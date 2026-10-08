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

export type QRType = 'url' | 'vcard' | 'tel' | 'email' | 'whatsapp' | 'wifi' | 'text';

/**
 * Normaliza e constrói a URL
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
 * Constrói payload de Email com assunto e corpo opcionais
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
 * Constrói payload de WhatsApp (link wa.me)
 */
export function buildWhatsAppPayload(data: WhatsAppData): string {
  let phone = data.phone.trim().replace(/[^0-9]/g, '');
  if (!phone) return '';

  const url = new URL(`https://wa.me/${phone}`);
  if (data.message && data.message.trim()) {
    url.searchParams.set('text', data.message.trim());
  }
  return url.toString();
}

/**
 * Constrói payload de Wi-Fi no padrão universal (WIFI:T:WPA;S:nome;P:senha;;)
 */
export function buildWifiPayload(data: WifiData): string {
  const ssid = (data.ssid || '').trim();
  if (!ssid) return '';

  const enc = data.encryption || 'WPA';
  const pass = (data.password || '').trim();
  const hidden = data.hidden ? 'true' : 'false';

  // Escapar caracteres especiais no SSID e senha conforme especificação MECARD/WIFI (\, ;, :, ")
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
