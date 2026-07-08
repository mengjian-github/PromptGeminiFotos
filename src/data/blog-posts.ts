import type { Locale } from '@/i18n/config';

export type BlogPostPromptExample = {
  title: string;
  description: string;
  prompt: string;
};

export type BlogPostSection = {
  id: string;
  heading: string;
  paragraphs: string[];
  bullets?: string[];
  promptExamples?: BlogPostPromptExample[];
};

export type BlogPostFaq = {
  question: string;
  answer: string;
};

export type BlogPostCta = {
  label: string;
  href: string;
  variant?: 'primary' | 'outline';
};

export type BlogPost = {
  slug: string;
  locale: Locale;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  author: string;
  authorRole: string;
  readingTimeMinutes: number;
  publishedAt: string;
  updatedAt: string;
  heroEyebrow: string;
  heroDescription: string;
  seo: {
    description: string;
    keywords: string[];
  };
  sections: BlogPostSection[];
  takeaways: string[];
  faq: BlogPostFaq[];
  ctas: BlogPostCta[];
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'personalizar-gemini-ensaio-feminino',
    locale: 'pt-BR',
    title: 'Como personalizar o Gemini para ensaio feminino',
    excerpt:
      'Veja como transformar dados de briefing em prompts Gemini para ensaio feminino com luz, guarda-roupa e storytelling pensados para buscas brasileiras.',
    category: 'Prompts',
    tags: ['prompt gemini ensaio fotografico feminino', 'ensaio feminino', 'workflow IA'],
    author: 'Equipe Prompt Gemini Fotos',
    authorRole: 'Estrategia de Conteudo',
    readingTimeMinutes: 9,
    publishedAt: '2025-10-03',
    updatedAt: '2025-10-03',
    heroEyebrow: 'Guia pratico',
    heroDescription:
      'Aplicamos as consultas de maior volume no Search Console para montar um roteiro real de briefing + prompt, cobrindo iluminacao, poses e ajustes finos para ensaios femininos.',
    seo: {
      description:
        'Tutorial completo para adaptar o Gemini ao ensaio feminino: briefing rapido, presets de luz, variações de pose e prompts prontos focados em consultas brasileiras.',
      keywords: [
        'prompt gemini ensaio fotografico feminino',
        'prompt gemini feminino',
        'workflow prompt gemini fotos',
        'ensaio feminino IA',
      ],
    },
    sections: [
      {
        id: 'mapear-intencao',
        heading: 'Mapeie a intencao de busca antes do briefing',
        paragraphs: [
          'Verifique no Search Console quais variacoes trazem mais impressao. Em ensaio feminino, termos como "prompt gemini ensaio fotografico feminino profissional" e "prompt gemini feminino" costumam liderar.',
          'Use essas palavras no titulo interno do projeto, no nome da pasta e nos campos de SEO. Isso garante consistencia entre o que voce vai produzir e o que o Google ja reconhece como relevante.',
        ],
        bullets: [
          'Anote 3 dores do publico: exemplo, falta de referencia de iluminacao, dificuldade com poses e padronizacao de look.',
          'Liste resultados desejados: foto para LinkedIn, feed lifestyle, campanha de moda.',
          'Traduza termos tecnicos para portugues simples; Gemini responde melhor ao contexto perfeito em pt-BR quando o objetivo esta claro.',
        ],
      },
      {
        id: 'briefing-visual',
        heading: 'Monte um briefing visual em cinco elementos',
        paragraphs: [
          'Em vez de escrever prompts longos sem estrutura, divida o briefing em objetivo, ambiente, estilo de luz, composicao e finalizacao. Preencha cada campo com frases curtas.',
          'Esse metodo reduz retrabalho porque cada teste muda apenas um campo por vez. Voce pode salvar o briefing em um documento padrao e replicar para outros ensaios.',
        ],
        bullets: [
          'Objetivo: editorial lifestyle com foco em autenticidade.',
          'Ambiente: parque urbano com vegetacao suave e fundos desfocados.',
          'Estilo de luz: golden hour lateral, flare leve e tons quentes.',
          'Composicao: meio corpo, movimento natural do cabelo e expressao confiante.',
          'Finalizacao: textura realista de pele e tecido, sem exagero em retoque.',
        ],
      },
      {
        id: 'prompts-prontos',
        heading: 'Prompts otimizados para diferentes funis',
        paragraphs: [
          'Aplique o briefing acima em variacoes de prompt pensadas para topo, meio e fundo de funil. Assim voce cobre redes sociais, portfolio e propostas comerciais com uma unica base.',
        ],
        promptExamples: [
          {
            title: 'Prompt base com luz dourada',
            description: 'Usado para buscas gerais sobre ensaio feminino externo.',
            prompt:
              'Contexto: ensaio feminino ao por do sol em parque urbano.\nComposicao: modelo em meia altura, vestido de seda azul, cabelo ao vento.\nIluminacao: golden hour lateral com flare suave.\nParametros tecnicos: camera full frame, 85mm f/1.8, ISO 200.\nEstilo: editorial lifestyle com cores quentes realistas.\nInstrucoes finais: manter textura natural de pele e tecido, responder em portugues.',
          },
          {
            title: 'Prompt corporativo neutro',
            description: 'Direcionado a quem busca headshot feminino profissional.',
            prompt:
              'Contexto: headshot feminino para LinkedIn em estudio claro.\nComposicao: meio corpo, blazer grafite, sorriso confiante.\nIluminacao: softbox frontal, hair light discreto.\nParametros: camera full frame, 70mm f/4, ISO 160.\nEstilo: fundo cinza neutro, contraste suave.\nInstrucoes finais: entregar arquivo limpo pronto para recorte.',
          },
          {
            title: 'Prompt lifestyle com props',
            description: 'Ideal para conteudo de redes em parceria com marcas.',
            prompt:
              'Contexto: ensaio feminino lifestyle com props de cafe.\nComposicao: modelo segurando caneca minimalista, mesa de madeira clara.\nIluminacao: janela lateral difusa, luz de preenchimento quente.\nParametros: camera mirrorless, 50mm f/2, ISO 250.\nEstilo: tons terrosos, atmosfera acolhedora.\nInstrucoes finais: realcar vapor da caneca e detalhes de ceramica.',
          },
        ],
      },
      {
        id: 'medir-resultados',
        heading: 'Meça a performance e gere variantes rapidas',
        paragraphs: [
          'Depois de publicar, monitore CTR e posicao media das paginas que recebem os prompts. Se alguma consulta ganhar muitas impressões sem clique, crie uma nova variante focada nela.',
          'Use o gerador interno para salvar presets baseados nas variacoes de luz e look que performaram melhor. Isso acelera a entrega para clientes recorrentes.',
        ],
      },
    ],
    takeaways: [
      'Comece pelo Search Console: defina quais consultas vao guiar briefing e prompt.',
      'Use estrutura fixa de 5 campos para transformar briefing em prompt replicavel.',
      'Salve presets no gerador e teste variantes quando o CTR cair.',
    ],
    faq: [
      {
        question: 'Qual configuracao de luz funciona melhor para ensaio feminino no Gemini?',
        answer:
          'Em geral, combinações de golden hour ou softbox frontal com hair light entregam pele natural. Ajuste a intensidade no prompt descrevendo direcao e suavidade da luz.',
      },
      {
        question: 'Como evitar resultados plasticos no rosto?',
        answer:
          'Inclua instrucoes como "manter textura de pele" e "sem aspecto plastico". Se necessario, some "realismo fotografico" ou "look editorial" ao final do prompt.',
      },
      {
        question: 'Quantos prompts devo salvar no gerador para um briefing feminino?',
        answer:
          'Recomendamos ao menos tres variações: um externo lifestyle, um corporativo neutro e um opcional com props ou close de beleza para redes sociais.',
      },
    ],
    ctas: [
      { label: 'Testar prompts no gerador', href: '/generator', variant: 'primary' },
      { label: 'Voltar para o guia completo de prompts', href: '/prompts', variant: 'outline' },
    ],
  },
  {
    slug: 'guia-prompts-gemini-ensaio-casal',
    locale: 'pt-BR',
    title: 'Guia de prompts Gemini para ensaio de casal',
    excerpt:
      'Estruture roteiros de casal com ambientacao, emocao e planos diferentes. Incluimos prompts otimizados para praia, urbano noturno e estudio fine art.',
    category: 'Prompts',
    tags: ['prompt gemini ensaio fotografico casal', 'prompt gemini foto casamento', 'ensaio casal IA'],
    author: 'Equipe Prompt Gemini Fotos',
    authorRole: 'Direcao Criativa',
    readingTimeMinutes: 8,
    publishedAt: '2025-10-03',
    updatedAt: '2025-10-03',
    heroEyebrow: 'Casos de uso',
    heroDescription:
      'Cobrimos os cenarios que mais aparecem nas buscas: praia ao amanhecer, vibes urbanas noturnas e estudio minimalista para pre wedding.',
    seo: {
      description:
        'Prompts Gemini focados em ensaio de casal e casamento. Aprenda a ajustar clima, poses e narrativa para conquistar buscas de pre wedding no Brasil.',
      keywords: [
        'prompt gemini ensaio fotografico casal',
        'prompt gemini foto casamento',
        'ensaio casal IA',
        'pre wedding gemini',
      ],
    },
    sections: [
      {
        id: 'planejamento',
        heading: 'Planeje o roteiro por clima e emocao',
        paragraphs: [
          'Divida o ensaio em tres climas: romantico suave, energia urbana e momento intimo. Para cada clima, escreva palavras que descrevem sensacoes, contato fisico e elementos visuais.',
          'Isso ajuda o Gemini a entender se o casal deve estar em movimento, em close ou em pose classica. Evite prompts genericos como "casal feliz"; seja direto sobre gestos e ambiente.',
        ],
      },
      {
        id: 'prompts-chave',
        heading: 'Prompts chave para cada ambiente',
        paragraphs: [
          'Os exemplos abaixo estao alinhados com as consultas mais fortes de casal: praia, urbano noturno e estudio fine art.',
        ],
        promptExamples: [
          {
            title: 'Praia ao amanhecer',
            description: 'Para consultas como "ensaio fotografico casal gemini".',
            prompt:
              'Contexto: casal caminhando na praia ao amanhecer, ondas suaves e ceu pastel.\nComposicao: plano aberto com camera baixa, maos dadas e risos leves.\nIluminacao: golden hour difusa com flare delicado.\nParametros: camera full frame, 35mm f/2, ISO 200.\nEstilo: romantico cinematografico com tons quentes.\nInstrucoes finais: manter respingos naturais e textura do mar.',
          },
          {
            title: 'Urbano noturno com neon',
            description: 'Atraente para "prompt gemini fotos casal" em clima moderno.',
            prompt:
              'Contexto: casal abraçado em rua com letreiros neon e chuva leve.\nComposicao: plano medio, reflexos no asfalto molhado, olhar compartilhado.\nIluminacao: mix de neon azul e rosa, contrastes fortes.\nParametros: camera mirrorless, 50mm f/1.4, ISO 640.\nEstilo: cinematografico, bokeh intenso.\nInstrucoes finais: realcar reflexos e gotas de chuva.',
          },
          {
            title: 'Estudio fine art minimalista',
            description: 'Ideal para "prompt para foto profissional gemini casal".',
            prompt:
              'Contexto: casal sentado em estudio cinza minimalista.\nComposicao: pose em triangulo, maos entrelacadas, expressao serena.\nIluminacao: softbox duplo frontal + hair light suave.\nParametros: camera full frame, 85mm f/2.2, ISO 160.\nEstilo: fine art neutro, textura suave.\nInstrucoes finais: enfatizar detalhes de tecido e pele sem exageros.',
          },
        ],
      },
      {
        id: 'checklist',
        heading: 'Checklist rapido para cada take',
        paragraphs: [
          'Antes de gerar, confirme briefing, referencia visual e variavel que vai mudar em cada take. Isso acelera o teste AB e evita prompts confusos.',
        ],
        bullets: [
          'Briefing textual de 3 frases.',
          'Paleta de cores definida.',
          'Verbos que descrevem emocao (abraçar, rir, observar).',
          'Props opcionais (buque, guarda-chuva, correntes de luz).',
        ],
      },
      {
        id: 'publicacao',
        heading: 'Publicacao e distribuicao rapida',
        paragraphs: [
          'Ao publicar no blog, reutilize o prompt como legenda para redes e destaque uma mini galeria com antes e depois.',
          'Inclua chamada para o gerador para estimular cadastro e salvamento de presets por parte do usuario.',
        ],
      },
    ],
    takeaways: [
      'Crie climas diferentes e mencione sensacoes para orientar poses.',
      'Monte prompts por ambiente (praia, urbano, estudio) e personalize apenas um elemento por teste.',
      'Use checklists curtos para acelerar variacoes e publicar aplicacoes reais.',
    ],
    faq: [
      {
        question: 'Como lidar com poses rigidas nas geracoes?',
        answer:
          'Acrescente verbos de movimento como "caminhando", "girando" ou "abraçando" e descreva onde as maos devem ficar. Solicite "poses naturais" no final do prompt.',
      },
      {
        question: 'O que muda entre prompt de casal e prompt de casamento?',
        answer:
          'Adicione detalhes de traje, mencione cerimonia, convidados ou elementos simbolicos. Para casamento use termos como "pre wedding" e "cerimonia".',
      },
      {
        question: 'Como medir se o prompt realmente ajudou na busca?',
        answer:
          'Compare CTR e tempo na pagina antes e depois do ajuste. Se o termo subir de posicao, considere criar um PDF ou lead magnet para aprofundar.',
      },
    ],
    ctas: [
      { label: 'Gerar prompts de casal agora', href: '/generator?category=casal', variant: 'primary' },
      { label: 'Ver templates prontos', href: '/templates?category=casal', variant: 'outline' },
    ],
  },
  {
    slug: 'checklist-ensaio-aniversario-ia',
    locale: 'pt-BR',
    title: 'Checklist IA para ensaio de aniversario com Gemini',
    excerpt:
      'Garanta que cada prompt de aniversario tenha briefing de idade, props e clima. Compartilhamos checklist printable e exemplos para infantil, 15 anos e adultos.',
    category: 'Workflow',
    tags: ['prompt gemini ensaio fotografico aniversario', 'festa infantil IA', 'ensaio aniversario IA'],
    author: 'Equipe Prompt Gemini Fotos',
    authorRole: 'Planejamento Visual',
    readingTimeMinutes: 7,
    publishedAt: '2025-10-03',
    updatedAt: '2025-10-03',
    heroEyebrow: 'Checklist',
    heroDescription:
      'Este roteiro transforma os termos mais buscados de aniversario em um plano de producao rapido, com prompts prontos e tabela de verificacao.',
    seo: {
      description:
        'Checklist IA para ensaio de aniversario no Gemini. Inclui prompts prontos para infantil, debutante e adulto, alem de planilha de acompanhamento.',
      keywords: [
        'prompt gemini ensaio fotografico aniversario',
        'prompt gemini fotos aniversario',
        'ensaio aniversario IA',
      ],
    },
    sections: [
      {
        id: 'antes-de-gerar',
        heading: 'Antes de gerar: defina idade, tema e plano de fundo',
        paragraphs: [
          'Todo prompt de aniversario precisa deixar claro a idade, o tema da festa e o tipo de emocao desejada. Isso evita resultados genericos e ajuda o Gemini a preencher o cenario com props coerentes.',
          'Use um mini briefing com idade, tema, paleta e props obrigatorios (bolo, balao, lettering).',
        ],
        bullets: [
          'Idade e estilo (infantil, 15 anos, adulto).',
          'Tema principal e cores.',
          'Props obrigatorios e extras.',
          'Tipo de emocao (diversao, glamour, nostalgia).',
        ],
      },
      {
        id: 'prompts-por-faixa',
        heading: 'Prompts por faixa de idade',
        paragraphs: [
          'Segmente o prompt conforme a idade para evitar proporcoes erradas e exageros em decoracao.',
        ],
        promptExamples: [
          {
            title: 'Infantil tematico espacial',
            description: 'Responde a buscas como "prompt gemini fotos ensaio fotografico aniversario".',
            prompt:
              'Contexto: aniversario infantil tema espaco com decoracao colorida.\nComposicao: crianca soprando velas em bolo com planetas.\nIluminacao: luz suave frontal com destaque azul.\nParametros: camera full frame, 35mm f/2.5, ISO 400.\nEstilo: vibrante, clima de festa.\nInstrucoes finais: manter proporcoes infantis realistas e evitar look cartoon.',
          },
          {
            title: 'Debutante com neon',
            description: 'Pensado para "prompt gemini ensaio fotografico aniversario" de 15 anos.',
            prompt:
              'Contexto: debutante posando diante de letreiro neon roxo.\nComposicao: vestido longo brilhante, postura confiante.\nIluminacao: luz principal suave + neon traseiro.\nParametros: camera mirrorless, 50mm f/1.8, ISO 640.\nEstilo: glam club com reflexos controlados.\nInstrucoes finais: destacar brilho do vestido e cabelo solto.',
          },
          {
            title: 'Adulto minimalista com amigos',
            description: 'Para ensaio de aniversario adulto casual.',
            prompt:
              'Contexto: aniversario adulto minimalista em apartamento moderno.\nComposicao: aniversariante segurando taça, amigos ao fundo desfocado.\nIluminacao: luz de janela + fitas de led quente.\nParametros: camera full frame, 50mm f/2.2, ISO 320.\nEstilo: lifestyle sofisticado.\nInstrucoes finais: manter textura dos objetos e clima acolhedor.',
          },
        ],
      },
      {
        id: 'checklist-final',
        heading: 'Checklist final para publicar',
        paragraphs: [
          'Use a lista abaixo antes de subir as imagens para o blog ou redes. Ela assegura consistencia entre prompt, copia e oferta.',
        ],
        bullets: [
          'Legenda menciona idade e tema.',
          'CTA convida para usar o gerador.',
          'Galeria inclui antes e depois quando possivel.',
          'Alt text descreve props principais (bolo, balao, lettering).',
        ],
      },
      {
        id: 'reaproveitar',
        heading: 'Reaproveite o material em PDF e email',
        paragraphs: [
          'Transforme o checklist em PDF editavel para captar leads. Envie follow-up com preset de prompt exclusivo em troca do cadastro.',
          'Adicione os prompts ao gerador como templates de aniversario para acelerar a producao.',
        ],
      },
    ],
    takeaways: [
      'Defina idade, tema e emocao antes de escrever o prompt.',
      'Use variacoes por faixa etaria para controlar o estilo visual.',
      'Finalize com checklist de legenda, CTA e alt text coerente.',
    ],
    faq: [
      {
        question: 'Como evitar excesso de decoracao artificial nas geracoes?',
        answer:
          'Limite o numero de elementos no prompt e mencione apenas os props obrigatorios. Adicione "decoracao equilibrada" ou "estilo minimalista" quando quiser controles finos.',
      },
      {
        question: 'Posso usar estes prompts para vender pacotes?',
        answer:
          'Sim. Monte landing pages com o checklist como bonus e inclua captura de lead antes de entregar o PDF.',
      },
      {
        question: 'Qual a melhor forma de apresentar as imagens geradas?',
        answer:
          'Use comparativo antes e depois, mais um carrossel com variações de tema. Isso aumenta tempo na pagina e gera provas sociais.',
      },
    ],
    ctas: [
      { label: 'Baixar checklist em PDF', href: '/templates?category=aniversario', variant: 'primary' },
      { label: 'Criar prompts de aniversario agora', href: '/generator?category=aniversario', variant: 'outline' },
    ],
  },

  {
    slug: 'prompt-gemini-foto-profissional-feminina',
    locale: 'pt-BR',
    title: 'Prompt Gemini para foto profissional feminina',
    excerpt:
      'Modelos prontos para transformar uma selfie em foto profissional feminina para LinkedIn, currículo e perfil comercial com identidade preservada.',
    category: 'Headshot',
    tags: ['prompt gemini foto profissional feminina', 'foto profissional gemini', 'linkedin feminino'],
    author: 'Equipe Prompt Gemini Fotos',
    authorRole: 'CRO e Conteudo',
    readingTimeMinutes: 8,
    publishedAt: '2026-07-08',
    updatedAt: '2026-07-08',
    heroEyebrow: 'Busca em crescimento',
    heroDescription:
      'A consulta por foto profissional feminina aparece cedo no Search Console. Este guia responde direto qual prompt usar, quando escolher fundo neutro e como preservar rosto, cabelo e tom de pele.',
    seo: {
      description:
        'Copie prompts Gemini para foto profissional feminina, LinkedIn e currículo. Inclui fórmula de luz, lente, fundo neutro, identidade preservada e FAQ.',
      keywords: [
        'prompt gemini foto profissional feminina',
        'prompt gemini para fotos profissionais femininas',
        'foto profissional gemini',
        'prompt gemini linkedin feminino',
      ],
    },
    sections: [
      {
        id: 'resposta-rapida',
        heading: 'Resposta rápida: use um headshot neutro com instrução de identidade',
        paragraphs: [
          'Para LinkedIn, currículo e página sobre, o prompt deve pedir fundo limpo, lente de retrato, luz suave e preservação explícita da identidade. Evite pedir transformação exagerada; isso aumenta risco de rosto artificial.',
          'Comece com uma foto de referência nítida, escolha roupa de trabalho e defina onde a imagem será usada. O Gemini tende a responder melhor quando a finalidade vem antes do estilo.',
        ],
        bullets: [
          'Uso final: LinkedIn, CV, perfil de consultora ou página institucional.',
          'Luz: softbox frontal ou janela difusa, sem sombras duras no rosto.',
          'Fundo: cinza claro, branco quente ou escritório desfocado.',
          'Restrição: preservar identidade, tom de pele e textura natural do cabelo.',
        ],
      },
      {
        id: 'prompts',
        heading: 'Prompts prontos para copiar',
        paragraphs: [
          'Use os exemplos abaixo no compositor ou copie direto para o Gemini. Troque profissão, roupa e fundo sem alterar a estrutura principal.',
        ],
        promptExamples: [
          {
            title: 'LinkedIn executivo feminino',
            description: 'Boa opção para busca por prompt Gemini foto profissional feminina.',
            prompt:
              'Objetivo: criar foto profissional feminina para LinkedIn mantendo identidade da pessoa da foto de referência.\nComposição: retrato meio corpo, olhar confiante para a câmera, blazer azul-marinho, postura natural.\nIluminação: softbox frontal suave com preenchimento lateral leve.\nFundo: cinza claro limpo, profundidade de campo discreta.\nParâmetros: câmera full frame, lente 85mm, f/4, ISO 160.\nInstruções finais: preservar rosto, tom de pele e textura realista do cabelo; evitar pele plástica e sorriso artificial.',
          },
          {
            title: 'Currículo e perfil corporativo',
            description: 'Mais sóbrio para CV, assinatura de e-mail e página de equipe.',
            prompt:
              'Objetivo: foto profissional feminina para currículo e perfil corporativo.\nComposição: enquadramento ombros para cima, camisa clara, expressão acessível.\nIluminação: luz de janela difusa, contraste baixo, sombras muito suaves.\nFundo: escritório moderno desfocado com tons neutros.\nEstilo: realista, elegante, sem filtro de beleza exagerado.\nInstruções finais: manter identidade e proporções do rosto, corrigir apenas ruído e iluminação.',
          },
        ],
      },
      {
        id: 'erros-comuns',
        heading: 'Erros que reduzem qualidade e conversão',
        paragraphs: [
          'Prompts muito genéricos geram fotos bonitas, mas pouco úteis. Para converter, o visitante precisa ver que o texto resolve um caso real: LinkedIn, CV, site pessoal ou perfil comercial.',
        ],
        bullets: [
          'Não use “make me beautiful” como instrução principal; descreva objetivo e luz.',
          'Não misture muitos fundos no mesmo prompt.',
          'Não prometa que o site gera a imagem; o fluxo público prepara o prompt para abrir no Gemini.',
        ],
      },
    ],
    takeaways: [
      'O melhor prompt começa por uso final, depois luz, lente, roupa e fundo.',
      'A instrução de preservar identidade deve ficar no começo e no fim.',
      'Para SEO, conecte esta página ao guia de prompts e ao gerador com template pré-selecionado.',
    ],
    faq: [
      {
        question: 'Qual prompt Gemini usar para foto profissional feminina?',
        answer:
          'Use um prompt com objetivo LinkedIn ou currículo, luz softbox, lente 85mm, fundo neutro e instrução explícita para preservar identidade, pele e cabelo naturais.',
      },
      {
        question: 'O site gera a foto profissional automaticamente?',
        answer:
          'Não. O fluxo público compõe o prompt pronto para copiar. Você abre o Gemini quando quiser gerar a imagem com sua conta.',
      },
      {
        question: 'Como evitar aparência artificial?',
        answer:
          'Inclua “textura natural de pele”, “sem pele plástica” e “preservar proporções do rosto”. Evite combinar maquiagem, cenário e roupa demais no mesmo teste.',
      },
    ],
    ctas: [
      { label: 'Abrir compositor para foto profissional', href: '/generator?template=professional-linkedin-1', variant: 'primary' },
      { label: 'Ver guia completo de prompts', href: '/prompts#ensaio-profissional', variant: 'outline' },
    ],
  },
  {
    slug: 'prompt-gemini-fotos-familia',
    locale: 'pt-BR',
    title: 'Prompts Gemini para fotos de família e gestante',
    excerpt:
      'Guia prático para ensaios de família, gestante e newborn usando Gemini: poses naturais, luz acolhedora e prompts com segurança para crianças.',
    category: 'Família',
    tags: ['prompt gemini fotos familia', 'ensaio gestante IA', 'foto familia gemini'],
    author: 'Equipe Prompt Gemini Fotos',
    authorRole: 'Planejamento Visual',
    readingTimeMinutes: 7,
    publishedAt: '2026-07-08',
    updatedAt: '2026-07-08',
    heroEyebrow: 'Long-tail familiar',
    heroDescription:
      'Família e gestante são variações naturais de fotos Gemini. Esta página cria uma resposta indexável para buscas de ensaio familiar, com CTAs para copiar prompt e testar no compositor.',
    seo: {
      description:
        'Prompts Gemini para fotos de família, gestante e newborn. Copie exemplos com poses naturais, luz de janela, cenário acolhedor e instruções de realismo.',
      keywords: [
        'prompt gemini fotos familia',
        'prompt gemini fotos ensaio fotografico familia',
        'ensaio gestante gemini',
        'foto familia IA',
      ],
    },
    sections: [
      {
        id: 'estrutura',
        heading: 'Estrutura segura para prompts de família',
        paragraphs: [
          'O prompt deve priorizar contexto, vínculo e naturalidade. Descreva composição simples e evite comandos que alterem idade, corpo ou características sensíveis.',
          'Para crianças e newborn, mantenha linguagem de retrato familiar, sem sensualização, sem exagero de edição e sem promessas de resultado perfeito.',
        ],
        bullets: [
          'Defina número de pessoas e relação familiar.',
          'Use luz de janela, golden hour ou sombra aberta.',
          'Peça gestos naturais: abraço, colo, risada, caminhada.',
          'Finalize com textura realista e proporções naturais.',
        ],
      },
      {
        id: 'exemplos',
        heading: 'Exemplos para copiar',
        paragraphs: [
          'Estes prompts cobrem os casos que podem gerar novas impressões orgânicas: família no parque, gestante em casa e newborn lifestyle.',
        ],
        promptExamples: [
          {
            title: 'Família no parque',
            description: 'Para buscas por prompt Gemini fotos família em ambiente externo.',
            prompt:
              'Contexto: família de quatro pessoas em parque verde durante golden hour.\nComposição: pais sentados em manta clara, crianças próximas sorrindo de forma natural.\nIluminação: luz lateral quente, sombras suaves, fundo com árvores desfocadas.\nParâmetros: câmera full frame, 35mm f/2.8, ISO 320.\nEstilo: lifestyle documental, cores acolhedoras.\nInstruções finais: preservar proporções naturais, textura de roupas e expressões espontâneas.',
          },
          {
            title: 'Gestante em casa',
            description: 'Boa base para ensaio gestante Gemini com luz de janela.',
            prompt:
              'Contexto: ensaio gestante em quarto claro com decoração boho.\nComposição: gestante de perfil tocando a barriga, vestido creme fluido, flores secas ao fundo.\nIluminação: janela lateral difusa com cortina translúcida.\nParâmetros: câmera mirrorless, 50mm f/2, ISO 250.\nEstilo: fine art suave, tons pastel.\nInstruções finais: manter naturalidade, textura do tecido e expressão serena.',
          },
        ],
      },
    ],
    takeaways: [
      'Família exige prompt mais claro sobre vínculo, segurança e naturalidade.',
      'Gestante funciona melhor com luz suave, tons claros e poucas props.',
      'Esta página deve alimentar links internos para /prompts#ensaio-familia e /generator.',
    ],
    faq: [
      {
        question: 'Como escrever prompt Gemini para fotos de família?',
        answer:
          'Informe quem aparece, onde estão, qual gesto natural deve acontecer, como é a luz e peça realismo. Evite alterar idade, corpo ou características sensíveis.',
      },
      {
        question: 'Posso usar prompt de família para gestante?',
        answer:
          'Sim, mas adapte composição e luz. Para gestante, descreva perfil, tecido, ambiente íntimo e expressão serena em vez de muitas pessoas no quadro.',
      },
      {
        question: 'Qual CTA usar depois do prompt?',
        answer:
          'O CTA principal deve levar ao compositor para ajustar luz, cenário e finalidade antes de abrir o Gemini explicitamente.',
      },
    ],
    ctas: [
      { label: 'Criar prompt de família no compositor', href: '/generator?category=family', variant: 'primary' },
      { label: 'Comparar todos os cenários', href: '/prompts#ensaio-familia', variant: 'outline' },
    ],
  },
  {
    slug: 'prompt-gemini-linkedin-cv',
    locale: 'pt-BR',
    title: 'Prompt Gemini para LinkedIn e currículo',
    excerpt:
      'Um fluxo curto para criar foto de perfil profissional com Gemini: escolha roupa, fundo, iluminação e versão para LinkedIn, CV ou página sobre.',
    category: 'Profissional',
    tags: ['prompt gemini linkedin', 'foto para curriculo gemini', 'headshot gemini'],
    author: 'Equipe Prompt Gemini Fotos',
    authorRole: 'Produto e Conversão',
    readingTimeMinutes: 6,
    publishedAt: '2026-07-08',
    updatedAt: '2026-07-08',
    heroEyebrow: 'CRO profissional',
    heroDescription:
      'Visitantes que chegam por foto profissional precisam de caminho direto: copiar prompt, ajustar contexto e abrir Gemini. Este guia reduz escolhas e cria uma rota clara até o gerador.',
    seo: {
      description:
        'Prompt Gemini para LinkedIn, currículo e headshot profissional. Copie modelos com fundo neutro, luz suave, roupa adequada e preservação de identidade.',
      keywords: [
        'prompt gemini linkedin',
        'prompt gemini curriculo',
        'foto profissional gemini linkedin',
        'headshot gemini prompt',
      ],
    },
    sections: [
      {
        id: 'decisao',
        heading: 'Escolha o uso antes do estilo',
        paragraphs: [
          'LinkedIn, currículo e site pessoal pedem variações diferentes. O LinkedIn aceita um pouco mais de personalidade; currículo pede neutralidade; site pessoal pode usar ambiente de trabalho.',
          'Definir isso no começo do prompt evita resultado bonito, mas desalinhado ao canal onde a foto será usada.',
        ],
        bullets: [
          'LinkedIn: sorriso natural, fundo limpo, roupa profissional.',
          'Currículo: enquadramento mais formal e sem props.',
          'Página sobre: ambiente real com profundidade de campo.',
        ],
      },
      {
        id: 'prompts',
        heading: 'Três variações prontas',
        paragraphs: [
          'Copie a opção mais próxima do seu objetivo e ajuste apenas profissão, roupa e fundo no compositor.',
        ],
        promptExamples: [
          {
            title: 'LinkedIn tech founder',
            description: 'Para perfil profissional com mais personalidade.',
            prompt:
              'Objetivo: headshot para LinkedIn de fundador de tecnologia.\nComposição: ombros para cima, sorriso confiante, camiseta preta com blazer casual.\nIluminação: softbox a 45 graus, catch light visível nos olhos.\nFundo: escritório moderno desfocado, tons neutros.\nParâmetros: câmera full frame, lente 85mm, f/3.5.\nInstruções finais: preservar identidade da foto de referência, pele natural, sem aparência de avatar.',
          },
          {
            title: 'Currículo formal',
            description: 'Para CV e candidatura tradicional.',
            prompt:
              'Objetivo: foto formal para currículo.\nComposição: retrato centralizado, camisa clara, postura reta, expressão acessível.\nIluminação: luz frontal suave, fundo branco quente.\nParâmetros: lente 70mm, f/4, nitidez alta nos olhos.\nEstilo: corporativo discreto.\nInstruções finais: manter proporções reais, corrigir apenas iluminação e ruído.',
          },
        ],
      },
    ],
    takeaways: [
      'LinkedIn pode ter contexto; currículo deve ser mais neutro.',
      'O prompt precisa repetir preservação de identidade e textura natural.',
      'O próximo passo ideal é abrir o gerador com template profissional pré-selecionado.',
    ],
    faq: [
      {
        question: 'Qual prompt Gemini usar para LinkedIn?',
        answer:
          'Use um prompt de headshot com objetivo LinkedIn, fundo neutro ou escritório desfocado, luz softbox, lente de retrato e preservação de identidade.',
      },
      {
        question: 'Foto de currículo deve ser diferente da foto de LinkedIn?',
        answer:
          'Sim. Currículo normalmente pede composição mais formal, fundo mais limpo e menos elementos de personalidade. LinkedIn aceita ambiente profissional desfocado.',
      },
      {
        question: 'Como medir se o prompt ficou bom?',
        answer:
          'Verifique se a pessoa ainda parece ela mesma, se o fundo não distrai, se os olhos estão nítidos e se a roupa combina com o canal de uso.',
      },
    ],
    ctas: [
      { label: 'Abrir gerador para LinkedIn', href: '/generator?template=professional-linkedin-1', variant: 'primary' },
      { label: 'Ver templates profissionais', href: '/templates?category=professional', variant: 'outline' },
    ],
  },
];

export function getPostsByLocale(locale: Locale): BlogPost[] {
  return BLOG_POSTS.filter((post) => post.locale === locale);
}

export function getPostBySlug(locale: Locale, slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.locale === locale && post.slug === slug);
}

export function getAllBlogSlugs(): { locale: Locale; slug: string }[] {
  return BLOG_POSTS.map((post) => ({ locale: post.locale, slug: post.slug }));
}

