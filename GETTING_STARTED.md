# Getting Started with Dragonsel Development

Follow these steps to set up and run Dragonsel locally.

## Step 1: Clone the Repository

If you haven't already:

```bash
git clone https://github.com/pmdthalha-alt/dragonsel.git
cd dragonsel
```

## Step 2: Install Dependencies

### Backend

```bash
cd backend
npm install
```

### Frontend

```bash
cd ../frontend
npm install
```

## Step 3: Set Up Environment Variables

### Backend

```bash
cd backend
cp .env.example .env
```

Edit `.env` with your settings:

```
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_USER=dragonsel
DB_PASSWORD=password
DB_NAME=dragonsel_dev
JWT_SECRET=your-secret-key-here
CLIENT_URL=http://localhost:3000
```

### Frontend

```bash
cd ../frontend
cp .env.example .env
```

Content should be:

```
VITE_API_URL=http://localhost:5000/api
```

## Step 4: Set Up Database

### Option A: With Docker (Recommended)

From the root directory:

```bash
docker-compose up -d
```

This starts:
- PostgreSQL on `localhost:5432`
- Redis on `localhost:6379`

Then run migrations:

```bash
cd backend
npm run db:migrate
```

### Option B: Manual Setup

If you have PostgreSQL and Redis installed locally:

1. Create database:
```sql
CREATE DATABASE dragonsel_dev;
CREATE USER dragonsel WITH PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE dragonsel_dev TO dragonsel;
```

2. Run migrations:
```bash
cd backend
npm run db:migrate
```

## Step 5: Start Development Servers

### Terminal 1: Backend

```bash
cd backend
npm run dev
```

You should see:
```
🚀 Dragonsel server running on port 5000
```

Test: Open `http://localhost:5000/api/health` in browser

### Terminal 2: Frontend

```bash
cd frontend
npm run dev
```

You should see:
```
VITE v4.2.0  ready in 234 ms

➜  Local:   http://localhost:3000/
```

Vite will open `http://localhost:3000` automatically

## Step 6: Test the Application

1. **Sign Up**
   - Go to `http://localhost:3000`
   - Click "Sign up"
   - Enter email, name, password
   - Click "Sign Up"

2. **Create a Project**
   - After signup, you're on the Dashboard
   - Click "+ New Project"
   - Enter title (e.g., "My First Project")
   - Add optional description/prompt
   - Click "Create Project"

3. **Explore Modules**
   - You're now in Project Studio
   - Click each module (Research, Design, Video, Web)
   - Each shows placeholder content ready for implementation

4. **API Testing** (using curl)

   ```bash
   # Test health endpoint
   curl http://localhost:5000/api/health

   # Test login (replace with your credentials)
   curl -X POST http://localhost:5000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"user@example.com","password":"password"}'
   ```

## Useful Commands

### Backend

```bash
npm run dev              # Start development server (with auto-reload)
npm start               # Start production server
npm test                # Run tests
npm run lint            # Run ESLint
npm run db:migrate      # Run database migrations
npm run db:seed         # Seed sample data
```

### Frontend

```bash
npm run dev             # Start dev server
npm run build           # Build for production
npm run preview         # Preview production build
npm run lint            # Run ESLint
npm run type-check      # Check TypeScript types
```

## Project Structure

```
dragonsel/
├── backend/
│   ├── src/
│   │   ├── server.js           # Express app
│   │   ├── db.js               # Database connection
│   │   ├── models/             # Data models
│   │   ├── routes/             # API endpoints
│   │   ├── middleware/         # Express middleware
│   │   ├── services/           # Business logic
│   │   ├── migrations/         # Database migrations
│   │   └── logger.js           # Logging
│   ├── knexfile.js             # Database config
│   ├── package.json
│   ├── .env                    # Environment config
│   ├── Dockerfile
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── main.jsx            # React entry point
│   │   ├── App.jsx             # Main component
│   │   ├── store/              # Zustand stores
│   │   ├── pages/              # Route pages
│   │   ├── components/         # Reusable components
│   │   ├── index.css           # Global styles
│   │   └── App.css             # App styles
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── package.json
│   ├── .env                    # Environment config
│   └── README.md
│
├── docker-compose.yml          # Docker setup
├── QUICKSTART.md               # Quick reference
├── INTEGRATED_ARCHITECTURE.md  # Complete design
├── IMPLEMENTATION_SUMMARY.md   # Build summary
└── GETTING_STARTED.md          # This file
```

## Architecture Overview

### Backend (Node.js + Express)

- **Authentication**: JWT tokens with bcrypt passwords
- **Database**: PostgreSQL with Knex migrations
- **Real-time**: Socket.io for live collaboration
- **API**: RESTful endpoints for all modules
- **State**: Project "brain" holds all context

### Frontend (React + Vite)

- **State**: Zustand for global stores (auth, projects, modules)
- **UI**: React components with Tailwind CSS
- **Routing**: React Router for navigation
- **HTTP**: Axios for API calls
- **Building**: Vite for fast development & bundling

### Database Schema

```sql
users          -- User accounts
projects       -- Project metadata and context
assets         -- Media files
module_data    -- Research, Design, Video, Web data
generation_jobs -- AI task tracking
```

## Next: Building Features

See [INTEGRATED_ARCHITECTURE.md](INTEGRATED_ARCHITECTURE.md) for what to build next:

1. **Research Module**
   - File upload & parsing
   - Vector embeddings
   - Semantic search

2. **Design Module**
   - Canvas editor
   - Object layers
   - Export system

3. **Video Module**
   - Timeline editor
   - Clip management
   - Auto-captions

4. **Website Module**
   - Page builder
   - Component library
   - Publishing

## Common Issues

### Port Already in Use

```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Database Connection Error

```bash
# Check PostgreSQL is running
psql -h localhost -U dragonsel -d dragonsel_dev

# Or with Docker
docker ps | grep postgres
```

### Module Not Found Error

```bash
# Install missing dependencies
npm install

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### CORS Error

1. Check `CLIENT_URL` in backend `.env` matches frontend URL
2. Verify `VITE_API_URL` in frontend `.env` matches backend URL

## Documentation

- [QUICKSTART.md](QUICKSTART.md) - Quick reference
- [INTEGRATED_ARCHITECTURE.md](INTEGRATED_ARCHITECTURE.md) - System design
- [backend/README.md](backend/README.md) - Backend docs
- [frontend/README.md](frontend/README.md) - Frontend docs
- [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) - What was built

## Support

For help:
1. Check troubleshooting section above
2. Review relevant README files
3. Check backend logs: `backend/combined.log`
4. Check frontend console: DevTools → Console
5. Check network requests: DevTools → Network

## Next Steps

1. ✅ Run `npm run dev` in backend and frontend
2. ✅ Sign up and create a project
3. ✅ Explore the module interfaces
4. ✅ Read [INTEGRATED_ARCHITECTURE.md](INTEGRATED_ARCHITECTURE.md)
5. ✅ Start building features!

Happy coding! 🚀
