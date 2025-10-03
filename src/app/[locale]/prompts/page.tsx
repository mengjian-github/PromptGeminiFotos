import { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Locale } from '@/i18n/config';
import { buildLocalePath } from '@/lib/locale-path';

type PromptExample = {
  title: string;
  description: string;
  prompt: string;
};

type PromptSection = {
  id: string;
  query: string;
  title: string;
  summary: string;
  bulletPoints: string[];
  promptExamples: PromptExample[];
  optimizationTips: string[];
};

type FAQ = {
  question: string;
  answer: string;
};

type PageContent = {
  badge: string;
  title: string;
  subtitle: string;
  heroCta: string;
  heroSecondaryCta: string;
  introParagraphs: string[];
  keyTakeaways: string[];
  sections: PromptSection[];
  faqs: FAQ[];
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  lastUpdated: string;
};

const contentByLocale: Record<Locale, PageContent> = {
  'pt-BR': {
    badge: 'Guia profissional',
    title: 'Prompts Gemini para ensaio fotografico: use cenarios prontos',
    subtitle: 'Transforme os termos mais buscados - feminino, casal, aniversario e corporativo - em imagens realistas com Gemini AI Photoshoot.',
    heroCta: 'Usar prompt no gerador agora',
    heroSecondaryCta: 'Ir direto para os prompts',
    introParagraphs: [
      'Este hub foi montado com base nos termos que mais geram cliques no Google Search Console, como prompt gemini ensaio fotografico, prompt gemini fotos ensaio fotografico e prompts para fotos gemini. A proposta e converter cada intencao em exemplos praticos para copiar, adaptar e publicar.',
      'Cada cenario abaixo reune briefing, parametros tecnicos e texto base que funciona bem no Gemini AI. Combine com o gerador interno para testar variacoes em portugues e ingles sem perder tempo formatando.'
    ],
    keyTakeaways: [
      'Os prompts estao agrupados por intencao: feminino, masculino, casal, aniversario, familia, profissional, preto e branco e ensaio sensual.',
      'Cada exemplo ja traz iluminacao, lente, enquadramento e ajustes finos para acelerar seu fluxo dentro do Gemini photoshoot.',
      'Incluimos dicas on-page para reaproveitar termos como prompt gemini foto profissional e fotos gemini em headings, anchors e alt text.'
    ],
    sections: [
      {
        id: 'ensaio-feminino',
        query: 'prompt gemini ensaio fotografico feminino',
        title: 'Ensaio feminino com Gemini',
        summary: 'Use estes prompts para retratos femininos editoriais, lifestyle e corporativos mantendo pele natural e styling alinhado as buscas.',
        bulletPoints: [
          'Combine iluminacao suave e descricao de poses para ranquear para prompt gemini ensaio fotografico feminino profissional.',
          'Detalhe styling, maquiagem e acessorios em portugues para capturar buscas como prompt gemini feminino.',
          'Finalize com instrucoes de textura realista para que o Gemini respeite tons de pele e detalhe de cabelo.'
        ],
        promptExamples: [
          {
            title: 'Retrato editorial ao entardecer',
            description: 'Ideal para campanhas lifestyle e redes sociais com luz dourada.',
            prompt: `Contexto: sessao "prompt gemini ensaio fotografico feminino" ao ar livre no por do sol.
Composicao: modelo sorrindo em meio-corpo, vestido de seda azul marinho esvoacante, vento leve.
Iluminacao: golden hour lateral com realce suave, flare controlado.
Parametros tecnicos: camera full frame, lente 85mm f/1.8, ISO 200, shutter 1/400s.
Estilo: editorial de revista, fundo urbano desfocado, paleta quente realista.
Instrucoes finais: manter pele natural, textura do tecido e reflexos metalicos nitidos. Responda em portugues.`
          },
          {
            title: 'Close de beleza neon',
            description: 'Para destacar maquiagem artistica em prompt gemini fotos ensaio fotografico feminino.',
            prompt: `Contexto: close de rosto feminino com maquiagem neon futurista.
Composicao: enquadramento fechado, olhar direto para a camera, unhas metalicas ao lado do rosto.
Iluminacao: mix de azul ciano e magenta com luz recortada lateral.
Parametros: camera mirrorless, macro 100mm, f/4, ISO 400, gelo seco ao fundo.
Estilo: beauty shot brilhante, pele glow, textura realista.
Instrucoes finais: aplicar suavizacao natural sem perder poros, responder em portugues do Brasil.`
          },
          {
            title: 'Retrato corporativo minimalista',
            description: 'Indicado para prompt gemini ensaio fotografico feminino profissional em LinkedIn.',
            prompt: `Contexto: headshot corporativo feminino para LinkedIn.
Composicao: camisa branca, blazer cinza, postura confiante, meio-corpo.
Iluminacao: softbox frontal + kicker lateral discreto.
Parametros: camera full frame, 70mm f/4, ISO 160.
Estilo: fundo cinza claro neutro, contraste suave, nitidez nos olhos.
Instrucoes finais: entregar arquivo pronto para recorte, manter expressao acolhedora.`
          }
        ],
        optimizationTips: [
          'Crie ancoras internas usando o texto "prompt gemini ensaio fotografico feminino" apontando para este bloco.',
          'Adicione alt text nas imagens com combinacoes long tail como "prompt gemini ensaio fotografico feminino profissional em estudio minimalista".',
          'Salve variacoes em ingles no CMS (Gemini female photoshoot prompt) para ranquear tambem para gemini photoshoot.'
        ]
      },
      {
        id: 'ensaio-masculino',
        query: 'prompt gemini ensaio fotografico masculino',
        title: 'Ensaio masculino e retratos de impacto',
        summary: 'Explore poses, textura e contraste para gerar imagens fortes e corporativas voltadas ao termo prompt gemini fotos ensaio fotografico masculino profissional.',
        bulletPoints: [
          'Misture luz dura com contraluz para criar volume em retratos masculinos.',
          'Inclua direcoes de guarda-roupa (terno, jaqueta de couro, camiseta basica) para cobrir diferentes personas.',
          'Trabalhe com palavras como "confianca", "lideranca" e "energia" para reforcar ensaio fotografico gemini orientado a negocios.'
        ],
        promptExamples: [
          {
            title: 'Retrato corporativo dramatico',
            description: 'Headshot para prompt gemini foto profissional masculino em ambientes de negocios.',
            prompt: `Contexto: executivo masculino posando em escritorio moderno.
Composicao: meio-corpo, bracos cruzados, olhar determinado para a camera.
Iluminacao: mistura de luz principal suave e hair light azul frio.
Parametros: camera full frame, 50mm f/2.8, ISO 200.
Estilo: fundo com linhas arquitetonicas desfocadas, contraste medio.
Instrucoes finais: manter barba definida, ajustar tom de pele para realismo.`
          },
          {
            title: 'Retrato lifestyle com jaqueta de couro',
            description: 'Atende buscas por prompt gemini ensaio fotografico masculino ao ar livre.',
            prompt: `Contexto: ensaio masculino urbano noturno.
Composicao: modelo encostado em parede de tijolos, jaqueta de couro preta, luz de neon roxa ao fundo.
Iluminacao: principal lateral dramatica + luz de recorte colorida.
Parametros: camera mirrorless APS-C, 35mm f/1.4, ISO 640.
Estilo: mood cinematografico, foco nos olhos, grao leve.
Instrucoes finais: manter expressao introspectiva, preservar textura do couro.`
          },
          {
            title: 'Retrato fitness editorial',
            description: 'Util para prompt gemini foto masculino com apelo esportivo.',
            prompt: `Contexto: atleta masculino em estudio minimalista.
Composicao: corpo inteiro em posicao de corrida estatica, musculos destacados.
Iluminacao: esquema tri-light com rim light para contorno.
Parametros: camera full frame, 24-70mm em 35mm, f/5.6, ISO 320.
Estilo: fundo cinza escuro, contraste alto, gotas de suor visiveis.
Instrucoes finais: manter definicao muscular realista, evitar plasticidade.`
          }
        ],
        optimizationTips: [
          'Inclua uma tabela comparando variacoes de prompt para LinkedIn, book de modelo e editorial esportivo.',
          'Link interne este bloco a partir de chamadas como "prompt gemini ensaio fotografico masculino" no menu ou CTA.',
          'Crie snippets em ingles (Gemini male photoshoot prompt) para atender usuarios internacionais.'
        ]
      },
      {
        id: 'ensaio-casal',
        query: 'prompt gemini ensaio fotografico casal',
        title: 'Ensaio de casal e pre-wedding',
        summary: 'Conduza o Gemini em cenas romanticas, casamentos e retratos intimos, cobrindo termos como prompt gemini foto casal e prompt gemini fotos ensaio fotografico casal.',
        bulletPoints: [
          'Contextualize clima e cenario (praia, campo, clima nublado) para cada prompt gemini ensaio fotografico de casal.',
          'Especifique contato fisico e olhar para garantir conexao realista.',
          'Inclua variacoes para pre-wedding e casamento, cobrindo buscas como prompt gemini foto casamento.'
        ],
        promptExamples: [
          {
            title: 'Pre-wedding na praia',
            description: 'Atende consultas como ensaio fotografico casal gemini e prompt gemini de casal.',
            prompt: `Contexto: casal caminhando na praia ao amanhecer.
Composicao: camera em angulo baixo, casal de maos dadas, ondas suaves.
Iluminacao: luz dourada difusa com flare leve.
Parametros: camera full frame, 35mm f/2, ISO 200, shutter 1/800s.
Estilo: romance cinematografico, tons pastel, ceu dramatico.
Instrucoes finais: manter respingos de agua naturais, expressoes sorridentes.`
          },
          {
            title: 'Casal urbano noturno',
            description: 'Otimo para prompts gemini fotos casal com vibe moderna.',
            prompt: `Contexto: casal em rua com letreiros de neon.
Composicao: abraco frontal, olhar compartilhado, chuva leve.
Iluminacao: mistura de neon azul e rosa refletido no asfalto molhado.
Parametros: camera mirrorless, 50mm f/1.2, ISO 800.
Estilo: cinematografico, bokeh intenso, destaque em reflexos.
Instrucoes finais: manter textura do casaco e reflexos realistas.`
          },
          {
            title: 'Retrato intimo em estudio',
            description: 'Ideal para prompt para foto profissional gemini casal, mantendo elegancia.',
            prompt: `Contexto: casal sentado em estudio com cenario monocromatico cinza.
Composicao: pose em triangulo, maos entrelacadas, olhar sereno.
Iluminacao: softbox duplo frontal + hair light, contraste baixo.
Parametros: camera full frame, 85mm f/2.2, ISO 160.
Estilo: fine art minimalista, paleta neutra.
Instrucoes finais: enfatizar textura de pele e tecidos sem exageros.`
          }
        ],
        optimizationTips: [
          'Crie ancoras especificas: "prompt gemini fotos ensaio fotografico casal" e "prompt gemini foto casamento".',
          'Link a pagina de templates diretamente para estes prompts de casal para melhorar navegacao.',
          'Adicione galeria antes/depois para reforcar credibilidade do Gemini AI fotos.'
        ]
      },
      {
        id: 'ensaio-aniversario',
        query: 'prompt gemini ensaio fotografico aniversario',
        title: 'Ensaio de aniversario e celebracoes',
        summary: 'Prompts para festas infantis, 15 anos e aniversarios adultos, cobrindo variacoes de prompt gemini fotos ensaio fotografico de aniversario.',
        bulletPoints: [
          'Determine idade, tema e paleta para cada prompt.',
          'Combine elementos decorativos (baloes, bolo, neon) com emocoes captadas.',
          'Inclua versoes para ambientes internos e externos.'
        ],
        promptExamples: [
          {
            title: 'Aniversario infantil ludico',
            description: 'Focado em cores vivas para "prompt gemini fotos ensaio fotografico aniversario".',
            prompt: `Contexto: festa infantil tema espaco sideral.
Composicao: crianca soprando velas, bolo com planetas, confetes no ar.
Iluminacao: mix de luz principal suave e luz ambiente azul.
Parametros: camera full frame, 35mm f/2.5, ISO 400.
Estilo: vibrante, contraste medio, brilho nos olhos.
Instrucoes finais: manter proporcoes infantis realistas, evitar look cartoon.`
          },
          {
            title: 'Ensaio de 15 anos com neon',
            description: 'Perfeito para prompt gemini ensaio fotografico aniversario noturno.',
            prompt: `Contexto: debutante posando diante de letreiro neon roxo.
Composicao: vestido longo brilhante, postura confiante.
Iluminacao: luz principal suave + led colorido traseiro.
Parametros: camera mirrorless, 50mm f/1.8, ISO 640.
Estilo: glam club, reflexos metalicos controlados.
Instrucoes finais: manter detalhes do vestido e cabelo ondulado.`
          }
        ],
        optimizationTips: [
          'Use headings que contenham "prompt gemini fotos ensaio fotografico aniversario" para reforcar relevancia.',
          'Adicione checklist para download cobrindo styling, paleta e poses.',
          'Link cruzado para pacotes do gerador oferecendo presets tematicos.'
        ]
      },
      {
        id: 'ensaio-profissional',
        query: 'prompt gemini ensaio fotografico profissional',
        title: 'Retratos profissionais e headshots',
        summary: 'Modelos de prompt para headshot, LinkedIn e campanhas B2B que convertem bem para foto profissional gemini e gemini prompt for professional headshot.',
        bulletPoints: [
          'Especifique uso final (LinkedIn, site institucional, folder) para orientar enquadramento.',
          'Inclua esquema de iluminacao com key light e fill balanceado.',
          'Peca variacoes com fundo solido e com textura para cobrir fotos profissionais gemini.'
        ],
        promptExamples: [
          {
            title: 'Headshot LinkedIn neutro',
            description: 'Converte para prompt gemini foto profissional e prompt para foto profissional gemini.',
            prompt: `Contexto: profissional sorrindo em estudio branco.
Composicao: plano medio, bracos cruzados, olhar direto.
Iluminacao: softbox principal + reflector prata.
Parametros: camera full frame, 85mm f/4, ISO 125.
Estilo: clean corporativo, fundo branco puro.
Instrucoes finais: entregar arquivo em alta resolucao com nitidez nos olhos.`
          },
          {
            title: 'Retrato empresarial ambiental',
            description: 'Ideal para prompts gemini fotos profissionais em ambiente real.',
            prompt: `Contexto: empresaria em coworking com notebook.
Composicao: plano medio, fundo com profundidade de campo.
Iluminacao: luz natural da janela + preenchimento com softbox.
Parametros: camera mirrorless, 35mm f/2, ISO 320.
Estilo: cores neutras, sensacao acolhedora.
Instrucoes finais: manter textura do cabelo, evitar excesso de desfoque.`
          },
          {
            title: 'Headshot internacional',
            description: 'Use para gemini prompt for professional headshot em ingles.',
            prompt: `Context: professional headshot for a technology leader.
Composition: shoulder-up framing, confident smile, navy blazer.
Lighting: soft key light at 45 degrees, subtle rim light.
Technical setup: full frame camera, 85mm lens, f/4, ISO 200.
Style: modern corporate, neutral gray background, natural skin texture.
Final notes: deliver 4K resolution, keep catch light visible, respond in English.`
          }
        ],
        optimizationTips: [
          'Inclua tabela com diferencas entre "prompt gemini foto profissional" e "prompt gemini fotos ensaio fotografico profissional".',
          'Marque este bloco com schema FAQ ou HowTo explicando setup de luz.',
          'Ofereca CTA para baixar presets em PDF e capturar leads.'
        ]
      },
      {
        id: 'ensaio-familia',
        query: 'prompt gemini fotos ensaio fotografico familia',
        title: 'Ensaio de familia e gestante',
        summary: 'Cenarios acolhedores para familias, newborn e gestantes, cobrindo prompt gemini fotos ensaio fotografico familia e fotos gemini.',
        bulletPoints: [
          'Defina composicao (circulo, fileira, abraco) para facilitar pose.',
          'Inclua objetos pessoais (cobertor, brinquedo, ultrassom) para reforcar storytelling.',
          'Determine paleta calorosa para dar aspecto lifestyle.'
        ],
        promptExamples: [
          {
            title: 'Sessao familia no parque',
            description: 'Perfeito para prompt para fotos gemini com criancas.',
            prompt: `Contexto: familia de quatro pessoas em parque verde.
Composicao: pais sentados, criancas no colo, risadas naturais.
Iluminacao: luz difusa em dia nublado.
Parametros: camera full frame, 35mm f/2.8, ISO 400.
Estilo: lifestyle documental, cores quentes.
Instrucoes finais: preservar textura do gramado e roupas.`
          },
          {
            title: 'Gestante com luz de janela',
            description: 'Cobre buscas por gemini ai fotos de gravidez.',
            prompt: `Contexto: gestante em loft boho com vestido fluido creme.
Composicao: posicao de perfil tocando a barriga, veu leve movendo.
Iluminacao: janela lateral com cortina translucida.
Parametros: camera mirrorless, 50mm f/2, ISO 250.
Estilo: fine art suave, tons pastel.
Instrucoes finais: enfatizar expressao emocionada, manter textura do tecido.`
          }
        ],
        optimizationTips: [
          'Crie galeria com legendas contendo "prompt gemini fotos ensaio fotografico familia".',
          'Sugira roteiro com horarios ideais para captar luz natural.',
          'Adicione CTA para combinar prompts com pacotes de impressao.'
        ]
      },
      {
        id: 'ensaio-preto-branco',
        query: 'prompt gemini ensaio fotografico preto e branco',
        title: 'Preto e branco dramatico',
        summary: 'Guias para trabalhar contraste e textura em preto e branco sem perder naturalidade.',
        bulletPoints: [
          'Mencione fontes de luz fortes ou direcionais para gerar contraste.',
          'Solicite granulacao suave e profundidade de cinzas.',
          'Adicione referencia a filmes classicos (Ilford, Kodak) se quiser textura analogica.'
        ],
        promptExamples: [
          {
            title: 'Retrato close em low key',
            description: 'Focado em prompt gemini ensaio fotografico preto e branco com drama.',
            prompt: `Contexto: retrato preto e branco em estudio, luz recortada lateral.
Composicao: close no rosto, sombras marcantes.
Iluminacao: luz principal forte de um lado, fundo escuro.
Parametros: camera full frame, 85mm f/2, ISO 200.
Estilo: filme analogico Ilford HP5, grao suave, contraste alto.
Instrucoes finais: preservar detalhes nos highlights e shadows.`
          },
          {
            title: 'Casal em preto e branco vintage',
            description: 'Ajuste para prompt gemini fotos ensaio fotografico casamento elegante.',
            prompt: `Contexto: casal se beijando em corredor de igreja vintage.
Composicao: plano aberto com colunas simetricas.
Iluminacao: luz natural entrando pelas janelas, flare controlado.
Parametros: camera full frame, 35mm f/2.8, ISO 320.
Estilo: preto e branco tonal, vibe filme classico.
Instrucoes finais: manter veu translucido e texturas do traje.`
          }
        ],
        optimizationTips: [
          'Inclua comparacao lado a lado (colorido vs PB) com legenda usando o termo alvo.',
          'Explique quando usar curva S e dodge & burn nos ajustes.',
          'Adicione CTA para preset PB dentro do gerador.'
        ]
      },
      {
        id: 'ensaio-sensual',
        query: 'prompt gemini ensaio sensual',
        title: 'Ensaio sensual artistico',
        summary: 'Abordagem elegante para boudoir, com atencao a privacidade e ao consentimento.',
        bulletPoints: [
          'Use linguagem cuidadosa e descreva limites de exposicao.',
          'Foque em texturas (renda, seda, sombra projetada) para resultados sofisticados.',
          'Inclua instrucoes sobre postura e expressoes suaves.'
        ],
        promptExamples: [
          {
            title: 'Boudoir com luz de persiana',
            description: 'Prompts que funcionam para prompt gemini ensaio sensual com sombras.',
            prompt: `Contexto: ensaio boudoir em suite vintage.
Composicao: modelo deitada em chaise, olhar relaxado, renda preta.
Iluminacao: luz de janela passando por persianas, sombras geometricas.
Parametros: camera full frame, 50mm f/1.4, ISO 400.
Estilo: fine art intimista, contraste suave.
Instrucoes finais: manter textura da renda, evitar exagero de retoque.`
          },
          {
            title: 'Silhueta artistica com veu',
            description: 'Para resultados elegantes em prompt gemini ensaio sensual minimalista.',
            prompt: `Contexto: silhueta feminina atras de veu translucido.
Composicao: pose de perfil, veu fluindo, fundo branco estourado.
Iluminacao: backlight forte, contorno delicado.
Parametros: camera full frame, 35mm f/2, ISO 200.
Estilo: minimalista, tons claros, sensacao eterea.
Instrucoes finais: manter suavidade, respeitar anatomia realista.`
          }
        ],
        optimizationTips: [
          'Inclua aviso de consentimento e orientacoes de privacidade para reforcar confianca.',
          'Adicione CTA suave para conversar com especialista antes de gerar.',
          'Crie versao em ingles (Gemini sensual photoshoot prompt) em bloco recolhivel.'
        ]
      },
      {
        id: 'estrutura-texto',
        query: 'prompt gemini ensaio fotografico texto',
        title: 'Modelo de texto para qualquer prompt',
        summary: 'Estrutura pronta para voce adaptar rapidamente e cobrir buscas genericas como prompt gemini foto, gemini ai fotos e prompt para fotos gemini.',
        bulletPoints: [
          'Sempre abra com objetivo e publico (ex.: book profissional, portfolio artista).',
          'Detalhe composicao, iluminacao, lente e clima em frases curtas.',
          'Feche com instrucoes sobre idioma, realismo e elementos a evitar.'
        ],
        promptExamples: [
          {
            title: 'Template universal',
            description: 'Copie e ajuste conforme o cenario desejado.',
            prompt: `Objetivo: [descrever ensaio, exemplo: "prompt gemini ensaio fotografico profissional"] para [canal de uso].
Composicao: [plano, poses, interacao].
Iluminacao: [tipo de luz principal] + [luz de preenchimento/contraluz].
Parametros tecnicos: camera [formato], lente [mm], abertura [f/], ISO [valor].
Estilo: [referencia visual], paleta [cores], atmosfera [emocao].
Instrucoes finais: manter textura de pele realista, responder em [idioma], evitar [elementos indesejados].`
          }
        ],
        optimizationTips: [
          'Use este bloco como FAQ expandido, respondendo "como escrever prompt gemini ensaio fotografico texto".',
          'Adicione link interno para o gerador com parametros pre-carregados.',
          'Inclua CTA para salvar template em PDF.'
        ]
      }
    ],
    faqs: [
      {
        question: 'Qual e o melhor prompt gemini ensaio fotografico feminino?',
        answer: 'Comece definindo objetivo (editorial, corporativo ou lifestyle), descreva iluminacao suave e poses alongadas, e finalize pedindo textura natural de pele. O exemplo "Retrato editorial ao entardecer" acima funciona como base solida para prompt gemini ensaio fotografico feminino profissional.'
      },
      {
        question: 'Como adaptar prompt gemini ensaio fotografico casal para casamento?',
        answer: 'Inclua local (igreja, praia, campo), descreva conexao fisica e peca detalhes do traje. Use variacoes como "prompt gemini foto casamento" e "prompt para foto profissional gemini casal" para cobrir pesquisa longa e pre-wedding.'
      },
      {
        question: 'Como escrever prompt gemini ensaio fotografico texto do zero?',
        answer: 'Siga o template universal: objetivo + composicao + iluminacao + parametros + estilo. Termine com instrucoes sobre linguagem (pt-BR ou ingles) e elementos proibidos. Essa estrutura atende buscas como prompt gemini foto, prompt gemini ensaio fotografico texto e prompt para fotos gemini.'
      },
      {
        question: 'O que considerar ao gerar foto profissional gemini?',
        answer: 'Defina uso final (LinkedIn, curriculo, site), escolha fundo coerente e informe o esquema de luz. Reforce termos como foto profissional gemini e gemini fotos profissionais na legenda e no alt text para ganhar relevancia.'
      },
      {
        question: 'Posso usar estes prompts no Gemini photoshoot em ingles?',
        answer: 'Sim. Adapte o idioma na instrucao final e traduza termos-chave para manter consistencia. Aproveite a versao "Headshot internacional" para ranquear tambem para gemini prompt for professional headshot e gemini photoshoot.'
      }
    ],
    metaTitle: 'Prompts Gemini para ensaio fotografico | Guia atualizado 2025',
    metaDescription: 'Colecao completa de prompts Gemini para ensaio feminino, casal, aniversario, familia e corporativo com exemplos prontos. Atualizado em 3 de outubro de 2025.',
    keywords: [
      'prompt gemini ensaio fotografico',
      'prompt gemini ensaio fotografico feminino',
      'prompt gemini fotos ensaio fotografico',
      'prompt gemini ensaio fotografico casal',
      'prompt gemini ensaio fotografico aniversario',
      'prompt gemini ensaio fotografico profissional',
      'prompt gemini ensaio fotografico masculino',
      'prompt gemini ensaio fotografico texto',
      'prompt gemini foto profissional',
      'prompt gemini fotos ensaio fotografico familia',
      'prompt gemini ensaio fotografico preto e branco',
      'prompt gemini ensaio sensual',
      'prompt para fotos gemini',
      'gemini photoshoot'
    ],
    lastUpdated: 'Atualizado em 3 de outubro de 2025'
  },
  en: {
    badge: 'Expert guide',
    title: 'Gemini photo shoot prompts by scenario',
    subtitle: 'Turn your top Search Console queries into polished briefs for Gemini AI shoots.',
    heroCta: 'Open the generator',
    heroSecondaryCta: 'Skip to prompts',
    introParagraphs: [
      'This hub repurposes your most searched queries into ready-to-use Gemini AI prompts.',
      'Each block covers intent, shooting notes, and multi-line prompt text so you can localize quickly.'
    ],
    keyTakeaways: [
      'Sections include female, male, couple, birthday, family, professional, black-and-white, and boudoir prompts.',
      'Every example highlights lighting, lens, composition, and finishing instructions to keep results realistic.',
      'Use the universal template to adapt any new query without starting from scratch.'
    ],
    sections: [
      {
        id: 'female-session',
        query: 'gemini female photoshoot',
        title: 'Female portraits',
        summary: 'Editorial and corporate female looks with soft light and natural skin.',
        bulletPoints: [
          'State the mood (editorial, lifestyle, corporate).',
          'Describe wardrobe, accessories, and hair.',
          'Close with notes about realistic texture and language.'
        ],
        promptExamples: [
          {
            title: 'Golden hour editorial',
            description: 'Sunset lifestyle portrait.',
            prompt: `Context: female editorial photoshoot at golden hour.
Composition: half body, silk dress flowing, gentle wind.
Lighting: warm side light, subtle lens flare.
Setup: full frame camera, 85mm f/1.8, ISO 200.
Style: magazine look, warm palette, realistic skin.
Final notes: keep natural texture, reply in English.`
          }
        ],
        optimizationTips: [
          'Link back to your PT-BR version for hreflang consistency.',
          'Add alt text with "Gemini female photoshoot prompt".',
          'Offer a CTA to copy the Portuguese version.'
        ]
      },
      {
        id: 'couple-session',
        query: 'gemini couple photo prompt',
        title: 'Couple sessions',
        summary: 'Romantic, wedding, and urban couple prompts.',
        bulletPoints: [
          'Clarify the location and weather.',
          'Spell out physical interaction and emotion.',
          'Mention wardrobe colors and props.'
        ],
        promptExamples: [
          {
            title: 'Sunrise beach walk',
            description: 'Pre-wedding scenario.',
            prompt: `Context: couple walking on the beach at sunrise.
Composition: holding hands, ocean spray, soft smiles.
Lighting: golden hour, warm highlights.
Setup: full frame, 35mm f/2, ISO 200.
Style: cinematic romance, pastel palette.
Final notes: preserve water texture, respond in English.`
          }
        ],
        optimizationTips: [
          'Connect this section with your wedding templates.',
          'Add an internal anchor labelled "Gemini couple photoshoot".',
          'Invite users to test the prompts in the generator.'
        ]
      },
      {
        id: 'professional-session',
        query: 'gemini prompt for professional headshot',
        title: 'Professional headshots',
        summary: 'Corporate-ready prompts for Gemini AI.',
        bulletPoints: [
          'Set the final usage (LinkedIn, website).',
          'Describe lighting with key and rim placement.',
          'Request high resolution and natural retouch.'
        ],
        promptExamples: [
          {
            title: 'Neutral studio headshot',
            description: 'Useful for LinkedIn.',
            prompt: `Context: professional headshot, white studio background.
Composition: shoulders up, relaxed smile.
Lighting: soft key + subtle rim light.
Setup: full frame, 85mm f/4, ISO 160.
Style: clean corporate, neutral colors.
Final notes: maintain skin texture, export 4K.`
          }
        ],
        optimizationTips: [
          'Link with your PT-BR professional section.',
          'Add a downloadable checklist in both languages.',
          'Mention Gemini AI photos for semantic coverage.'
        ]
      },
      {
        id: 'universal-template',
        query: 'gemini photoshoot template',
        title: 'Universal template',
        summary: 'Fill-in-the-blank structure to adapt any new query.',
        bulletPoints: [
          'Define objective and audience.',
          'Outline composition, lighting, technical specs.',
          'Finish with language and realism instructions.'
        ],
        promptExamples: [
          {
            title: 'Fill the blanks',
            description: 'Copy, replace brackets, and run.',
            prompt: `Goal: [describe photoshoot] for [usage].
Composition: [frame, pose, interaction].
Lighting: [key light] + [fill/rim].
Technical setup: [camera], [lens], [aperture], [ISO].
Style: [reference], [color palette], [emotion].
Final notes: keep skin realistic, reply in [language], avoid [elements].`
          }
        ],
        optimizationTips: [
          'Cross-link to the PT-BR text guide.',
          'Offer a copy button for quick usage.',
          'Mention Gemini photoshoot in the description.'
        ]
      }
    ],
    faqs: [
      {
        question: 'How do I adapt a Gemini couple photoshoot prompt for weddings?',
        answer: 'State the venue, describe gestures, and add details about attire and props. Link back to the Portuguese block for hreflang balance.'
      },
      {
        question: 'What is the best Gemini prompt for professional headshot?',
        answer: 'Combine objective, lighting recipe, lens choice, and finishing notes. The "Neutral studio headshot" example is a reliable starting point.'
      },
      {
        question: 'Can I translate the prompts to Portuguese?',
        answer: 'Yes. Use the universal template, swap the language instruction, and keep the same structure for Search Console alignment.'
      }
    ],
    metaTitle: 'Gemini photoshoot prompts by scenario',
    metaDescription: 'Ready-to-use Gemini AI prompts for female, couple, birthday, family, and corporate sessions. Updated October 3, 2025.',
    keywords: [
      'gemini photoshoot',
      'gemini photo prompts',
      'gemini prompt for professional headshot',
      'gemini couple photo prompt'
    ],
    lastUpdated: 'Updated October 3, 2025'
  }
};
interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const currentLocale = (locale as Locale) || 'pt-BR';
  const content = contentByLocale[currentLocale] ?? contentByLocale['pt-BR'];
  const canonical = buildLocalePath(currentLocale, '/prompts', { absolute: true });

  return {
    title: content.metaTitle,
    description: content.metaDescription,
    keywords: content.keywords,
    alternates: {
      canonical,
    },
    openGraph: {
      title: content.metaTitle,
      description: content.metaDescription,
      url: canonical,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: content.metaTitle,
      description: content.metaDescription,
    },
  };
}

