
import React, { useState, useEffect } from 'react';
import { ControlCenter } from './components/ControlCenter';
import { DeliverableCard } from './components/DeliverableCard';
import { Icons, COTER_LOGO_URL } from './constants';
import { VisualStyle, ContentTone, ReferenceImage, SocialMediaContent, LinhaDeEsforco, IDEIAS_FORCA_MAP } from './types';
import { generateOperationalContent, generateOperationalImage } from './services/geminiService';
import * as pdfjsLib from 'pdfjs-dist';

// Configuração do worker do PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://esm.sh/pdfjs-dist@4.10.38/build/pdf.worker.mjs`;

const App: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [style, setStyle] = useState<VisualStyle>(VisualStyle.REAL_PHOTOS);
  const [tone, setTone] = useState<ContentTone>(ContentTone.TECHNICAL);
  const [linha, setLinha] = useState<LinhaDeEsforco>(LinhaDeEsforco.OPERACIONALIDADE);
  const [ideiaForca, setIdeiaForca] = useState<string>('');
  const [customSource, setCustomSource] = useState<string>('');
  const [attachedFileName, setAttachedFileName] = useState<string | null>(null);
  const [images, setImages] = useState<ReferenceImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [processingPdf, setProcessingPdf] = useState(false);
  const [result, setResult] = useState<SocialMediaContent | null>(null);
  const [logoError, setLogoError] = useState(false);

  useEffect(() => {
    const opcoes = IDEIAS_FORCA_MAP[linha];
    if (opcoes && opcoes.length > 0) {
      setIdeiaForca(opcoes[0]);
    }
  }, [linha]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files: File[] = (Array.from(e.target.files) as File[]).slice(0, 3);
    
    files.forEach((file: File) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        setImages(prev => [
          ...prev,
          {
            id: Math.random().toString(36).substr(2, 9),
            preview: reader.result as string,
            data: base64String,
            mimeType: file.type
          }
        ].slice(0, 3));
      };
      reader.readAsDataURL(file);
    });
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || file.type !== 'application/pdf') {
      alert('Por favor, anexe um arquivo PDF válido.');
      return;
    }

    setProcessingPdf(true);
    setAttachedFileName(file.name);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(' ');
        fullText += pageText + '\n';
      }

      setCustomSource(fullText);
    } catch (error) {
      console.error('Erro ao processar PDF:', error);
      alert('Erro ao extrair texto do PDF.');
      setAttachedFileName(null);
    } finally {
      setProcessingPdf(false);
    }
  };

  const removeImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  const handleGenerate = async () => {
    if (!topic) {
      alert('Por favor, defina o tópico da missão.');
      return;
    }
    setLoading(true);
    setResult(null);
    
    try {
      const params = { topic, style, tone, linha, ideiaForca, images, customSource: customSource.trim() || undefined };
      const textContent = await generateOperationalContent(params);
      const generatedImageUrl = await generateOperationalImage(params, textContent.articleTitle);

      setResult({ ...textContent, imageUrl: generatedImageUrl });
    } catch (error) {
      console.error(error);
      alert('Falha na geração estratégica. Verifique os parâmetros.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6]">
      <header className="military-gradient text-white py-12 px-6 shadow-[0_10px_30px_rgba(0,0,0,0.4)] relative overflow-hidden border-b border-emerald-900/50">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full -mr-48 -mt-48 blur-[100px]"></div>
        
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="relative group min-w-[144px]">
              <div className="absolute -inset-4 bg-emerald-500/20 rounded-full blur-2xl opacity-40 group-hover:opacity-70 transition duration-1000 animate-pulse"></div>
              
              {!logoError ? (
                <img 
                  src={COTER_LOGO_URL} 
                  alt="Brasão Oficial COTER" 
                  onError={() => {
                    console.error("Erro ao carregar o logo do COTER.");
                    setLogoError(true);
                  }}
                  loading="eager"
                  className="relative w-36 h-36 md:w-44 md:h-44 object-contain drop-shadow-[0_15px_25px_rgba(0,0,0,0.6)] transition-transform duration-700 hover:scale-105 cursor-help"
                />
              ) : (
                <div className="relative w-36 h-36 md:w-44 md:h-44 bg-emerald-950/80 rounded-full flex flex-col items-center justify-center border-4 border-emerald-500/30 text-emerald-400 shadow-2xl">
                  <Icons.Shield />
                  <span className="text-[9px] font-black uppercase mt-1 tracking-tighter">COTER BRASÃO</span>
                </div>
              )}
            </div>
            
            <div className="text-center md:text-left space-y-2">
              <h1 className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic leading-none text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]">
                Comando de Operações Terrestres
              </h1>
              <div className="flex flex-col md:flex-row md:items-center gap-4 pt-1">
                <div className="flex items-center justify-center md:justify-start gap-3">
                  <span className="h-[3px] w-14 bg-emerald-500 rounded-full shadow-[0_0_10px_#10b981]"></span>
                  <p className="text-base md:text-lg font-bold text-emerald-400 tracking-[0.4em] uppercase drop-shadow-sm">
                    Estratégia 2026 (TC LUIZ ALVES)
                  </p>
                </div>
              </div>
              <p className="text-[10px] font-mono text-white/40 uppercase tracking-[0.5em] mt-2 block">A VITÓRIA TERRESTRE COMEÇA AQUI!</p>
            </div>
          </div>
          
          <div className="text-right hidden lg:block border-l-2 border-white/5 pl-10 space-y-3">
            <div className="space-y-1">
              <p className="text-[10px] font-mono font-bold text-white/60 uppercase tracking-[0.2em]">Rede: SIPLEX-OPs</p>
              <p className="text-[10px] font-mono font-bold text-white/60 uppercase tracking-[0.2em]">Nível de Segurança: Reservado</p>
            </div>
            <div className="bg-black/20 backdrop-blur-sm p-3 rounded-lg border border-white/5 shadow-inner">
              <p className="text-[11px] font-mono font-black text-emerald-500 uppercase tracking-[0.1em] flex items-center justify-end gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
                Analytical Engine v9.5.4
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-12 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200 transition-all hover:shadow-2xl">
              <label className="block text-[11px] font-black text-gray-400 uppercase mb-4 tracking-[0.2em]">Missão / Evento Operacional</label>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Ex: Operação Ágata - Reforço na Faixa de Fronteira Norte"
                className="w-full h-36 p-5 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none text-base font-semibold text-gray-800 transition-all placeholder:text-gray-300 shadow-inner"
              />
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-xl border-l-8 border-l-blue-700 border border-gray-100 space-y-6">
              <div className="relative">
                <label className="block text-[11px] font-black text-blue-900 uppercase mb-3 tracking-[0.2em] flex items-center gap-3">
                  <Icons.FileText /> INTELIGÊNCIA TÉCNICA (PDF)
                </label>
                {attachedFileName ? (
                  <div className="flex items-center justify-between p-5 bg-blue-50 border-2 border-blue-100 rounded-2xl group transition-all hover:bg-blue-100">
                    <div className="flex items-center gap-4 overflow-hidden">
                      <div className="p-3 bg-blue-700 text-white rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                        <Icons.FileText />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-[10px] font-black text-blue-900 uppercase opacity-60">Doutrina Ativa</p>
                        <span className="text-sm font-bold text-blue-800 truncate block">{attachedFileName}</span>
                      </div>
                    </div>
                    <button onClick={() => { setAttachedFileName(null); setCustomSource(''); }} className="text-red-600 hover:bg-red-50 p-3 rounded-xl transition-all">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                ) : (
                  <label className={`w-full p-8 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all ${processingPdf ? 'bg-gray-100 border-gray-300 cursor-wait' : 'border-blue-200 hover:border-blue-500 hover:bg-blue-50/50 hover:shadow-inner'}`}>
                    {processingPdf ? (
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-8 h-8 border-4 border-blue-700 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-[11px] font-black text-blue-700 animate-pulse uppercase tracking-[0.2em]">INDEXANDO DOUTRINA...</span>
                      </div>
                    ) : (
                      <>
                        <div className="text-blue-300 mb-3 group-hover:scale-110 transition-transform"><Icons.FileText /></div>
                        <span className="text-[11px] font-black text-blue-800 uppercase tracking-[0.2em] text-center">ANEXAR DIRETRIZ ESTRATÉGICA (PDF)</span>
                      </>
                    )}
                    <input type="file" className="hidden" accept="application/pdf" onChange={handlePdfUpload} disabled={processingPdf} />
                  </label>
                )}
              </div>

              <div className="grid grid-cols-1 gap-5">
                <div>
                  <label className="block text-[11px] font-black text-gray-400 uppercase mb-2 tracking-[0.2em]">Linha de Esforço</label>
                  <select value={linha} onChange={(e) => setLinha(e.target.value as LinhaDeEsforco)} className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-xl text-sm font-bold text-gray-700 focus:border-emerald-500 outline-none transition-all">
                    {Object.values(LinhaDeEsforco).map(v => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-black text-gray-400 uppercase mb-2 tracking-[0.2em]">Ideia-Força Vinculada</label>
                  <select value={ideiaForca} onChange={(e) => setIdeiaForca(e.target.value)} className="w-full p-4 bg-emerald-50 border-2 border-emerald-100 rounded-xl text-sm font-black text-emerald-900 focus:border-emerald-500 outline-none transition-all shadow-sm">
                    {IDEIAS_FORCA_MAP[linha].map(v => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <ControlCenter style={style} tone={tone} setStyle={setStyle} setTone={setTone} />

            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
              <label className="block text-[11px] font-black text-gray-400 uppercase mb-4 tracking-[0.2em] flex justify-between items-center">
                <span>INTELIGÊNCIA VISUAL</span>
                <span className="text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full text-[10px] font-black">{images.length}/3 REFERÊNCIAS</span>
              </label>
              <div className="grid grid-cols-3 gap-4">
                {images.map(img => (
                  <div key={img.id} className="relative aspect-square rounded-xl overflow-hidden group shadow-md border border-gray-100">
                    <img src={img.preview} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <button onClick={() => removeImage(img.id)} className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                ))}
                {images.length < 3 && (
                  <label className="aspect-square border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-emerald-50 hover:border-emerald-400 transition-all group">
                    <div className="text-gray-300 group-hover:text-emerald-500 group-hover:scale-110 transition-all"><Icons.Camera /></div>
                    <input type="file" className="hidden" accept="image/*" multiple onChange={handleImageUpload} />
                  </label>
                )}
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading || processingPdf}
              className={`w-full py-6 rounded-2xl font-black text-white uppercase tracking-[0.3em] shadow-2xl flex items-center justify-center gap-4 transition-all transform hover:-translate-y-1 active:scale-95 ${loading || processingPdf ? 'bg-gray-400 cursor-not-allowed' : 'bg-emerald-900 hover:bg-emerald-800 ring-4 ring-emerald-900/10'}`}
            >
              {loading ? (
                <div className="flex items-center gap-4">
                  <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                  SINTETIZANDO COMANDO...
                </div>
              ) : (
                <><Icons.Send /> EMITIR DIRETRIZ DIGITAL</>
              )}
            </button>
          </div>

          <div className="lg:col-span-7 space-y-10">
            {loading && (
              <div className="space-y-8">
                <div className="bg-white rounded-2xl h-[500px] animate-pulse border border-gray-100 shadow-xl"></div>
                <div className="bg-white rounded-2xl h-64 animate-pulse border border-gray-100 shadow-xl"></div>
              </div>
            )}

            {result && (
              <div className="animate-in fade-in slide-in-from-bottom-6 duration-1000 space-y-10 pb-24">
                {result.conflictWarnings && result.conflictWarnings.trim() !== "" && (
                  <div className="bg-red-50 border-l-8 border-red-700 p-6 rounded-2xl shadow-2xl animate-bounce">
                    <div className="flex items-center gap-4 mb-3">
                      <svg className="w-8 h-8 text-red-700" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                      <h4 className="text-base font-black text-red-800 uppercase tracking-widest">ALERTA DE DIVERGÊNCIA TÁTICA</h4>
                    </div>
                    <p className="text-sm text-red-900 font-black leading-relaxed italic">{result.conflictWarnings}</p>
                  </div>
                )}

                {attachedFileName && (
                  <div className="bg-blue-700 text-white px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-[0.3em] flex items-center justify-center gap-4 shadow-2xl border-b-4 border-blue-900">
                    <Icons.FileText /> PRIORIDADE ESTRATÉGICA: DOCUMENTAÇÃO ANEXA ATIVA
                  </div>
                )}
                
                <DeliverableCard title="Social Media Institutional" icon={<Icons.Camera />} badge="Instagram/FB" content={result.instagram} imageUrl={result.imageUrl} />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-white p-10 rounded-2xl shadow-2xl border-t-8 border-t-red-700 border border-gray-100 hover:shadow-emerald-500/10 transition-shadow">
                    <h4 className="text-xs font-black text-red-900 uppercase tracking-widest mb-5 flex items-center gap-4">
                      <span className="w-8 h-[3px] bg-red-700 rounded-full"></span> ANÁLISE DE RISCO REPUTACIONAL
                    </h4>
                    <p className="text-sm text-gray-700 leading-relaxed font-bold italic opacity-90">{result.riskAnalysis}</p>
                  </div>
                  <div className="bg-white p-10 rounded-2xl shadow-2xl border-t-8 border-t-blue-700 border border-gray-100 hover:shadow-emerald-500/10 transition-shadow">
                    <h4 className="text-xs font-black text-blue-900 uppercase tracking-widest mb-5 flex items-center gap-4">
                      <span className="w-8 h-[3px] bg-blue-700 rounded-full"></span> INDICADORES DE IMPACTO (KPI)
                    </h4>
                    <p className="text-sm text-gray-700 leading-relaxed font-bold italic opacity-90">{result.impactMetrics}</p>
                  </div>
                </div>

                <DeliverableCard title="WhatsApp Corporativo" icon={<Icons.Send />} badge="Difusão Direta" content={result.whatsapp} />
                <DeliverableCard title="Artigo Técnico-Doutrinário" icon={<Icons.Shield />} badge="Pensamento Militar" content={result.article} />

                <div className="bg-white p-10 rounded-2xl shadow-2xl border border-gray-100 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 -mr-16 -mt-16 rounded-full"></div>
                  <h4 className="text-xs font-black text-emerald-900 uppercase tracking-[0.2em] mb-8 flex justify-between items-center relative z-10">
                    <span>FUNDAMENTAÇÃO E FONTES DE CONSULTA</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-4 py-1.5 rounded-full font-black border border-emerald-200">GROUNDING VERIFIED</span>
                  </h4>
                  <div className="space-y-8 relative z-10">
                    {result.sourceLinks && result.sourceLinks.length > 0 && (
                      <div className="border-b border-gray-100 pb-8">
                        <p className="text-[10px] font-black text-gray-400 mb-5 uppercase tracking-widest">Hiperlinks de Inteligência Externa:</p>
                        <div className="flex flex-wrap gap-4">
                          {result.sourceLinks.map((link, i) => (
                            <a 
                              key={i} 
                              href={link.uri} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-xs bg-white text-gray-800 border-2 border-gray-100 px-5 py-3 rounded-2xl hover:border-emerald-600 hover:text-emerald-900 hover:shadow-xl transition-all flex items-center gap-4 font-black group"
                            >
                              <div className="w-6 h-6 bg-gray-50 rounded-lg flex items-center justify-center shrink-0 border border-gray-200 group-hover:bg-emerald-50 transition-colors">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                              </div>
                              <span className="truncate max-w-[250px]">{link.title}</span>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {result.sources.map((src, i) => (
                        <div key={i} className="text-[11px] text-gray-600 uppercase flex items-start gap-4 bg-gray-50/50 p-4 rounded-xl border border-gray-100/50 hover:bg-white transition-colors">
                          <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full shrink-0 mt-1.5 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span> 
                          <span className="leading-tight font-black opacity-80">{src}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
