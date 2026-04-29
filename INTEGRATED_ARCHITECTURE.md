# Dragonsel: Integrated Creation OS Architecture

## Vision

Build a unified platform that reverse-engineers and connects the core internal workflows of 4 successful tools into one seamless ecosystem.

---

## Part 1: Reverse-Engineered Core Systems

### System 1: NotebookLM (Research/Knowledge)

**Core Internal Systems:**
- Document ingestion & parsing (PDFs, docs, videos)
- Vector embeddings for semantic search (RAG)
- Query system over documents
- Context memory management
- Citation tracking
- Multi-source synthesis

**Dragonsel Implementation:**
```
Research Module
├── Source Manager
│   ├── Upload handler (PDF, DOCX, images, links)
│   ├── Parser (extract text, metadata, structure)
│   ├── Vector embedder (convert to embeddings)
│   └── Storage (vector DB + metadata)
├── Query Engine
│   ├── Semantic search over sources
│   ├── Multi-source synthesis
│   └── Citation generation
└── Knowledge Graph
    ├── Entity extraction
    ├── Relationship mapping
    └── Context consolidation
```

**Key APIs:**
- `POST /api/research/sources/upload` → Parse & embed documents
- `POST /api/research/query` → Search & synthesize across sources
- `GET /api/research/sources/{id}` → Retrieve with metadata
- `POST /api/research/summarize` → Generate from context

---

### System 2: Canva (Design/Templates)

**Core Internal Systems:**
- Template library (categorized & searchable)
- Drag-and-drop canvas editor
- Layer system (objects, groups, properties)
- Asset library (fonts, colors, icons, images)
- Grid/alignment system
- Property inspector (size, position, rotation, effects)

**Dragonsel Implementation:**
```
Design Module
├── Template Engine
│   ├── Template library (categorized)
│   ├── Template parser (convert to editable format)
│   └── Quick-apply system
├── Canvas Editor
│   ├── SVG/Canvas renderer
│   ├── Object creation & manipulation
│   ├── Layer panel (hierarchy)
│   └── Selection system
├── Asset Manager
│   ├── Font library (Google Fonts, custom)
│   ├── Color palette (project brand colors)
│   ├── Icon library (Feather, Material)
│   └── Image upload & optimization
├── Properties Inspector
│   ├── Transform (position, size, rotation)
│   ├── Appearance (fill, stroke, opacity)
│   ├── Effects (shadow, blur, filters)
│   └── Typography
└── Alignment Tools
    ├── Grid snapping
    ├── Smart guides
    └── Distribute options
```

**Key APIs:**
- `GET /api/design/templates` → List templates
- `POST /api/design/canvas/create` → New blank or from template
- `POST /api/design/canvas/{id}/objects` → Add/update objects
- `GET /api/design/assets` → Fonts, colors, icons, images
- `POST /api/design/export` → Export as PNG, PDF, SVG

**Data Structure (Canvas):**
```json
{
  "id": "canvas-123",
  "projectId": "proj-456",
  "type": "poster|slide|thumbnail|web",
  "dimensions": { "width": 1920, "height": 1080 },
  "objects": [
    {
      "id": "obj-1",
      "type": "text|image|shape|group",
      "position": { "x": 0, "y": 0 },
      "size": { "width": 100, "height": 100 },
      "rotation": 0,
      "properties": { "fill": "#000000", "opacity": 1 },
      "text": "Hello",
      "fontFamily": "Inter",
      "fontSize": 24
    }
  ],
  "brandKit": { "colors": [], "fonts": [] }
}
```

---

### System 3: CapCut (Video Timeline)

**Core Internal Systems:**
- Timeline composition (tracks: video, audio, captions, effects)
- Clip management & trimming
- Transition library
- Effects library
- Keyframe animation
- Render pipeline

**Dragonsel Implementation:**
```
Video Module
├── Timeline Editor
│   ├── Multi-track system (video, audio, text, effects)
│   ├── Time-based positioning
│   ├── Clip trimming & splitting
│   └── Playback engine
├── Clip Manager
│   ├── Clip upload & processing
│   ├── Trim/cut interface
│   ├── Speed adjustment
│   └── Color grading presets
├── Media Library
│   ├── Stock video library
│   ├── Stock music library
│   ├── Sound effects
│   ├── Transitions (fade, slide, wipe)
│   └── Effects library
├── Subtitle System
│   ├── Auto-captions (via speech-to-text)
│   ├── Manual caption editor
│   ├── Caption styling
│   └── Multi-language support
└── Render Engine
    ├── Background processing
    ├── Format conversion
    ├── Quality settings (480p, 720p, 1080p, 4K)
    └── Export delivery
```

**Key APIs:**
- `POST /api/video/timeline/create` → New timeline
- `POST /api/video/timeline/{id}/clips` → Add clips
- `PATCH /api/video/timeline/{id}/clips/{clipId}` → Trim/adjust
- `POST /api/video/timeline/{id}/captions` → Auto-generate or manual
- `POST /api/video/timeline/{id}/render` → Start render job

