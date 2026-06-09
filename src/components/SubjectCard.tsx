import { Link } from 'react-router-dom';
import type { Subject } from '../content/types';
import { countTopics } from '../content';
import { accentStyle } from '../utils/color';

interface SubjectCardProps {
  subject: Subject;
}

/**
 * Dashboard card for one subject. Themed by the subject's accent colour and
 * links through to its page. Purely driven by data — no per-subject code.
 */
export default function SubjectCard({ subject }: SubjectCardProps) {
  return (
    <Link
      to={`/subject/${subject.id}`}
      className="subject-card"
      style={accentStyle(subject.accent)}
      aria-label={`Open ${subject.title}`}
    >
      <span className="subject-card__icon">{subject.icon}</span>
      <span className="subject-card__code">{subject.code}</span>
      <h3 className="subject-card__title">{subject.title}</h3>
      <div className="subject-card__meta">
        <span>
          <strong>{subject.modules.length}</strong> modules
        </span>
        <span>
          <strong>{countTopics(subject)}</strong> topics
        </span>
      </div>
    </Link>
  );
}
