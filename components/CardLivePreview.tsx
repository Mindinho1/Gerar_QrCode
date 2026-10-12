'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { CardFormData, CARD_MODELS } from '@/lib/cardModels';
import { renderFrontFace, renderBackFace } from '@/lib/cardCanvasRenderer';
import { downloadCanvasAsPng, exportCardToPDF } from '@/lib/exportCard';
import { 
  Download, 
  FileText, 
  RotateCw, 
  Layers, 
  Eye, 
  Check, 
  Printer, 
  Maximize2,
  Sparkles,
  Scissors
} from 'lucide-react';

interface CardLivePreviewProps {
  formData: CardFormData;
}

export const CardLivePreview: React.FC<CardLivePreviewProps> = ({ formData }) => {
  const frontCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const backCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // View state: 'front' | 'back' | 'split' | 'flip'
  const [viewMode, setViewMode] = useState<'front' | 'back' | 'split' | 'flip'>('front');
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [includeBleed, setIncludeBleed] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportSuccessMsg, setExportSuccessMsg] = useState<string | null>(null);

  const currentModel = CARD_MODELS.find((m) => m.id === formData.modelId) || CARD_MODELS[0];

  // Render both faces on canvases whenever formData or bleed changes
  const updateCanvases = useCallback(async () => {
    if (frontCanvasRef.current) {
      await renderFrontFace(frontCanvasRef.current, formData, {
        is300DPI: false,
        includeBleed,
        bleedMm: 3,
      });
    }
    if (backCanvasRef.current) {
      await renderBackFace(backCanvasRef.current, formData, {
        is300DPI: false,
        includeBleed,
        bleedMm: 3,
      });
    }
  }, [formData, includeBleed]);

  useEffect(() => {
    updateCanvases();
  }, [updateCanvases]);

  // Export 300 DPI PNG Front
  const handleExportPngFront = async () => {
    setIsExporting(true);
    try {
      const exportCanvas = document.createElement('canvas');
      await renderFrontFace(exportCanvas, formData, {
        is300DPI: true,
        includeBleed,
        bleedMm: 3,
      });
      const name = formData.name.replace(/[^a-zA-Z0-9]/g, '_') || 'cartao';
      await downloadCanvasAsPng(exportCanvas, `${name}-frente-300dpi.png`);
      showSuccessFeedback('PNG Frente baixado com sucesso!');
    } catch (err) {
      console.error(err);
    } finally {
      setIsExporting(false);
    }
  };

  // Export 300 DPI PNG Back
  const handleExportPngBack = async () => {
    setIsExporting(true);
    try {
      const exportCanvas = document.createElement('canvas');
      await renderBackFace(exportCanvas, formData, {
        is300DPI: true,
        includeBleed,
        bleedMm: 3,
      });
      const name = formData.name.replace(/[^a-zA-Z0-9]/g, '_') || 'cartao';
      await downloadCanvasAsPng(exportCanvas, `${name}-verso-300dpi.png`);
      showSuccessFeedback('PNG Verso baixado com sucesso!');
    } catch (err) {
      console.error(err);
    } finally {
      setIsExporting(false);
    }
  };

  // Export Full PDF (Front + Back) at 300 DPI
  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const frontExportCanvas = document.createElement('canvas');
      const backExportCanvas = document.createElement('canvas');

      await Promise.all([
        renderFrontFace(frontExportCanvas, formData, {
          is300DPI: true,
          includeBleed,
          bleedMm: 3,
        }),
        renderBackFace(backExportCanvas, formData, {
          is300DPI: true,
          includeBleed,
          bleedMm: 3,
        }),
      ]);

      await exportCardToPDF(frontExportCanvas, backExportCanvas, formData, {
        includeBleed,
        bleedMm: 3,
        drawCropMarks: includeBleed,
      });

      showSuccessFeedback('PDF em 300 DPI com as 2 faces gerado com sucesso!');
    } catch (err) {
      console.error(err);
    } finally {
      setIsExporting(false);
    }
  };

  const showSuccessFeedback = (msg: string) => {
    setExportSuccessMsg(msg);
    setTimeout(() => setExportSuccessMsg(null), 3000);
  };

  return (
    <div className="preview-card-wrapper">
      {/* Header com Modos de Visualização */}
      <div className="preview-card-header">
        <div className="preview-title-group">
          <div className="live-indicator">
            <span className="live-pulse" />
            <span className="live-text">Ao Vivo</span>
          </div>
          <h3 className="preview-headline">Pré-visualização</h3>
        </div>

        {/* Segmented View Mode Tabs */}
        <div className="view-mode-tabs">
          <button
            type="button"
            className={`view-tab-btn ${viewMode === 'front' ? 'active' : ''}`}
            onClick={() => setViewMode('front')}
          >
            Frente
          </button>
          <button
            type="button"
            className={`view-tab-btn ${viewMode === 'back' ? 'active' : ''}`}
            onClick={() => setViewMode('back')}
          >
            Verso
          </button>
          <button
            type="button"
            className={`view-tab-btn ${viewMode === 'split' ? 'active' : ''}`}
            onClick={() => setViewMode('split')}
          >
            Lado a Lado
          </button>
          <button
            type="button"
            className={`view-tab-btn ${viewMode === 'flip' ? 'active' : ''}`}
            onClick={() => setViewMode('flip')}
          >
            <RotateCw size={13} />
            <span>Giro 3D</span>
          </button>
        </div>
      </div>

      {/* Opções de Impressão e Sangria */}
      <div className="print-specs-bar">
        <div className="specs-info">
          <span className="spec-badge">
            {currentModel.dimensionsMm.width}×{currentModel.dimensionsMm.height} mm
          </span>
          <span className="spec-badge text-emerald-600 dark:text-emerald-400">
            300 DPI Escala Real
          </span>
          <span className="spec-badge text-indigo-600 dark:text-indigo-400">
            Correção Erros Nível H
          </span>
        </div>

        <label className="bleed-toggle-label">
          <input
            type="checkbox"
            checked={includeBleed}
            onChange={(e) => setIncludeBleed(e.target.checked)}
            className="bleed-checkbox"
          />
          <Scissors size={14} className="text-red-500" />
          <span>Sangria de 3 mm (Bleed)</span>
        </label>
      </div>

      {/* ÁREA DE EXIBIÇÃO DO CARTÃO */}
      <div className="canvas-presentation-area">
        {/* Modo 1: Somente Frente */}
        {viewMode === 'front' && (
          <div className="single-card-frame">
            <div className="face-label-tag">Face: FRENTE</div>
            <div className="canvas-shadow-box">
              <canvas ref={frontCanvasRef} className="card-render-canvas" />
            </div>
          </div>
        )}

        {/* Modo 2: Somente Verso */}
        {viewMode === 'back' && (
          <div className="single-card-frame">
            <div className="face-label-tag">Face: VERSO</div>
            <div className="canvas-shadow-box">
              <canvas ref={backCanvasRef} className="card-render-canvas" />
            </div>
          </div>
        )}

        {/* Modo 3: Lado a Lado (Frente & Verso) */}
        {viewMode === 'split' && (
          <div className="split-cards-container">
            <div className="split-card-item">
              <div className="face-label-tag">FRENTE</div>
              <div className="canvas-shadow-box">
                <canvas ref={frontCanvasRef} className="card-render-canvas" />
              </div>
            </div>
            <div className="split-card-item">
              <div className="face-label-tag">VERSO</div>
              <div className="canvas-shadow-box">
                <canvas ref={backCanvasRef} className="card-render-canvas" />
              </div>
            </div>
          </div>
        )}

        {/* Modo 4: Giro 3D Interativo (Flip) */}
        {viewMode === 'flip' && (
          <div className="flip-3d-container">
            <div 
              className={`flip-card-inner ${isFlipped ? 'flipped' : ''}`}
              onClick={() => setIsFlipped(!isFlipped)}
            >
              <div className="flip-card-front">
                <div className="face-label-tag">FRENTE (Clique p/ virar)</div>
                <div className="canvas-shadow-box">
                  <canvas ref={frontCanvasRef} className="card-render-canvas" />
                </div>
              </div>
              <div className="flip-card-back">
                <div className="face-label-tag">VERSO (Clique p/ virar)</div>
                <div className="canvas-shadow-box">
                  <canvas ref={backCanvasRef} className="card-render-canvas" />
                </div>
              </div>
            </div>

            <button
              type="button"
              className="btn-flip-trigger"
              onClick={() => setIsFlipped(!isFlipped)}
            >
              <RotateCw size={15} />
              <span>Virar Cartão ({isFlipped ? 'Ver Frente' : 'Ver Verso'})</span>
            </button>
          </div>
        )}
      </div>

      {/* Success banner */}
      {exportSuccessMsg && (
        <div className="export-success-banner">
          <Check size={16} />
          <span>{exportSuccessMsg}</span>
        </div>
      )}

      {/* SEÇÃO DE EXPORTAÇÃO */}
      <div className="export-actions-panel">
        <h4 className="export-section-title">
          <Download size={16} />
          <span>Opções de Exportação Profissional</span>
        </h4>

        {/* Botão Principal: PDF 300 DPI com as 2 Faces */}
        <button
          type="button"
          className="btn-export-pdf-primary"
          onClick={handleExportPDF}
          disabled={isExporting}
        >
          <FileText size={18} />
          <div className="btn-text-col">
            <span className="btn-main-label">Exportar PDF (Frente + Verso)</span>
            <span className="btn-sub-label">
              300 DPI com {includeBleed ? 'Sangria de 3 mm e marcas de corte' : 'dimensões exactas de impressão'}
            </span>
          </div>
        </button>

        {/* Botões Secundários: PNGs em separado a 300 DPI */}
        <div className="png-export-buttons-grid">
          <button
            type="button"
            className="btn-export-png-secondary"
            onClick={handleExportPngFront}
            disabled={isExporting}
          >
            <Download size={15} />
            <span>PNG Frente (300 DPI)</span>
          </button>

          <button
            type="button"
            className="btn-export-png-secondary"
            onClick={handleExportPngBack}
            disabled={isExporting}
          >
            <Download size={15} />
            <span>PNG Verso (300 DPI)</span>
          </button>
        </div>

        {/* Garantia técnica */}
        <div className="print-guarantee-note">
          <Sparkles size={14} className="text-amber-500 shrink-0" />
          <span>
            Arquivos gerados a <strong>300 DPI</strong> no padrão CMYK/RGB gráfico internacional, prontos para envio direto a gráficas rápidas ou industriais.
          </span>
        </div>
      </div>
    </div>
  );
};
