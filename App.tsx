
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
      <header className="military-gradient text-white py-8 px-4 shadow-2xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-white/10 p-3 rounded-full backdrop-blur-sm border border-white/20">
              <Icons.Shield />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black tracking-tighter uppercase italic leading-tight">Comando de Operações Terrestres</h1>
              <p className="text-xs font-bold text-emerald-400 tracking-[0.2em] uppercase">Estratégia 2026 (TC LUIZ ALVES)</p>
            </div>
          </div>
          <div className="text-right hidden md:block">
            <p className="text-[10px] font-mono opacity-60 uppercase">Doutrina Traduzida para Sociedade Civil</p>
            <p className="text-[10px] font-mono opacity-60 uppercase">MÓDULO: ANALYTICAL FACTORY V6.0</p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-10 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-3 tracking-widest">Atividade Operacional / Evento</label>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Ex: Operação Catrimani II - Proteção ao Povo Yanomami"
                className="w-full h-32 p-4 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
              />
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2 tracking-widest">Linha de Esforço</label>
                <select 
                  value={linha}
                  onChange={(e) => setLinha(e.target.value as LinhaDeEsforco)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                >
                  {Object.values(LinhaDeEsforco).map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2 tracking-widest">Ideia-Força</label>
                <select 
                  value={ideiaForca}
                  onChange={(e) => setIdeiaForca(e.target.value)}
                  className="w-full p-3 bg-emerald-50 border border-emerald-100 rounded-lg text-sm font-medium text-emerald-900"
                >
                  {IDEIAS_FORCA_MAP[linha].map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
            </div>

            <ControlCenter style={style} tone={tone} setStyle={setStyle} setTone={setTone} />

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-3 tracking-widest flex justify-between">
                <span>Referências Visuais</span>
                <span className="text-emerald-600">{images.length}/3</span>
              </label>
              <div className="grid grid-cols-3 gap-3">
                {images.map(img => (
                  <div key={img.id} className="relative aspect-square rounded-lg overflow-hidden group">
                    <img src={img.preview} className="w-full h-full object-cover" />
                    <button onClick={() => removeImage(img.id)} className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                ))}
                {images.length < 3 && (
                  <label className="aspect-square border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50">
                    <Icons.Camera />
                    <input type="file" className="hidden" accept="image/*" multiple onChange={handleImageUpload} />
                  </label>
                )}
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading}
              className={`w-full py-4 rounded-xl font-black text-white uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 transition-all ${loading ? 'bg-gray-400' : 'bg-emerald-800 hover:bg-emerald-900'}`}
            >
              {loading ? 'ANALISANDO RISCOS...' : <><Icons.Send /> GERAR MATERIAL 2026</>}
            </button>
          </div>

          <div className="lg:col-span-7 space-y-8">
            {loading && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl h-64 animate-pulse"></div>
                <div className="bg-white rounded-xl h-48 animate-pulse"></div>
              </div>
            )}

            {result && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8">
                <DeliverableCard title="Mídia Digital (2026)" icon={<Icons.Camera />} badge="Instagram/Facebook" content={result.instagram} imageUrl={result.imageUrl} />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-red-100">
                    <h4 className="text-[10px] font-black text-red-800 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <span className="w-4 h-[1px] bg-red-800"></span> ANÁLISE DE RISCO REPUTACIONAL
                    </h4>
                    <p className="text-xs text-gray-700 leading-relaxed font-medium">{result.riskAnalysis}</p>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-100">
                    <h4 className="text-[10px] font-black text-blue-800 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <span className="w-4 h-[1px] bg-blue-800"></span> MÉTRICAS DE IMPACTO (KPIs)
                    </h4>
                    <p className="text-xs text-gray-700 leading-relaxed font-medium">{result.impactMetrics}</p>
                  </div>
                </div>

                <DeliverableCard title="WhatsApp Institucional" icon={<Icons.Send />} badge="Canais de Difusão" content={result.whatsapp} />
                <DeliverableCard title="Artigo Analítico" icon={<Icons.Shield />} badge="Doutrina Traduzida" content={result.article} />

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <h4 className="text-[10px] font-black text-emerald-800 uppercase tracking-widest mb-4">BASE DOCUMENTAL (REFERÊNCIAS)</h4>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {result.sources.map((src, i) => (
                      <li key={i} className="text-[11px] text-gray-600 uppercase flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span> {src}
                      </li>
                    ))}
                  </ul>
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
