/**
 * Build the DOM id / navigation anchor for a topic. Used in two places that
 * must agree: the topic card's element id and the sidebar link's `?t=` value.
 * Keeping it here means the scroll target can never drift out of sync.
 */
export function topicAnchor(moduleId: string, topicId: string): string {
  return `t-${moduleId}-${topicId}`;
}
