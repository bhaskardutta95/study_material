# StudyDeck 📚

A clean, static study webpage for college subjects. The dashboard lists each
subject as a card; opening one shows **module-wise** collapsible topic cards —
each with a short description, a plain-English study note, and either a code
example or a real-world example.

Built with **Vite + React + TypeScript**. No backend. Deploys to **GitHub Pages**.

## Tech & design choices

- **Vite + React + TS** — lightest static SPA; builds to a plain `dist/` folder.
- **HashRouter** — deep links (`/#/subject/dbms`) work on GitHub Pages with no
  server rewrites.
- **Content as data** — each subject is a JSON file in `src/content/` shaped
  like the `Subject` type. The UI renders generically, so adding a subject is
  pure data (see below). The app ships only this JSON; original source documents
  are kept locally and are gitignored.
- **Common CSS** — all styles live in four shared files in `src/styles/`
  (`tokens`, `base`, `layout`, `components`), imported once in `main.tsx`.
  Components use shared class names only — no inline or per-component CSS.
- **Reusable components** — `Header`, `Footer`, `Menu` are shared via
  `PageLayout`; `Collapsible` and `CodeBlock` are generic primitives composed
  by `TopicCard`.

## Project structure

```
src/
├─ components/
│  ├─ layout/      Header, Footer, Menu, PageLayout   (shared shell)
│  ├─ Collapsible, CodeBlock                          (generic primitives)
│  └─ SubjectCard, ModuleSection, TopicCard           (content cards)
├─ pages/          Dashboard, SubjectPage
├─ content/        types.ts, index.ts (registry), dbms.json, os.json
├─ styles/         tokens.css, base.css, layout.css, components.css
└─ utils/          color.ts
```

## Run locally

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build to dist/
npm run preview  # serve the built dist/ locally
```

## Add a new subject (plug-and-play)

1. Create `src/content/<subject>.json`, shaped like the `Subject` type
   (`src/content/types.ts`): `id`, `title`, `code`, `icon`, `summary`,
   `accent`, and `modules → topics`.
2. Register it in `src/content/index.ts`:

   ```ts
   import mysubject from './mysubject.json';
   export const subjects: Subject[] = [dbms, os, mysubject as Subject];
   ```

The dashboard card, menu entry, routing and subject page all appear
automatically — no component changes needed.

### Topic card rule

Each topic shows a **code example** if it has a `code` field; otherwise it
shows its `realWorld` example. Set one or the other per topic.

## Deploy to GitHub Pages

Push to `main`. The workflow in `.github/workflows/deploy.yml` builds and
publishes `dist/`. In the repo's **Settings → Pages**, set the source to
**GitHub Actions**. The relative `base` in `vite.config.ts` makes the build
work under any repo sub-path.
