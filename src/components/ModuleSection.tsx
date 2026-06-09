import { useEffect, useState } from 'react';
import type { Module } from '../content/types';
import TopicCard from './TopicCard';
import { topicAnchor } from '../utils/anchors';

interface ModuleSectionProps {
  module: Module;
  /** 1-based position, shown as the module index badge. */
  index: number;
  /** Whether the module is expanded (controlled by the page). */
  open: boolean;
  /** Toggle handler from the page controller. */
  onToggle: () => void;
  /** Anchor of the topic the URL currently points at (from `?t=`), if any. */
  activeTopicAnchor?: string | null;
  /** True when the URL points at this module (from `?m=`) — flashes its heading. */
  isActiveModule?: boolean;
  /** Changes on every navigation so re-selecting the same target re-triggers. */
  navNonce?: string;
}

const IMPORTANCE_LABEL: Record<string, string> = {
  normal: 'Normal',
  important: 'Important',
  'most-important': 'Most Important',
};

const FLASH_MS = 1800;

/**
 * Renders one module: a collapsible heading (index + name + importance badge)
 * that shows/hides its topic cards. Open state is owned by the page so a single
 * controller can drive Expand/Collapse-all and navigation honestly. The heading
 * flashes when the sidebar navigates to this module (re-firing on every click).
 */
export default function ModuleSection({
  module,
  index,
  open,
  onToggle,
  activeTopicAnchor,
  isActiveModule = false,
  navNonce,
}: ModuleSectionProps) {
  const importance = module.importance ?? 'normal';

  // Transient highlight that fades out shortly after arrival.
  const [flash, setFlash] = useState(false);
  useEffect(() => {
    if (!isActiveModule) return;
    setFlash(true);
    const t = setTimeout(() => setFlash(false), FLASH_MS);
    return () => clearTimeout(t);
  }, [isActiveModule, navNonce]);

  return (
    <section className="module" id={module.id}>
      <h2 className="module__heading">
        <button
          type="button"
          className="module__head"
          data-flash={flash}
          aria-expanded={open}
          onClick={onToggle}
        >
          <span className="module__chevron" data-open={open} aria-hidden="true">
            ▶
          </span>
          <span className="module__index">M{index}</span>
          <span className="module__name">{module.name}</span>
          <span className={`badge badge--${importance}`}>
            {IMPORTANCE_LABEL[importance]}
          </span>
        </button>
      </h2>

      {open && (
        <div className="topic-list">
          {module.topics.map((topic) => {
            const anchor = topicAnchor(module.id, topic.id);
            return (
              <TopicCard
                key={topic.id}
                topic={topic}
                anchorId={anchor}
                isActive={anchor === activeTopicAnchor}
                navNonce={navNonce}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}
