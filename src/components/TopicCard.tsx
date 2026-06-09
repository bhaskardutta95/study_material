import { useEffect, useRef, useState } from 'react';
import type { Topic } from '../content/types';
import Collapsible from './Collapsible';
import CodeBlock from './CodeBlock';

interface TopicCardProps {
  topic: Topic;
  /** DOM id used as the scroll target for sidebar navigation. */
  anchorId: string;
  /** True when the sidebar/URL points at this topic — opens and scrolls to it. */
  isActive?: boolean;
  /** Changes on every navigation so re-selecting the same topic re-reveals it. */
  navNonce?: string;
}

/**
 * A collapsible study card for one topic.
 *
 * Header shows the name + short description; on expand, the study paragraph
 * plus EITHER a code example (if present) OR a real-world example. When it
 * becomes the active navigation target it opens itself and scrolls into view.
 */
export default function TopicCard({
  topic,
  anchorId,
  isActive = false,
  navNonce,
}: TopicCardProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // `navNonce` changes on every navigation, so re-selecting the same (already
  // active) topic re-opens and re-scrolls instead of doing nothing.
  useEffect(() => {
    if (!isActive) return;
    setOpen(true);
    // Wait a frame so the card is laid out before scrolling to it.
    const id = requestAnimationFrame(() => {
      ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    return () => cancelAnimationFrame(id);
  }, [isActive, navNonce]);

  return (
    <div id={anchorId} ref={ref} className="topic-anchor">
      <Collapsible
        open={open}
        onOpenChange={setOpen}
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
    </div>
  );
}
