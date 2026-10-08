'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import QRCode from 'qrcode';
import { 
  Download, 
  Copy, 
  Check, 
  Palette, 
  Shield, 
  Image as ImageIcon, 
  Trash2, 
  Printer, 
  Maximize2,
  FileCode,
  Sparkles
} from 'lucide-react';

interface QRPreviewProps {
  payload: string;
  typeLabel: string;
}

const COLOR_SWATCHES = [
  { name: 'Gunmetal Clássico', fg: '#202C39', bg: '#ffffff' },
  { name: 'Tiffany Noturno', fg: '#0f766e', bg: '#ffffff' },
  { name: 'Azul Ardósia', fg: '#1e293b', bg: '#ffffff' },
  { name: 'Dourado Premium', fg: '#b45309', bg: '#ffffff' },
  { name: 'Rubi Intenso', fg: '#991b1b', bg: '#ffffff' },
  { name: 'Preto Puro', fg: '#000000', bg: '#ffffff' },
];

export const QRPreview: React.FC<QRPreviewProps> = ({ payload, typeLabel }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [fgColor, setFgColor] = useState<string>('#202C39');
  const [bgColor, setBgColor] = useState<string>('#ffffff');
  const [errorLevel, setErrorLevel] = useState<'L' | 'M' | 'Q' | 'H'>('H');
  const [logoDataUrl, setLogoDataUrl] = useState<string | null>(null);
  const [logoSizePercent, setLogoSizePercent] = useState<number>(22);
  const [copied, setCopied] = useState<boolean>(false);
  const [copiedPayload, setCopiedPayload] = useState<boolean>(false);
  const [renderError, setRenderError] = useState<string | null>(null);
  const [sizePx, setSizePx] = useState<number>(1024); // High res export

  // Render QR Code onto Canvas with optional logo
  const renderQRCode = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (!payload || payload.trim() === '') {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      setRenderError(null);
      return;
    }

    try {
      setRenderError(null);
      // Auto upgrade error level to 'H' if logo is present
      const effectiveLevel = logoDataUrl ? 'H' : errorLevel;

      // 1. Draw base QR code on canvas
      await QRCode.toCanvas(canvas, payload, {
        errorCorrectionLevel: effectiveLevel,
        margin: 2,
        width: 340,
        color: {
          dark: fgColor,
          light: bgColor,
        },
      });

      // 2. If logo exists, composite the logo with white badge onto canvas
      if (logoDataUrl) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.src = logoDataUrl;
          await new Promise<void>((resolve, reject) => {
            img.onload = () => resolve();
            img.onerror = () => reject(new Error('Falha ao carregar o logótipo'));
          });

          const canvasSize = canvas.width;
          const maxLogoSize = (canvasSize * logoSizePercent) / 100;

          // Aspect ratio scaling
          let logoW = img.width;
          let logoH = img.height;
          if (logoW > logoH) {
            logoH = (logoH / logoW) * maxLogoSize;
            logoW = maxLogoSize;
          } else {
            logoW = (logoW / logoH) * maxLogoSize;
            logoH = maxLogoSize;
          }

          const padding = 8;
          const bgW = logoW + padding * 2;
          const bgH = logoH + padding * 2;
          const bgX = (canvasSize - bgW) / 2;
          const bgY = (canvasSize - bgH) / 2;
          const logoX = (canvasSize - logoW) / 2;
          const logoY = (canvasSize - logoH) / 2;

          // Desenhar fundo suave com cantos arredondados para proteger a leitura
          ctx.save();
          ctx.fillStyle = bgColor === '#ffffff' ? '#ffffff' : '#ffffff';
          ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
          ctx.shadowBlur = 10;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 2;

          // Desenhar retângulo arredondado para o badge do logotipo
          const radius = 8;
          ctx.beginPath();
          ctx.moveTo(bgX + radius, bgY);
          ctx.lineTo(bgX + bgW - radius, bgY);
          ctx.quadraticCurveTo(bgX + bgW, bgY, bgX + bgW, bgY + radius);
          ctx.lineTo(bgX + bgW, bgY + bgH - radius);
          ctx.quadraticCurveTo(bgX + bgW, bgY + bgH, bgX + bgW - radius, bgY + bgH);
          ctx.lineTo(bgX + radius, bgY + bgH);
          ctx.quadraticCurveTo(bgX, bgY + bgH, bgX, bgY + bgH - radius);
          ctx.lineTo(bgX, bgY + radius);
          ctx.quadraticCurveTo(bgX, bgY, bgX + radius, bgY);
          ctx.closePath();
          ctx.fill();

          ctx.restore();

          // Desenhar imagem do logotipo
          ctx.drawImage(img, logoX, logoY, logoW, logoH);
        }
      }
    } catch (err: any) {
      console.error('Erro ao renderizar QR Code:', err);
      setRenderError(err.message || 'Erro ao gerar QR Code');
    }
  }, [payload, fgColor, bgColor, errorLevel, logoDataUrl, logoSizePercent]);

  useEffect(() => {
    renderQRCode();
  }, [renderQRCode]);

  // Handle Logo Upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setLogoDataUrl(event.target.result as string);
          setErrorLevel('H'); // Forçar nível alto para legibilidade
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Download High-Resolution PNG
  const handleDownloadPNG = async () => {
    if (!payload) return;

    try {
      // Create offscreen canvas with full target resolution
      const exportCanvas = document.createElement('canvas');
      exportCanvas.width = sizePx;
      exportCanvas.height = sizePx;

      const effectiveLevel = logoDataUrl ? 'H' : errorLevel;

      await QRCode.toCanvas(exportCanvas, payload, {
        errorCorrectionLevel: effectiveLevel,
        margin: 3,
        width: sizePx,
        color: {
          dark: fgColor,
          light: bgColor,
        },
      });

      if (logoDataUrl) {
        const ctx = exportCanvas.getContext('2d');
        if (ctx) {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.src = logoDataUrl;
          await new Promise<void>((res) => {
            img.onload = () => res();
          });

          const maxLogoSize = (sizePx * logoSizePercent) / 100;
          let logoW = img.width;
          let logoH = img.height;
          if (logoW > logoH) {
            logoH = (logoH / logoW) * maxLogoSize;
            logoW = maxLogoSize;
          } else {
            logoW = (logoW / logoH) * maxLogoSize;
            logoH = maxLogoSize;
          }

          const padding = (sizePx / 340) * 8;
          const bgW = logoW + padding * 2;
          const bgH = logoH + padding * 2;
          const bgX = (sizePx - bgW) / 2;
          const bgY = (sizePx - bgH) / 2;
          const logoX = (sizePx - logoW) / 2;
          const logoY = (sizePx - logoH) / 2;

          ctx.save();
          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
          ctx.shadowBlur = (sizePx / 340) * 10;
          const radius = (sizePx / 340) * 8;

          ctx.beginPath();
          ctx.moveTo(bgX + radius, bgY);
          ctx.lineTo(bgX + bgW - radius, bgY);
          ctx.quadraticCurveTo(bgX + bgW, bgY, bgX + bgW, bgY + radius);
          ctx.lineTo(bgX + bgW, bgY + bgH - radius);
          ctx.quadraticCurveTo(bgX + bgW, bgY + bgH, bgX + bgW - radius, bgY + bgH);
          ctx.lineTo(bgX + radius, bgY + bgH);
          ctx.quadraticCurveTo(bgX, bgY + bgH, bgX, bgY + bgH - radius);
          ctx.lineTo(bgX, bgY + radius);
          ctx.quadraticCurveTo(bgX, bgY, bgX + radius, bgY);
          ctx.closePath();
          ctx.fill();
          ctx.restore();

          ctx.drawImage(img, logoX, logoY, logoW, logoH);
        }
      }

      const link = document.createElement('a');
      link.download = `qrcode-${typeLabel.toLowerCase()}-${Date.now()}.png`;
      link.href = exportCanvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Falha ao exportar PNG:', err);
    }
  };

  // Download SVG
  const handleDownloadSVG = async () => {
    if (!payload) return;
    try {
      const effectiveLevel = logoDataUrl ? 'H' : errorLevel;
      const svgString = await QRCode.toString(payload, {
        type: 'svg',
        errorCorrectionLevel: effectiveLevel,
        margin: 2,
        color: {
          dark: fgColor,
          light: bgColor,
        },
      });

      const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `qrcode-${typeLabel.toLowerCase()}-${Date.now()}.svg`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Falha ao exportar SVG:', err);
    }
  };

  // Copy to Clipboard (PNG Image)
  const handleCopyImage = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2200);
      });
    } catch (err) {
      console.warn('Clipboard writeImage not fully supported, copying payload instead');
      navigator.clipboard.writeText(payload);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  // Copy Raw Payload
  const handleCopyPayload = () => {
    if (!payload) return;
    navigator.clipboard.writeText(payload);
    setCopiedPayload(true);
    setTimeout(() => setCopiedPayload(false), 2000);
  };

  // Print
  const handlePrint = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Imprimir QR Code - ${typeLabel}</title>
            <style>
              body {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                margin: 0;
                font-family: sans-serif;
                background: white;
              }
              img { max-width: 320px; width: 100%; border-radius: 8px; }
              h2 { margin-bottom: 8px; color: #111; }
              p { color: #555; margin-top: 4px; font-size: 14px; max-width: 400px; text-align: center; word-break: break-all; }
            </style>
          </head>
          <body>
            <h2>QR Code (${typeLabel})</h2>
            <img src="${dataUrl}" alt="QR Code" />
            <p>${payload}</p>
            <script>
              window.onload = function() {
                window.print();
                window.onafterprint = function() { window.close(); }
              }
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const hasData = Boolean(payload && payload.trim());

  return (
    <div className="preview-card">
      <div className="preview-header">
        <div>
          <span className="live-tag">
            <span className="pulse-dot"></span> Tempo Real
          </span>
          <h3 className="preview-title">Visualização</h3>
        </div>
        <div className="preview-badge">{typeLabel}</div>
      </div>

      {/* QR Canvas Display */}
      <div className="canvas-wrapper">
        {hasData ? (
          <div className="qr-container">
            <canvas ref={canvasRef} className="qr-canvas" />
          </div>
        ) : (
          <div className="empty-placeholder">
            <div className="empty-icon-box">
              <Sparkles size={32} className="empty-icon" />
            </div>
            <p className="empty-title">Aguardando dados...</p>
            <p className="empty-desc">
              Preencha os campos ao lado para gerar o seu QR Code instantaneamente.
            </p>
          </div>
        )}

        {renderError && (
          <div className="error-banner">
            <span>Aviso: {renderError}</span>
          </div>
        )}
      </div>

      {/* Payload summary */}
      {hasData && (
        <div className="payload-box">
          <div className="payload-header">
            <span className="payload-title">Conteúdo Codificado ({payload.length} caracteres):</span>
            <button
              type="button"
              className="copy-text-btn"
              onClick={handleCopyPayload}
              title="Copiar texto bruto"
            >
              {copiedPayload ? <Check size={14} /> : <Copy size={14} />}
              <span>{copiedPayload ? 'Copiado' : 'Copiar texto'}</span>
            </button>
          </div>
          <div className="payload-preview">{payload}</div>
        </div>
      )}

      {/* Customization Controls */}
      <div className="customization-accordion">
        {/* Colors */}
        <div className="control-group">
          <label className="control-label">
            <Palette size={16} />
            <span>Cores & Estilo</span>
          </label>
          <div className="color-swatches-row">
            {COLOR_SWATCHES.map((swatch) => (
              <button
                key={swatch.name}
                type="button"
                className={`color-chip ${fgColor === swatch.fg ? 'selected' : ''}`}
                style={{ backgroundColor: swatch.fg }}
                onClick={() => {
                  setFgColor(swatch.fg);
                  setBgColor(swatch.bg);
                }}
                title={swatch.name}
              />
            ))}
            <div className="custom-color-picker">
              <input
                type="color"
                value={fgColor}
                onChange={(e) => setFgColor(e.target.value)}
                className="native-color-picker"
                title="Personalizar cor do QR Code"
              />
            </div>
          </div>
        </div>

        {/* Error Correction Level */}
        <div className="control-group">
          <div className="label-with-tip">
            <label className="control-label">
              <Shield size={16} />
              <span>Nível de Redundância (Correção de Erros)</span>
            </label>
            <span className="badge-hint">{errorLevel === 'H' ? '30% (Ideal p/ Logo)' : errorLevel}</span>
          </div>
          <div className="segmented-control">
            {(['L', 'M', 'Q', 'H'] as const).map((lvl) => (
              <button
                key={lvl}
                type="button"
                className={`segment-btn ${errorLevel === lvl ? 'active' : ''}`}
                onClick={() => setErrorLevel(lvl)}
              >
                {lvl} {lvl === 'H' ? '★' : ''}
              </button>
            ))}
          </div>
        </div>

        {/* Optional Center Logo */}
        <div className="control-group">
          <label className="control-label">
            <ImageIcon size={16} />
            <span>Logótipo Central (Opcional)</span>
          </label>
          {logoDataUrl ? (
            <div className="logo-preview-row">
              <img src={logoDataUrl} alt="Logo" className="logo-thumb" />
              <div className="logo-actions">
                <span className="logo-info">Logótipo activo</span>
                <button
                  type="button"
                  className="remove-logo-btn"
                  onClick={() => setLogoDataUrl(null)}
                >
                  <Trash2 size={14} /> Remover
                </button>
              </div>
            </div>
          ) : (
            <label className="upload-logo-box">
              <input
                type="file"
                accept="image/png, image/jpeg, image/svg+xml, image/webp"
                onChange={handleLogoUpload}
                className="hidden-file-input"
              />
              <ImageIcon size={18} />
              <span>Inserir logo no centro (.png, .jpg, .svg)</span>
            </label>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="actions-section">
        <div className="primary-download-row">
          <button
            type="button"
            className="btn-download-primary"
            onClick={handleDownloadPNG}
            disabled={!hasData}
          >
            <Download size={18} />
            <span>Baixar PNG (Alta Resolução)</span>
          </button>
          <button
            type="button"
            className="btn-download-secondary"
            onClick={handleDownloadSVG}
            disabled={!hasData}
            title="Download em vetor SVG (escalável sem perda)"
          >
            <FileCode size={18} />
            <span>SVG</span>
          </button>
        </div>

        <div className="secondary-actions-row">
          <button
            type="button"
            className="btn-action-outline"
            onClick={handleCopyImage}
            disabled={!hasData}
          >
            {copied ? <Check size={16} className="text-emerald" /> : <Copy size={16} />}
            <span>{copied ? 'Copiado para Área de Transferência' : 'Copiar Imagem'}</span>
          </button>

          <button
            type="button"
            className="btn-action-outline btn-icon-only"
            onClick={handlePrint}
            disabled={!hasData}
            title="Imprimir QR Code"
          >
            <Printer size={16} />
          </button>
        </div>

        <div className="guarantee-box">
          <span className="dot-green"></span>
          <span>100% Estático &bull; Não expira &bull; Gerado localmente no seu browser</span>
        </div>
      </div>
    </div>
  );
};
