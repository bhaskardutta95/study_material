import { useEffect, useState } from 'react';
import type { Module } from '../content/types';
import TopicCard from './TopicCard';
import { topicAnchor } from '../utils/anchors';

interface ModuleSectionProps {
  module: Module;
  /** 1-based position, shown as the module index badge. */
  index: number;
  /** Anchor of the topic the URL currently points at (from `?t=`), if any. */
  activeTopicAnchor?: string | null;
  /** Id of the module the URL points at (from `?m=`) — flashes its heading. */
  activeModuleId?: string | null;
}

const IMPORTANCE_LABEL: Record<string, string> = {
  normal: 'Normal',
  important: 'Important',
  'most-important': 'Most Important',
};

const FLASH_MS = 1800;

/**
 * Renders one module: a heading (index + name + importance badge) followed by
 * its topic cards. Module-wise separation of the subject page lives here.
 * When navigated to via the sidebar, the heading briefly flashes.
 */
export default function ModuleSection({
  module,
  index,
  activeTopicAnchor,
  activeModuleId,
}: ModuleSectionProps) {
  const importance = module.importance ?? 'normal';
  const isActive = activeModuleId === module.id;

  // Transient highlight that fades out shortly after arrival.
  const [flash, setFlash] = useState(false);
  useEffect(() => {
    if (!isActive) return;
    setFlash(true);
    const t = setTimeout(() => setFlash(false), FLASH_MS);
    return () => clearTimeout(t);
  }, [isActive]);

  return (
    <section className="module" id={module.id}>
      <div className="module__head" data-flash={flash}>
        <span className="module__index">M{index}</span>
        <h2 className="module__name">{module.name}</h2>
        <span className={`badge badge--${importance}`}>
          {IMPORTANCE_LABEL[importance]}
        </span>
      </div>

      <div className="topic-list">
        {module.topics.map((topic) => {
          const anchor = topicAnchor(module.id, topic.id);
          return (
            <TopicCard
              key={topic.id}
              topic={topic}
              anchorId={anchor}
              isActive={anchor === activeTopicAnchor}
            />
          );
        })}
      </div>
    </section>
  );
}
