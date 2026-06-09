// ---------------------------------------------------------------------------
// Search helpers shared by the header's global search (flat result list) and
// the sidebar's filter (tree pruning). One matching rule, used in both places.
// ---------------------------------------------------------------------------
import { subjects } from '../content';
import type { Subject, Module, Topic } from '../content/types';
import { topicAnchor } from './anchors';

export interface TopicHit {
  subject: Subject;
  module: Module;
  topic: Topic;
  anchor: string;
}

/** Lower-cased, trimmed query for case-insensitive matching. */
export function normalize(s: string): string {
  return s.toLowerCase().trim();
}

/** A topic matches if the query appears in its name or short description. */
export function topicMatches(topic: Topic, query: string): boolean {
  const q = normalize(query);
  if (!q) return true;
  return (
    topic.name.toLowerCase().includes(q) ||
    topic.description.toLowerCase().includes(q)
  );
}

/** A module matches if its name matches or any of its topics match. */
export function moduleMatches(module: Module, query: string): boolean {
  const q = normalize(query);
  if (!q) return true;
  return (
    module.name.toLowerCase().includes(q) ||
    module.topics.some((t) => topicMatches(t, q))
  );
}

/** A subject matches if its title matches or any of its modules match. */
export function subjectMatches(subject: Subject, query: string): boolean {
  const q = normalize(query);
  if (!q) return true;
  return (
    subject.title.toLowerCase().includes(q) ||
    subject.modules.some((m) => moduleMatches(m, q))
  );
}

/**
 * Flat, ranked list of topics across ALL subjects for the global search.
 * Name matches rank above description-only matches; result is capped.
 */
export function searchTopics(query: string, limit = 8): TopicHit[] {
  const q = normalize(query);
  if (!q) return [];

  const primary: TopicHit[] = []; // name match
  const secondary: TopicHit[] = []; // description match only

  for (const subject of subjects) {
    for (const module of subject.modules) {
      for (const topic of module.topics) {
        const hit: TopicHit = {
          subject,
          module,
          topic,
          anchor: topicAnchor(module.id, topic.id),
        };
        if (topic.name.toLowerCase().includes(q)) primary.push(hit);
        else if (topic.description.toLowerCase().includes(q)) secondary.push(hit);
      }
    }
  }

  return [...primary, ...secondary].slice(0, limit);
}
