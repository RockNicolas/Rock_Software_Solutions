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
    summary: 'Sistemas de gestão, financeiro, estoque e aprovações desenvolvidos a partir dos processos da sua empresa.',
    points: ['Dashboards com os indicadores do seu negócio', 'Controle de acesso por perfil e equipe', 'Relatórios em PDF e Excel'],
  },
  {
    id: 'sites',
    title: 'Sites e landing pages',
    summary: 'Páginas de alto desempenho, otimizadas para SEO e voltadas à conversão de visitas em contatos no WhatsApp.',
    points: ['Design exclusivo da sua marca', 'Carregamento rápido em dispositivos móveis', 'SEO e compartilhamento em redes sociais'],
  },
  {
    id: 'apps',
    title: 'Aplicativos',
    summary: 'Aplicativos para a sua equipe em campo ou para os seus clientes, em celular e computador.',
    points: ['Instalação direta pelo navegador (PWA)', 'Notificações push', 'Captura de fotos, assinatura digital e geolocalização'],
  },
  {
    id: 'integracoes',
    title: 'Integrações',
    summary: 'Integramos ERP, bancos, meios de pagamento e WhatsApp para que os dados fluam sem retrabalho.',
    points: ['Integração com ERPs, como o Sienge', 'Cobrança e baixa automática de títulos', 'Mensagens automáticas via API do WhatsApp'],
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
    text: 'Levantamos os requisitos e mapeamos o seu processo. Você recebe escopo, cronograma e valor por escrito antes do início do desenvolvimento.',
  },
  {
    title: 'Desenvolvimento',
    text: 'Desenvolvemos em ciclos curtos. Você acompanha, valida cada entrega e solicita ajustes antes da versão final.',
  },
  {
    title: 'Suporte',
    text: 'Após o lançamento, seguimos ao seu lado: corrigimos, ajustamos e evoluímos o sistema conforme a sua empresa cresce.',
  },
];

export interface Case {
  id: 'kargo' | 'motuga' | 'vettori' | 'aprovetech';
  name: string;
  accent: string;
  ambient: string;
  headline: string;
  description: string;
  features: string[];
  tags: string[];
  /** Screen recording of the product. Cases without one show `image` instead. */
  video?: string;
  poster?: string;
  /** Still screen (demo data) used when there is no recording. */
  image?: string;
  /** Name with its article for sentences like "o site {of}". Defaults to "do {name}". */
  of?: string;
  /** Alt text for `image` when it shows a real site instead of demo data. */
  imageAlt?: string;
  /** Shown in place of "No ar em ..." when the product has no public site yet. */
  status?: string;
  /** Loop only this stretch of the video, in seconds. */
  segment?: readonly [number, number];
  /** Width / height of the footage, when it is not the device's default shape. */
  ratio?: string;
  device: 'browser' | 'phone';
  /** Public website of the product. */
  site?: { url: string; label: string };
}

export const KARGO_SITE = { url: 'https://www.kargo-web.com/', label: 'kargo-web.com' };
export const VETTORI_SITE = { url: 'https://clinicavettori.com.br/', label: 'clinicavettori.com.br' };

