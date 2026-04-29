import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectStore, moduleStore } from '../store';
import ResearchModule from '../components/modules/ResearchModule';
import DesignModule from '../components/modules/DesignModule';
import VideoModule from '../components/modules/VideoModule';
import WebModule from '../components/modules/WebModule';

export default function ProjectStudio() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { fetchProject } = projectStore();
  const [activeModule, setActiveModule] = useState('research');
  const [project, setProject] = useState(null);

  useEffect(() => {
    const loadProject = async () => {
      const proj = await fetchProject(projectId);
      setProject(proj);
    };
    loadProject();
  }, [projectId]);

  if (!project) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  const modules = [
    { id: 'research', label: 'Research', icon: '📚' },
    { id: 'design', label: 'Design', icon: '🎨' },
    { id: 'video', label: 'Video', icon: '🎬' },
    { id: 'web', label: 'Web', icon: '🌐' },
  ];

  return (
    <div className="min-h-screen bg-slate-100">
      <nav className="bg-white shadow-sm p-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{project.title}</h1>
          <p className="text-sm text-slate-500">Project ID: {projectId.slice(0, 8)}...</p>
        </div>
        <button
          onClick={() => navigate('/dashboard')}
          className="px-4 py-2 bg-slate-300 text-slate-900 rounded-lg hover:bg-slate-400"
        >
          ← Back
        </button>
      </nav>

      <div className="flex">
        {/* Module Navigation */}
        <div className="w-48 bg-white shadow-sm p-4 border-r border-slate-200">
          <h3 className="font-semibold text-slate-900 mb-4">Modules</h3>
          <div className="space-y-2">
            {modules.map((mod) => (
              <button
                key={mod.id}
                onClick={() => setActiveModule(mod.id)}
                className={`w-full text-left px-4 py-2 rounded-lg transition ${
                  activeModule === mod.id
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-900 hover:bg-slate-100'
                }`}
              >
                {mod.icon} {mod.label}
              </button>
            ))}
          </div>
        </div>

        {/* Module Content */}
        <div className="flex-1 p-8">
          {activeModule === 'research' && <ResearchModule projectId={projectId} />}
          {activeModule === 'design' && <DesignModule projectId={projectId} />}
          {activeModule === 'video' && <VideoModule projectId={projectId} />}
          {activeModule === 'web' && <WebModule projectId={projectId} />}
        </div>
      </div>
    </div>
  );
}