**Data Structure (Timeline):**
```json
{
  "id": "timeline-123",
  "projectId": "proj-456",
  "duration": 60000,
  "fps": 30,
  "tracks": [
    {
      "id": "track-video",
      "type": "video",
      "items": [
        {
          "id": "clip-1",
          "sourceUrl": "s3://...",
          "startTime": 0,
          "endTime": 10000,
          "trim": { "start": 0, "end": 10000 },
          "speed": 1.0,
          "volume": 1.0
        }
      ]
    },
    {
      "id": "track-audio",
      "type": "audio",
      "items": []
    },
    {
      "id": "track-captions",
      "type": "captions",
      "items": [
        {
          "id": "caption-1",
          "text": "Hello world",
          "startTime": 0,
          "endTime": 5000,
          "style": { "font": "Arial", "size": 24, "color": "#fff" }
        }
      ]
    }
  ]
}
```

---

### System 4: Website Builder (Prompt-to-Site)

**Core Internal Systems:**
- Component library (blocks/sections)
- Responsive grid system
- Visual editor
- Content management
- Publishing pipeline
- Template system

**Dragonsel Implementation:**
```
Website Module
├── Page Builder
│   ├── Component library (header, hero, gallery, CTA, footer)
│   ├── Drag-and-drop editor
│   ├── Responsive preview (mobile, tablet, desktop)
│   └── Style editor
├── Section System
│   ├── Pre-built sections
│   ├── Section templates
│   ├── Custom styling
│   └── Reusable components
├── Content Manager
│   ├── Editable text blocks
│   ├── Image galleries
│   ├── SEO meta tags
│   └── Navigation structure
├── Template Generator
│   ├── Prompt → site layout
│   ├── AI-chosen sections
│   ├── Brand color application
│   └── Content population
└── Publish Engine
    ├── Static site generation
    ├── Domain linking
    ├── SSL certificate
    ├── CDN delivery
    └── SEO optimization
```

**Key APIs:**
- `POST /api/web/pages/create` → New page (blank or from template)
- `POST /api/web/pages/{id}/sections` → Add sections
- `PATCH /api/web/pages/{id}/sections/{sectionId}` → Edit section
- `POST /api/web/pages/generate` → AI generates from prompt
- `POST /api/web/publish` → Deploy site

**Data Structure (Page):**
```json
{
  "id": "page-123",
  "projectId": "proj-456",
  "url": "landing",
  "title": "Landing Page",
  "sections": [
    {
      "id": "section-hero",
      "type": "hero",
      "content": {
        "headline": "Welcome",
        "subheadline": "Description",
        "image": "s3://...",
        "cta": { "text": "Get Started", "link": "/signup" }
      },
      "style": { "background": "#fff", "textColor": "#000" }
    }
  ]
}
```

---

## Part 2: Integration Layer (The Real Value)

### Unified Project Context

Every module shares access to the same project "brain":

```
Project Brain
├── Project Metadata
│   ├── Title, description
│   ├── Goals & audience
│   └── Brand guidelines
├── Shared Assets
│   ├── Uploaded files
│   ├── Generated assets
│   ├── Images & videos
│   └── Fonts & colors
├── Knowledge Graph
│   ├── Research findings
│   ├── Sources & citations
│   ├── Key insights
│   └── Entity map
└── AI Context
    ├── Project summary
    ├── Tone & voice
    ├── Key messages
    └── Brand kit
```

### Module Connections

```
Research Module
    ↓ (insights, facts)
Design Module (creates visuals based on research)
    ↓ (brand, colors, messaging)
Website Module (uses design system, research content)
    ↓ (content, structure)
Video Module (uses design assets, research narration)
    ↓ (all outputs combined)
Export Module (packages everything)
```

---

## Part 3: Backend Architecture

### Tech Stack Recommendation

**Frontend:**
- React (UI framework)
- Redux (state management)
- Socket.io (real-time updates)
- Three.js / Babylon.js (3D previews, optional)
- FFmpeg.wasm (video processing in browser)

**Backend:**
- Node.js + Express (API server)
- Python (AI services, embeddings, rendering)
- PostgreSQL (metadata, projects, users)
- MongoDB (flexible document storage)
- Redis (caching, real-time features)
- Minio or S3 (asset storage)
- Queue system (Bull/RabbitMQ for render jobs)

**AI Services:**
- OpenAI API (GPT-4 for generation)
- Pinecone or Weaviate (vector embeddings)
- Hugging Face (open-source models)

**Infrastructure:**
- Docker (containerization)
- Kubernetes or Docker Compose (orchestration)
- GitHub Actions (CI/CD)
- AWS/GCP/Azure (hosting)

### API Structure

