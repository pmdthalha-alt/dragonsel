# Active Dragonsel App

Use these files for the current working Studio:

- `index.html` - main page
- `app.css` - interface styling
- `app.js` - chat-first workspace logic and local generators
- `smoke-test.mjs` - browser smoke test for the main workflows

Run it with:

```bash
npm run dev
```

Open:

```text
http://127.0.0.1:5173
```

Production build:

```bash
npm run build
```

Vercel should use:

- Framework Preset: `Vite`
- Build Command: `npm run build`
- Output Directory: `dist`
- Root Directory: this repo root, the folder that contains `index.html` and `vercel.json`

Notes:

- `_archive/` contains old experiments and duplicate copies. It is not loaded by the app.
- Old inactive root files such as `script.js`, `styles.css`, `workspace.js`, `ai.js`, and `brain.js` were moved into `_archive/legacy-2026-04-29/inactive-root-and-editor-files/`.
- `backend/` is the only active backend folder.
- `frontend/` is the separate React app scaffold. It is not used by the current root Studio page.
- `/editor/` redirects to `/` because the editor now lives inside the main smart workspace.
