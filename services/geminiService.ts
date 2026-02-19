
import { GoogleGenAI, Type } from "@google/genai";
import { GenerationParams, SocialMediaContent, LinhaDeEsforco, VisualStyle } from "../types";

const TEXT_MODEL = 'gemini-3-pro-preview';
const IMAGE_MODEL = 'gemini-2.5-flash-image';

const DOUTRINA_COTER: Record<LinhaDeEsforco, string> = {
  [LinhaDeEsforco.OPERACIONALIDADE]: "Foco no 'Braço Forte': prontidão logística, vigilância diuturna da fronteira, defense da Amazônia, combate a ilícitos transfronteiriços e interoperabilidade entre Forças Armadas.",
  [LinhaDeEsforco.INTEGRACAO_SOCIEDADE]: "Foco na 'Mão Amiga': apoio em catástrofes (Op Taquari/Pantanal), auxílio a povos originários, cooperação ambiental e compromisso inabalável com a Democracia e o desenvolvimento nacional.",
  [LinhaDeEsforco.DIPLOMACIA_MILITAR]: "Profissionalismo em missões de paz da ONU, atuação do CCOPAB, relevância dos Adidos Militares e integração com exércitos de nações amigas para dissuasão e cooperação.",
  [LinhaDeEsforco.COESAO]: "União entre Ativa e Veteranos, valorização da Família Militar, ética, combate a assédios e novos riscos sociais (bets), e o Sistema de Proteção Social Militar como pilar de estabilidade.",
  [LinhaDeEsforco.FORMACAO_MILITAR]: "Excelência no ensino, civismo e disciplina, formação profissional de alto nível como base do profissionalismo e altos estudos militares.",
  [LinhaDeEsforco.LEGITIMIDADE]: "Instituição de State pautada na legalidade (Art 142 CF), transparência (LAI), atuação em GLO e apoio ao processo eleitoral dentro dos marcos vigentes.",
  [LinhaDeEsforco.CIENCIA_TECNOLOGIA]: "Modernização de MEM, fortalecimento da BID, Programas Estratégicos e parcerias científico-tecnológicas como ativos de soberania nacional.",
  [LinhaDeEsforco.SINGULARIDADE]: "A vertente 'Mão Amiga', sacrifício pessoal e familiar, necessidade de saúde autônoma e dedicação exclusiva como traços distintivos da profissão militar.",
};

