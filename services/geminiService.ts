
import { GoogleGenAI, Type } from "@google/genai";
import { GenerationParams, SocialMediaContent, LinhaDeEsforco, VisualStyle } from "../types";

const TEXT_MODEL = 'gemini-3-pro-preview';
const IMAGE_MODEL = 'gemini-2.5-flash-image';

export async function generateOperationalImage(params: GenerationParams, forcedTitle?: string): Promise<string | undefined> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const styleInstruction = params.style === VisualStyle.REAL_PHOTOS 
    ? "Crie uma imagem realista com estética fotográfica profissional, luz natural, alta definição, estilo fotojornalismo militar contemporâneo."
    : "Crie uma ilustração épica e moderna, com estilo cinematográfico, cores sóbrias e impacto visual de alta qualidade.";

  const prompt = `
    ${styleInstruction}
    ASSUNTO DA IMAGEM: Uma cena operacional do Exército Brasileiro executando: "${params.topic}".
    CONTEXTO DOUTRINÁRIO: Relacionado a "${params.linha}" e focado em "${params.ideiaForca}".
    
    ESTRUTURA DE COMPOSIÇÃO (ESTRITAMENTE OBRIGATÓRIA):
    1. FORMATO: 1080x1080.
    2. CENÁRIO: A atividade militar descrita deve ocupar todo o quadro com foco na operacionalidade e prontidão.
    
    RESTRIÇÃO ABSOLUTA (ZERO TOLERÂNCIA):
    - NÃO INCLUA NENHUM TEXTO, PALAVRA, LETRA, NÚMERO OU CARACTERE NA IMAGEM.
    - NÃO INCLUA NENHUM LOGOTIPO, BRASÃO, ESCUDO OU SÍMBOLO.
    - A IMAGEM DEVE SER COMPLETAMENTE LIMPA DE QUALQUER ESCRITA, MARCA D'ÁGUA OU ELEMENTO TIPOGRÁFICO.
    
    ESTILO: Prontidão, soberania e profissionalismo técnico (Persona TC Luiz Alves).
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
  
  const customDoctrineContext = params.customSource 
    ? `FONTE TÉCNICA PRIMÁRIA (O PDF ANEXADO): \n"""\n${params.customSource}\n"""\n
       DIRETRIZ: O PDF é sua base de verdade absoluta. O Google Search deve ser usado para complementar com notícias atuais e sites .com.br relevantes, mas o PDF tem precedência em caso de divergência técnica.` 
    : "Utilize o Google Search para buscar diretrizes oficiais (eb.mil.br, gov.br) e também notícias em portais brasileiros relevantes (.com.br) para fundamentar o conteúdo.";

  const systemInstruction = `
    IDENTIDADE: Você é o Tenente-Coronel Luiz Alves (45 anos), Chefe da Comunicação Estratégica Operacional do COTER (Persona 2026).
    PERFIL: Produtor Textual sênior, especialista em Comunicação Social e Estratégia, com domínio absoluto da Norma Culta da Língua Portuguesa.
    MISSÃO: Produzir conteúdo estratégico alinhado às Diretrizes do Comando, com revisão gramatical rigorosa e fundamentação em fontes reais.
    
    REGRAS DE BUSCA E FONTES:
    1. ESCOPO: Busque em sites oficiais (.mil.br, .gov.br) e em portais de notícias e defesa brasileiros (.com.br).
    2. ATRIBUIÇÃO: Toda informação relevante deve ser acompanhada de sua fonte.
    3. CONFLITOS: Se encontrar informações divergentes entre sites ou entre um site e o PDF anexo, você DEVE:
       a) Adicionar a marcação [VERIFICAR CONFLITO] ao lado do texto divergente.
       b) Descrever o conflito no campo 'conflictWarnings'.
    
    REQUISITOS DE LINGUAGEM:
    - EXCELÊNCIA GRAMATICAL E TRADUÇÃO DOUTRINÁRIA PARA PÚBLICO CIVIL.
    
    REGRAS DE FORMATAÇÃO:
    - DESTAQUE OBRIGATÓRIO: A essência da Ideia-Força selecionada ("${params.ideiaForca}") deve ser integrada organicamente e destacada em **negrito e sublinhado** (Use: **<u>texto aqui</u>**).
    
    ESTRUTURA DA RESPOSTA (JSON):
    - instagram, whatsapp, article, articleTitle, riskAnalysis, impactMetrics, sources, conflictWarnings.
  `;

  const prompt = `Atue como Produtor Textual oficial e gere o conteúdo estratégico para o tópico: "${params.topic}". 
  Utilize o Google Search para expandir a fundamentação para toda a internet brasileira (.com.br e oficiais). 
  Sempre identifique as fontes e aponte conflitos de informação se existirem.`;

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
      tools: [{ googleSearch: {} }],
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
          sources: { type: Type.ARRAY, items: { type: Type.STRING } },
          conflictWarnings: { type: Type.STRING, description: "Descreva divergências encontradas entre as fontes de pesquisa." }
        },
        required: ["instagram", "whatsapp", "article", "articleTitle", "riskAnalysis", "impactMetrics", "sources", "conflictWarnings"]
      }
    }
  });

  const jsonStr = (response.text || '{}').trim();
  const content = JSON.parse(jsonStr) as SocialMediaContent;

  // Extrair links reais do Grounding Metadata
  const groundingLinks = response.candidates?.[0]?.groundingMetadata?.groundingChunks
    ?.filter(chunk => chunk.web)
    ?.map(chunk => ({
      title: chunk.web?.title || 'Fonte Externa',
      uri: chunk.web?.uri || ''
    })) || [];

  return { 
    ...content, 
    sourceLinks: groundingLinks 
  };
}
