import create from 'zustand';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const authStore = create((set) => ({
  token: localStorage.getItem('token') || null,
  user: null,
  loading: false,

  login: async (email, password) => {
    set({ loading: true });
    try {
      const res = await axios.post(`${API_URL}/auth/login`, { email, password });
      localStorage.setItem('token', res.data.token);
      set({ token: res.data.token, user: res.data });
      return res.data;
    } catch (err) {
      throw err.response?.data?.error || 'Login failed';
    } finally {
      set({ loading: false });
    }
  },

  signup: async (email, name, password) => {
    set({ loading: true });
    try {
      const res = await axios.post(`${API_URL}/auth/signup`, {
        email,
        name,
        password,
      });
      localStorage.setItem('token', res.data.token);
      set({ token: res.data.token, user: res.data });
      return res.data;
    } catch (err) {
      throw err.response?.data?.error || 'Signup failed';
    } finally {
      set({ loading: false });
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ token: null, user: null });
  },
}));

export const projectStore = create((set, get) => ({
  projects: [],
  currentProject: null,
  loading: false,

  fetchProjects: async () => {
    set({ loading: true });
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/projects`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ projects: res.data });
    } catch (err) {
      console.error('Failed to fetch projects');
    } finally {
      set({ loading: false });
    }
  },

  fetchProject: async (projectId) => {
    set({ loading: true });
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/projects/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ currentProject: res.data });
      return res.data;
    } catch (err) {
      console.error('Failed to fetch project');
    } finally {
      set({ loading: false });
    }
  },

  createProject: async (projectData) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${API_URL}/projects`, projectData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set((state) => ({ projects: [res.data, ...state.projects] }));
      return res.data;
    } catch (err) {
      throw err.response?.data?.error || 'Failed to create project';
    }
  },

  updateProject: async (projectId, updates) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.patch(`${API_URL}/projects/${projectId}`, updates, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ currentProject: res.data });
      return res.data;
    } catch (err) {
      throw err.response?.data?.error || 'Failed to update project';
    }
  },
}));

export const moduleStore = create((set) => ({
  research: null,
  design: null,
  video: null,
  web: null,

  fetchModuleData: async (projectId, module) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/${module}/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ [module]: res.data });
      return res.data;
    } catch (err) {
      console.error(`Failed to fetch ${module} data`);
    }
  },

  saveModuleData: async (projectId, module, data) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${API_URL}/${module}/${projectId}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ [module]: res.data });
      return res.data;
    } catch (err) {
      throw err.response?.data?.error || 'Failed to save module data';
    }
  },
}));
