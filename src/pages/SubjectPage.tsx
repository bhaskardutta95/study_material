import { useEffect } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import PageLayout from '../components/layout/PageLayout';
import ModuleSection from '../components/ModuleSection';
import { getSubject } from '../content';

/**
 * Subject page: module-wise sections, each holding collapsible topic cards.
 * The subject is resolved from the URL param against the registry.
 *
 * URL drives navigation from the sidebar:
 *   ?t=<anchor>  → open + scroll to a topic   (handled in TopicCard)
 *   ?m=<id>      → scroll to a module section  (handled here)
 *   neither      → start at the top of the subject
 */
export default function SubjectPage() {
  const { subjectId } = useParams();
  const [params] = useSearchParams();
  const activeTopic = params.get('t');
  const activeModule = params.get('m');
  const subject = getSubject(subjectId);

  useEffect(() => {
    if (activeTopic) return; // TopicCard scrolls itself
    if (activeModule) {
      const el = document.getElementById(activeModule);
      if (el) {
        const id = requestAnimationFrame(() =>
          el.scrollIntoView({ behavior: 'smooth', block: 'start' }),
        );
        return () => cancelAnimationFrame(id);
      }
      return;
    }
    window.scrollTo({ top: 0 }); // plain subject navigation
  }, [subjectId, activeTopic, activeModule]);

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

      <div className="module-list">
        {subject.modules.map((module, i) => (
          <ModuleSection
            key={module.id}
            module={module}
            index={i + 1}
            activeTopicAnchor={activeTopic}
          />
        ))}
      </div>
    </PageLayout>
  );
}