export async function generateOperationalImage(params: GenerationParams, forcedTitle?: string): Promise<string | undefined> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const styleInstruction = params.style === VisualStyle.REAL_PHOTOS 
    ? "Crie uma imagem realista com estética fotográfica profissional, luz natural, alta definição, estilo fotojornalismo militar."
    : "Crie uma ilustração épica e moderna, com estilo cinematográfico, cores vibrantes, impacto visual artístico.";

  const displayTitle = forcedTitle || params.topic;

  const prompt = `
    ${styleInstruction}
    ASSUNTO PRINCIPAL: Uma cena do Exército Brasileiro realizando: "${params.topic}".
    
    DIRETRIZES DE LAYOUT INSTITUCIONAL (ESTRITAMENTE OBRIGATÓRIO):
    1. A imagem deve ser composta como um cartaz oficial de 1080x1080.
    2. FUNDO: A cena operacional descrita acima ocupando toda a área.
    3. MÁSCARA INFERIOR: Gradiente preto sólido no terço inferior para dar legibilidade aos textos.
    4. TEXTO LINHA DE ESFORÇO: Escreva "${params.linha}" em letras AMARELAS vibrantes (#FFD700) no canto inferior esquerdo, sobre o gradiente.
    5. TÍTULO DA MISSÃO: Escreva "${displayTitle}" em letras BRANCAS (#FFFFFF) grandes, em negrito, logo abaixo do texto da Linha de Esforço, também alinhado à esquerda.
    6. SLOGAN FINAL: Na base inferior centralizada, em letras brancas menores: "A VITÓRIA TERRESTRE COMEÇA AQUI!".
    
    ESTILO: Prontidão, profissionalismo e soberania conforme persona TC Luiz Alves.
    
    IMPORTANTE: NÃO inclua brasões, escudos, logomarcas ou símbolos institucionais (como o escudo do COTER) na imagem. O foco deve ser puramente na cena operacional e nos textos descritos.
  `;

  const response = await ai.models.generateContent({
    model: IMAGE_MODEL,
    contents: {
      parts: [{ text: prompt }]
    },
    config: {
      imageConfig: { aspectRatio: "1:1" }
    }
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return undefined;
}

export async function generateOperationalContent(params: GenerationParams): Promise<SocialMediaContent> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const toneDesc = params.tone === 'Técnico' 
    ? 'estritamente institucional, técnico e focado em resultados operacionais e marcos legais' 
    : 'emotivo, ressaltando o lado humano, o espírito de corpo, o sacrifício da família e a dedicação vocacionada';

  const customDoctrineContext = params.customSource 
    ? `FONTE DE CONSULTA PRIORITÁRIA (Manual/Diretriz): \n"""\n${params.customSource}\n"""\n` 
    : "";

  const systemInstruction = `
    IDENTIDADE: Você é o Tenente-Coronel Luiz Alves (45 anos), Chefe da Comunicação Estratégica Operacional do COTER (Persona 2026).
    PERFIL PROFISSIONAL: Produtor Textual sênior com rigorosa formação em ECEME e Letras.
    MISSÃO: Garantir alinhamento às Diretrizes do Comandante, antecipar riscos reputacionais e traduzir doutrina para linguagem civil COM EXCELÊNCIA GRAMATICAL.
    
    REQUISITO CRÍTICO DE LINGUAGEM:
    - O conteúdo deve seguir a NORMA CULTA do Português Brasileiro (Padrão ABNT para documentos técnicos quando couber).
    - ERROS DE PORTUGUÊS SÃO INADMISSÍVEIS. Faça uma revisão textual rigorosa antes de gerar a resposta.
    - O tom é institucional, acessível, preventivo e sólido.
    
    PRINCÍPIO ESTRUTURAL (FLUXO):
    Linha de Esforço -> Ideia-Força -> Base Documental -> Tradução Estratégica -> Controle de Risco -> Métrica de Impacto.

    ${customDoctrineContext}

    REGRAS DE OURO:
    1. PROIBIÇÃO LITERAL: NUNCA escreva os termos "linha de esforço" ou "ideia-força".
    2. DESTAQUE E INTEGRAÇÃO: Integre o sentido da Ideia-Força selecionada ("${params.ideiaForca}"). O trecho que expressa esse sentido DEVE ser destacado obrigatoriamente em **negrito e sublinhado** (Use a tag HTML: **<u>texto</u>**).
    3. REVISÃO TEXTUAL: Atue como revisor ortográfico e sintático impecável. Evite gírias inapropriadas ou construções ambíguas.
    4. NÃO POLÍTICO: Jamais comente decisões políticas ou entre em debates ideológicos.
    5. NÃO PERSONALIZE: Foco na Instituição.

    INTEGRAÇÃO OBRIGATÓRIA:
    - Mesclar Linha de Esforço (${params.linha}) com Ideia-Força (${params.ideiaForca}).
    - Fontes oficiais apenas.

    REQUISITOS DE SAÍDA:
    - instagram: Script carrossel + Legenda (3 parágrafos, 1º parágrafo com **<u>destaque</u>** estratégico).
    - whatsapp: Mensagem institucional objetiva com **<u>destaque</u>**.
    - article: Texto formal, analítico, focado em estabilidade institucional.
    - riskAnalysis: Breve análise de riscos reputacionais e mitigação.
    - impactMetrics: Sugestão de KPIs.
    - sources: Lista de manuais e leis utilizadas.
  `;

  const prompt = `Gere o conteúdo estratégico literário como Produtor Textual oficial, seguindo rigorosamente as normas da língua portuguesa, sobre o tópico: "${params.topic}".`;

  const response = await ai.models.generateContent({
    model: TEXT_MODEL,
    contents: { 
      parts: [
        ...params.images.map(img => ({ inlineData: { data: img.data, mimeType: img.mimeType } })),
        { text: prompt }
      ] 
    },
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          instagram: { type: Type.STRING },
          whatsapp: { type: Type.STRING },
          article: { type: Type.STRING },
          articleTitle: { type: Type.STRING },
          riskAnalysis: { type: Type.STRING },
          impactMetrics: { type: Type.STRING },
          sources: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["instagram", "whatsapp", "article", "articleTitle", "riskAnalysis", "impactMetrics", "sources"]
      }
    }
  });

  const jsonStr = (response.text || '{}').trim();
  return JSON.parse(jsonStr) as SocialMediaContent;
}
