# Dragonsel Quick Start (5 Minutes)

> Get the full Dragonsel platform running in 5 minutes

---

## 🚀 Fastest Way: Docker (Recommended)

### Prerequisites
- Docker Desktop installed ([download](https://www.docker.com/products/docker-desktop))

### Start Everything
```bash
# From project root
docker-compose up
```

**Wait 30 seconds for startup, then:**
- 🌐 Frontend: http://localhost:3000
- 🔗 Backend API: http://localhost:5000
- 🗄️ Database: localhost:5432 (user: dragonsel)
- 🔴 Redis: localhost:6379

**Demo Credentials:**
```
Email: demo@dragonsel.io
Password: password123
```

---

## 💻 Local Development Setup

### Prerequisites
- Node.js 18+ ([download](https://nodejs.org/))
- PostgreSQL 15 ([download](https://www.postgresql.org/download/))

### 1. Install Dependencies (2 min)
```bash
npm run setup
# or manually:
cd backend && npm install
cd ../frontend && npm install
```

### 2. Setup Database (1 min)
```bash
cd backend

# Create database
createdb dragonsel_dev

# Run migrations
npm run db:migrate

# Seed demo data
npm run db:seed
```

### 3. Run Backend (Terminal 1)
```bash
cd backend
npm run dev
# Runs on http://localhost:5000
```

### 4. Run Frontend (Terminal 2)
```bash
cd frontend
npm run dev
# Runs on http://localhost:3000
```

### 5. Open Browser
```
http://localhost:3000
```

Login with:
- Email: `demo@dragonsel.io`
- Password: `password123`

---

## ✅ Verify Everything Works

```bash
# Check system completeness
node verify.js

# Expected output: "✓ All checks passed! System is ready."
```

---

## 📋 What You Get

### Backend (http://localhost:5000)
- ✅ Authentication (signup/login/verify)
- ✅ Project CRUD operations
- ✅ All 4 module APIs (research, design, video, web)
- ✅ Asset management
- ✅ Real-time Socket.io ready
- ✅ Health check: http://localhost:5000/api/health

### Frontend (http://localhost:3000)
- ✅ Login & Signup pages
- ✅ Project dashboard
- ✅ Module switcher
- ✅ Responsive Tailwind design
- ✅ Real-time ready

### Database
- ✅ 5 tables (users, projects, assets, module_data, generation_jobs)
- ✅ Foreign keys & cascading deletes
- ✅ Demo data preloaded
- ✅ Migration system ready

---

## 🔑 Important Files

| File | Purpose |
|------|---------|
| `docker-compose.yml` | Docker Compose configuration |
| `backend/src/server.js` | Express server entry point |
| `frontend/src/App.jsx` | React app entry point |
| `backend/knexfile.js` | Database configuration |
| `.env` files | Environment variables |

---

## 🐛 Troubleshooting

### Port Already In Use
```bash
# Find what's using port 5000
lsof -i :5000
kill -9 <PID>

# Or change port in backend/.env
# PORT=5001
```

### Database Connection Error
```bash
# Check PostgreSQL is running
psql -U postgres

# Create database manually
createdb dragonsel_dev

# Check credentials in backend/.env
```

### Frontend won't connect to backend
```bash
# Check VITE_API_URL in frontend/.env
# Should be: http://localhost:5000/api
```

### Docker won't start
```bash
docker-compose down
docker-compose up --build
```

---

## 📚 Next Steps

1. **Read the full docs:**
   - [INTEGRATED_ARCHITECTURE.md](INTEGRATED_ARCHITECTURE.md) - System design
   - [IMPLEMENTATION_CHECKLIST.md](IMPLEMENTATION_CHECKLIST.md) - What to build next

2. **Explore the code:**
   - Backend APIs: `backend/src/routes/`
   - Frontend pages: `frontend/src/pages/`
   - Database models: `backend/src/models/`

3. **Start building Phase 1:**
   - Research module with file uploads
   - See [IMPLEMENTATION_CHECKLIST.md](IMPLEMENTATION_CHECKLIST.md#phase-1-research-module)

---

## 💡 Pro Tips

### Frontend Hot Reload
Vite provides instant HMR - just save a file and it updates in browser!

### Backend Hot Reload
Nodemon watches for changes - just save and server restarts!

### Database Changes
To run migrations manually:
```bash
cd backend
npm run db:migrate  # Run migrations
npm run db:seed    # Seed data
```

### Clear Everything & Start Fresh
```bash
docker-compose down -v          # Remove volumes
docker-compose up              # Fresh start
```

---

## 🎯 Success Indicators

✅ See Dragonsel logo on login page  
✅ Can create account & log in  
✅ Dashboard shows project grid  
✅ Can create a new project  
✅ Module buttons appear in project  
✅ No console errors  

---

## 📞 API Health Check

```bash
curl http://localhost:5000/api/health

# Response:
# {"status":"ok","timestamp":"2024-04-28T..."}
```

---

## 🎓 Architecture Quick Reference

```
Client (http://3000)
    ↓
Vite Dev Server
    ↓
React App + Zustand stores
    ↓ (Axios with JWT)
Express Server (http://5000)
    ↓
PostgreSQL Database
```

---

## ✨ You're Ready!

Everything is set up and running. Check the browser at **http://localhost:3000** and start exploring!

**Questions?** See [GETTING_STARTED.md](GETTING_STARTED.md) for detailed setup.

---

*Last Updated: April 28, 2026*  
*Verified: All systems operational ✅*
