// ---------------------------------------------------------------------------
// Content schema — the single source of truth for what a subject looks like.
//
// All UI components render generically from these types, so adding a new
// subject is pure data: drop a JSON file shaped like `Subject` and register it
// in `index.ts`. No component code needs to change. (plug-and-play)
// ---------------------------------------------------------------------------

/** How heavily a module is weighted — drives the badge shown on a module. */
export type Importance = 'normal' | 'important' | 'most-important';

/** A single study card. */
export interface Topic {
  /** Stable slug, unique within its module. */
  id: string;
  /** Display name of the topic. */
  name: string;
  /** One- or two-line plain-English summary (shown collapsed and expanded). */
  description: string;
  /** Short study paragraph in easy language. */
  study: string;
  /** Optional code/snippet. When present, it is rendered instead of `realWorld`. */
  code?: string;
  /** Language hint for the code block (e.g. "sql", "c", "text"). */
  codeLang?: string;
  /** A real-world / real-system analogy. Shown when there is no `code`. */
  realWorld?: string;
}

/** A module groups related topics, mirroring the syllabus structure. */
export interface Module {
  id: string;
  name: string;
  importance?: Importance;
  topics: Topic[];
}

/** A subject is one document/course — one card on the dashboard. */
export interface Subject {
  /** Slug used in the URL (/subject/:id). */
  id: string;
  /** Full title, e.g. "Database Management Systems". */
  title: string;
  /** Short code shown on the card, e.g. "DBMS". */
  code: string;
  /** Emoji or short glyph used as the card icon. */
  icon: string;
  /** One-line description for the dashboard card. */
  summary: string;
  /** Accent colour (any CSS color) used to theme the subject. */
  accent: string;
  modules: Module[];
}
