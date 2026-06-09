import type { Topic } from '../content/types';
import Collapsible from './Collapsible';
import CodeBlock from './CodeBlock';

interface TopicCardProps {
  topic: Topic;
}

/**
 * A collapsible study card for one topic.
 *
 * Layout: name + short description in the header; on expand, the study
 * paragraph plus EITHER a code example (if present) OR a real-world example.
 * The example rule lives here once, so every topic behaves identically.
 */
export default function TopicCard({ topic }: TopicCardProps) {
  return (
    <Collapsible
      header={
        <span className="topic__heading">
          <span className="topic__name">{topic.name}</span>
          <span className="topic__desc">{topic.description}</span>
        </span>
      }
    >
      <div className="topic__section">
        <span className="topic__section-label">Study</span>
        <p className="topic__study">{topic.study}</p>
      </div>

      {topic.code ? (
        <div className="topic__section">
          <span className="topic__section-label">Code Example</span>
          <CodeBlock code={topic.code} lang={topic.codeLang} />
        </div>
      ) : topic.realWorld ? (
        <div className="topic__section">
          <span className="topic__section-label">Real-World Example</span>
          <p className="topic__realworld">{topic.realWorld}</p>
        </div>
      ) : null}
    </Collapsible>
  );
}