/** Screen recording of the real Kargo panel (from kargo-web.com). */
export const KARGO_PANEL = {
  video: '/assets/video/kargo-painel.mp4',
  ratio: '1366 / 606',
  /** Pre-blurred still that lights the background of the statement scene (a live blurred video was too heavy). */
  ambient: '/assets/video/kargo-painel-ambient.jpg',
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
    description: 'Feito para construtoras que precisam controlar veículos, máquinas, manutenção, documentação e almoxarifado sem depender de planilhas.',
    features: [
      'Alertas de vencimento: manutenção preventiva, licenciamento e estoque mínimo',
      'Integração com o Sienge, sem retrabalho de digitação',
      'Relatórios em PDF e Excel sob demanda',
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
    description: 'Contratos, motos, vistorias e cobrança em um único sistema, acessível pelo computador e instalável como aplicativo (PWA) no celular.',
    features: [
      'Cobrança automática via WhatsApp, com Pix',
      'Integração com Asaas e Mercado Pago',
      'Assinatura digital de contrato pelo celular e vistoria com registro fotográfico',
    ],
    tags: ['Locadoras de moto', 'App no celular', 'Asaas e Mercado Pago'],
    video: '/assets/video/motuga.mp4',
    poster: '/assets/video/motuga-poster.jpg',
    device: 'phone',
  },
  {
    id: 'vettori',
    name: 'Clínica Vettori',
    of: 'da Clínica Vettori',
    accent: '#FF8FB4',
    ambient: '#150A10',
    headline: 'Landing page de uma clínica multiprofissional, feita para o paciente agendar.',
    description: 'A Vettori Saúde Integral, em Paraguaçu (MG), reúne médicos, dentista, nutrição e saúde mental. A página apresenta cada especialidade e deixa o contato a um toque.',
    features: [
      'Perfil de cada profissional, em um carrossel fácil de navegar',
      'Depoimentos de pacientes e perguntas frequentes para tirar dúvidas antes da consulta',
      'Botão de WhatsApp e de agendamento sempre à mão, no celular e no computador',
    ],
    tags: ['Clínicas', 'Landing page', 'Pronto para celular'],
    image: '/assets/vettori-site.jpg',
    imageAlt: 'Página inicial do site da Clínica Vettori no computador',
    site: VETTORI_SITE,
    device: 'browser',
  },
  {
    id: 'aprovetech',
    name: 'AproveTech',
    accent: '#FF7A3D',
    ambient: '#141012',
    headline: 'Aprovações de sistemas ERP no celular, em poucos toques.',
    description: 'Pedidos de compra, solicitações e mapas de cotação chegam ao aprovador com valor, obra e motivo da pendência, sem abrir o computador.',
    features: [
      'Aprovar ou reprovar pelo celular, com motivo obrigatório na reprovação',
      'Aviso quando o documento muda no Sienge, antes de você decidir',
      'Aprovação em lote, filtros por obra, tipo e urgência, e histórico das decisões',
    ],
    tags: ['Construtoras', 'App no celular', 'Integração Sienge'],
    image: '/assets/aprovetech-lista.jpg',
    status: 'Reta final de desenvolvimento',
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

/** Kinds of business we build for. The first two are live systems, Clínicas has a live site; the rest are examples of what fits. */
export const sectors: Sector[] = [
  {
    id: 'construtora',
    name: 'Construtoras',
    accent: '#F5922F',
    pain: 'Equipamentos parados, manutenção preventiva negligenciada e estoque de obra controlado em planilhas.',
    solution: 'Gestão de ativos, manutenção e almoxarifado em um único painel, com alertas preventivos.',
    tag: 'Em produção: Kargo',
  },
  {
    id: 'locadora',
    name: 'Locadoras',
    accent: '#E5333B',
    pain: 'Contratos em papel, cobrança manual e vistorias sem registro.',
    solution: 'Assinatura digital no celular, vistoria com registro fotográfico e cobrança automática por Pix.',
    tag: 'Em produção: Motuga',
  },
  {
    id: 'loja',
    name: 'Lojas',
    accent: '#2FB37A',
    pain: 'Pedidos dispersos no WhatsApp e estoque que não confere com o físico.',
    solution: 'Pedidos, estoque e notificações ao cliente integrados, do balcão à entrega.',
    tag: 'Exemplo de projeto',
  },
  {
    id: 'clinica',
    name: 'Clínicas',
    accent: '#38B6E8',
    pain: 'Agenda com alto índice de faltas e confirmações feitas manualmente.',
    solution: 'Agendamento online, confirmação automática via WhatsApp e histórico por paciente.',
    tag: 'No ar: Clínica Vettori',
  },
  {
    id: 'industria',
    name: 'Indústrias',
    accent: '#A98BF5',
    pain: 'Produção sem visibilidade e ordens de serviço controladas em papel.',
    solution: 'Ordens de produção, apontamento pelo celular e indicadores atualizados em tempo real.',
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
  { id: 'whatsapp', label: 'Notificações no WhatsApp' },
  { id: 'pix', label: 'Cobrança por Pix' },
  { id: 'app', label: 'Aplicativo para a equipe' },
  { id: 'relatorios', label: 'Relatórios em PDF e Excel' },
];

export interface Teaser {
  code: 'suprimentos' | 'automacao';
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
    hint: 'Este a equipe ainda não divulga.',
    peek: { kind: 'sketch' },
  },
];
