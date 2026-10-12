import QRCode from 'qrcode';
import { QRCodeItem } from './cardModels';
import { getBrandBadgeDataUri, isMandatorySocialType } from './brandIcons';
import { buildPayloadForQRItem } from './builders';

export interface RenderQROptions {
  sizePx?: number;
  fgColor?: string;
  bgColor?: string;
  margin?: number;
}

/**
 * Renders a single QR code onto an HTMLCanvasElement with an optional or mandatory central icon.
 * Always forces Error Correction Level 'H' when a central icon is used.
 * The central icon is strictly constrained to ~20% of the QR code dimension with a white protective margin.
 */
export async function renderQRToCanvas(
  canvas: HTMLCanvasElement,
  item: QRCodeItem,
  options: RenderQROptions = {}
): Promise<void> {
  const size = options.sizePx || 400;
  const fg = options.fgColor || '#000000';
  const bg = options.bgColor || '#ffffff';
  const margin = options.margin !== undefined ? options.margin : 2;

  const payload = buildPayloadForQRItem(item.type, item.value);
  if (!payload || !payload.trim()) {
    const ctx = canvas.getContext('2d');
    if (ctx) {
      canvas.width = size;
      canvas.height = size;
      ctx.clearRect(0, 0, size, size);
    }
    return;
  }

  // Determine center icon URL
  let centerIconUrl: string | null = null;
  if (isMandatorySocialType(item.type)) {
    centerIconUrl = getBrandBadgeDataUri(item.type);
  } else if (item.customLogoUrl) {
    centerIconUrl = item.customLogoUrl;
  }

  // Mandatory level 'H' if there is an icon
  const errorCorrectionLevel = centerIconUrl ? 'H' : 'M';

  canvas.width = size;
  canvas.height = size;

  // 1. Draw base QR Code
  await QRCode.toCanvas(canvas, payload, {
    errorCorrectionLevel,
    margin,
    width: size,
    color: {
      dark: fg,
      light: bg,
    },
  });

  // 2. Composite central icon if present
  if (centerIconUrl) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = centerIconUrl;

    await new Promise<void>((resolve, reject) => {
      if (img.complete) return resolve();
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('Falha ao carregar ícone central'));
    });

    // Icon limited to ~20% of QR code size
    const maxLogoSize = Math.round(size * 0.20);

    let logoW = img.width || maxLogoSize;
    let logoH = img.height || maxLogoSize;
    if (logoW > logoH) {
      logoH = Math.round((logoH / logoW) * maxLogoSize);
      logoW = maxLogoSize;
    } else {
      logoW = Math.round((logoW / logoH) * maxLogoSize);
      logoH = maxLogoSize;
    }

    // Protective white background badge with rounded corners
    const padding = Math.max(4, Math.round(size * 0.022));
    const badgeW = logoW + padding * 2;
    const badgeH = logoH + padding * 2;
    const badgeX = Math.round((size - badgeW) / 2);
    const badgeY = Math.round((size - badgeH) / 2);
    const logoX = Math.round((size - logoW) / 2);
    const logoY = Math.round((size - logoH) / 2);

    ctx.save();
    // Drop soft shadow around the white badge for crisp contrast against QR modules
    ctx.fillStyle = '#FFFFFF';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.20)';
    ctx.shadowBlur = Math.max(3, Math.round(size * 0.015));
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 1;

    const radius = Math.max(4, Math.round(badgeW * 0.22));
    ctx.beginPath();
    ctx.moveTo(badgeX + radius, badgeY);
    ctx.lineTo(badgeX + badgeW - radius, badgeY);
    ctx.quadraticCurveTo(badgeX + badgeW, badgeY, badgeX + badgeW, badgeY + radius);
    ctx.lineTo(badgeX + badgeW, badgeY + badgeH - radius);
    ctx.quadraticCurveTo(badgeX + badgeW, badgeY + badgeH, badgeX + badgeW - radius, badgeY + badgeH);
    ctx.lineTo(badgeX + radius, badgeY + badgeH);
    ctx.quadraticCurveTo(badgeX, badgeY + badgeH, badgeX, badgeY + badgeH - radius);
    ctx.lineTo(badgeX, badgeY + radius);
    ctx.quadraticCurveTo(badgeX, badgeY, badgeX + radius, badgeY);
    ctx.closePath();
    ctx.fill();

    // Subtle crisp border
    ctx.shadowColor = 'transparent';
    ctx.lineWidth = Math.max(1, Math.round(size * 0.004));
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.08)';
    ctx.stroke();

    ctx.restore();

    // Draw image inside badge
    ctx.drawImage(img, logoX, logoY, logoW, logoH);
  }
}

/**
 * Creates an offscreen canvas and returns a PNG Data URL
 */
export async function generateQRDataUrl(
  item: QRCodeItem,
  options: RenderQROptions = {}
): Promise<string> {
  const canvas = document.createElement('canvas');
  await renderQRToCanvas(canvas, item, options);
  return canvas.toDataURL('image/png');
}
