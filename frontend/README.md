# Dragonsel Frontend

React + Vite frontend for the Dragonsel unified creation platform.

## Setup

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Configuration

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Key environment variables:
- `VITE_API_URL` - Backend API URL (default: http://localhost:5000/api)

### Development

```bash
npm run dev
```

Frontend runs on `http://localhost:3000`

### Production Build

```bash
npm run build
```

Output in `dist/` directory

Preview production build:

```bash
npm run preview
```

## Architecture

### State Management (Zustand)

Three global stores in `src/store/index.js`:

**authStore**
- `token` - JWT authentication token
- `user` - Current user info
- `loading` - Auth operation loading state
- `login(email, password)` - User login
- `signup(email, name, password)` - Create account
- `logout()` - Logout and clear token

**projectStore**
- `projects` - List of user projects
- `currentProject` - Currently selected project
- `loading` - Data loading state
- `fetchProjects()` - Load all projects
- `fetchProject(projectId)` - Load specific project
- `createProject(data)` - Create new project
- `updateProject(projectId, updates)` - Update project

**moduleStore**
- `research`, `design`, `video`, `web` - Module data
- `fetchModuleData(projectId, module)` - Load module data
- `saveModuleData(projectId, module, data)` - Persist module data

### Pages

**Login** (`src/pages/Login.jsx`)
- Email/password login form
- Link to signup
- Error handling

**Signup** (`src/pages/Signup.jsx`)
- Email/password/name signup form
- Link to login
- Validation

**Dashboard** (`src/pages/Dashboard.jsx`)
- Project list grid
- Create new project modal
- Project card with metadata

**ProjectStudio** (`src/pages/ProjectStudio.jsx`)
- Module sidebar navigation
- Module content area
- Project context header

### Components

**Module Components** (`src/components/modules/`)
- `ResearchModule.jsx` - Research interface
- `DesignModule.jsx` - Design interface
- `VideoModule.jsx` - Video interface
- `WebModule.jsx` - Website interface

Each module starter includes:
- Module header
- Quick action buttons
- Content area
- TODO placeholders for full implementation

### Styling

- **Tailwind CSS** - Utility-first CSS framework
- **Responsive Design** - Mobile-first approach
- **Dark Mode Ready** - Config in `tailwind.config.js`

### Build & Tooling

- **Vite** - Lightning-fast build tool
- **React 18** - Latest React features
- **ESM** - ECMAScript modules throughout
- **Hot Module Replacement** - Live updates during dev

## API Integration

All API calls use Axios with centralized configuration:

```js
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Example API call with auth
const res = await axios.get(`${API_URL}/projects`, {
  headers: { Authorization: `Bearer ${token}` },
});
```

## Authentication Flow

1. User fills signup/login form
2. Submit to `/api/auth/signup` or `/api/auth/login`
3. Backend returns JWT token
4. Token stored in localStorage
5. Token included in all subsequent requests
6. Redirect to dashboard on success

## Project Studio Flow

1. User selects project on dashboard
2. Loads project details via `fetchProject()`
3. Displays module sidebar
4. User clicks module (research, design, video, web)
5. Loads module data via `fetchModuleData()`
6. Displays module component
7. Changes saved via `saveModuleData()`
8. Real-time updates via WebSocket (when connected)

## Deployment

### Static Hosting (Vercel, Netlify, etc.)

```bash
npm run build
# Deploy dist/ folder
```

### Environment for Production

Create `.env.production`:

```
VITE_API_URL=https://api.dragonsel.io
```

### Docker

```bash
docker build -t dragonsel-frontend .
docker run -p 3000:3000 dragonsel-frontend
```

## Performance Optimizations

- ✅ Code splitting with Vite
- ✅ Lazy loading with React.lazy (TODO: implement)
- ✅ Image optimization (TODO: implement)
- ✅ CSS optimization with Tailwind
- ✅ React Router code splitting (TODO: implement advanced routing)

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## Troubleshooting

**API connection fails**
- Check `VITE_API_URL` in `.env`
- Ensure backend is running
- Check CORS settings in backend

**Styling not applied**
- Ensure Tailwind is building: check `tailwind.config.js`
- Verify `index.css` imports

**State not persisting**
- Token stored in localStorage - check DevTools Storage
- Verify auth middleware in backend

**Login redirects to login page**
- Check JWT token validity
- Verify token in localStorage
- Check token expiration

## Development Tips

- Use React DevTools browser extension
- Check Vite dev output for errors
- Use `console.log(authStore())` to debug state
- Network tab in DevTools for API debugging

## Next Steps

1. Implement canvas editor for Design module
2. Add file upload for Research module
3. Implement timeline editor for Video module
4. Add page builder for Website module
5. Add WebSocket real-time collaboration
6. Implement module-to-module data sharing
7. Add export functionality UI
8. Add user profile/settings page

## File Structure

```
src/
├── main.jsx                 # App entry point
├── App.jsx                  # Main app component
├── App.css                  # Global styles
├── index.css                # Tailwind imports
├── store/
│   └── index.js             # Global state (auth, projects, modules)
├── pages/
│   ├── Login.jsx
│   ├── Signup.jsx
│   ├── Dashboard.jsx
│   └── ProjectStudio.jsx
└── components/
    └── modules/
        ├── ResearchModule.jsx
        ├── DesignModule.jsx
        ├── VideoModule.jsx
        └── WebModule.jsx
```

## Support

For issues or questions, check:
- [INTEGRATED_ARCHITECTURE.md](../INTEGRATED_ARCHITECTURE.md)
- [QUICKSTART.md](../QUICKSTART.md)
- Frontend console for errors
- Backend logs for API issues
