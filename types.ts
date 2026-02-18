
export enum VisualStyle {
  REAL_PHOTOS = 'Fotos Reais',
  AI_GENERATED = 'Imagem Gerada por IA',
}

export enum ContentTone {
  TECHNICAL = 'Técnico',
  EMOTIVE = 'Emotivo',
}

export enum LinhaDeEsforco {
  OPERACIONALIDADE = 'Operacionalidade',
  INTEGRACAO_SOCIEDADE = 'Integração com a Sociedade',
  DIPLOMACIA_MILITAR = 'Diplomacia Militar',
  COESAO = 'Coesão',
  FORMACAO_MILITAR = 'Formação Militar',
  LEGITIMIDADE = 'Legitimidade',
  CIENCIA_TECNOLOGIA = 'Ciência, Tecnologia e Inovação',
  SINGULARIDADE = 'Singularidade da Profissão Militar',
}

export const IDEIAS_FORCA_MAP: Record<LinhaDeEsforco, string[]> = {
  [LinhaDeEsforco.OPERACIONALIDADE]: [
    "a. Ressaltar capacidades a fim de desestimular a criação de outros agentes ou forças de segurança",
    "b. Fomentar o interesse pela Defesa Nacional como assunto imprescindível à Nação",
    "c. Maximizar a divulgação das capacidades e atividades operacionais da Força Terrestre",
    "d. Resultados positivos no combate aos crimes ambientais e delitos transfronteiriços (Braço Forte)",
    "e. Ressaltar as atividades de preparo e emprego da Força Terrestre (Braço Forte)",
    "f. Necessidade de investimentos condizentes para o EB cumprir missões constitucionais",
    "g. Priorizar a defesa e segurança da Amazônia para enfrentar possíveis ameaças",
    "h. Preparação ininterrupta de tropas e vigilância diuturna da fronteira",
    "i. Constantemente preparado, com militares disponíveis 24h por dia, 7 dias por semana",
    "j. Capacidades para atuar no espaço cibernético sob sua responsabilidade",
    "k. Fortalecer as relações do EB com o MD, com a MB e com a FAB",
    "l. Fortalecer na MB e na FAB o reconhecimento das capacidades do EB",
    "m. Inserção da temática da Defesa Nacional nas relações com stakeholders",
    "n. Fomentar a relevância da interoperabilidade entre as Forças Armadas",
    "o. Mostrar que o EB é operacional e está apto a cumprir sua missão constitucional"
  ],
  [LinhaDeEsforco.INTEGRACAO_SOCIEDADE]: [
    "a. Maximizar conhecimento das contribuições do EB para o desenvolvimento nacional",
    "b. Potencializar a divulgação das características da profissão militar e compromisso com a Democracia",
    "c. Promover a importância do serviço militar obrigatório e concursos de ingresso",
    "d. Manutenção do Art 142 da CF e LC Nr 97/99 para defesa da Pátria",
    "e. Emprego eficiente das Polícias Militares (§ 5° do Art 144 da CF)",
    "f. Resultados em desastres naturais e catástrofes (Taquari, Pantanal II, Catrimani II)",
    "g. Cooperação com preservação ambiental e apoio a ribeirinhos e indígenas",
    "h. Visibilidade das ações em prol do País (vertente 'mão amiga')",
    "i. Estimular a participação dos diversos segmentos nas atividades do EB",
    "j. O Exército protege e apoia todos os povos e comunidades originárias",
    "k. Incentivar interesse pelas entregas e benefícios à sociedade",
    "l. Incentivar o público interno a mostrar a total integração à Força"
  ],
  [LinhaDeEsforco.DIPLOMACIA_MILITAR]: [
    "a. Maximizar a divulgação das ações do EB em missões internacionais",
    "b. Profissionalismo e capacidade dos militares brasileiros em DIH, DICA e DDH",
    "c. CCOPAB capacita recursos humanos para Operações de Paz e Desminagem",
    "d. EB entre os melhores do mundo (Art 142 da CF e LC Nr 97 de 1999)",
    "e. Ressaltar a presença dos Adidos Militares",
    "f. Relevância das missões internacionais para as Forças Armadas e para o País",
    "g. Ampliar as relações do EB com os diversos segmentos militares internacionais",
    "h. Ressaltar a operacionalidade e a capacidade de dissuasão do EB",
    "i. Atividades operacionais que envolvem militares de outras nações",
    "j. Participação do Brasil nas diversas missões internacionais",
    "k. Destacar as ações do EB nas relações com nações amigas",
    "l. Compromisso com os mais altos valores universais (Paz e Direitos Humanos)",
    "n. Contribuição para aprimorar a operacionalidade e atualização da doutrina",
    "p. Incentivar o interesse pela divulgação das inúmeras missões internacionais"
  ],
  [LinhaDeEsforco.COESAO]: [
    "a. Estreitar relações de camaradagem e união entre Ativa e Veteranos",
    "b. Pertencimento a uma Instituição cuja atuação e história ampliam valor pessoal",
    "c. Culto aos valores e preservação do patrimônio histórico e cultural",
    "d. Ideal de pertencimento a uma Instituição de Estado presente em momentos de relevância",
    "e. Líderes militares como pilares para manter reputação positiva",
    "f. Preocupação em prover serviço de saúde de qualidade e universal",
    "g. Aproximar o EB e a família militar pelo reconhecimento ao suporte e dedicação",
    "h. Visibilidade das ações da Família Militar e Veteranos em prol da sociedade",
    "i. Ação de comando para evitar casos de assédio sexual/moral",
    "j. EB baseado na hierarquia e disciplina com ação de comando diuturna",
    "k. Ressaltar os riscos do vício em apostas ('bets') no âmbito do Exército",
    "l. Conhecimento sobre o Sistema de Proteção Social Militar",
    "m. Observância de princípios éticos e morais por parte de seus integrantes",
    "n. Integrantes do EB permanecem unidos e respeitando a cadeia de comando"
  ],
  [LinhaDeEsforco.FORMACAO_MILITAR]: [
    "a. Incentivar o interesse pela divulgação da formação profissional de alto nível",
    "b. Culto aos valores e tradições desde o início da formação",
    "c. Qualidade do Ensino por meio de tecnologia e capacitação de docentes",
    "d. Excelência do Ensino/Formação Militar perante a academia",
    "e. Potencializar a divulgação das singularidades da profissão militar",
    "f. Processos seletivos para docentes/discentes voltadas para veteranos e família",
    "g. Profissionalismo fruto da excelência na formação e altos estudos",
    "h. Maximizar a divulgação das atividades inerentes à formação militar",
    "i. Divulgar os rígidos padrões éticos e morais da formação militar",
    "j. Estimular o interesse pela realização dos diversos concursos",
    "k. Promover a importância dos concursos com vistas à formação militar"
  ],
  [LinhaDeEsforco.LEGITIMIDADE]: [
    "a. Enfatizar que a principal missão constitucional é a 'Defesa da Pátria'",
    "b. Correta e efetiva aplicação e utilização de bens e recursos públicos",
    "c. Atuação conforme a legislação em vigor (LAI e Produtos Controlados)",
    "d. EB atua com base nos diplomas legais vigentes",
    "e. EB como única Instituição de defesa da pátria ao lado de MB e FAB",
    "f. Sistema de Inteligência atuando dentro da legalidade (SISBIN)",
    "g. Manutenção da 'Lei da Anistia' para garantir coesão nacional e paz social",
    "h. Licitações de MEM atendendo às demandas do Plano Estratégico (PEEx)",
    "i. Estruturas de controle modernas (CCIEx e CGCFEx)",
    "j. GLO desencadeadas mediante acionamento dos Poderes constituídos (Art 142)",
    "k. Cooperação em GLO respeitando direitos fundamentais dos cidadãos",
    "l. Atuação em apoio e garantia do processo eleitoral (Lei 4.737/65)",
    "m. Instituição de Estado, imparcial e perfeitamente integrada à sociedade",
    "n. Operações GVA para livre exercício do direito ao voto",
    "o. Atuação na faixa de fronteira contra delitos ambientais (LC 97/99)",
    "r. Divulgar os rígidos padrões éticos e morais da formação"
  ],
  [LinhaDeEsforco.CIENCIA_TECNOLOGIA]: [
    "a. Ampliar as relações do EB com órgãos e agências governamentais",
    "b. Fomentar a temática da Defesa Nacional como assunto imprescindível",
    "c. Potencializar a divulgação dos Programas Estratégicos do Exército",
    "d. Recursos orçamentários vitais para a modernização de materiais (MEM)",
    "e. Fortalecer as relações do EB com os integrantes da BID",
    "f. Incentivar a BID a desenvolver Produtos de Defesa modernos",
    "g. Ampliar as relações com diversos segmentos da Sociedade",
    "h. Parcerias voltadas aos estudos científico-tecnológicos e de inovação",
    "i. Relações com meios de comunicação, Academia e órgãos governamentais",
    "j. Fomentar percepção de que o EB é imprescindível à Nação",
    "k. Benefícios gerados ao País em virtude dos sacrifícios da profissão",
    "l. Realização de entregas à sociedade dependente de sacrifícios pessoais",
    "m. Potencializar divulgação das características da profissão"
  ],
  [LinhaDeEsforco.SINGULARIDADE]: [
    "a. Maximizar divulgação das entregas e contribuições (vertente 'mão amiga')",
    "b. Estimular participação da Sociedade nas atividades promovidas pelo EB",
    "c. Potencializar divulgação das características da profissão militar",
    "d. Necessidade de um Sistema de Saúde autônomo e independente",
    "e. Ampliar relações com meios de comunicação e Academia",
    "f. Fomentar a percepção de que o EB é imprescindível à Nação",
    "g. Benefícios gerados ao País em virtude do sacrifício pessoal",
    "h. Entregas à sociedade dependente de sacrifícios pessoais",
    "i. Singularidades inerentes aos tempos de paz, crise e guerra",
    "j. Incentivar interesse pelas contribuições e sacrifício em prol da missão"
  ]
};

export interface SocialMediaContent {
  instagram: string;
  whatsapp: string;
  article: string;
  articleTitle: string;
  sources: string[];
  imageUrl?: string;
}

export interface ReferenceImage {
  id: string;
  preview: string;
  data: string;
  mimeType: string;
}

export interface GenerationParams {
  topic: string;
  style: VisualStyle;
  tone: ContentTone;
  linha: LinhaDeEsforco;
  ideiaForca: string;
  images: ReferenceImage[];
  customSource?: string;
}
