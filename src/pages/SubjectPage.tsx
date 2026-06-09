import { useEffect, useState } from 'react';
import { Link, useLocation, useParams, useSearchParams } from 'react-router-dom';
import PageLayout from '../components/layout/PageLayout';
import ModuleSection from '../components/ModuleSection';
import { getSubject } from '../content';
import { topicAnchor } from '../utils/anchors';

/**
 * Subject page: module-wise sections of collapsible topic cards.
 *
 * The page OWNS each module's open state (a single controller), so the
 * Expand/Collapse-all toggle reflects reality and navigation can reliably open
 * a target. `location.key` changes on every navigation — even re-clicking the
 * same link — so re-selecting a topic/module re-reveals it.
 *
 *   ?t=<anchor>  → open the containing module; TopicCard opens + scrolls
 *   ?m=<id>      → open + scroll to a module
 *   neither      → start at the top
 */
export default function SubjectPage() {
  const { subjectId } = useParams();
  const [params] = useSearchParams();
  const location = useLocation();
  const activeTopic = params.get('t');
  const activeModule = params.get('m');
  const subject = getSubject(subjectId);

  // Open state per module id. Missing entry means "open" (the default).
  const [openModules, setOpenModules] = useState<Record<string, boolean>>({});
  const isModuleOpen = (id: string) => openModules[id] ?? true;
  const setModuleOpen = (id: string, open: boolean) =>
    setOpenModules((m) => ({ ...m, [id]: open }));
  const setAllModules = (open: boolean) => {
    if (!subject) return;
    setOpenModules(Object.fromEntries(subject.modules.map((m) => [m.id, open])));
  };
  const allOpen = subject ? subject.modules.every((m) => isModuleOpen(m.id)) : true;

  // Module ids (m1..m9) repeat across subjects, so reset to defaults on switch.
  useEffect(() => {
    setOpenModules({});
  }, [subjectId]);

  // Reveal the navigation target. Keyed on location.key so an identical-URL
  // re-click (which leaves the search params unchanged) still re-fires.
  useEffect(() => {
    if (!subject) return;
    if (activeTopic) {
      const mod = subject.modules.find((m) =>
        m.topics.some((t) => topicAnchor(m.id, t.id) === activeTopic),
      );
      if (mod) setModuleOpen(mod.id, true); // TopicCard handles its own scroll
    } else if (activeModule) {
      setModuleOpen(activeModule, true);
      const raf = requestAnimationFrame(() =>
        document
          .getElementById(activeModule)
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
      );
      return () => cancelAnimationFrame(raf);
    } else {
      window.scrollTo({ top: 0 });
    }
    // location.key is the navigation signal; the rest are read fresh from it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.key]);

  if (!subject) {
    return (
      <PageLayout>
        <Link to="/" className="back-link">
          ← Back to dashboard
        </Link>
        <div className="notice">
          Sorry, that subject doesn’t exist. Pick one from the dashboard.
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout accent={subject.accent}>
      <Link to="/" className="back-link">
        ← Back to dashboard
      </Link>

      <header className="page-head">
        <h1 className="page-head__title">
          {subject.icon} {subject.title}
        </h1>
        <p className="page-head__subtitle">{subject.summary}</p>
      </header>

      <div className="bulk-controls">
        <button
          type="button"
          className="bulk-btn"
          onClick={() => setAllModules(!allOpen)}
          aria-label={allOpen ? 'Collapse all modules' : 'Expand all modules'}
          title={allOpen ? 'Collapse all' : 'Expand all'}
        >
          {allOpen ? '−' : '+'}
        </button>
      </div>

      <div className="module-list">
        {subject.modules.map((module, i) => (
          <ModuleSection
            key={module.id}
            module={module}
            index={i + 1}
            open={isModuleOpen(module.id)}
            onToggle={() => setModuleOpen(module.id, !isModuleOpen(module.id))}
            activeTopicAnchor={activeTopic}
            isActiveModule={activeModule === module.id}
            navNonce={location.key}
          />
        ))}
      </div>
    </PageLayout>
  );
}
