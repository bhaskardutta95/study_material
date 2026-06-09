import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import type { Module, Subject } from '../../content/types';
import { subjects } from '../../content';
import { topicAnchor } from '../../utils/anchors';
import { accentStyle } from '../../utils/color';
import {
  moduleMatches,
  normalize,
  subjectMatches,
  visibleTopics,
} from '../../utils/search';

interface SidebarNavProps {
  /** Mobile drawer open state. */
  open: boolean;
  /** Called after a topic is chosen (closes the mobile drawer). */
  onNavigate: () => void;
}

/**
 * Shared open/close behaviour for a tree node. All nodes are collapsed by
 * default. A node opens when navigation targets it (`hasActive`). While a
 * filter is active, matching nodes open to reveal results but remain manually
 * collapsible; clearing the filter returns the tree to its collapsed shape.
 */
function useTreeDisclosure(hasActive: boolean, filtering: boolean, matches: boolean) {
  const [open, setOpen] = useState(false);
  const wasFiltering = useRef(false);

  useEffect(() => {
    if (hasActive) setOpen(true);
  }, [hasActive]);

  useEffect(() => {
    if (filtering) {
      if (matches) setOpen(true);
    } else if (wasFiltering.current) {
      setOpen(false); // collapse only when a filter was just cleared
    }
    wasFiltering.current = filtering;
  }, [filtering, matches]);

  return [open, setOpen] as const;
}

/**
 * Hierarchical contents tree: Subject → Module → Topics. Clicking a topic,
 * module or subject navigates the page; the chevron only expands/collapses.
 * The search box filters the tree in place.
 */
export default function SidebarNav({ open, onNavigate }: SidebarNavProps) {
  const { subjectId } = useParams();
  const [params] = useSearchParams();
  const activeTopic = params.get('t');
  const [query, setQuery] = useState('');

  const filtering = normalize(query).length > 0;
  const visibleSubjects = useMemo(
    () => (filtering ? subjects.filter((s) => subjectMatches(s, query)) : subjects),
    [filtering, query],
  );

  return (
    <>
      <div
        className="sidebar-backdrop"
        data-open={open}
        onClick={onNavigate}
        aria-hidden="true"
      />
      <aside className="sidebar" data-open={open} aria-label="Contents">
        <div className="sidebar__search">
          <span className="sidebar__search-icon" aria-hidden="true">
            🔍
          </span>
          <input
            type="search"
            className="sidebar__search-input"
            placeholder="Filter menu…"
            value={query}
            aria-label="Filter contents menu"
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <nav className="sidetree">
          {visibleSubjects.map((subject) => (
            <SideSubject
              key={subject.id}
              subject={subject}
              activeSubjectId={subjectId}
              activeTopic={activeTopic}
              query={query}
              onNavigate={onNavigate}
            />
          ))}
          {filtering && visibleSubjects.length === 0 && (
            <p className="sidetree__empty">No topics match “{query}”.</p>
          )}
        </nav>
      </aside>
    </>
  );
}

interface SideSubjectProps {
  subject: Subject;
  activeSubjectId: string | undefined;
  activeTopic: string | null;
  query: string;
  onNavigate: () => void;
}

function SideSubject({
  subject,
  activeSubjectId,
  activeTopic,
  query,
  onNavigate,
}: SideSubjectProps) {
  const filtering = normalize(query).length > 0;
  const isActive = subject.id === activeSubjectId;
  const hasActiveTopic =
    isActive &&
    !!activeTopic &&
    subject.modules.some((m) =>
      m.topics.some((t) => topicAnchor(m.id, t.id) === activeTopic),
    );

  const [open, setOpen] = useTreeDisclosure(
    hasActiveTopic,
    filtering,
    subjectMatches(subject, query),
  );

  // Pair each module with its real syllabus number BEFORE filtering, so the
  // number stays correct and we avoid an indexOf scan per render.
  const modules = useMemo(
    () =>
      subject.modules
        .map((module, i) => ({ module, number: i + 1 }))
        .filter(({ module }) => !filtering || moduleMatches(module, query)),
    [subject, filtering, query],
  );

  return (
    <div className="sidetree__group" style={accentStyle(subject.accent)}>
      <div className="sidetree__node sidetree__node--subject">
        <button
          type="button"
          className="sidetree__toggle"
          aria-label={open ? 'Collapse' : 'Expand'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sidetree__chevron" data-open={open} aria-hidden="true">
            ▶
          </span>
        </button>
        <Link
          className="sidetree__rowlink"
          data-active={isActive}
          to={`/subject/${subject.id}`}
          onClick={() => {
            setOpen(true);
            onNavigate();
          }}
        >
          <span className="sidetree__icon" aria-hidden="true">
            {subject.icon}
          </span>
          <span className="sidetree__label">{subject.title}</span>
        </Link>
      </div>

      {open && (
        <div className="sidetree__children">
          {modules.map(({ module, number }) => (
            <SideModule
              key={module.id}
              subjectId={subject.id}
              module={module}
              index={number}
              activeTopic={activeTopic}
              query={query}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface SideModuleProps {
  subjectId: string;
  module: Module;
  index: number;
  activeTopic: string | null;
  query: string;
  onNavigate: () => void;
}

function SideModule({
  subjectId,
  module,
  index,
  activeTopic,
  query,
  onNavigate,
}: SideModuleProps) {
  const filtering = normalize(query).length > 0;
  const hasActiveTopic = module.topics.some(
    (t) => topicAnchor(module.id, t.id) === activeTopic,
  );

  const [open, setOpen] = useTreeDisclosure(
    hasActiveTopic,
    filtering,
    moduleMatches(module, query),
  );

  const topics = useMemo(() => visibleTopics(module, query), [module, query]);

  return (
    <div className="sidetree__group">
      <div className="sidetree__node sidetree__node--module">
        <button
          type="button"
          className="sidetree__toggle"
          aria-label={open ? 'Collapse' : 'Expand'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sidetree__chevron" data-open={open} aria-hidden="true">
            ▶
          </span>
        </button>
        <Link
          className="sidetree__rowlink"
          to={`/subject/${subjectId}?m=${module.id}`}
          onClick={() => {
            setOpen(true);
            onNavigate();
          }}
        >
          <span className="sidetree__index">M{index}</span>
          <span className="sidetree__label">{module.name}</span>
        </Link>
      </div>

      {open && (
        <ul className="sidetree__topics">
          {topics.map((topic) => {
            const anchor = topicAnchor(module.id, topic.id);
            return (
              <li key={topic.id}>
                <Link
                  className="sidetree__topic"
                  data-active={anchor === activeTopic}
                  to={`/subject/${subjectId}?t=${anchor}`}
                  onClick={onNavigate}
                >
                  {topic.name}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
