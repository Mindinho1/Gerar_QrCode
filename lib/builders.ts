export interface VCardData {
  firstName: string;
  lastName?: string;
  organization?: string;
  jobTitle?: string;
  phone?: string;
  email?: string;
  website?: string;
  address?: string;
  notes?: string;
}

export interface WifiData {
  ssid: string;
  password?: string;
  encryption: 'WPA' | 'WEP' | 'nopass';
  hidden?: boolean;
}

export interface EmailData {
  to: string;
  subject?: string;
  body?: string;
}

export interface WhatsAppData {
  phone: string;
  message?: string;
}

export type QRType =
  | 'whatsapp'
  | 'instagram'
  | 'facebook'
  | 'x'
  | 'url'
  | 'vcard'
  | 'tel'
  | 'email'
  | 'text'
  | 'wifi';

/**
 * Normaliza e constrói a URL genérica
 */
export function buildUrlPayload(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return '';
  if (!/^https?:\/\//i.test(trimmed)) {
    return `https://${trimmed}`;
  }
  return trimmed;
}

/**
 * Normaliza link oficial de Instagram (evita URLs longas para manter o QR limpo)
 */
export function buildInstagramPayload(input: string): string {
  const clean = input.trim().replace(/^@/, '');
  if (!clean) return '';
  if (/^https?:\/\/(www\.)?instagram\.com\//i.test(clean)) {
    return clean;
  }
  return `https://instagram.com/${clean}`;
}

/**
 * Normaliza link oficial de WhatsApp (wa.me)
 */
export function buildWhatsAppPayload(data: WhatsAppData | string): string {
  if (typeof data === 'string') {
    let clean = data.trim().replace(/[^0-9]/g, '');
    if (!clean) return '';
    return `https://wa.me/${clean}`;
  }

  let phone = data.phone.trim().replace(/[^0-9]/g, '');
  if (!phone) return '';

  const url = new URL(`https://wa.me/${phone}`);
  if (data.message && data.message.trim()) {
    url.searchParams.set('text', data.message.trim());
  }
  return url.toString();
}

/**
 * Normaliza link oficial de Facebook
 */
export function buildFacebookPayload(input: string): string {
  const clean = input.trim();
  if (!clean) return '';
  if (/^https?:\/\/(www\.)?facebook\.com\//i.test(clean) || /^https?:\/\/fb\.me\//i.test(clean)) {
    return clean;
  }
  return `https://facebook.com/${clean.replace(/^@/, '')}`;
}

/**
 * Normaliza link oficial do X (Twitter)
 */
export function buildXPayload(input: string): string {
  const clean = input.trim().replace(/^@/, '');
  if (!clean) return '';
  if (/^https?:\/\/(www\.)?(x|twitter)\.com\//i.test(clean)) {
    return clean;
  }
  return `https://x.com/${clean}`;
}

/**
 * Constrói payload de Cartão de Contacto (vCard 3.0)
 */
export function buildVCardPayload(data: VCardData): string {
  if (!data.firstName && !data.phone && !data.email) return '';

  const lines: string[] = ['BEGIN:VCARD', 'VERSION:3.0'];

  const fullName = [data.firstName, data.lastName].filter(Boolean).join(' ').trim();
  lines.push(`FN:${fullName || 'Contacto'}`);
  lines.push(`N:${data.lastName || ''};${data.firstName || ''};;;`);

  if (data.organization) lines.push(`ORG:${data.organization}`);
  if (data.jobTitle) lines.push(`TITLE:${data.jobTitle}`);
  if (data.phone) lines.push(`TEL;TYPE=CELL,VOICE:${data.phone.trim()}`);
  if (data.email) lines.push(`EMAIL;TYPE=INTERNET,PREF:${data.email.trim()}`);
  if (data.website) lines.push(`URL:${buildUrlPayload(data.website)}`);
  if (data.address) lines.push(`ADR;TYPE=WORK,POSTAL:;;${data.address};;;;`);
  if (data.notes) lines.push(`NOTE:${data.notes.replace(/\n/g, '\\n')}`);

  lines.push('END:VCARD');
  return lines.join('\n');
}

/**
 * Constrói payload de Telefone
 */
export function buildTelPayload(phone: string): string {
  const cleanPhone = phone.trim().replace(/\s+/g, '');
  if (!cleanPhone) return '';
  return cleanPhone.startsWith('tel:') ? cleanPhone : `tel:${cleanPhone}`;
}

/**
 * Constrói payload de Email
 */
export function buildEmailPayload(data: EmailData): string {
  const to = data.to.trim();
  if (!to) return '';

  const params = new URLSearchParams();
  if (data.subject) params.append('subject', data.subject);
  if (data.body) params.append('body', data.body);

  const query = params.toString();
  return `mailto:${to}${query ? `?${query}` : ''}`;
}

/**
 * Constrói payload de Wi-Fi
 */
export function buildWifiPayload(data: WifiData): string {
  const ssid = (data.ssid || '').trim();
  if (!ssid) return '';

  const enc = data.encryption || 'WPA';
  const pass = (data.password || '').trim();
  const hidden = data.hidden ? 'true' : 'false';

  const escapeWifi = (str: string) => str.replace(/([\\;,:"])/g, '\\$1');

  if (enc === 'nopass') {
    return `WIFI:T:nopass;S:${escapeWifi(ssid)};H:${hidden};;`;
  }

  return `WIFI:T:${enc};S:${escapeWifi(ssid)};P:${escapeWifi(pass)};H:${hidden};;`;
}

/**
 * Constrói payload de Texto Simples
 */
export function buildTextPayload(text: string): string {
  return text.trim();
}

/**
 * Construtor universal para qualquer item de QR code
 */
export function buildPayloadForQRItem(type: QRType, value: string): string {
  switch (type) {
    case 'whatsapp':
      return buildWhatsAppPayload(value);
    case 'instagram':
      return buildInstagramPayload(value);
    case 'facebook':
      return buildFacebookPayload(value);
    case 'x':
      return buildXPayload(value);
    case 'url':
      return buildUrlPayload(value);
    case 'tel':
      return buildTelPayload(value);
    case 'email':
      return buildEmailPayload({ to: value });
    case 'text':
      return buildTextPayload(value);
    default:
      return value.trim();
  }
}
