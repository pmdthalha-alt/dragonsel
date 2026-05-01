 // ==========================================
// Dragonsel API Client — Backend Connectivity
// ==========================================

const API_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000/api' 
  : '/api';

// --- Auth State ---
const auth = {
  token: localStorage.getItem('dragonsel_auth_token') || null,
  user: JSON.parse(localStorage.getItem('dragonsel_user') || 'null'),
  
  isLoggedIn() { return !!this.token; },
  
  setSession(token, user) {
    this.token = token;
    this.user = user;
    localStorage.setItem('dragonsel_auth_token', token);
    localStorage.setItem('dragonsel_user', JSON.stringify(user));
    updateAuthUI();
  },
  
  clearSession() {
    this.token = null;
    this.user = null;
    localStorage.removeItem('dragonsel_auth_token');
    localStorage.removeItem('dragonsel_user

The app.js is restored. Now I'll take a modular approach - create a separate `api.js` file for the new functionality, then update index.html to include it. This avoids the length limit issue.

Let me create `api.js` with:
- API client with JWT handling
- Auth functions (login, signup, logout)
- Toast notification system
- AI generation wrappers
- Auto-save functionality
