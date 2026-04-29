import React, { useEffect, useState } from 'react';
import { moduleStore } from '../../store';

export default function ResearchModule({ projectId }) {
  const { research, fetchModuleData } = moduleStore();
  const [sources, setSources] = useState([]);

  useEffect(() => {
    fetchModuleData(projectId, 'research');
  }, [projectId]);

  useEffect(() => {
    if (research?.data?.sources) {
      setSources(research.data.sources);
    }
  }, [research]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-slate-900 mb-4">📚 Research</h2>
      <p className="text-slate-600 mb-6">
        Upload documents, manage sources, and discover insights across your research.
      </p>

      <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center mb-6">
        <p className="text-slate-500 mb-2">Drag files here or click to upload</p>
        <input
          type="file"
          multiple
          className="hidden"
          id="file-input"
        />
        <button
          onClick={() => document.getElementById('file-input').click()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Choose Files
        </button>
      </div>

      <div>
        <h3 className="font-semibold text-slate-900 mb-3">Sources</h3>
        {sources.length > 0 ? (
          <ul className="space-y-2">
            {sources.map((source, idx) => (
              <li key={idx} className="p-3 bg-slate-50 rounded-lg">
                {source.title}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-slate-500">No sources yet</p>
        )}
      </div>
    </div>
  );
}