```
Core APIs
├── /api/auth/* (login, signup, session)
├── /api/users/* (profile, settings)
├── /api/projects/*
│   ├── GET / (list projects)
│   ├── POST / (create project)
│   ├── GET /:id (get project brain)
│   ├── PATCH /:id (update project)
│   └── DELETE /:id (delete project)
├── /api/projects/:id/assets/*
├── /api/projects/:id/research/*
├── /api/projects/:id/design/*
├── /api/projects/:id/video/*
├── /api/projects/:id/web/*
└── /api/projects/:id/export/*

AI Service APIs
├── /api/ai/generate (multi-purpose generation)
├── /api/ai/summarize (summarization)
├── /api/ai/suggest (suggestions)
└── /api/ai/refine (refinement)

System APIs
├── /api/health (status)
├── /api/analytics/* (usage tracking)
└── /api/feedback/* (bug reports, feature requests)
```

### Database Schema (PostgreSQL)

```sql
-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  name VARCHAR,
  avatar_url VARCHAR,
  created_at TIMESTAMP
);

-- Projects (the brain)
CREATE TABLE projects (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  title VARCHAR,
  description TEXT,
  prompt TEXT,
  goals JSONB,
  audience VARCHAR,
  brand_rules JSONB,
  status VARCHAR (draft|published|archived),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Assets (shared across modules)
CREATE TABLE assets (
  id UUID PRIMARY KEY,
  project_id UUID REFERENCES projects(id),
  type VARCHAR (image|video|audio|document|font|color),
  name VARCHAR,
  url VARCHAR,
  metadata JSONB,
  created_at TIMESTAMP
);

-- Module Data (flexible, stored as JSONB)
CREATE TABLE module_data (
  id UUID PRIMARY KEY,
  project_id UUID REFERENCES projects(id),
  module VARCHAR (research|design|video|web|app|game),
  data JSONB,
  version INT,
  updated_at TIMESTAMP
);

-- Generation Jobs (tracking async work)
CREATE TABLE generation_jobs (
  id UUID PRIMARY KEY,
  project_id UUID REFERENCES projects(id),
  module VARCHAR,
  status VARCHAR (queued|processing|completed|failed),
  prompt TEXT,
  result JSONB,
  error TEXT,
  created_at TIMESTAMP,
  completed_at TIMESTAMP
);
```

---

## Part 4: Implementation Roadmap

### Phase 1: Foundation (Weeks 1-2)
- [ ] Backend scaffold (Node + Express)
- [ ] Database setup (PostgreSQL)
- [ ] Authentication
- [ ] Project management API
- [ ] Asset storage & retrieval

### Phase 2: Research Module (Weeks 3-4)
- [ ] Document upload & parsing
- [ ] Vector embeddings integration
- [ ] Search API
- [ ] Citation system

### Phase 3: Design Module (Weeks 5-7)
- [ ] Canvas editor (React)
- [ ] Template library
- [ ] Object layer system
- [ ] Export (PNG, PDF)

### Phase 4: Video Module (Weeks 8-10)
- [ ] Timeline editor
- [ ] Clip management
- [ ] Captions (manual + auto)
- [ ] Render pipeline

### Phase 5: Website Module (Weeks 11-13)
- [ ] Page builder
- [ ] Component library
- [ ] Responsive editor
- [ ] Publishing

### Phase 6: Integration (Weeks 14-15)
- [ ] Cross-module APIs
- [ ] Shared asset system
- [ ] AI context sharing
- [ ] Export module

### Phase 7: Polish & Launch (Week 16+)
- [ ] UI/UX refinement
- [ ] Performance optimization
- [ ] Testing & debugging
- [ ] Beta launch

---

## Part 5: Smart Integration Points

### Design → Video
```
Design creates brand kit (colors, fonts)
↓
Video module automatically applies brand colors to captions
Video module uses design assets in timeline
```

### Research → Website
```
Research summarizes sources
↓
Website module uses summaries as page content
Website module highlights research citations
```

### Research → Video
```
Research extracts key points
↓
Video module generates script from key points
Video module creates captions from summaries
```

### Design → Website
```
Design creates logo & brand kit
↓
Website module imports colors & fonts
Website applies design system to pages
```

### All → Export
```
All modules generate outputs
↓
Export packages everything:
- Slide deck (from design)
- Website (from web module)
- Video file (from video module)
- Research document (from research)
- Brand guide (consolidated)
- Media kit (all assets)
```

---

## Part 6: Key Differentiators

**Why Dragonsel Wins:**
1. **One login** (not 4 separate accounts)
2. **Shared context** (research informs design, design informs video)
3. **Connected outputs** (design system stays consistent across video & web)
4. **Consolidated exports** (everything packaged together)
5. **Faster workflows** (copy from one module to another)
6. **Better AI** (more context = better generation)

---

## Next Steps

1. **Choose your backend language** (Node.js is fastest to ship)
2. **Set up PostgreSQL + Redis** (infrastructure)
3. **Start with Phase 1: Foundation**
4. **Build Research module first** (feeds other modules)
5. **Then Design, then Video, then Web**

This architecture is scalable, modular, and professional-grade. Each module can be built independently, then integrated into the shared system.

Ready to start building?
