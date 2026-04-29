import React, { useEffect } from 'react';
import { moduleStore } from '../../store';

export default function VideoModule({ projectId }) {
  const { video, fetchModuleData } = moduleStore();

  useEffect(() => {
    fetchModuleData(projectId, 'video');
  }, [projectId]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-slate-900 mb-4">🎬 Video</h2>
      <p className="text-slate-600 mb-6">
        Edit video timelines, add clips, captions, and effects.
      </p>

      <div className="space-y-4">
        <button className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold">
          + New Timeline
        </button>
        <button className="w-full px-6 py-3 bg-slate-200 text-slate-900 rounded-lg hover:bg-slate-300">
          Stock Library
        </button>
      </div>

      <div className="mt-8">
        <h3 className="font-semibold text-slate-900 mb-3">Timeline Editor</h3>
        <p className="text-sm text-slate-600">Create a new timeline to get started</p>
      </div>
    </div>
  );
}
