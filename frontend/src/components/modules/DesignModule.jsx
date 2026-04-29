import React, { useEffect } from 'react';
import { moduleStore } from '../../store';

export default function DesignModule({ projectId }) {
  const { design, fetchModuleData } = moduleStore();

  useEffect(() => {
    fetchModuleData(projectId, 'design');
  }, [projectId]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-slate-900 mb-4">🎨 Design</h2>
      <p className="text-slate-600 mb-6">
        Create and edit designs with our canvas editor. Manage your brand kit and templates.
      </p>

      <div className="space-y-4">
        <button className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold">
          + New Canvas
        </button>
        <button className="w-full px-6 py-3 bg-slate-200 text-slate-900 rounded-lg hover:bg-slate-300">
          Browse Templates
        </button>
      </div>

      <div className="mt-8">
        <h3 className="font-semibold text-slate-900 mb-3">Brand Kit</h3>
        <div className="space-y-2">
          <p className="text-sm text-slate-600">Colors, fonts, and logos will appear here</p>
        </div>
      </div>
    </div>
  );
}
