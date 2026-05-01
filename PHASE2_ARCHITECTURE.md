# Dragonsel Phase 2 — Production Architecture

## 1. Current State vs Target

### Phase 1 (Current)
- Frontend: Single-file app (index.html, app.css, app.js) with mock data generation
- Backend: Express API with auth, projects, assets, OpenAI integration
- Database: PostgreSQL with users, projects, assets, module_data, generation_jobs tables
- AI: Direct OpenAI API calls via user's own API key (personal, no shared limits)

### Phase 2 Target
- Frontend connected to backend via authenticated API calls
- Real AI generation through backend (not mock data)
- Async job queue for heavy operations (video rendering, audio synthesis)
- Export pipeline with multiple formats
- Enhanced tool renderers with backend persistence

## 2. System Architecture

```
Client (index.html + app.css +

I see the content was cut off again. Let me take a different approach - I'll proceed with the implementation that the user originally asked for, and create the architecture document in smaller pieces if needed.

The user's original task was:
1. Append API connectivity functions to app.js
2. Add auth UI modal to index.html
3. Add auth styles to app.css
4. Update app.js to use real AI generation

Let me start implementing these changes. I'll use edit_file to make targeted edits to the existing files.

First, let me add the API functions to app.js. I'll add them at the end of
