import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectStore, authStore } from '../store';

export default function Dashboard() {
  const navigate = useNavigate();
  const { projects, fetchProjects, createProject, loading } = projectStore();
  const { logout } = authStore();
  const [showNewProject, setShowNewProject] = useState(false);
  const [title, setTitle] = useState('');
  const [prompt, setPrompt] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      const project = await createProject({
        title: title || 'Untitled Project',
        prompt,
      });
      setTitle('');
      setPrompt('');
      setShowNewProject(false);
      navigate(`/project/${project.id}`);
    } catch (err) {
      alert('Failed to create project');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white shadow-sm p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Dragonsel</h1>
        <button
          onClick={() => {
            logout();
            navigate('/login');
          }}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Logout
        </button>
      </nav>

      <div className="max-w-7xl mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-slate-900">My Projects</h2>
          <button
            onClick={() => setShowNewProject(!showNewProject)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
          >
            + New Project
          </button>
        </div>

        {showNewProject && (
          <form
            onSubmit={handleCreateProject}
            className="bg-white rounded-lg shadow-md p-6 mb-8"
          >
            <input
              type="text"
              placeholder="Project Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg mb-4"
            />
            <textarea
              placeholder="Describe your project or paste a prompt..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg mb-4 h-24"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create Project
              </button>
              <button
                type="button"
                onClick={() => setShowNewProject(false)}
                className="px-6 py-2 bg-slate-300 text-slate-900 rounded-lg hover:bg-slate-400"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <p className="text-slate-500">Loading projects...</p>
          ) : projects.length > 0 ? (
            projects.map((project) => (
              <div
                key={project.id}
                onClick={() => navigate(`/project/${project.id}`)}
                className="bg-white rounded-lg shadow-md hover:shadow-lg p-6 cursor-pointer transition"
              >
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {project.title}
                </h3>
                <p className="text-slate-600 text-sm mb-4">
                  {project.description || 'No description'}
                </p>
                <div className="flex justify-between items-center text-xs text-slate-500">
                  <span>{new Date(project.created_at).toLocaleDateString()}</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                    {project.status}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-slate-500 col-span-3 text-center py-8">
              No projects yet. Create your first one!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
