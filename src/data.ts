export const WHATSAPP_NUMBER = '5585997665652';
export const WHATSAPP_DISPLAY = '(85) 99766-5652';
export const EMAIL = 'rocksoftwaresolutions.dev@gmail.com';
export const INSTAGRAM = 'rocksoftware.dev';

export const whatsappLink = (text = 'Olá! Quero um orçamento com a Rock Software Solutions.') =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

/** Words that cycle at the end of the hero headline. */
export const audiences = ['empresa.', 'construtora.', 'locadora.', 'loja.', 'clínica.', 'indústria.'];

/** Technologies actually used in Kargo and Motuga. */
export const stack = ['React', 'TypeScript', 'Node.js', 'NestJS', 'PostgreSQL', 'Prisma', 'Tailwind CSS', 'Vite', 'PWA', 'APIs e webhooks'];

export type ServiceId = 'sistemas' | 'sites' | 'apps' | 'integracoes';

export interface Service {
  id: ServiceId;
  title: string;
  summary: string;
  points: string[];
}

export const services: Service[] = [
  {
    id: 'sistemas',
    title: 'Sistemas sob medida',
    summary: 'Gestão, financeiro, estoque e aprovações construídos em cima do jeito que a sua empresa já trabalha.',
    points: ['Painéis com os números do seu negócio', 'Acesso separado por equipe', 'Relatórios em PDF e Excel'],
  },
  {
    id: 'sites',
    title: 'Sites e landing pages',
    summary: 'Páginas rápidas e bem desenhadas, fáceis de achar no Google e feitas para virar conversa no WhatsApp.',
    points: ['Design exclusivo da sua marca', 'Carrega rápido no celular', 'Pronto para Google e redes sociais'],
  },
  {
    id: 'apps',
    title: 'Aplicativos',
    summary: 'Apps para a sua equipe em campo ou para os seus clientes, no celular e no computador.',
    points: ['Instala direto pelo navegador', 'Avisos e notificações', 'Fotos, assinatura e localização'],
  },
  {
    id: 'integracoes',
    title: 'Integrações',
    summary: 'Conectamos ERP, banco, meios de pagamento e WhatsApp para os dados andarem sozinhos.',
    points: ['ERPs como o Sienge', 'Cobrança e baixa automáticas', 'Mensagens automáticas no WhatsApp'],
  },
];

export interface Layer {
  title: string;
  text: string;
}

/** The three layers of the cube, bottom to top. */
export const layers: Layer[] = [
  {
    title: 'Planejamento',
    text: 'Entendemos o seu processo e o problema que precisa ser resolvido. Você recebe escopo, prazo e valor por escrito antes de começar.',
  },
  {
    title: 'Desenvolvimento',
    text: 'Construímos em etapas curtas. Você acompanha, testa cada parte e pede ajustes antes da entrega final.',
  },
  {
    title: 'Suporte',
    text: 'Depois do lançamento a gente continua junto: corrige, ajusta e evolui o sistema conforme a sua empresa cresce.',
  },
];

export interface Case {
  id: 'kargo' | 'motuga';
  name: string;
  accent: string;
  ambient: string;
  headline: string;
  description: string;
  features: string[];
  tags: string[];
  video: string;
  poster: string;
  /** Loop only this stretch of the video, in seconds. */
  segment?: readonly [number, number];
  /** Width / height of the footage, when it is not the device's default shape. */
  ratio?: string;
  device: 'browser' | 'phone';
  /** Public website of the product. */
  site?: { url: string; label: string };
}

export const KARGO_SITE = { url: 'https://www.kargo-web.com/', label: 'kargo-web.com' };

/** Screen recording of the real Kargo panel (from kargo-web.com). */
export const KARGO_PANEL = {
  video: '/assets/video/kargo-painel.mp4',
  ratio: '1366 / 606',
  overview: { segment: [0, 15.4] as const, poster: '/assets/video/kargo-painel-poster.jpg' },
  details: { segment: [15.6, 37.2] as const, poster: '/assets/video/kargo-painel-detalhes-poster.jpg' },
};

export const cases: Case[] = [
  {
    id: 'kargo',
    name: 'Kargo',
    accent: '#F5922F',
    ambient: '#130F0C',
    headline: 'Gestão de ativos, equipamentos e obras em um só lugar.',
    description: 'Feito para construtoras que precisam controlar veículos, máquinas, manutenção, documentação e almoxarifado sem depender de planilha.',
    features: [
      'Alertas antes de vencer: preventiva, licenciamento e estoque mínimo',
      'Integração com o Sienge, sem digitar duas vezes',
      'Relatórios em PDF e Excel na hora',
    ],
    tags: ['Construtoras', 'Web e celular', 'Integração Sienge'],
    video: KARGO_PANEL.video,
    poster: KARGO_PANEL.details.poster,
    segment: KARGO_PANEL.details.segment,
    ratio: KARGO_PANEL.ratio,
    device: 'browser',
    site: KARGO_SITE,
  },
  {
    id: 'motuga',
    name: 'Motuga',
    accent: '#E5333B',
    ambient: '#150B0E',
    headline: 'Gestão completa para locadoras de moto.',
    description: 'Contratos, motos, vistorias e cobrança em um só sistema, que funciona no computador e como app no celular.',
    features: [
      'Cobrança automática pelo WhatsApp, com Pix',
      'Integração com a Asaas e o Mercado Pago',
      'Contrato assinado pelo celular e vistoria com fotos',
    ],
    tags: ['Locadoras de moto', 'App no celular', 'Asaas e Mercado Pago'],
    video: '/assets/video/motuga.mp4',
    poster: '/assets/video/motuga-poster.jpg',
    device: 'phone',
  },
];

