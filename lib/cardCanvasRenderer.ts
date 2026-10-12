import { CardFormData, CARD_MODELS, QRCodeItem } from './cardModels';
import { renderQRToCanvas } from './qrRenderer';
import { BRAND_SVGS } from './brandIcons';

export interface RenderCanvasOptions {
  is300DPI?: boolean;
  includeBleed?: boolean;
  bleedMm?: number;
}

/**
 * Helper to wrap text into multiple lines
 */
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = words[0] || '';

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const width = ctx.measureText(currentLine + ' ' + word).width;
    if (width < maxWidth) {
      currentLine += ' ' + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}

/**
 * Draws rounded rectangle
 */
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  ctx.lineTo(x + radius, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

/**
 * Renders Front face of the card
 */
export async function renderFrontFace(
  canvas: HTMLCanvasElement,
  data: CardFormData,
  options: RenderCanvasOptions = {}
): Promise<void> {
  const model = CARD_MODELS.find((m) => m.id === data.modelId) || CARD_MODELS[0];
  const bleedMm = options.includeBleed ? (options.bleedMm || 3) : 0;

  const wMm = model.dimensionsMm.width + bleedMm * 2;
  const hMm = model.dimensionsMm.height + bleedMm * 2;

  // Scale: 300 DPI = ~11.811 px per mm, preview = ~6 px per mm
  const scale = options.is300DPI ? 300 / 25.4 : 6.0;
  const W = Math.round(wMm * scale);
  const H = Math.round(hMm * scale);

  canvas.width = W;
  canvas.height = H;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const bleedPx = Math.round(bleedMm * scale);

  ctx.save();

  switch (data.modelId) {
    case 'dark_green_id':
      await drawDarkGreenIdFront(ctx, W, H, bleedPx, data, scale);
      break;

    case 'gold_premium':
      await drawGoldPremiumFront(ctx, W, H, bleedPx, data, scale);
      break;

    case 'services_card':
      await drawServicesCardFront(ctx, W, H, bleedPx, data, scale);
      break;

    case 'table_tent':
      await drawTableTentFront(ctx, W, H, bleedPx, data, scale);
      break;

    case 'social_card':
      await drawSocialCardFront(ctx, W, H, bleedPx, data, scale);
      break;

    case 'classic_card':
    default:
      await drawClassicCardFront(ctx, W, H, bleedPx, data, scale);
      break;
  }

  // Draw bleed guide if enabled in preview
  if (options.includeBleed && !options.is300DPI) {
    drawBleedGuides(ctx, W, H, bleedPx);
  }

  ctx.restore();
}

/**
 * Renders Back face of the card
 */
export async function renderBackFace(
  canvas: HTMLCanvasElement,
  data: CardFormData,
  options: RenderCanvasOptions = {}
): Promise<void> {
  const model = CARD_MODELS.find((m) => m.id === data.modelId) || CARD_MODELS[0];
  const bleedMm = options.includeBleed ? (options.bleedMm || 3) : 0;

  const wMm = model.dimensionsMm.width + bleedMm * 2;
  const hMm = model.dimensionsMm.height + bleedMm * 2;

  const scale = options.is300DPI ? 300 / 25.4 : 6.0;
  const W = Math.round(wMm * scale);
  const H = Math.round(hMm * scale);

  canvas.width = W;
  canvas.height = H;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const bleedPx = Math.round(bleedMm * scale);

  ctx.save();

  switch (data.modelId) {
    case 'dark_green_id':
      await drawDarkGreenIdBack(ctx, W, H, bleedPx, data, scale);
      break;

    case 'gold_premium':
      await drawGoldPremiumBack(ctx, W, H, bleedPx, data, scale);
      break;

    case 'services_card':
      await drawServicesCardBack(ctx, W, H, bleedPx, data, scale);
      break;

    case 'table_tent':
      await drawTableTentBack(ctx, W, H, bleedPx, data, scale);
      break;

    case 'social_card':
      await drawSocialCardBack(ctx, W, H, bleedPx, data, scale);
      break;

    case 'classic_card':
    default:
      await drawClassicCardBack(ctx, W, H, bleedPx, data, scale);
      break;
  }

  if (options.includeBleed && !options.is300DPI) {
    drawBleedGuides(ctx, W, H, bleedPx);
  }

  ctx.restore();
}

/* =========================================================================
   MODEL 1: CARTÃO DE VISITA CLÁSSICO (90×50 mm)
   ========================================================================= */

async function drawClassicCardFront(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  bleed: number,
  data: CardFormData,
  scale: number
) {
  // Navy background inspired by Dr. David Montoya (Image 1)
  const bg = data.primaryColor || '#182B49';
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Subtle texture/gradient
  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, 'rgba(255,255,255,0.06)');
  grad.addColorStop(1, 'rgba(0,0,0,0.18)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  const cx = W / 2;
  const cy = H / 2;

  // Monogram / Logo
  const mono = data.monogram || 'DM';
  const logoSize = Math.round(44 * scale);

  // Outer delicate circle
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = Math.max(1.5, scale * 0.4);
  ctx.beginPath();
  ctx.arc(cx, cy - 22 * scale, logoSize / 2, 0, Math.PI * 2);
  ctx.stroke();

  // Monogram letters
  ctx.fillStyle = '#FFFFFF';
  ctx.font = `600 ${Math.round(20 * scale)}px "Plus Jakarta Sans", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(mono, cx, cy - 21 * scale);

  // Name
  ctx.font = `700 ${Math.round(15 * scale)}px "Plus Jakarta Sans", sans-serif`;
  ctx.letterSpacing = '1px';
  ctx.fillText(data.name.toUpperCase() || 'DR. DAVID MONTOYA', cx, cy + 18 * scale);

  // Subtitle / Title
  ctx.font = `400 ${Math.round(8.5 * scale)}px "Plus Jakarta Sans", sans-serif`;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.78)';
  ctx.fillText((data.title || 'CIRUJANO PLASTICO').toUpperCase(), cx, cy + 30 * scale);
}

async function drawClassicCardBack(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  bleed: number,
  data: CardFormData,
  scale: number
) {
  // Off-white / light paper background (Image 1)
  ctx.fillStyle = '#F8F9FA';
  ctx.fillRect(0, 0, W, H);

  // Navy geometric accent block at bottom right
  ctx.fillStyle = data.primaryColor || '#182B49';
  ctx.beginPath();
  ctx.moveTo(W * 0.45, H);
  ctx.lineTo(W, H);
  ctx.lineTo(W, H - 24 * scale);
  ctx.closePath();
  ctx.fill();

  const qrs = data.qrItems.slice(0, 3);
  const numQrs = qrs.length || 1;

  if (numQrs === 1) {
    // 1 QR Layout: Left QR Code, Right Contact info (Exactly like Dr. David Montoya Image 1)
    const qrSize = Math.round(32 * scale);
    const qrX = bleed + 12 * scale;
    const qrY = (H - qrSize) / 2;

    const qrCanvas = document.createElement('canvas');
    await renderQRToCanvas(qrCanvas, qrs[0], {
      sizePx: qrSize,
      fgColor: data.primaryColor || '#182B49',
      bgColor: '#FFFFFF',
    });
    ctx.drawImage(qrCanvas, qrX, qrY, qrSize, qrSize);

    // Label under QR
    ctx.fillStyle = '#64748B';
    ctx.font = `500 ${Math.round(6.5 * scale)}px "Plus Jakarta Sans", sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(qrs[0].label || 'Aceder', qrX + qrSize / 2, qrY + qrSize + 7 * scale);

    // Vertical separator
    ctx.strokeStyle = data.primaryColor || '#182B49';
    ctx.lineWidth = Math.max(1, scale * 0.25);
    const divX = qrX + qrSize + 10 * scale;
    ctx.beginPath();
    ctx.moveTo(divX, H * 0.22);
    ctx.lineTo(divX, H * 0.78);
    ctx.stroke();

    // Right Column: Contact Details
    const textX = divX + 10 * scale;
    let currY = H * 0.30;
    ctx.textAlign = 'left';

    if (data.address) {
      ctx.fillStyle = '#1E293B';
      ctx.font = `500 ${Math.round(7.2 * scale)}px "Plus Jakarta Sans", sans-serif`;
      ctx.fillText(data.address, textX, currY);
      currY += 10 * scale;
    }
    if (data.phone || data.whatsappPhone) {
      ctx.fillStyle = '#1E293B';
      ctx.font = `500 ${Math.round(7.2 * scale)}px "Plus Jakarta Sans", sans-serif`;
      ctx.fillText(data.phone || data.whatsappPhone, textX, currY);
      currY += 10 * scale;
    }
    if (data.handle || data.email) {
      ctx.fillStyle = '#1E293B';
      ctx.font = `500 ${Math.round(7.2 * scale)}px "Plus Jakarta Sans", sans-serif`;
      ctx.fillText(data.handle || data.email, textX, currY);
      currY += 10 * scale;
    }

    // Small footer monogram
    ctx.fillStyle = '#64748B';
    ctx.font = `700 ${Math.round(7 * scale)}px "Plus Jakarta Sans", sans-serif`;
    ctx.fillText(`${data.monogram || 'DM'} • ${data.name || ''}`, textX, H - bleed - 8 * scale);
  } else {
    // 2 or 3 QR Layout: Organized dynamically in a row or balanced grid!
    // Top: Mini header with Name & Title
    ctx.textAlign = 'center';
    ctx.fillStyle = data.primaryColor || '#182B49';
    ctx.font = `700 ${Math.round(11 * scale)}px "Plus Jakarta Sans", sans-serif`;
    ctx.fillText((data.name || 'DR. DAVID MONTOYA').toUpperCase(), W / 2, bleed + 11 * scale);

    ctx.fillStyle = '#64748B';
    ctx.font = `500 ${Math.round(6.5 * scale)}px "Plus Jakarta Sans", sans-serif`;
    ctx.fillText((data.title || 'CIRUJANO PLASTICO').toUpperCase(), W / 2, bleed + 18 * scale);

    // QR Codes in row (min ~20 mm per code = ~20 * scale)
    const qrSize = Math.round(22 * scale);
    const spacing = Math.round((W - bleed * 2 - qrSize * numQrs) / (numQrs + 1));
    const qrY = bleed + 23 * scale;

    for (let i = 0; i < numQrs; i++) {
      const qX = bleed + spacing * (i + 1) + qrSize * i;
      const qrCanvas = document.createElement('canvas');
      await renderQRToCanvas(qrCanvas, qrs[i], {
        sizePx: qrSize,
        fgColor: data.primaryColor || '#182B49',
        bgColor: '#FFFFFF',
      });

      // Subtle shadow box
      ctx.fillStyle = '#FFFFFF';
      roundRect(ctx, qX - 2 * scale, qrY - 2 * scale, qrSize + 4 * scale, qrSize + 4 * scale, 3 * scale);
      ctx.fill();

      ctx.drawImage(qrCanvas, qX, qrY, qrSize, qrSize);

      // Label below QR
      ctx.fillStyle = '#1E293B';
      ctx.font = `600 ${Math.round(6.5 * scale)}px "Plus Jakarta Sans", sans-serif`;
      ctx.fillText(qrs[i].label || `QR ${i + 1}`, qX + qrSize / 2, qrY + qrSize + 7.5 * scale);
    }
  }
}

