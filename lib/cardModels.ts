/**
 * Card Models and Layout Definitions
 */

export type ModelId =
  | 'classic_card'
  | 'social_card'
  | 'dark_green_id'
  | 'gold_premium'
  | 'table_tent'
  | 'services_card';

export interface CardModelDefinition {
  id: ModelId;
  name: string;
  tagline: string;
  maxQRs: number;
  qrLocation: 'back_only' | 'front_only' | 'center_only' | 'choice';
  dimensionsMm: { width: number; height: number };
  aspectRatio: string;
  description: string;
  features: string[];
}

export const CARD_MODELS: CardModelDefinition[] = [
  {
    id: 'classic_card',
    name: 'Cartão de Visita Clássico',
    tagline: '90×50 mm • Até 3 QR Codes no Verso',
    maxQRs: 3,
    qrLocation: 'back_only',
    dimensionsMm: { width: 90, height: 50 },
    aspectRatio: '90 / 50',
    description: 'Frente limpa e sofisticada para marca, nome e contactos. Verso dinâmico com até 3 QR codes em linha.',
    features: ['Até 3 QR no verso', 'Frente 100% livre', 'Layout dinâmico 1-3 códigos'],
  },
  {
    id: 'social_card',
    name: 'Cartão para Redes Sociais',
    tagline: '90×50 mm • Até 3 Redes Sociais no Verso',
    maxQRs: 3,
    qrLocation: 'back_only',
    dimensionsMm: { width: 90, height: 50 },
    aspectRatio: '90 / 50',
    description: 'Ideal para criadores, influencers e marcas com múltiplos perfis sociais (Instagram, WhatsApp, X, Facebook).',
    features: ['Ícones oficiais fixos', 'Até 3 QR no verso', 'Destaque para @handle'],
  },
  {
    id: 'dark_green_id',
    name: 'Cartão ID Escuro / Verde',
    tagline: 'Estilo Crachá Tech WhatsApp • 1 QR na Frente',
    maxQRs: 1,
    qrLocation: 'front_only',
    dimensionsMm: { width: 90, height: 54 },
    aspectRatio: '90 / 54',
    description: 'Estética cyber neon com circuitos luminosos, moldura de foto do titular, ID numérico e QR code frontal.',
    features: ['1 QR na Frente', 'Foto / Avatar tech', 'Efeito neon esmeralda'],
  },
  {
    id: 'gold_premium',
    name: 'Preto e Dourado Premium',
    tagline: 'Estilo Luxury • 1 QR (Frente ou Verso)',
    maxQRs: 1,
    qrLocation: 'choice',
    dimensionsMm: { width: 90, height: 50 },
    aspectRatio: '90 / 50',
    description: 'Paleta navy/preto profundo e gradiente dourado, monograma de luxo e tipografia serifada de alto padrão.',
    features: ['1 QR à escolha (Frente ou Verso)', 'Monograma dourado', 'Acabamento premium'],
  },
  {
    id: 'table_tent',
    name: 'Placa de Mesa Vertical',
    tagline: 'Display de Balcão • 1 QR na Zona Central',
    maxQRs: 1,
    qrLocation: 'center_only',
    dimensionsMm: { width: 105, height: 148 },
    aspectRatio: '105 / 148',
    description: 'Formato vertical ideal para mesas de restaurantes, balcões de recepção e eventos. QR code de alto impacto no centro.',
    features: ['1 QR Central gigante', 'Leitura rápida a distância', 'Display vertical'],
  },
  {
    id: 'services_card',
    name: 'Cartão de Serviços',
    tagline: 'Clínica & Especialidades • 1 QR (Frente ou Verso)',
    maxQRs: 1,
    qrLocation: 'choice',
    dimensionsMm: { width: 90, height: 50 },
    aspectRatio: '90 / 50',
    description: 'Inspirado em cartões de estética e medicina com lista de serviços detalhada, linha divisória elegante e QR code.',
    features: ['Lista de serviços com bullets', 'Divisão em 2 colunas', 'QR na Frente ou Verso'],
  },
];

export interface QRCodeItem {
  id: string;
  type: 'whatsapp' | 'instagram' | 'facebook' | 'x' | 'url' | 'vcard' | 'tel' | 'email' | 'text' | 'wifi';
  label: string;
  value: string; // URL, phone, handle, etc.
  customLogoUrl?: string; // Optional for non-social types
}

export interface CardFormData {
  modelId: ModelId;
  qrPosition: 'front' | 'back'; // Only relevant when model has 'choice'
  
  // Titular / Marca
  name: string;
  title: string;
  company: string;
  subtitle: string;
  handle: string; // e.g. @dr.davidmontoya
  idNumber: string; // e.g. 98/b-2079
  
  // Contactos
  phone: string;
  whatsappPhone: string;
  email: string;
  website: string;
  address: string;
  
  // Serviços (para Cartão de Serviços)
  servicesList: string[];
  
  // Mídia / Logos
  logoUrl?: string;
  photoUrl?: string;
  monogram: string; // e.g. "DM", "JS", "LD"
  
  // Cores
  wifiSsid?: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  textColor: string;
  
  // Lista de QR Codes (1 a 3)
  qrItems: QRCodeItem[];
}

