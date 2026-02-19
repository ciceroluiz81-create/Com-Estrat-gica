
import React from 'react';
import { jsPDF } from 'jspdf';

interface DeliverableCardProps {
  title: string;
  icon: React.ReactNode;
  content: string;
  badge?: string;
  imageUrl?: string;
}

export const DeliverableCard: React.FC<DeliverableCardProps> = ({ title, icon, content, badge, imageUrl }) => {
  // Função para converter markdown básico em HTML seguro para exibição
  const formatContent = (text: string) => {
    let formatted = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Negrito Markdown
      .replace(/\n/g, '<br />'); // Quebras de linha
    
    return { __html: formatted };
  };

  const handleDownloadImage = () => {
    if (!imageUrl) return;
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `imagem_coter_${new Date().getTime()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const margin = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const contentWidth = pageWidth - (margin * 2);

    // Cabeçalho Institucional
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("EXÉRCITO BRASILEIRO", pageWidth / 2, 20, { align: "center" });
    doc.setFontSize(10);
    doc.text("COMANDO DE OPERAÇÕES TERRESTRES", pageWidth / 2, 26, { align: "center" });
    
    doc.setLineWidth(0.5);
    doc.line(margin, 30, pageWidth - margin, 30);

    // Título do Card
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(title.toUpperCase(), margin, 45);

    // Conteúdo (Limpeza de HTML)
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    const cleanText = content
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<[^>]*>?/gm, '')
      .replace(/\*\*/g, '');
    
    const lines = doc.splitTextToSize(cleanText, contentWidth);
    doc.text(lines, margin, 55);

    // Rodapé de Autenticidade
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text(
        `Documento Gerado por COTER AI Factory (Persona TC Luiz Alves) - ${new Date().toLocaleDateString('pt-BR')}`,
        pageWidth / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: "center" }
      );
    }

    const fileName = `${title.toLowerCase().replace(/\s+/g, '_')}_${new Date().getTime()}.pdf`;
    doc.save(fileName);
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
          <button 
            onClick={handleDownloadImage}
            className="absolute bottom-4 right-4 bg-white/90 hover:bg-white text-emerald-900 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0"
            title="Baixar Imagem JPG"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </button>
        </div>
      )}

      <div className="p-6 flex-grow">
        <div 
          className="prose prose-sm max-w-none text-gray-700 leading-relaxed font-normal"
          dangerouslySetInnerHTML={formatContent(content)}
        />
      </div>
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-4">
          <button 
            onClick={handleDownloadPDF}
            className="text-xs font-bold text-emerald-800 hover:text-emerald-900 flex items-center gap-1.5 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            BAIXAR PDF
          </button>
          
          {imageUrl && (
            <button 
              onClick={handleDownloadImage}
              className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1.5 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              BAIXAR JPG
            </button>
          )}
        </div>

        <button 
          onClick={() => {
            const plainText = content.replace(/<[^>]*>?/gm, '').replace(/\*\*/g, '');
            navigator.clipboard.writeText(plainText);
            alert('Conteúdo copiado para a área de transferência.');
          }}
          className="text-xs font-bold text-gray-500 hover:text-gray-700 flex items-center gap-1 transition-colors ml-auto"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
          </svg>
          COPIAR TEXTO
        </button>
      </div>
    </div>
  );
};
