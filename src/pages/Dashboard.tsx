import PageLayout from '../components/layout/PageLayout';
import SubjectCard from '../components/SubjectCard';
import { subjects } from '../content';

/**
 * Landing page: a grid of subject cards, generated from the registry.
 */
export default function Dashboard() {
  return (
    <PageLayout>
      <header className="page-head">
        <h1 className="page-head__title">Your Study Dashboard</h1>
        <p className="page-head__subtitle">
          Pick a subject to dive into module-wise notes — short explanations,
          examples and code, all in collapsible cards.
        </p>
      </header>

      <div className="subject-grid">
        {subjects.map((subject) => (
          <SubjectCard key={subject.id} subject={subject} />
        ))}
      </div>
    </PageLayout>
  );
}