export const INITIAL_MODEL_DATA: Record<ModelId, CardFormData> = {
  classic_card: {
    modelId: 'classic_card',
    qrPosition: 'back',
    name: 'Dr. David Montoya',
    title: 'Cirurgião Plástico',
    company: 'Torre Empresarial Capitalia',
    subtitle: 'Medicina e Cirurgia Especializada',
    handle: '@dr.davidmontoya',
    idNumber: '',
    phone: '+351 91 234 5678',
    whatsappPhone: '351912345678',
    email: 'contacto@davidmontoya.com',
    website: 'https://davidmontoya.com',
    address: 'Av. Liberdade, 120, Lisboa',
    servicesList: [],
    monogram: 'DM',
    primaryColor: '#182B49',
    secondaryColor: '#FFFFFF',
    accentColor: '#D4AF37',
    textColor: '#182B49',
    qrItems: [
      {
        id: 'qr-1',
        type: 'whatsapp',
        label: 'WhatsApp',
        value: '351912345678',
      },
    ],
  },
  social_card: {
    modelId: 'social_card',
    qrPosition: 'back',
    name: 'Alexandre Silva',
    title: 'Criador de Conteúdo & Design',
    company: 'Studio Digital',
    subtitle: 'Conecte-se comigo nas redes sociais',
    handle: '@alexandredesign',
    idNumber: '',
    phone: '+351 92 123 4567',
    whatsappPhone: '351921234567',
    email: 'alexandre@design.pt',
    website: 'https://alexandredesign.me',
    address: 'Porto, Portugal',
    servicesList: [],
    monogram: 'AS',
    primaryColor: '#0F172A',
    secondaryColor: '#1E293B',
    accentColor: '#E1306C',
    textColor: '#FFFFFF',
    qrItems: [
      {
        id: 'qr-1',
        type: 'instagram',
        label: 'Instagram',
        value: 'alexandredesign',
      },
      {
        id: 'qr-2',
        type: 'whatsapp',
        label: 'WhatsApp',
        value: '351921234567',
      },
    ],
  },
  dark_green_id: {
    modelId: 'dark_green_id',
    qrPosition: 'front',
    name: 'Makhdoom Nouman',
    title: 'Security Verified Member',
    company: 'WHATSAPP OFFICIAL IDENTITY',
    subtitle: 'Authorized Personnel',
    handle: '@makhdoom',
    idNumber: '98/B-2079',
    phone: '+351 93 456 7890',
    whatsappPhone: '351934567890',
    email: 'makhdoom@secure.com',
    website: 'https://wa.me/351934567890',
    address: 'Global Hub',
    servicesList: [],
    monogram: 'MN',
    primaryColor: '#060B0E',
    secondaryColor: '#00E676',
    accentColor: '#00E676',
    textColor: '#FFFFFF',
    qrItems: [
      {
        id: 'qr-1',
        type: 'whatsapp',
        label: 'WhatsApp ID',
        value: '351934567890',
      },
    ],
  },
  gold_premium: {
    modelId: 'gold_premium',
    qrPosition: 'back',
    name: 'Laurenzo Donatelli',
    title: 'Executive Wealth Advisor',
    company: 'Private Consulting Group',
    subtitle: 'Serviços Financeiros Exclusivos',
    handle: '@donatelli.vip',
    idNumber: '',
    phone: '+351 91 999 8888',
    whatsappPhone: '351919998888',
    email: 'laurenzo@donatellivip.com',
    website: 'https://donatelli.vip',
    address: 'Avenida da Liberdade, Lisboa',
    servicesList: [],
    monogram: 'LD',
    primaryColor: '#0B1220',
    secondaryColor: '#D4AF37',
    accentColor: '#D4AF37',
    textColor: '#FAF6EE',
    qrItems: [
      {
        id: 'qr-1',
        type: 'url',
        label: 'Acesso VIP',
        value: 'https://donatelli.vip',
      },
    ],
  },
  table_tent: {
    modelId: 'table_tent',
    qrPosition: 'front',
    name: 'Bistro & Lounge Gourmet',
    title: 'Menu Digital & Wi-Fi',
    company: 'BISTRO & LOUNGE GOURMET',
    subtitle: 'Aponte a câmara do seu telemóvel para aceder',
    handle: '@bistrogourmet',
    idNumber: '',
    phone: '+351 21 555 1234',
    whatsappPhone: '351915551234',
    email: 'contacto@bistrogourmet.pt',
    website: 'https://bistrogourmet.pt/menu',
    address: 'Chiado, Lisboa',
    wifiSsid: 'Bistro_Gourmet_Guest',
    servicesList: [],
    monogram: 'BG',
    primaryColor: '#182B49',
    secondaryColor: '#FFFFFF',
    accentColor: '#F59E0B',
    textColor: '#0F172A',
    qrItems: [
      {
        id: 'qr-1',
        type: 'wifi',
        label: 'Wi-Fi & Cardápio',
        value: 'WIFI:T:WPA;S:Bistro_Gourmet_Guest;P:bistro2026;;',
      },
    ],
  },
  services_card: {
    modelId: 'services_card',
    qrPosition: 'back',
    name: 'Júlia Strepchenkova',
    title: 'Estética e Cosmetologia',
    company: 'Clínica de Estética Avançada',
    subtitle: 'Procedimentos faciais e corporais de alta precisão',
    handle: 'julia.st__cosm65',
    idNumber: '',
    phone: '+351 96 089 7222',
    whatsappPhone: '351960897222',
    email: 'julia.strep@estetica.pt',
    website: 'https://instagram.com/julia.st__cosm65',
    address: 'Clínica Bella Vita, Sala 402',
    servicesList: [
      'Contorno e preenchimento labial',
      'Mesoterapia e bio-revitalização facial',
      'Lipoescultura e drenagem enzimática',
      'Harmonização e toxina botulínica',
    ],
    monogram: 'JS',
    primaryColor: '#1A4959',
    secondaryColor: '#FAF8F3',
    accentColor: '#D4AF37',
    textColor: '#1F2937',
    qrItems: [
      {
        id: 'qr-1',
        type: 'instagram',
        label: 'Instagram',
        value: 'julia.st__cosm65',
      },
    ],
  },
};

