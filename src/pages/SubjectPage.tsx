import { Link, useParams } from 'react-router-dom';
import PageLayout from '../components/layout/PageLayout';
import ModuleSection from '../components/ModuleSection';
import { getSubject } from '../content';

/**
 * Subject page: module-wise sections, each holding collapsible topic cards.
 * The subject is resolved from the URL param against the registry.
 */
export default function SubjectPage() {
  const { subjectId } = useParams();
  const subject = getSubject(subjectId);

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
          <ModuleSection key={module.id} module={module} index={i + 1} />
        ))}
      </div>
    </PageLayout>
  );
}
