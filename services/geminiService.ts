
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

  // Prompt ultra-específico para o layout com o novo logo
  const prompt = `
    ${styleInstruction}
    ASSUNTO PRINCIPAL: Uma cena do Exército Brasileiro realizando: "${params.topic}".
    
    DIRETRIZES DE LAYOUT INSTITUCIONAL (ESTRITAMENTE OBRIGATÓRIO):
    1. A imagem deve ser composta como um cartaz oficial de 1080x1080.
    2. FUNDO: A cena operacional descrita acima ocupando toda a área.
    3. MÁSCARA INFERIOR: Gradiente preto sólido no terço inferior para dar legibilidade aos textos.
    4. SÍMBOLO DE REFERÊNCIA (ÚNICO): Posicione o Escudo do COTER à esquerda no terço inferior. 
       DESCRIÇÃO DO ESCUDO: 
       - Topo: Retângulo vermelho horizontal com a palavra "COTER" em letras brancas de forma robusta.
       - Corpo: Escudo com borda amarela, partido diagonalmente da esquerda superior para a direita inferior.
       - Parte Superior Direita (Fundo Azul): Uma mão (manopla) armada de ouro segurando uma espada de prata/ouro apontada para cima.
       - Parte Inferior Esquerda: Padrão xadrez em cores verde e amarelo.
    5. TEXTO LINHA DE ESFORÇO: Escreva "${params.linha}" em letras AMARELAS vibrantes (#FFD700), logo à direita do escudo e acima do título.
    6. TÍTULO DA MISSÃO: Escreva "${displayTitle}" em letras BRANCAS (#FFFFFF) grandes, em negrito, logo abaixo do texto amarelo.
    7. SLOGAN FINAL: Na base inferior centralizada, em letras brancas menores, a frase: "A VITÓRIA TERRESTRE COMEÇA AQUI!".
    
    CONTEXTO DOUTRINÁRIO: ${DOUTRINA_COTER[params.linha]}.
    ESTILO: Prontidão, profissionalismo e soberania.
  `;

  const response = await ai.models.generateContent({
    model: IMAGE_MODEL,
    contents: {
      parts: [
        { text: prompt }
      ]
    },
    config: {
      imageConfig: {
        aspectRatio: "1:1"
      }
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
    Atue como Oficial Superior (Doutor) do Exército Brasileiro e Especialista em Comunicação Estratégica do Comando de Operações Terrestres.
    Seu tom é ${toneDesc}.

    ${customDoctrineContext}

    RESTRIÇÕES E REGRAS DE OURO:
    1. PROIBIÇÃO LITERAL: NUNCA escreva os termos "linha de esforço" ou "ideia-força".
    2. DESTAQUE E INTEGRAÇÃO: Você DEVE integrar o sentido original da Ideia-Força selecionada ("${params.ideiaForca}") nos textos. NÃO é necessário copiar o texto literalmente, mas a essência e o significado devem ser preservados de forma clara e criativa. O trecho que expressa esse sentido deve ser destacado em **negrito** (Markdown: **texto**).
    3. SIMPLICIDADE SOCIAL: Para Instagram e Facebook, use uma linguagem simples, direta e de fácil entendimento para o público civil.
    4. PROIBIÇÃO DE SLOGAN: NUNCA use a frase "A Vitória Terrestre Começa Aqui!" no corpo do texto (ela é exclusiva do layout visual).
    5. FONTES DE CONSULTA: Identifique e liste explicitamente quais manuais, leis ou diretrizes foram fundamentais para a criação deste conteúdo.

    INTEGRAÇÃO OBRIGATÓRIA:
    - O conteúdo DEVE combinar organicamente o conceito da Linha de Esforço base (${params.linha}) com o sentido da Ideia-Força específica (${params.ideiaForca}).

    REQUISITOS DE FORMATAÇÃO:
    - Instagram: Linguagem simples. Legenda com no mínimo TRÊS parágrafos. O primeiro parágrafo já deve conter o destaque em **negrito**.
    - WhatsApp: Mensagens rápidas e objetivas, com o sentido da Ideia-Força em **negrito**.
    - Matéria Jornalística: Título impactante (articleTitle). Mantenha o tom formal e analítico, com a essência da Ideia-Força em **negrito**.

    CONTEXTO DOUTRINÁRIO OFICIAL 2025: ${DOUTRINA_COTER[params.linha]}.
    VETOR ESTRATÉGICO / IDEIA-FORÇA SELECIONADA (REFERÊNCIA): ${params.ideiaForca}.
  `;

  const imageParts = params.images.map(img => ({
    inlineData: {
      data: img.data,
      mimeType: img.mimeType
    }
  }));

  const prompt = `Gere o conteúdo estratégico literário sobre: "${params.topic}". 
    Certifique-se de manter o sentido da ideia-força "${params.ideiaForca}" de forma fluida; destaque a parte essencial em **negrito** e utilize uma linguagem de fácil compreensão para as redes sociais.
    Indique também as fontes de consulta utilizadas.`;

  const response = await ai.models.generateContent({
    model: TEXT_MODEL,
    contents: { 
      parts: [
        ...imageParts,
        { text: prompt }
      ] 
    },
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          instagram: { type: Type.STRING, description: "Instagram script with simple language. Essential meaning of Ideia-força in bold." },
          whatsapp: { type: Type.STRING, description: "WhatsApp operational messages. Essential meaning of Ideia-força in bold." },
          article: { type: Type.STRING, description: "Formal article with proper structure. Essential meaning of Ideia-força in bold." },
          articleTitle: { type: Type.STRING, description: "O título curto e impactante da matéria de imprensa (será usado no template visual)." },
          sources: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "List of doctrine sources and legal references used for the text."
          }
        },
        required: ["instagram", "whatsapp", "article", "articleTitle", "sources"]
      }
    }
  });

  const jsonStr = (response.text || '{}').trim();
  const content = JSON.parse(jsonStr);
  return content as SocialMediaContent;
}
