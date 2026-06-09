import { useEffect, useState, type CSSProperties } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import type { Module, Subject } from '../../content/types';
import { subjects } from '../../content';
import { topicAnchor } from '../../utils/anchors';
import { softColor } from '../../utils/color';
import {
  moduleMatches,
  normalize,
  subjectMatches,
  topicMatches,
} from '../../utils/search';

interface SidebarNavProps {
  /** Mobile drawer open state. */
  open: boolean;
  /** Called after a topic is chosen (closes the mobile drawer). */
  onNavigate: () => void;
}

/**
 * Hierarchical contents tree: Subject → Module → Topics.
 *
 * All nodes are collapsed by default. The search box filters the tree in place
 * (matching branches auto-expand). Clicking a topic routes to its subject page
 * with `?t=<anchor>`, which opens the matching card and scrolls to it.
 */
export default function SidebarNav({ open, onNavigate }: SidebarNavProps) {
  const { subjectId } = useParams();
  const [params] = useSearchParams();
  const activeTopic = params.get('t');
  const [query, setQuery] = useState('');

  const filtering = normalize(query).length > 0;
  const visibleSubjects = filtering
    ? subjects.filter((s) => subjectMatches(s, query))
    : subjects;

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

  const [userOpen, setUserOpen] = useState(false);

  // Expand when this subject holds the active topic (navigation), not by default.
  useEffect(() => {
    if (hasActiveTopic) setUserOpen(true);
  }, [hasActiveTopic]);

  const open = filtering || userOpen;
  const modules = filtering
    ? subject.modules.filter((m) => moduleMatches(m, query))
    : subject.modules;

  // Each subject tints its own subtree with its accent colour.
  const style = {
    '--accent': subject.accent,
    '--accent-soft': softColor(subject.accent),
  } as CSSProperties;

  return (
    <div className="sidetree__group" style={style}>
      <div className="sidetree__node sidetree__node--subject">
        <button
          type="button"
          className="sidetree__toggle"
          aria-label={open ? 'Collapse' : 'Expand'}
          aria-expanded={open}
          onClick={() => setUserOpen((v) => !v)}
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
            setUserOpen(true);
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
          {modules.map((module) => (
            <SideModule
              key={module.id}
              subjectId={subject.id}
              module={module}
              // Real syllabus number, stable even when the list is filtered.
              index={subject.modules.indexOf(module) + 1}
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

  const [userOpen, setUserOpen] = useState(false);
  useEffect(() => {
    if (hasActiveTopic) setUserOpen(true);
  }, [hasActiveTopic]);

  const open = filtering || userOpen;

  // When filtering, show only matching topics — unless the module name itself
  // matched, in which case show all of its topics.
  const nameMatch = module.name.toLowerCase().includes(normalize(query));
  const matched = module.topics.filter((t) => topicMatches(t, query));
  const topics = !filtering
    ? module.topics
    : matched.length > 0
      ? matched
      : nameMatch
        ? module.topics
        : [];

  return (
    <div className="sidetree__group">
      <div className="sidetree__node sidetree__node--module">
        <button
          type="button"
          className="sidetree__toggle"
          aria-label={open ? 'Collapse' : 'Expand'}
          aria-expanded={open}
          onClick={() => setUserOpen((v) => !v)}
        >
          <span className="sidetree__chevron" data-open={open} aria-hidden="true">
            ▶
          </span>
        </button>
        <Link
          className="sidetree__rowlink"
          to={`/subject/${subjectId}?m=${module.id}`}
          onClick={() => {
            setUserOpen(true);
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