/* =========================================================================
   MODEL 2: CARTÃO PARA REDES SOCIAIS (90×50 mm)
   ========================================================================= */

async function drawSocialCardFront(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  bleed: number,
  data: CardFormData,
  scale: number
) {
  // Dark stylish gradient
  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, '#0F172A');
  grad.addColorStop(1, '#1E293B');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // Social accent banner line
  const accentGrad = ctx.createLinearGradient(0, 0, W, 0);
  accentGrad.addColorStop(0, '#E1306C');
  accentGrad.addColorStop(0.5, '#25D366');
  accentGrad.addColorStop(1, '#1877F2');
  ctx.fillStyle = accentGrad;
  ctx.fillRect(0, H - 4 * scale, W, 4 * scale);

  const cx = W / 2;

  // Avatar / Monogram circle
  const avatarR = 18 * scale;
  const avatarY = bleed + 20 * scale;

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, avatarY, avatarR, 0, Math.PI * 2);
  ctx.fillStyle = '#334155';
  ctx.fill();
  ctx.strokeStyle = '#E1306C';
  ctx.lineWidth = 2 * scale;
  ctx.stroke();

  if (data.photoUrl) {
    const img = new Image();
    img.src = data.photoUrl;
    await new Promise<void>((res) => {
      img.onload = () => res();
      img.onerror = () => res();
    });
    ctx.clip();
    ctx.drawImage(img, cx - avatarR, avatarY - avatarR, avatarR * 2, avatarR * 2);
  } else {
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `700 ${Math.round(16 * scale)}px "Plus Jakarta Sans", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(data.monogram || 'IG', cx, avatarY);
  }
  ctx.restore();

  // Name & Handle
  ctx.textAlign = 'center';
  ctx.fillStyle = '#FFFFFF';
  ctx.font = `700 ${Math.round(13 * scale)}px "Plus Jakarta Sans", sans-serif`;
  ctx.fillText(data.name || 'Criador de Conteúdo', cx, avatarY + avatarR + 12 * scale);

  ctx.fillStyle = '#38BDF8';
  ctx.font = `600 ${Math.round(9 * scale)}px "Plus Jakarta Sans", sans-serif`;
  ctx.fillText(data.handle || '@meuperfil', cx, avatarY + avatarR + 22 * scale);

  ctx.fillStyle = '#94A3B8';
  ctx.font = `400 ${Math.round(7 * scale)}px "Plus Jakarta Sans", sans-serif`;
  ctx.fillText(data.title || 'Conecte-se comigo nas redes sociais', cx, avatarY + avatarR + 31 * scale);
}

async function drawSocialCardBack(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  bleed: number,
  data: CardFormData,
  scale: number
) {
  ctx.fillStyle = '#0F172A';
  ctx.fillRect(0, 0, W, H);

  const qrs = data.qrItems.slice(0, 3);
  const numQrs = qrs.length || 1;

  // Title
  ctx.textAlign = 'center';
  ctx.fillStyle = '#FFFFFF';
  ctx.font = `700 ${Math.round(10 * scale)}px "Plus Jakarta Sans", sans-serif`;
  ctx.fillText('SIGA-NOS NAS REDES', W / 2, bleed + 11 * scale);

  ctx.fillStyle = '#94A3B8';
  ctx.font = `400 ${Math.round(6.5 * scale)}px "Plus Jakarta Sans", sans-serif`;
  ctx.fillText('Aponte a sua câmara para seguir instantaneamente', W / 2, bleed + 17 * scale);

  const qrSize = Math.round(23 * scale);
  const spacing = Math.round((W - bleed * 2 - qrSize * numQrs) / (numQrs + 1));
  const qrY = bleed + 22 * scale;

  for (let i = 0; i < numQrs; i++) {
    const qX = bleed + spacing * (i + 1) + qrSize * i;
    const qrCanvas = document.createElement('canvas');
    await renderQRToCanvas(qrCanvas, qrs[i], {
      sizePx: qrSize,
      fgColor: '#000000',
      bgColor: '#FFFFFF',
    });

    // White backing card for clean contrast
    ctx.fillStyle = '#FFFFFF';
    roundRect(ctx, qX - 2.5 * scale, qrY - 2.5 * scale, qrSize + 5 * scale, qrSize + 5 * scale, 4 * scale);
    ctx.fill();

    ctx.drawImage(qrCanvas, qX, qrY, qrSize, qrSize);

    // Label
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `600 ${Math.round(7 * scale)}px "Plus Jakarta Sans", sans-serif`;
    ctx.fillText(qrs[i].label || qrs[i].type, qX + qrSize / 2, qrY + qrSize + 8 * scale);
  }
}

/* =========================================================================
   MODEL 3: CARTÃO ID ESCURO/VERDE (WHATSAPP TECH ID - Image 4)
   ========================================================================= */

async function drawDarkGreenIdFront(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  bleed: number,
  data: CardFormData,
  scale: number
) {
  // Obsidian carbon background
  ctx.fillStyle = '#060B0E';
  ctx.fillRect(0, 0, W, H);

  // Futuristic cyber circuit patterns
  ctx.strokeStyle = 'rgba(0, 230, 118, 0.22)';
  ctx.lineWidth = 1 * scale;

  // Background subtle circuits
  ctx.beginPath();
  ctx.moveTo(W * 0.45, 0);
  ctx.lineTo(W * 0.6, H * 0.35);
  ctx.lineTo(W * 0.9, H * 0.35);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(W * 0.35, H);
  ctx.lineTo(W * 0.5, H * 0.65);
  ctx.lineTo(W * 0.8, H * 0.65);
  ctx.stroke();

  // Top header: WhatsApp logo + text (Image 4)
  ctx.fillStyle = '#FFFFFF';
  ctx.font = `700 ${Math.round(13 * scale)}px "Plus Jakarta Sans", sans-serif`;
  ctx.textAlign = 'left';
  ctx.fillText('WhatsApp', bleed + 10 * scale, bleed + 13 * scale);

  // Top right corner glowing badge
  ctx.fillStyle = '#25D366';
  ctx.beginPath();
  ctx.arc(W - bleed - 12 * scale, bleed + 12 * scale, 6 * scale, 0, Math.PI * 2);
  ctx.fill();

  // LEFT: Photo frame with cyber neon green border
  const photoW = 28 * scale;
  const photoH = 34 * scale;
  const photoX = bleed + 10 * scale;
  const photoY = bleed + 18 * scale;

  ctx.save();
  // Glowing green frame
  ctx.strokeStyle = '#00E676';
  ctx.lineWidth = 2 * scale;
  ctx.shadowColor = '#00E676';
  ctx.shadowBlur = 8 * scale;
  roundRect(ctx, photoX, photoY, photoW, photoH, 4 * scale);
  ctx.stroke();
  ctx.restore();

  // Photo clipping
  ctx.save();
  roundRect(ctx, photoX, photoY, photoW, photoH, 4 * scale);
  ctx.clip();
  if (data.photoUrl) {
    const pImg = new Image();
    pImg.src = data.photoUrl;
    await new Promise<void>((res) => {
      pImg.onload = () => res();
      pImg.onerror = () => res();
    });
    ctx.drawImage(pImg, photoX, photoY, photoW, photoH);
  } else {
    // Elegant silhouette placeholder
    ctx.fillStyle = '#112217';
    ctx.fillRect(photoX, photoY, photoW, photoH);
    ctx.fillStyle = '#00E676';
    ctx.font = `700 ${Math.round(14 * scale)}px "Plus Jakarta Sans", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(data.monogram || 'ID', photoX + photoW / 2, photoY + photoH / 2);
  }
  ctx.restore();

  // CENTER: Glowing Concentric Circles with WhatsApp Badge (Image 4)
  const centerRingX = W * 0.58;
  const centerRingY = H * 0.42;
  const ringR = 17 * scale;

  ctx.save();
  ctx.strokeStyle = 'rgba(0, 230, 118, 0.4)';
  ctx.lineWidth = 1.5 * scale;
  ctx.beginPath();
  ctx.arc(centerRingX, centerRingY, ringR, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = '#00E676';
  ctx.lineWidth = 2.5 * scale;
  ctx.shadowColor = '#00E676';
  ctx.shadowBlur = 12 * scale;
  ctx.beginPath();
  ctx.arc(centerRingX, centerRingY, ringR * 0.75, 0, Math.PI * 2);
  ctx.stroke();

  // Center WhatsApp icon circle
  ctx.fillStyle = '#00E676';
  ctx.beginPath();
  ctx.arc(centerRingX, centerRingY, ringR * 0.45, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // BOTTOM LEFT: Titular Name & ID
  ctx.fillStyle = '#FFFFFF';
  ctx.font = `700 ${Math.round(11 * scale)}px "Plus Jakarta Sans", sans-serif`;
  ctx.textAlign = 'left';
  ctx.fillText(data.name || 'Makhdoom Nouman', bleed + 10 * scale, H - bleed - 14 * scale);

  ctx.fillStyle = '#00E676';
  ctx.font = `600 ${Math.round(7.5 * scale)}px monospace`;
  ctx.fillText(data.idNumber || 'ID: 98/b-2079', bleed + 10 * scale, H - bleed - 6 * scale);

  // BOTTOM RIGHT: 1 QR Code on Front
  const qrItem = data.qrItems[0] || {
    id: 'qr-1',
    type: 'whatsapp',
    label: 'WhatsApp',
    value: data.whatsappPhone || '258841234567',
  };

  const qrSize = Math.round(24 * scale);
  const qrX = W - bleed - qrSize - 8 * scale;
  const qrY = H - bleed - qrSize - 6 * scale;

  // White backing with rounded corners
  ctx.fillStyle = '#FFFFFF';
  roundRect(ctx, qrX - 2 * scale, qrY - 2 * scale, qrSize + 4 * scale, qrSize + 4 * scale, 3 * scale);
  ctx.fill();

  const qrCanvas = document.createElement('canvas');
  await renderQRToCanvas(qrCanvas, qrItem, {
    sizePx: qrSize,
    fgColor: '#000000',
    bgColor: '#FFFFFF',
  });
  ctx.drawImage(qrCanvas, qrX, qrY, qrSize, qrSize);
}

async function drawDarkGreenIdBack(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  bleed: number,
  data: CardFormData,
  scale: number
) {
  // Dark cyber back
  ctx.fillStyle = '#080F12';
  ctx.fillRect(0, 0, W, H);

  // Magnetic black strip
  ctx.fillStyle = '#111827';
  ctx.fillRect(0, bleed + 8 * scale, W, 12 * scale);

  // Signature / info panel
  ctx.fillStyle = '#1E293B';
  roundRect(ctx, bleed + 10 * scale, bleed + 24 * scale, W - bleed * 2 - 20 * scale, 12 * scale, 2 * scale);
  ctx.fill();

  ctx.fillStyle = '#64748B';
  ctx.font = `500 ${Math.round(6 * scale)}px monospace`;
  ctx.textAlign = 'left';
  ctx.fillText('AUTHORIZED SIGNATURE / CHIP CODE', bleed + 14 * scale, bleed + 32 * scale);

  // Bottom info
  ctx.fillStyle = '#94A3B8';
  ctx.font = `500 ${Math.round(7 * scale)}px "Plus Jakarta Sans", sans-serif`;
  ctx.fillText(data.company || 'WHATSAPP VERIFIED TECH IDENTITY', bleed + 10 * scale, H - bleed - 10 * scale);
  ctx.fillStyle = '#00E676';
  ctx.fillText(data.phone || '+258 84 123 4567', bleed + 10 * scale, H - bleed - 4 * scale);
}

/* =========================================================================
   MODEL 4: PRETO E DOURADO PREMIUM (Image 3 - LD Monogram Luxury)
   ========================================================================= */

async function drawGoldPremiumFront(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  bleed: number,
  data: CardFormData,
  scale: number
) {
  // Deep Navy / Obsidian
  ctx.fillStyle = data.primaryColor || '#0B1220';
  ctx.fillRect(0, 0, W, H);

  // Delicate gold foil border
  ctx.strokeStyle = '#D4AF37';
  ctx.lineWidth = Math.max(1, 0.4 * scale);
  roundRect(ctx, bleed + 5 * scale, bleed + 5 * scale, W - bleed * 2 - 10 * scale, H - bleed * 2 - 10 * scale, 2 * scale);
  ctx.stroke();

  const cx = W / 2;
  const cy = H / 2;

  // If QR is chosen on Front
  if (data.qrPosition === 'front') {
    const qrSize = Math.round(28 * scale);
    const qrX = W - bleed - qrSize - 12 * scale;
    const qrY = cy - qrSize / 2;

    const qrItem = data.qrItems[0] || { id: 'qr-1', type: 'url', label: 'VIP', value: 'https://seusite.com' };
    const qrCanvas = document.createElement('canvas');
    await renderQRToCanvas(qrCanvas, qrItem, {
      sizePx: qrSize,
      fgColor: '#0B1220',
      bgColor: '#FAF6EE',
    });

    ctx.fillStyle = '#FAF6EE';
    roundRect(ctx, qrX - 2 * scale, qrY - 2 * scale, qrSize + 4 * scale, qrSize + 4 * scale, 3 * scale);
    ctx.fill();
    ctx.drawImage(qrCanvas, qrX, qrY, qrSize, qrSize);

    // Left: Monogram and title
    ctx.textAlign = 'left';
    ctx.fillStyle = '#D4AF37';
    ctx.font = `700 ${Math.round(22 * scale)}px "Times New Roman", serif`;
    ctx.fillText(data.monogram || 'LD', bleed + 14 * scale, cy - 6 * scale);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = `600 ${Math.round(11 * scale)}px "Plus Jakarta Sans", sans-serif`;
    ctx.fillText(data.name || 'Nome do Titular', bleed + 14 * scale, cy + 8 * scale);

    ctx.fillStyle = '#D4AF37';
    ctx.font = `400 ${Math.round(7.5 * scale)}px "Plus Jakarta Sans", sans-serif`;
    ctx.fillText((data.title || 'Executive Advisor').toUpperCase(), bleed + 14 * scale, cy + 18 * scale);
  } else {
    // Pure luxury front without QR
    // Large gold luxury monogram (Image 3)
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Monogram shadow / glow
    ctx.fillStyle = '#D4AF37';
    ctx.font = `700 ${Math.round(36 * scale)}px "Times New Roman", serif`;
    ctx.fillText(data.monogram || 'LD', cx, cy - 12 * scale);

    // Thin accent line
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 0.8 * scale;
    ctx.beginPath();
    ctx.moveTo(cx - 30 * scale, cy + 8 * scale);
    ctx.lineTo(cx + 30 * scale, cy + 8 * scale);
    ctx.stroke();

    // Name
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `700 ${Math.round(13 * scale)}px "Plus Jakarta Sans", sans-serif`;
    ctx.letterSpacing = '1px';
    ctx.fillText((data.name || 'LUXURY ADVISOR').toUpperCase(), cx, cy + 20 * scale);

    // Subtitle
    ctx.fillStyle = '#D4AF37';
    ctx.font = `400 ${Math.round(7.5 * scale)}px "Plus Jakarta Sans", sans-serif`;
    ctx.fillText((data.title || 'PRIVATE CONSULTING').toUpperCase(), cx, cy + 30 * scale);
  }
}

async function drawGoldPremiumBack(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  bleed: number,
  data: CardFormData,
  scale: number
) {
  // If QR was on front, back has clean contacts. If QR was on back, draw QR!
  ctx.fillStyle = '#0B1220';
  ctx.fillRect(0, 0, W, H);

  // Gold frame
  ctx.strokeStyle = '#D4AF37';
  ctx.lineWidth = Math.max(1, 0.4 * scale);
  roundRect(ctx, bleed + 5 * scale, bleed + 5 * scale, W - bleed * 2 - 10 * scale, H - bleed * 2 - 10 * scale, 2 * scale);
  ctx.stroke();

  if (data.qrPosition === 'back' || data.qrPosition === undefined) {
    // 1 QR Code on Back
    const qrSize = Math.round(28 * scale);
    const qrX = bleed + 14 * scale;
    const qrY = (H - qrSize) / 2;

    const qrItem = data.qrItems[0] || { id: 'qr-1', type: 'url', label: 'VIP', value: 'https://seusite.com' };
    const qrCanvas = document.createElement('canvas');
    await renderQRToCanvas(qrCanvas, qrItem, {
      sizePx: qrSize,
      fgColor: '#0B1220',
      bgColor: '#FAF6EE',
    });

    ctx.fillStyle = '#FAF6EE';
    roundRect(ctx, qrX - 2 * scale, qrY - 2 * scale, qrSize + 4 * scale, qrSize + 4 * scale, 3 * scale);
    ctx.fill();
    ctx.drawImage(qrCanvas, qrX, qrY, qrSize, qrSize);

    // Right Column: Gold Contacts
    const textX = qrX + qrSize + 14 * scale;
    let currY = H * 0.32;
    ctx.textAlign = 'left';

    ctx.fillStyle = '#D4AF37';
    ctx.font = `700 ${Math.round(9 * scale)}px "Plus Jakarta Sans", sans-serif`;
    ctx.fillText(data.name || 'Titular', textX, currY);
    currY += 9 * scale;

    ctx.fillStyle = '#E2E8F0';
    ctx.font = `500 ${Math.round(7 * scale)}px "Plus Jakarta Sans", sans-serif`;
    if (data.phone) {
      ctx.fillText(data.phone, textX, currY);
      currY += 9 * scale;
    }
    if (data.email) {
      ctx.fillText(data.email, textX, currY);
      currY += 9 * scale;
    }
    if (data.website) {
      ctx.fillText(data.website, textX, currY);
      currY += 9 * scale;
    }
  } else {
    // Back has minimalist centered info
    const cx = W / 2;
    ctx.textAlign = 'center';
    ctx.fillStyle = '#D4AF37';
    ctx.font = `700 ${Math.round(14 * scale)}px "Times New Roman", serif`;
    ctx.fillText(data.monogram || 'LD', cx, H * 0.35);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = `500 ${Math.round(7.5 * scale)}px "Plus Jakarta Sans", sans-serif`;
    ctx.fillText(data.phone || '+258 84 123 4567', cx, H * 0.52);
    ctx.fillText(data.email || 'contacto@exclusivo.com', cx, H * 0.64);
    ctx.fillText(data.website || 'www.exclusivo.com', cx, H * 0.76);
  }
}

/* =========================================================================
   MODEL 5: PLACA DE MESA VERTICAL (105×148 mm Display Balcão)
   ========================================================================= */

async function drawTableTentFront(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  bleed: number,
  data: CardFormData,
  scale: number
) {
  // Clean modern display card
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, W, H);

  // Top header brand curve
  ctx.fillStyle = data.primaryColor || '#182B49';
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(W, 0);
  ctx.lineTo(W, bleed + 32 * scale);
  ctx.quadraticCurveTo(W / 2, bleed + 40 * scale, 0, bleed + 32 * scale);
  ctx.closePath();
  ctx.fill();

  const cx = W / 2;

  // Monogram / Logo badge in header
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(cx, bleed + 24 * scale, 14 * scale, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = data.primaryColor || '#182B49';
  ctx.font = `700 ${Math.round(13 * scale)}px "Plus Jakarta Sans", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(data.monogram || 'QR', cx, bleed + 24 * scale);

  // Invitation Title
  ctx.textAlign = 'center';
  ctx.fillStyle = '#0F172A';
  ctx.font = `700 ${Math.round(14 * scale)}px "Plus Jakarta Sans", sans-serif`;
  ctx.fillText((data.company || 'BEM-VINDO').toUpperCase(), cx, bleed + 54 * scale);

  ctx.fillStyle = '#64748B';
  ctx.font = `500 ${Math.round(8.5 * scale)}px "Plus Jakarta Sans", sans-serif`;
  ctx.fillText(data.subtitle || 'Aponte a câmara do telemóvel para aceder', cx, bleed + 64 * scale);

  // 1 QR Code in CENTRAL ZONE
  const qrItem = data.qrItems[0] || {
    id: 'qr-1',
    type: 'wifi',
    label: 'Aceder',
    value: data.website || 'https://restaurante.com',
  };

  const qrSize = Math.round(52 * scale);
  const qrX = cx - qrSize / 2;
  const qrY = bleed + 72 * scale;

  // Frame around QR
  ctx.fillStyle = '#F8FAFC';
  ctx.strokeStyle = '#E2E8F0';
  ctx.lineWidth = 1.5 * scale;
  roundRect(ctx, qrX - 5 * scale, qrY - 5 * scale, qrSize + 10 * scale, qrSize + 10 * scale, 8 * scale);
  ctx.fill();
  ctx.stroke();

  const qrCanvas = document.createElement('canvas');
  await renderQRToCanvas(qrCanvas, qrItem, {
    sizePx: qrSize,
    fgColor: data.primaryColor || '#182B49',
    bgColor: '#FFFFFF',
  });
  ctx.drawImage(qrCanvas, qrX, qrY, qrSize, qrSize);

  // Footer instructions / Wi-Fi info
  ctx.fillStyle = data.primaryColor || '#182B49';
  ctx.font = `700 ${Math.round(10 * scale)}px "Plus Jakarta Sans", sans-serif`;
  ctx.fillText(qrItem.label || 'Wi-Fi & Cardápio Digital', cx, qrY + qrSize + 16 * scale);

  if (data.wifiSsid || data.phone) {
    ctx.fillStyle = '#64748B';
    ctx.font = `500 ${Math.round(7.5 * scale)}px "Plus Jakarta Sans", sans-serif`;
    ctx.fillText(data.wifiSsid ? `Rede: ${data.wifiSsid}` : data.phone, cx, qrY + qrSize + 25 * scale);
  }
}

async function drawTableTentBack(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  bleed: number,
  data: CardFormData,
  scale: number
) {
  // Mirror design for double-sided table display
  await drawTableTentFront(ctx, W, H, bleed, data, scale);
}

/* =========================================================================
   MODEL 6: CARTÃO DE SERVIÇOS (Image 2 - Julia Strepchenkova & Image 5 - Lilian Botelho)
   ========================================================================= */

async function drawServicesCardFront(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  bleed: number,
  data: CardFormData,
  scale: number
) {
  // Deep petrol teal or sage green (Image 2 & 5)
  const bg = data.primaryColor || '#1A4959';
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  const cx = W / 2;
  const cy = H / 2;

  // Thin gold/cream accent stripe
  ctx.strokeStyle = '#D4AF37';
  ctx.lineWidth = 0.8 * scale;
  ctx.beginPath();
  ctx.moveTo(bleed + 20 * scale, cy + 32 * scale);
  ctx.lineTo(W - bleed - 20 * scale, cy + 32 * scale);
  ctx.stroke();

  // Oval Monogram Emblem (Image 2)
  const mono = data.monogram || 'JS';
  const radiusX = 14 * scale;
  const radiusY = 20 * scale;
  const monoY = cy - 14 * scale;

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.lineWidth = 1.2 * scale;
  ctx.beginPath();
  ctx.ellipse(cx, monoY, radiusX, radiusY, 0, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = '#FFFFFF';
  ctx.font = `600 ${Math.round(18 * scale)}px "Times New Roman", serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(mono, cx, monoY);

  // Name
  ctx.font = `700 ${Math.round(14 * scale)}px "Times New Roman", serif`;
  ctx.fillText(data.name || 'JULIA STREPCHENKOVA', cx, cy + 16 * scale);

  // Specialty subtitle
  ctx.font = `400 ${Math.round(7.5 * scale)}px "Plus Jakarta Sans", sans-serif`;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.fillText((data.title || 'estética e cosmetologia').toLowerCase(), cx, cy + 25 * scale);
}

async function drawServicesCardBack(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  bleed: number,
  data: CardFormData,
  scale: number
) {
  // Warm ivory linen / cream (Image 2)
  ctx.fillStyle = '#FAF8F3';
  ctx.fillRect(0, 0, W, H);

  const qrs = data.qrItems.slice(0, 2);
  const qrItem = qrs[0] || {
    id: 'qr-1',
    type: 'instagram',
    label: 'Instagram',
    value: data.handle || 'julia.st_cosm',
  };

  // Thin vertical separator line (Image 2)
  const divX = W * 0.56;
  ctx.strokeStyle = '#D1D5DB';
  ctx.lineWidth = 0.8 * scale;
  ctx.beginPath();
  ctx.moveTo(divX, bleed + 8 * scale);
  ctx.lineTo(divX, H - bleed - 8 * scale);
  ctx.stroke();

  // LEFT COLUMN: Name, Services List with Bullets & Contacts (Image 2)
  const leftX = bleed + 10 * scale;
  let currY = bleed + 10 * scale;

  ctx.textAlign = 'left';
  ctx.fillStyle = data.primaryColor || '#1A4959';
  ctx.font = `700 ${Math.round(10 * scale)}px "Times New Roman", serif`;
  ctx.fillText(data.name || 'Júlia Strepchenkova', leftX, currY);
  currY += 9 * scale;

  // Services bullets
  const defaultServices = [
    'Harmonização facial',
    'Mesoterapia & Bio revitalização',
    'Limpeza de pele profunda',
    'Peeling de alta performance',
  ];
  const services = (data.servicesList && data.servicesList.length > 0) ? data.servicesList : defaultServices;

  ctx.fillStyle = '#4B5563';
  ctx.font = `400 ${Math.round(6.2 * scale)}px "Plus Jakarta Sans", sans-serif`;

  for (const s of services.slice(0, 4)) {
    ctx.fillText(`• ${s}`, leftX, currY);
    currY += 6.5 * scale;
  }

  // Contacts at bottom of left column
  currY = Math.max(currY + 2 * scale, H - bleed - 14 * scale);
  ctx.fillStyle = '#1F2937';
  ctx.font = `600 ${Math.round(6.5 * scale)}px "Plus Jakarta Sans", sans-serif`;
  if (data.phone) {
    ctx.fillText(`📞 ${data.phone}`, leftX, currY);
    currY += 7 * scale;
  }
  if (data.handle) {
    ctx.fillText(`📸 ${data.handle}`, leftX, currY);
  }

  // RIGHT COLUMN: QR Code (or 2 QR Codes stacked) (Image 2)
  const rightCenterX = divX + (W - bleed - divX) / 2;

  if (qrs.length > 1) {
    // 2 stacked QR codes (e.g. Instagram + WhatsApp)
    const qrSize = Math.round(18 * scale);
    for (let i = 0; i < 2; i++) {
      const qY = bleed + 6 * scale + i * (qrSize + 7 * scale);
      const qX = rightCenterX - qrSize / 2;

      const qrCanvas = document.createElement('canvas');
      await renderQRToCanvas(qrCanvas, qrs[i], {
        sizePx: qrSize,
        fgColor: data.primaryColor || '#1A4959',
        bgColor: '#FAF8F3',
      });
      ctx.drawImage(qrCanvas, qX, qY, qrSize, qrSize);

      ctx.fillStyle = '#4B5563';
      ctx.font = `600 ${Math.round(5.5 * scale)}px "Plus Jakarta Sans", sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText(qrs[i].label || qrs[i].type, rightCenterX, qY + qrSize + 4.5 * scale);
    }
  } else {
    // 1 prominent QR Code
    const qrSize = Math.round(26 * scale);
    const qX = rightCenterX - qrSize / 2;
    const qY = (H - qrSize) / 2 - 3 * scale;

    const qrCanvas = document.createElement('canvas');
    await renderQRToCanvas(qrCanvas, qrItem, {
      sizePx: qrSize,
      fgColor: data.primaryColor || '#1A4959',
      bgColor: '#FAF8F3',
    });
    ctx.drawImage(qrCanvas, qX, qY, qrSize, qrSize);

    ctx.fillStyle = '#4B5563';
    ctx.font = `600 ${Math.round(6.5 * scale)}px "Plus Jakarta Sans", sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(qrItem.label || 'Agende Connosco', rightCenterX, qY + qrSize + 7 * scale);
  }
}

/**
 * Visual bleed boundary guides
 */
function drawBleedGuides(ctx: CanvasRenderingContext2D, W: number, H: number, bleed: number) {
  ctx.save();
  ctx.strokeStyle = 'rgba(239, 68, 68, 0.55)';
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 4]);
  ctx.strokeRect(bleed, bleed, W - bleed * 2, H - bleed * 2);
  ctx.restore();
}
