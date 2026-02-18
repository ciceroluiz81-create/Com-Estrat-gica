
import React from 'react';
import { VisualStyle, ContentTone } from '../types';

interface ControlCenterProps {
  style: VisualStyle;
  tone: ContentTone;
  setStyle: (s: VisualStyle) => void;
  setTone: (t: ContentTone) => void;
}

export const ControlCenter: React.FC<ControlCenterProps> = ({ style, tone, setStyle, setTone }) => {
  return (
    <div className="bg-white border-l-4 border-emerald-800 p-6 rounded-lg shadow-sm mb-8">
      <h2 className="text-sm font-bold text-emerald-900 uppercase tracking-widest mb-4 flex items-center gap-2">
        <span className="w-2 h-2 bg-emerald-800 rounded-full"></span>
        Centro de Controle Operacional
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Estilo Visual</label>
          <div className="flex gap-2">
            {Object.values(VisualStyle).map((v) => (
              <button
                key={v}
                onClick={() => setStyle(v)}
                className={`flex-1 py-2 px-4 rounded border text-sm transition-all ${
                  style === v 
                  ? 'bg-emerald-800 text-white border-emerald-800' 
                  : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-emerald-400'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Tom da Comunicação</label>
          <div className="flex gap-2">
            {Object.values(ContentTone).map((v) => (
              <button
                key={v}
                onClick={() => setTone(v)}
                className={`flex-1 py-2 px-4 rounded border text-sm transition-all ${
                  tone === v 
                  ? 'bg-slate-800 text-white border-slate-800' 
                  : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-slate-400'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
