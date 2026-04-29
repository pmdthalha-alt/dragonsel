import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { authStore } from './store/auth';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProjectStudio from './pages/ProjectStudio';
import './App.css';

function App() {
  const { token } = authStore();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {token ? (
          <>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/project/:projectId" element={<ProjectStudio />} />
          </>
        ) : (
          <Route path="*" element={<Login />} />
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
