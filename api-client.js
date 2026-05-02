// ==========================================
// Dragonsel API Client - Backend Connectivity
// ==========================================

(function () {
  const API_URL = (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" || !window.location.hostname)
    ? "http://localhost:5000/api"
    : "/api";

  const auth = {
    token: localStorage.getItem("dragonsel_auth_token") || null,
    user: JSON.parse(localStorage.getItem("dragonsel_user") || "null"),

    isLoggedIn() {
      return Boolean(this.token);
    },

    setSession(token, user) {
      this.token = token;
      this.user = user;
      localStorage.setItem("dragonsel_auth_token", token);
      localStorage.setItem("dragonsel_user", JSON.stringify(user));
    },

    clearSession() {
      this.token = null;
      this.user = null;
      localStorage.removeItem("dragonsel_auth_token");
      localStorage.removeItem("dragonsel_user");
    }
  };

  async function request(path, options = {}) {
    const headers = {
      "Content-Type": "application/json",
      ...(options.headers || {})
    };

    if (auth.token) {
      headers.Authorization = `Bearer ${auth.token}`;
    }

    const response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.error || `Request failed with ${response.status}`);
    }

    return data;
  }

  async function login(email, password) {
    const data = await request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password })
    });

    auth.setSession(data.token, {
      id: data.userId,
      email: data.email,
      name: data.name
    });

    return data;
  }

  async function signup({ name, email, password }) {
    const data = await request("/auth/signup", {
      method: "POST",
      body: JSON.stringify({ name, email, password })
    });

    auth.setSession(data.token, {
      id: data.userId,
      email: data.email,
      name: data.name
    });

    return data;
  }

  function logout() {
    auth.clearSession();
  }

  function generate(tool, prompt, context = {}, sources = []) {
    return request("/ai/generate", {
      method: "POST",
      body: JSON.stringify({ tool, prompt, context, sources })
    });
  }

  window.DragonselAPI = {
    API_URL,
    auth,
    request,
    login,
    signup,
    logout,
    generate
  };
})();
