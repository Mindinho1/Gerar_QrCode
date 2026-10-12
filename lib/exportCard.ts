import { CardFormData, CARD_MODELS } from './cardModels';

/**
 * Calculates pixel dimensions for mm at 300 DPI
 */
export function mmToPx300DPI(mm: number): number {
  return Math.round((mm / 25.4) * 300);
}

export interface ExportOptions {
  includeBleed?: boolean; // 3mm sangria
  bleedMm?: number; // default 3mm
  drawCropMarks?: boolean;
}

/**
 * Exports a canvas or image elements to a high-resolution 300 DPI PNG file
 */
export async function downloadCanvasAsPng(
  canvas: HTMLCanvasElement,
  fileName: string
): Promise<void> {
  const link = document.createElement('a');
  link.download = fileName;
  link.href = canvas.toDataURL('image/png', 1.0);
  link.click();
}

/**
 * Generates and downloads a multi-page PDF containing Front (Page 1) and Back (Page 2)
 * formatted to exact millimetric dimensions with 300 DPI raster fidelity.
 */
export async function exportCardToPDF(
  frontCanvas: HTMLCanvasElement,
  backCanvas: HTMLCanvasElement,
  formData: CardFormData,
  options: ExportOptions = {}
): Promise<void> {
  // Dynamically import jsPDF only on client-side when user exports
  const { default: jsPDF } = await import('jspdf');

  const model = CARD_MODELS.find((m) => m.id === formData.modelId) || CARD_MODELS[0];
  const { width: origWidthMm, height: origHeightMm } = model.dimensionsMm;

  const bleedMm = options.includeBleed ? (options.bleedMm || 3) : 0;
  const totalWidthMm = origWidthMm + bleedMm * 2;
  const totalHeightMm = origHeightMm + bleedMm * 2;

  const orientation = totalWidthMm >= totalHeightMm ? 'landscape' : 'portrait';

  // Initialize jsPDF with custom mm dimensions
  const pdf = new jsPDF({
    orientation,
    unit: 'mm',
    format: [totalWidthMm, totalHeightMm],
    compress: true,
  });

  // Page 1: Frente (Front)
  const frontDataUrl = frontCanvas.toDataURL('image/png', 1.0);
  pdf.addImage(frontDataUrl, 'PNG', 0, 0, totalWidthMm, totalHeightMm, undefined, 'FAST');

  // Draw crop marks if bleed enabled
  if (options.includeBleed && options.drawCropMarks) {
    drawCropMarksOnPdf(pdf, origWidthMm, origHeightMm, bleedMm);
  }

  // Page 2: Verso (Back)
  pdf.addPage([totalWidthMm, totalHeightMm], orientation);
  const backDataUrl = backCanvas.toDataURL('image/png', 1.0);
  pdf.addImage(backDataUrl, 'PNG', 0, 0, totalWidthMm, totalHeightMm, undefined, 'FAST');

  if (options.includeBleed && options.drawCropMarks) {
    drawCropMarksOnPdf(pdf, origWidthMm, origHeightMm, bleedMm);
  }

  const cleanName = formData.name.replace(/[^a-zA-Z0-9]/g, '_') || 'cartao';
  const fileName = `${cleanName}-${formData.modelId}-${options.includeBleed ? 'com-sangria-' : ''}300dpi.pdf`;
  pdf.save(fileName);
}

/**
 * Draws professional printing press crop marks in bleed zone
 */
function drawCropMarksOnPdf(pdf: any, wMm: number, hMm: number, bleed: number) {
  pdf.setDrawColor(80, 80, 80);
  pdf.setLineWidth(0.1);

  const markLen = 2.5; // mm
  const offset = 0.5;

  // Top-left
  pdf.line(bleed, 0, bleed, bleed - offset);
  pdf.line(0, bleed, bleed - offset, bleed);

  // Top-right
  pdf.line(bleed + wMm, 0, bleed + wMm, bleed - offset);
  pdf.line(bleed + wMm + offset, bleed, bleed + wMm + bleed, bleed);

  // Bottom-left
  pdf.line(bleed, bleed + hMm + offset, bleed, bleed + hMm + bleed);
  pdf.line(0, bleed + hMm, bleed - offset, bleed + hMm);

  // Bottom-right
  pdf.line(bleed + wMm, bleed + hMm + offset, bleed + wMm, bleed + hMm + bleed);
  pdf.line(bleed + wMm + offset, bleed + hMm, bleed + wMm + bleed, bleed + hMm);
}
