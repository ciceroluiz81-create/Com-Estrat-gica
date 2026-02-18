
import React, { useState, useEffect } from 'react';
import { ControlCenter } from './components/ControlCenter';
import { DeliverableCard } from './components/DeliverableCard';
import { Icons } from './constants';
import { VisualStyle, ContentTone, ReferenceImage, SocialMediaContent, LinhaDeEsforco, IDEIAS_FORCA_MAP } from './types';
import { generateOperationalContent, generateOperationalImage } from './services/geminiService';

const App: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [style, setStyle] = useState<VisualStyle>(VisualStyle.REAL_PHOTOS);
  const [tone, setTone] = useState<ContentTone>(ContentTone.TECHNICAL);
  const [linha, setLinha] = useState<LinhaDeEsforco>(LinhaDeEsforco.OPERACIONALIDADE);
  const [ideiaForca, setIdeiaForca] = useState<string>('');
  const [customSource, setCustomSource] = useState<string>('');
  const [images, setImages] = useState<ReferenceImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SocialMediaContent | null>(null);
  const [showCustomSource, setShowCustomSource] = useState(false);

  // Atualiza a Ideia-Força selecionada quando a Linha de Esforço muda
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
      const params = { 
        topic, 
        style, 
        tone, 
        linha, 
        ideiaForca, 
        images,
        customSource: customSource.trim() || undefined
      };

      // Chamada sequencial para garantir sincronia de títulos
      const textContent = await generateOperationalContent(params);
      
      // Gera a imagem usando o título gerado no conteúdo textual
      const generatedImageUrl = await generateOperationalImage(params, textContent.articleTitle);

      setResult({
        ...textContent,
        imageUrl: generatedImageUrl
      });
    } catch (error) {
      console.error(error);
      alert('Falha na geração estratégica. Verifique os parâmetros.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6]">
      {/* Institutional Header */}
      <header className="military-gradient text-white py-8 px-4 shadow-2xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-white/10 p-3 rounded-full backdrop-blur-sm border border-white/20">
              <Icons.Shield />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black tracking-tighter uppercase italic leading-tight">Comando de Operações Terrestres</h1>
              <p className="text-xs font-bold text-emerald-400 tracking-[0.2em] uppercase">Comunicação Estratégica (TC LUIZ ALVES)</p>
            </div>
          </div>
          <div className="text-right hidden md:block">
            <p className="text-[10px] font-mono opacity-60 uppercase">Doutrina: Caderno 2025</p>
            <p className="text-[10px] font-mono opacity-60 uppercase">MÓDULO: LITERARY FACTORY V5.3</p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-10 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Inputs Section */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-3 tracking-widest">
                Definição do Evento / Atividade
              </label>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Ex: Operação Taquari - Apoio à Defesa Civil no RS"
                className="w-full h-32 p-4 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none text-sm leading-relaxed"
              />
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-3 tracking-widest">
                  Linha de Esforço
                </label>
                <select 
                  value={linha}
                  onChange={(e) => setLinha(e.target.value as LinhaDeEsforco)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {Object.values(LinhaDeEsforco).map(v => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-3 tracking-widest">
                  Ideia-Força
                </label>
                <select 
                  value={ideiaForca}
                  onChange={(e) => setIdeiaForca(e.target.value)}
                  className="w-full p-3 bg-gray-100 border border-emerald-100 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-emerald-900"
                >
                  {IDEIAS_FORCA_MAP[linha].map(v => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </div>

              {/* Módulo de Fonte Customizada */}
              <div className="pt-2">
                <button 
                  onClick={() => setShowCustomSource(!showCustomSource)}
                  className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest hover:underline flex items-center gap-1"
                >
                  {showCustomSource ? '[-] Ocultar' : '[+] Adicionar'} Contexto Adicional
                </button>
                {showCustomSource && (
                  <div className="mt-3 animate-in fade-in slide-in-from-top-2 duration-300">
                    <textarea
                      value={customSource}
                      onChange={(e) => setCustomSource(e.target.value)}
                      placeholder="Cole aqui diretrizes específicas para esta missão..."
                      className="w-full h-40 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono outline-none focus:ring-1 focus:ring-slate-400"
                    />
                    <p className="text-[9px] text-gray-400 mt-1 italic uppercase">A IA priorizará este contexto na fusão literária.</p>
                  </div>
                )}
              </div>
            </div>

            <ControlCenter 
              style={style} 
              tone={tone} 
              setStyle={setStyle} 
              setTone={setTone} 
            />

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-3 tracking-widest flex items-center justify-between">
                <span>Imagens de Referência</span>
                <span className="text-emerald-600">{images.length}/3</span>
              </label>
              
              <div className="grid grid-cols-3 gap-3 mb-4">
                {images.map(img => (
                  <div key={img.id} className="relative aspect-square rounded-lg overflow-hidden border border-gray-100 group">
                    <img src={img.preview} alt="Reference" className="w-full h-full object-cover" />
                    <button 
                      onClick={() => removeImage(img.id)}
                      className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
                {images.length < 3 && (
                  <label className="aspect-square border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
                    <Icons.Camera />
                    <span className="text-[10px] font-bold mt-1 text-gray-400">ANEXAR</span>
                    <input type="file" className="hidden" accept="image/*" multiple onChange={handleImageUpload} />
                  </label>
                )}
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading}
              className={`w-full py-4 rounded-xl font-black text-white uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-xl ${
                loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-emerald-800 hover:bg-emerald-900 active:transform active:scale-95'
              }`}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Mobilizando Inteligência...
                </>
              ) : (
                <>
                  <Icons.Send />
                  Produzir Material Estratégico
                </>
              )}
            </button>
          </div>

          {/* Outputs Section */}
          <div className="lg:col-span-7">
            {!result && !loading && (
              <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-white/50 border-2 border-dashed border-gray-200 rounded-3xl">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-300">
                  <Icons.Shield />
                </div>
                <h3 className="text-lg font-bold text-gray-400 uppercase tracking-widest">Fábrica de Conteúdo</h3>
                <p className="text-sm text-gray-400 mt-2 max-w-xs">Os parâmetros oficiais e visuais do Caderno de Comunicação 2025 estão aplicados.</p>
              </div>
            )}

            {loading && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl h-64 animate-pulse border border-gray-100 p-6 flex flex-col items-center justify-center text-gray-300">
                  <Icons.Camera />
                  <p className="text-[10px] font-bold mt-2 uppercase tracking-widest">Renderizando Visual Sincronizado...</p>
                </div>
                {[1, 2].map(i => (
                  <div key={i} className="bg-white rounded-xl h-48 animate-pulse border border-gray-100 p-6 space-y-4">
                    <div className="h-6 w-1/3 bg-gray-100 rounded"></div>
                    <div className="h-4 w-full bg-gray-50 rounded"></div>
                    <div className="h-4 w-5/6 bg-gray-50 rounded"></div>
                  </div>
                ))}
              </div>
            )}

            {result && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <DeliverableCard 
                  title="Social Media (Instagram/Facebook)" 
                  icon={<Icons.Camera />}
                  badge="Roteiro & Legenda"
                  content={result.instagram}
                  imageUrl={result.imageUrl}
                />
                <DeliverableCard 
                  title="WhatsApp" 
                  icon={<Icons.Send />}
                  badge="Canais de Informação"
                  content={result.whatsapp}
                />
                <DeliverableCard 
                  title="Matéria de Imprensa" 
                  icon={<Icons.Shield />}
                  badge="Análise Institucional"
                  content={result.article}
                />

                {/* Sources Section */}
                {result.sources && result.sources.length > 0 && (
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-emerald-100">
                    <h4 className="text-[10px] font-black text-emerald-800 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                      <span className="w-4 h-[1px] bg-emerald-800"></span>
                      Fontes de Consulta e Doutrina
                    </h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {result.sources.map((src, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-emerald-500 mt-1">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293l-4 4a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L9 10.586l3.293-3.293a1 1 0 011.414 1.414z" />
                            </svg>
                          </span>
                          <span className="text-[11px] font-medium text-gray-600 uppercase tracking-wide leading-tight">{src}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 mt-20 py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 opacity-50 grayscale">
          <div className="flex items-center gap-2">
            <span className="font-black text-sm tracking-tighter uppercase leading-tight">Comando de Operações Terrestres</span>
            <span className="text-xs font-mono">| EXÉRCITO BRASILEIRO</span>
          </div>
          <p className="text-[10px] font-mono text-center uppercase">Comunicação Estratégica: Eficácia Operacional em Foco</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
