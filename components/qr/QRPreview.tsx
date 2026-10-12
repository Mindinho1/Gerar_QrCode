'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import QRCode from 'qrcode';
import { QRType } from '@/lib/builders';
import { QRStyleSettings } from './QRStyleOptions';
import { isMandatorySocialType, getBrandBadgeDataUri } from '@/lib/brandIcons';
import { Button } from '@/components/ui/Button';
import { 
  Download, 
  Copy, 
  Check, 
  AlertTriangle, 
  Info, 
  Printer, 
  Sparkles, 
  FileCode,
  Eye,
  Maximize2
} from 'lucide-react';

interface QRPreviewProps {
  payload: string;
  type: QRType;
  styleSettings: QRStyleSettings;
}

// Function to calculate relative luminance of hex color
function getLuminance(hex: string): number {
  const cleanHex = hex.replace('#', '');
  if (cleanHex.length !== 6) return 0.5;
  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;

  const a = [r, g, b].map((v) =>
    v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
  );
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function getContrastRatio(hex1: string, hex2: string): number {
  const lum1 = getLuminance(hex1);
  const lum2 = getLuminance(hex2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

export const QRPreview: React.FC<QRPreviewProps> = ({
  payload,
  type,
  styleSettings,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [copiedImage, setCopiedImage] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [svgString, setSvgString] = useState<string>('');
  const [renderError, setRenderError] = useState<string | null>(null);

  const isSocial = isMandatorySocialType(type);
  const effectiveLogoUrl = isSocial
    ? getBrandBadgeDataUri(type as any)
    : styleSettings.customLogoUrl;

  const contrastRatio = getContrastRatio(styleSettings.fgColor, styleSettings.bgColor);
  const isLowContrast = contrastRatio < 3.2;
  const isHighDensity = payload.length > 250;

  // Render QR code onto canvas
  const renderQRCode = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (!payload || payload.trim() === '') {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      setSvgString('');
      return;
    }

    try {
      setRenderError(null);
      const effectiveLevel = effectiveLogoUrl ? 'H' : styleSettings.errorCorrection;

      // 1. Render base QR
      await QRCode.toCanvas(canvas, payload, {
        errorCorrectionLevel: effectiveLevel,
        margin: styleSettings.margin,
        width: 380,
        color: {
          dark: styleSettings.fgColor,
          light: styleSettings.bgColor,
        },
      });

      // 2. Render SVG string for SVG download
      const svg = await QRCode.toString(payload, {
        type: 'svg',
        errorCorrectionLevel: effectiveLevel,
        margin: styleSettings.margin,
        color: {
          dark: styleSettings.fgColor,
          light: styleSettings.bgColor,
        },
      });
      setSvgString(svg);

      // 3. Draw center logo if present
      if (effectiveLogoUrl) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const logoImg = new Image();
          logoImg.crossOrigin = 'anonymous';
          await new Promise<void>((resolve, reject) => {
            logoImg.onload = () => resolve();
            logoImg.onerror = () => reject(new Error('Falha ao carregar o ícone central'));
            logoImg.src = effectiveLogoUrl;
          });

          const sizePercent = styleSettings.logoSizePercent || 22;
          const logoSize = Math.round((canvas.width * sizePercent) / 100);
          const x = (canvas.width - logoSize) / 2;
          const y = (canvas.height - logoSize) / 2;

          // Background badge backing
          const pad = Math.round(logoSize * 0.12);
          const badgeX = x - pad;
          const badgeY = y - pad;
          const badgeW = logoSize + pad * 2;
          const badgeH = logoSize + pad * 2;
          const radius = Math.round(badgeW * 0.22);

          ctx.save();
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

          ctx.fillStyle = '#FFFFFF';
          ctx.shadowColor = 'rgba(0, 0, 0, 0.12)';
          ctx.shadowBlur = 8;
          ctx.shadowOffsetY = 2;
          ctx.fill();
          ctx.restore();

          // Draw the logo itself
          ctx.drawImage(logoImg, x, y, logoSize, logoSize);
        }
      }
    } catch (err: any) {
      console.error('Erro render QR:', err);
      setRenderError('Não foi possível gerar o código com estes parâmetros.');
    }
  }, [payload, styleSettings, effectiveLogoUrl]);

  useEffect(() => {
    renderQRCode();
  }, [renderQRCode]);

  // Download High-Res PNG
  const handleDownloadPNG = async (targetWidth = 1024) => {
    if (!payload) return;
    try {
      const offCanvas = document.createElement('canvas');
      const effectiveLevel = effectiveLogoUrl ? 'H' : styleSettings.errorCorrection;

      await QRCode.toCanvas(offCanvas, payload, {
        errorCorrectionLevel: effectiveLevel,
        margin: styleSettings.margin,
        width: targetWidth,
        color: {
          dark: styleSettings.fgColor,
          light: styleSettings.bgColor,
        },
      });

      if (effectiveLogoUrl) {
        const ctx = offCanvas.getContext('2d');
        if (ctx) {
          const logoImg = new Image();
          logoImg.crossOrigin = 'anonymous';
          await new Promise<void>((resolve, reject) => {
            logoImg.onload = () => resolve();
            logoImg.onerror = () => reject(new Error('Erro logo export'));
            logoImg.src = effectiveLogoUrl;
          });

          const sizePercent = styleSettings.logoSizePercent || 22;
          const logoSize = Math.round((offCanvas.width * sizePercent) / 100);
          const x = (offCanvas.width - logoSize) / 2;
          const y = (offCanvas.height - logoSize) / 2;

          const pad = Math.round(logoSize * 0.12);
          const badgeX = x - pad;
          const badgeY = y - pad;
          const badgeW = logoSize + pad * 2;
          const badgeH = logoSize + pad * 2;
          const radius = Math.round(badgeW * 0.22);

          ctx.save();
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
          ctx.fillStyle = '#FFFFFF';
          ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
          ctx.shadowBlur = 12;
          ctx.fill();
          ctx.restore();

          ctx.drawImage(logoImg, x, y, logoSize, logoSize);
        }
      }

      const link = document.createElement('a');
      link.download = `qrcode-${type}-${targetWidth}px.png`;
      link.href = offCanvas.toDataURL('image/png', 1.0);
      link.click();
    } catch (e) {
      console.error(e);
    }
  };

  // Download SVG
  const handleDownloadSVG = () => {
    if (!svgString) return;
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `qrcode-${type}-vetorial.svg`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Copy Image to Clipboard
  const handleCopyImage = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob }),
        ]);
        setCopiedImage(true);
        setTimeout(() => setCopiedImage(false), 2500);
      });
    } catch (e) {
      console.error(e);
    }
  };

  // Copy Payload
  const handleCopyText = async () => {
    if (!payload) return;
    await navigator.clipboard.writeText(payload);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2500);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm flex flex-col items-center">
      <div className="flex items-center justify-between w-full mb-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Eye size={16} className="text-[#0f766e]" />
          <span className="text-xs font-bold text-[#202C39] uppercase tracking-wider">
            Pré-visualização em Tempo Real
          </span>
        </div>
        <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
          Fundo Claro Impressão
        </span>
      </div>

      {/* QR Canvas Display */}
      <div className="relative p-6 rounded-2xl bg-[#F8FAFC] border border-slate-200/90 shadow-inner flex items-center justify-center min-h-[340px] w-full max-w-[360px]">
        {payload ? (
          <canvas
            ref={canvasRef}
            className="w-full max-w-[300px] h-auto aspect-square rounded-xl shadow-md bg-white transition-transform"
          />
        ) : (
          <div className="text-center p-8 text-slate-400 flex flex-col items-center gap-2">
            <Info size={28} className="text-slate-300" />
            <p className="text-xs">Preencha o formulário para visualizar o QR Code.</p>
          </div>
        )}
      </div>

      {/* Real-time Warnings */}
      <div className="w-full space-y-2 mt-4">
        {isLowContrast && (
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50 border border-amber-200/70 text-amber-900 text-xs">
            <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
            <p>
              <strong>Contraste reduzido ({contrastRatio.toFixed(1)}:1):</strong> A cor do código e o fundo têm pouco contraste. Leitores em ambientes escuros podem falhar.
            </p>
          </div>
        )}

        {isHighDensity && (
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-blue-50 border border-blue-200/70 text-blue-900 text-xs">
            <Info size={16} className="text-blue-600 shrink-0 mt-0.5" />
            <p>
              <strong>Conteúdo extenso ({payload.length} caracteres):</strong> Gera um código com módulos muito pequenos. Recomendamos encurtar o link para facilitar a leitura.
            </p>
          </div>
        )}

        {renderError && (
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
            <AlertTriangle size={16} className="text-rose-600 shrink-0 mt-0.5" />
            <p>{renderError}</p>
          </div>
        )}
      </div>

      {/* Download Action Buttons */}
      <div className="w-full space-y-2.5 mt-5">
        <Button
          variant="primary"
          size="lg"
          icon={Download}
          onClick={() => handleDownloadPNG(1024)}
          disabled={!payload}
          className="w-full shadow-md bg-[#202C39] hover:bg-[#18222D]"
        >
          Descarregar PNG (Alta Resolução)
        </Button>

        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="secondary"
            size="md"
            icon={FileCode}
            onClick={handleDownloadSVG}
            disabled={!payload}
            className="w-full text-xs font-bold"
          >
            Descarregar SVG
          </Button>

          <Button
            variant="outline"
            size="md"
            icon={copiedImage ? Check : Copy}
            onClick={handleCopyImage}
            disabled={!payload}
            className="w-full text-xs"
          >
            {copiedImage ? 'Copiado!' : 'Copiar Imagem'}
          </Button>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <Printer size={13} className="text-slate-400" />
            Mínimo recomendado: 2×2 cm
          </span>
          <button
            type="button"
            onClick={handleCopyText}
            className="hover:text-slate-800 underline underline-offset-2 transition-colors"
          >
            {copiedText ? 'Texto copiado!' : 'Copiar texto/link'}
          </button>
        </div>
      </div>
    </div>
  );
};