export const needs = ['Sistema', 'Site', 'Aplicativo', 'Integração', 'Ainda não sei'];

export type SectorId = 'construtora' | 'locadora' | 'loja' | 'clinica' | 'industria';

export interface Sector {
  id: SectorId;
  name: string;
  accent: string;
  pain: string;
  solution: string;
  tag: string;
}

/** Kinds of business we build for. The first two are live projects; the rest are examples of what fits. */
export const sectors: Sector[] = [
  {
    id: 'construtora',
    name: 'Construtoras',
    accent: '#F5922F',
    pain: 'Máquina parada, preventiva esquecida e estoque de obra controlado na planilha.',
    solution: 'Gestão de ativos, manutenção e almoxarifado em um painel só, com alerta antes do problema.',
    tag: 'Em produção: Kargo',
  },
  {
    id: 'locadora',
    name: 'Locadoras',
    accent: '#E5333B',
    pain: 'Contrato em papel, cobrança feita no braço e vistoria sem registro.',
    solution: 'Contrato assinado no celular, vistoria com fotos e cobrança automática por Pix.',
    tag: 'Em produção: Motuga',
  },
  {
    id: 'loja',
    name: 'Lojas',
    accent: '#2FB37A',
    pain: 'Pedidos espalhados no WhatsApp e um estoque que nunca bate.',
    solution: 'Pedidos, estoque e avisos ao cliente conectados, do balcão à entrega.',
    tag: 'Exemplo de projeto',
  },
  {
    id: 'clinica',
    name: 'Clínicas',
    accent: '#38B6E8',
    pain: 'Agenda cheia de faltas e confirmações feitas uma por uma.',
    solution: 'Agenda online com confirmação automática no WhatsApp e histórico de cada paciente.',
    tag: 'Exemplo de projeto',
  },
  {
    id: 'industria',
    name: 'Indústrias',
    accent: '#A98BF5',
    pain: 'Produção sem visibilidade e ordens de serviço que andam no papel.',
    solution: 'Ordens de produção, apontamento pelo celular e indicadores atualizados na hora.',
    tag: 'Exemplo de projeto',
  },
];

export type ModuleId = 'painel' | 'financeiro' | 'estoque' | 'agenda' | 'whatsapp' | 'pix' | 'app' | 'relatorios';

/** Building blocks for the "Monte o seu sistema" configurator. */
export const modules: { id: ModuleId; label: string }[] = [
  { id: 'painel', label: 'Painel de indicadores' },
  { id: 'financeiro', label: 'Financeiro' },
  { id: 'estoque', label: 'Estoque' },
  { id: 'agenda', label: 'Agenda' },
  { id: 'whatsapp', label: 'Avisos no WhatsApp' },
  { id: 'pix', label: 'Cobrança por Pix' },
  { id: 'app', label: 'App para a equipe' },
  { id: 'relatorios', label: 'Relatórios PDF e Excel' },
];

export interface Teaser {
  code: 'aprovacoes' | 'suprimentos' | 'automacao';
  /** Public name. Empty means the project stays locked. */
  name: string | null;
  /** How far along the team is, 0–100. */
  progress: number;
  /** A line that stays out of focus behind the lock. */
  hint: string;
  /** Short words that tease, without saying what the product does. */
  clues?: string[];
  /** What shows on hover: a phone, a desktop window (both with demo data) or a rough sketch. */
  peek: { kind: 'phone' | 'desktop'; src: string; alt: string } | { kind: 'sketch' };
}

/** What the team is producing. None is named yet. */
export const teasers: Teaser[] = [
  {
    code: 'aprovacoes',
    name: null,
    progress: 85,
    hint: 'O que ele faz de fato, a equipe ainda segura.',
    clues: ['No celular', 'No Sienge', 'Sem o computador'],
    peek: { kind: 'phone', src: '/previews/aprovetech.jpg', alt: 'Tela do app de aprovações no celular, com dados fictícios' },
  },
  {
    code: 'suprimentos',
    name: null,
    progress: 70,
    hint: 'Ainda não dá para abrir este aqui.',
    peek: { kind: 'desktop', src: '/previews/painel.jpg', alt: 'Painel de compras e fornecedores no computador, com dados fictícios' },
  },
  {
    code: 'automacao',
    name: null,
    progress: 50,
    hint: 'Este a equipe ainda não solta.',
    peek: { kind: 'sketch' },
  },
];