export default async function PromptsPage({ params }: Props) {
  const { locale } = await params;
  const currentLocale = (locale as Locale) || 'pt-BR';
  setRequestLocale(currentLocale);
  const content = contentByLocale[currentLocale] ?? contentByLocale['pt-BR'];
  const generatorHref = buildLocalePath(currentLocale, '/generator');
  const templatesHref = buildLocalePath(currentLocale, '/templates');
  const blogHref = buildLocalePath(currentLocale, '/blog');
  const faqStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: content.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <div className="bg-gradient-to-b from-white via-blue-50/30 to-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
      <section className="relative px-4 pt-24 pb-16 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/60 via-purple-50/40 to-pink-50/30" />
        <div className="relative mx-auto max-w-6xl text-center">
          <Badge className="mb-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg" variant="secondary">
            {content.badge}
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            {content.title}
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg text-gray-600 sm:text-xl leading-relaxed">
            {content.subtitle}
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg" asChild>
              <Link href={generatorHref}>{content.heroCta}</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="#sumario-prompts">{content.heroSecondaryCta}</Link>
            </Button>
          </div>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
            {content.keyTakeaways.map((takeaway) => (
              <Card key={takeaway} className="border border-white/60 shadow-sm bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <p className="text-gray-700 leading-relaxed">{takeaway}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="sumario-prompts" className="px-4 pb-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            {currentLocale === 'pt-BR' ? 'Resumo rapido dos cenarios' : 'Scenario summary'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {content.sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="group rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <span className="text-xs uppercase tracking-wide text-blue-600 font-semibold">
                  {section.query}
                </span>
                <h3 className="mt-2 text-lg font-semibold text-gray-900 group-hover:text-blue-600">
                  {section.title}
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  {section.summary}
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-10">
          {content.sections.map((section) => (
            <Card key={section.id} id={section.id} className="scroll-mt-32 border border-gray-100 shadow-lg/40">
              <CardHeader className="space-y-2">
                <Badge variant="outline" className="w-fit border-blue-500 text-blue-600 bg-blue-50">
                  {section.query}
                </Badge>
                <CardTitle className="text-2xl text-gray-900">{section.title}</CardTitle>
                <CardDescription className="text-gray-600 text-base">
                  {section.summary}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    {currentLocale === 'pt-BR' ? 'Como posicionar:' : 'Positioning notes'}
                  </h4>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    {section.bulletPoints.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900">
                    {currentLocale === 'pt-BR' ? 'Exemplos de prompt:' : 'Prompt examples'}
                  </h4>
                  {section.promptExamples.map((example) => (
                    <div key={example.title} className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                      <h5 className="text-base font-semibold text-gray-900">{example.title}</h5>
                      <p className="text-sm text-gray-600 mt-1">{example.description}</p>
                      <pre className="mt-3 whitespace-pre-wrap rounded-lg bg-white p-4 text-sm text-gray-800 border border-gray-200">
                        {example.prompt}
                      </pre>
                    </div>
                  ))}
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    {currentLocale === 'pt-BR' ? 'Dicas de otimizacao:' : 'Optimization tips'}
                  </h4>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    {section.optimizationTips.map((tip) => (
                      <li key={tip}>{tip}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 lg:px-8 bg-gray-50">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            {currentLocale === 'pt-BR' ? 'Perguntas frequentes' : 'Frequently asked questions'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {content.faqs.map((faq) => (
              <Card key={faq.question} className="border border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-900">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="generator-section" className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center space-y-4">
          <p className="text-sm font-medium uppercase tracking-wider text-blue-600">
            {content.lastUpdated}
          </p>
          <h2 className="text-3xl font-bold text-gray-900">
            {currentLocale === 'pt-BR'
              ? 'Teste os prompts no gerador e salve seus favoritos'
              : 'Test the prompts inside the generator'}
          </h2>
          <p className="text-lg text-gray-600">
            {currentLocale === 'pt-BR'
              ? 'Acesse o gerador Prompt Gemini Fotos para aplicar cada cenario, salvar presets e exportar imagens prontas para o seu ensaio.'
              : 'Open the Prompt Gemini Photos generator to apply each setup, save presets, and export results fast.'}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="bg-gradient-to-r from-purple-500 to-blue-600 text-white shadow-lg hover:from-purple-600 hover:to-blue-700" asChild>
              <Link href={generatorHref}>
                {currentLocale === 'pt-BR' ? 'Abrir gerador agora' : 'Launch generator'}
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href={templatesHref}>
                {currentLocale === 'pt-BR' ? 'Explorar templates adicionais' : 'Explore more templates'}
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
