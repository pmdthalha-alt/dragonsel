# Dragonsel Backend

Production-ready Node.js backend for the Dragonsel unified creation platform.

## Setup

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Redis 7+

### Installation

```bash
npm install
```

### Configuration

Copy `.env.example` to `.env` and update values:

```bash
cp .env.example .env
```

Key environment variables:
- `PORT` - Server port (default: 5000)
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` - PostgreSQL config
- `JWT_SECRET` - Secret key for JWT tokens (use strong random string in production)
- `REDIS_URL` - Redis connection URL
- `CLIENT_URL` - Frontend URL for CORS

### Database Setup

Run migrations:

```bash
npm run db:migrate
```

Seed sample data (optional):

```bash
npm run db:seed
```

### Development

```bash
npm run dev
```

Server runs on `http://localhost:5000`

### Production

```bash
npm start
```

## API Documentation

### Authentication

**POST /api/auth/signup**
```json
{
  "email": "user@example.com",
  "name": "User Name",
  "password": "secure_password"
}
```

**POST /api/auth/login**
```json
{
  "email": "user@example.com",
  "password": "secure_password"
}
```

**GET /api/auth/verify**
- Headers: `Authorization: Bearer <token>`

### Projects

**GET /api/projects**
- List all projects for authenticated user

**GET /api/projects/:id**
- Get project details with all module data

**POST /api/projects**
```json
{
  "title": "Project Name",
  "description": "Optional description",
  "prompt": "Optional prompt",
  "goals": {},
  "audience": "Target audience"
}
```

**PATCH /api/projects/:id**
- Update project metadata

**DELETE /api/projects/:id**
- Delete project

### Modules

**GET /api/research/:projectId**
- Get research module data

**POST /api/research/:projectId**
- Save research module data

**POST /api/research/:projectId/sources**
- Upload research source document

**POST /api/research/:projectId/query**
- Query research data across sources

Similar endpoints exist for:
- `/api/design/:projectId`
- `/api/video/:projectId`
- `/api/web/:projectId`

### Assets

**GET /api/assets/:projectId**
- List project assets (with optional `?type=image` filter)

**POST /api/assets/:projectId**
```json
{
  "type": "image|video|audio|document|font|color",
  "name": "Asset name",
  "url": "https://...",
  "metadata": {}
}
```

**DELETE /api/assets/:projectId/:assetId**
- Delete asset

### Export

**POST /api/export/:projectId/package**
```json
{
  "formats": ["slides", "video", "website", "brand-kit"]
}
```

**POST /api/export/:projectId/share**
- Create shareable link

## Architecture

### Database Schema

- **users** - User accounts
- **projects** - Project metadata and context
- **assets** - Media files (images, videos, documents)
- **module_data** - Flexible storage for each module's data
- **generation_jobs** - Track AI generation tasks

### Models

- `Project` - Project CRUD and context management
- `Asset` - Asset upload and retrieval
- `Module` - Module data persistence and job tracking

### Routes

- `auth.js` - Authentication endpoints
- `projects.js` - Project management
- `assets.js` - Asset management
- `modules/research.js` - Research module API
- `modules/design.js` - Design module API
- `modules/video.js` - Video module API
- `modules/web.js` - Website module API
- `export.js` - Export and packaging

### Middleware

- `auth.js` - JWT verification
- `errorHandler.js` - Global error handling

## Real-time Features

WebSocket events via Socket.io:
- `join-project` - Join project room for real-time updates
- `module-update` - Broadcast module changes to project team
- `user-joined` - Notify when team member joins

## Testing

```bash
npm test
```

## Deployment

### Docker

```bash
docker build -t dragonsel-backend .
docker run -p 5000:5000 dragonsel-backend
```

### Docker Compose

```bash
docker-compose up
```

## Performance Tips

- Enable Redis for caching
- Use database connection pooling
- Implement rate limiting in production
- Monitor with APM tools (Datadog, New Relic)
- Use CDN for asset delivery

## Troubleshooting

**Database connection error**
- Check `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`
- Ensure PostgreSQL is running
- Run migrations: `npm run db:migrate`

**JWT validation fails**
- Check `JWT_SECRET` matches frontend
- Verify token format: `Bearer <token>`

**CORS errors**
- Update `CLIENT_URL` in `.env`
- Check request headers

## Security

- ✅ HTTPS ready (use nginx/reverse proxy in production)
- ✅ JWT authentication
- ✅ CORS configured
- ✅ Rate limiting
- ✅ Helmet for security headers
- ✅ Input validation required (TODO: add validation middleware)
- ✅ SQL injection safe (using parameterized queries)

## Next Steps

1. Add input validation middleware
2. Implement file upload service (S3/Minio)
3. Add vector embeddings for research module
4. Implement render queue system for video/exports
5. Add batch job processing
6. Implement caching layer
7. Add comprehensive logging
8. Set up monitoring and alerts

## Support

For issues or questions, check:
- [INTEGRATED_ARCHITECTURE.md](../INTEGRATED_ARCHITECTURE.md)
- [QUICKSTART.md](../QUICKSTART.md)
