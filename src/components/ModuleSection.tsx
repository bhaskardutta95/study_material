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
  /**
   * Bulk open/collapse command from the page toolbar. `seq` increments on each
   * click so the same command re-applies; `seq === 0` means "no command yet".
   */
  bulk?: { open: boolean; seq: number };
}

const IMPORTANCE_LABEL: Record<string, string> = {
  normal: 'Normal',
  important: 'Important',
  'most-important': 'Most Important',
};

const FLASH_MS = 1800;

/**
 * Renders one module: a collapsible heading (index + name + importance badge)
 * that shows/hides its topic cards. Module-wise separation of the subject page
 * lives here. Modules are open by default; they auto-open and flash when the
 * sidebar navigates to the module or one of its topics.
 */
export default function ModuleSection({
  module,
  index,
  activeTopicAnchor,
  activeModuleId,
  bulk,
}: ModuleSectionProps) {
  const importance = module.importance ?? 'normal';
  const isActiveModule = activeModuleId === module.id;
  const containsActiveTopic =
    !!activeTopicAnchor &&
    module.topics.some((t) => topicAnchor(module.id, t.id) === activeTopicAnchor);

  const [open, setOpen] = useState(true);
  const [flash, setFlash] = useState(false);

  // Make sure the module is open when navigation targets it or a topic inside it.
  useEffect(() => {
    if (isActiveModule || containsActiveTopic) setOpen(true);
  }, [isActiveModule, containsActiveTopic]);

  // Apply Expand all / Collapse all from the page toolbar.
  useEffect(() => {
    if (!bulk || bulk.seq === 0) return;
    setOpen(bulk.open);
  }, [bulk?.seq, bulk?.open]);

  // Transient highlight that fades out shortly after arrival.
  useEffect(() => {
    if (!isActiveModule) return;
    setFlash(true);
    const t = setTimeout(() => setFlash(false), FLASH_MS);
    return () => clearTimeout(t);
  }, [isActiveModule]);

  return (
    <section className="module" id={module.id}>
      <h2 className="module__heading">
        <button
          type="button"
          className="module__head"
          data-flash={flash}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
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
              />
            );
          })}
        </div>
      )}
    </section>
  );
}
