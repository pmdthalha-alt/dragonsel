# Dragonsel Quick Start Guide

## Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Docker (optional, for containerized setup)

## Setup

### 1. Backend Setup

```bash
cd backend
cp .env.example .env
npm install
npm run db:migrate
npm run dev
```

Backend runs on `http://localhost:5000`

### 2. Frontend Setup

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`

### 3. Database Setup (Optional - with Docker)

```bash
docker-compose up -d
```

This starts PostgreSQL and Redis automatically.

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Login
- `GET /api/auth/verify` - Verify token

### Projects
- `GET /api/projects` - List user projects
- `GET /api/projects/:id` - Get project details
- `POST /api/projects` - Create new project
- `PATCH /api/projects/:id` - Update project

### Modules
- `GET /api/research/:projectId` - Get research data
- `POST /api/research/:projectId` - Save research data
- `GET /api/design/:projectId` - Get design data
- `POST /api/design/:projectId` - Save design data
- `GET /api/video/:projectId` - Get video data
- `POST /api/video/:projectId` - Save video data
- `GET /api/web/:projectId` - Get website data
- `POST /api/web/:projectId` - Save website data

### Assets
- `GET /api/assets/:projectId` - List assets
- `POST /api/assets/:projectId` - Upload asset
- `DELETE /api/assets/:projectId/:assetId` - Delete asset

## Architecture

See `INTEGRATED_ARCHITECTURE.md` for the complete system design.

## Next Steps

1. Implement vector embeddings for Research module (RAG)
2. Build canvas editor for Design module
3. Implement timeline editor for Video module
4. Build page builder for Website module
5. Create AI generation pipeline
6. Add real-time collaboration (WebSockets)
7. Implement rendering & export services

## Key Files

- `backend/src/server.js` - Express server setup
- `backend/src/models/` - Data models
- `backend/src/routes/` - API endpoints
- `frontend/src/store/index.js` - Global state management
- `frontend/src/pages/` - Main pages
- `frontend/src/components/modules/` - Module UIs

## Development Tips

- Use `npm run dev` in both backend and frontend
- Backend auto-reloads with nodemon
- Frontend auto-reloads with Vite
- Check `.env.example` for all environment variables
- Database migrations in `backend/src/migrations/`
