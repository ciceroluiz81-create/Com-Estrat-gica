
import React from 'react';

interface DeliverableCardProps {
  title: string;
  icon: React.ReactNode;
  content: string;
  badge?: string;
  imageUrl?: string;
}

export const DeliverableCard: React.FC<DeliverableCardProps> = ({ title, icon, content, badge, imageUrl }) => {
  // Função para converter markdown básico em HTML seguro para exibição
  // Mantém tags HTML enviadas pela IA como <u>
  const formatContent = (text: string) => {
    let formatted = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Negrito Markdown
      .replace(/\n/g, '<br />'); // Quebras de linha
    
    return { __html: formatted };
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden flex flex-col h-full">
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-50 text-emerald-800 rounded-lg">
            {icon}
          </div>
          <h3 className="font-bold text-gray-800 uppercase text-sm tracking-wide">{title}</h3>
        </div>
        {badge && (
          <span className="text-[10px] font-bold px-2 py-1 bg-gray-200 text-gray-600 rounded uppercase">
            {badge}
          </span>
        )}
      </div>
      
      {imageUrl && (
        <div className="relative aspect-square w-full bg-gray-100 border-b border-gray-100 group">
          <img 
            src={imageUrl} 
            alt="Generated Visual Content" 
            className="w-full h-full object-cover shadow-inner"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 flex flex-col justify-end h-1/3 opacity-0 group-hover:opacity-100 transition-opacity">
            <p className="text-[9px] text-yellow-400 font-black uppercase tracking-widest">Layout Institucional Aplicado</p>
            <p className="text-[8px] text-white/70 font-mono uppercase">Dimensão: 1080x1080 | Identidade: Caderno 2025</p>
          </div>
          <div className="absolute top-4 right-4 bg-emerald-800/80 backdrop-blur-md px-3 py-1 rounded text-[10px] text-white font-bold uppercase tracking-widest shadow-lg border border-white/20">
            Preview Final
          </div>
        </div>
      )}

      <div className="p-6 flex-grow">
        <div 
          className="prose prose-sm max-w-none text-gray-700 leading-relaxed font-normal"
          dangerouslySetInnerHTML={formatContent(content)}
        />
      </div>
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
        <button 
          onClick={() => {
            // Copia o texto limpo para o clipboard
            const plainText = content.replace(/<[^>]*>?/gm, '').replace(/\*\*/g, '');
            navigator.clipboard.writeText(plainText);
            alert('Conteúdo copiado para a área de transferência.');
          }}
          className="text-xs font-bold text-emerald-800 hover:text-emerald-900 flex items-center gap-1 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
          </svg>
          COPIAR MATERIAL
        </button>
      </div>
    </div>
  );
};
