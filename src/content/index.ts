// ---------------------------------------------------------------------------
// Subject registry.
//
// This is the ONLY place that knows which subjects exist. To add a subject:
//   1. Create a JSON file shaped like `Subject` (see types.ts).
//   2. Import it and add it to the `subjects` array below.
// The dashboard, menu and routing all read from here automatically.
// ---------------------------------------------------------------------------

import type { Subject } from './types';
import dbms from './dbms.json';
import os from './os.json';

// `as Subject` validates each JSON file against the schema at build time.
export const subjects: Subject[] = [dbms as Subject, os as Subject];

/** Look up a single subject by its URL id. Returns undefined if not found. */
export function getSubject(id: string | undefined): Subject | undefined {
  return subjects.find((s) => s.id === id);
}

/** Count of topics across all modules — handy for dashboard stats. */
export function countTopics(subject: Subject): number {
  return subject.modules.reduce((sum, m) => sum + m.topics.length, 0);
}
