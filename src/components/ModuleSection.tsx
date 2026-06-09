import type { Module } from '../content/types';
import TopicCard from './TopicCard';

interface ModuleSectionProps {
  module: Module;
  /** 1-based position, shown as the module index badge. */
  index: number;
}

const IMPORTANCE_LABEL: Record<string, string> = {
  normal: 'Normal',
  important: 'Important',
  'most-important': 'Most Important',
};

/**
 * Renders one module: a heading (index + name + importance badge) followed by
 * its topic cards. Module-wise separation of the subject page lives here.
 */
export default function ModuleSection({ module, index }: ModuleSectionProps) {
  const importance = module.importance ?? 'normal';

  return (
    <section className="module" id={module.id}>
      <div className="module__head">
        <span className="module__index">M{index}</span>
        <h2 className="module__name">{module.name}</h2>
        <span className={`badge badge--${importance}`}>
          {IMPORTANCE_LABEL[importance]}
        </span>
      </div>

      <div className="topic-list">
        {module.topics.map((topic) => (
          <TopicCard key={topic.id} topic={topic} />
        ))}
      </div>
    </section>
  );
}
