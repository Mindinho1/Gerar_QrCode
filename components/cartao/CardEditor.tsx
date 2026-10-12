'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ModelId, CardFormData, CARD_MODELS, INITIAL_MODEL_DATA } from '@/lib/cardModels';
import { renderFrontFace, renderBackFace } from '@/lib/cardCanvasRenderer';
import { downloadCanvasAsPng, exportCardToPDF } from '@/lib/exportCard';
import { CardForm } from './CardForm';
import { CardPreview } from './CardPreview';
import { SideToggle, ViewFaceMode } from './SideToggle';
import { Button } from '@/components/ui/Button';
import { 
  Download, 
  FileText, 
  Scissors, 
  RotateCcw, 
  Sparkles, 
  Check, 
  Printer, 
  Layers, 
  ShieldCheck,
  ArrowLeft,
  ChevronRight,
  Eye
} from 'lucide-react';

interface CardEditorProps {
  modelId: ModelId;
}

export const CardEditor: React.FC<CardEditorProps> = ({ modelId }) => {
  const currentModel = CARD_MODELS.find((m) => m.id === modelId) || CARD_MODELS[0];

  // Initialize formData from localStorage or default
  const [formData, setFormData] = useState<CardFormData>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(`cartao_draft_${modelId}`);
        if (saved) {
          const parsed = JSON.parse(saved);
          return { ...INITIAL_MODEL_DATA[modelId], ...parsed, modelId };
        }
      } catch (e) {
        console.warn('Erro ao carregar rascunho do localStorage', e);
      }
    }
    return INITIAL_MODEL_DATA[modelId] || INITIAL_MODEL_DATA.classic_card;
  });

  // Keep draft in localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(`cartao_draft_${modelId}`, JSON.stringify(formData));
      } catch (e) {
        console.warn('Erro ao salvar rascunho', e);
      }
    }
  }, [formData, modelId]);

  // View state
  const [viewMode, setViewMode] = useState<ViewFaceMode>('front');
  const [includeBleed, setIncludeBleed] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // References to active preview canvases
  const frontCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const backCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  // Reset to original template defaults
  const handleReset = () => {
    if (window.confirm('Deseja restaurar as informações originais deste modelo? Todas as alterações manuais serão reiniciadas.')) {
      const initial = INITIAL_MODEL_DATA[modelId];
      setFormData(initial);
      localStorage.removeItem(`cartao_draft_${modelId}`);
      showToast('Modelo restaurado para os dados de demonstração.');
    }
  };

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
      const cleanName = formData.name.replace(/[^a-zA-Z0-9]/g, '_') || 'cartao';
      await downloadCanvasAsPng(exportCanvas, `${cleanName}-${modelId}-frente-300dpi.png`);
      showToast('PNG Frente (300 DPI) descarregado com sucesso!');
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
      const cleanName = formData.name.replace(/[^a-zA-Z0-9]/g, '_') || 'cartao';
      await downloadCanvasAsPng(exportCanvas, `${cleanName}-${modelId}-verso-300dpi.png`);
      showToast('PNG Verso (300 DPI) descarregado com sucesso!');
    } catch (err) {
      console.error(err);
    } finally {
      setIsExporting(false);
    }
  };

  // Export 300 DPI Multi-page PDF (Front & Back)
  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const frontExport = document.createElement('canvas');
      const backExport = document.createElement('canvas');

      await Promise.all([
        renderFrontFace(frontExport, formData, {
          is300DPI: true,
          includeBleed,
          bleedMm: 3,
        }),
        renderBackFace(backExport, formData, {
          is300DPI: true,
          includeBleed,
          bleedMm: 3,
        }),
      ]);

      await exportCardToPDF(frontExport, backExport, formData, {
        includeBleed,
        bleedMm: 3,
        drawCropMarks: true,
      });

      showToast('PDF para Impressão Gráfica gerado com sucesso!');
    } catch (err) {
      console.error(err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Top Breadcrumb & Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <Link href="/cartoes" className="hover:text-slate-900 flex items-center gap-1 font-semibold">
              <ArrowLeft size={13} />
              Modelos
            </Link>
            <ChevronRight size={13} className="text-slate-300" />
            <span className="text-slate-800 font-bold">{currentModel.name}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#202C39] tracking-tight">
            Editor de Cartão: {currentModel.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {currentModel.tagline} • Processado 100% no seu navegador com gravação automática
          </p>
        </div>

        {/* Reset draft button */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            icon={RotateCcw}
            onClick={handleReset}
            className="text-xs text-slate-600 hover:text-slate-900 border border-slate-200"
          >
            Restaurar Padrão
          </Button>
        </div>
      </div>

      {/* Main 3-Zone Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ZONA 1 (ESQUERDA): Formulário em Secções Recolhíveis (5 Colunas) */}
        <div className="lg:col-span-5 space-y-6 order-2 lg:order-1">
          <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-[#202C39] uppercase tracking-wider">
                Personalização dos Dados
              </span>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Guardado automaticamente
              </span>
            </div>

            <CardForm
              formData={formData}
              onChange={setFormData}
              activeFace={viewMode}
              onNavigateToFace={(face) => setViewMode(face)}
            />
          </div>
        </div>

        {/* ZONA 2 (CENTRO & DIREITA): Pré-visualização & Painel de Descarga (7 Colunas) */}
        <div className="lg:col-span-7 space-y-6 order-1 lg:order-2 lg:sticky lg:top-24">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-6">
            {/* Top Toolbar: Toggle Frente/Verso & Sangria */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <SideToggle
                currentMode={viewMode}
                isFlipped={false}
                onChangeMode={setViewMode}
                onFlipToggle={() => setViewMode(viewMode === 'front' ? 'back' : 'front')}
              />

              {/* Sangria checkbox */}
              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer select-none bg-slate-50 hover:bg-slate-100 px-3 py-2 rounded-xl border border-slate-200/70 transition-colors">
                <input
                  type="checkbox"
                  checked={includeBleed}
                  onChange={(e) => setIncludeBleed(e.target.checked)}
                  className="w-4 h-4 rounded text-[#202C39] focus:ring-[#99E1D9] accent-[#202C39]"
                />
                <Scissors size={14} className="text-amber-600" />
                <span>Com sangria (3mm gráfica)</span>
              </label>
            </div>

            {/* Live Canvas Preview */}
            <CardPreview
              formData={formData}
              viewMode={viewMode}
              includeBleed={includeBleed}
              onFrontCanvasReady={(c) => {
                frontCanvasRef.current = c;
              }}
              onBackCanvasReady={(c) => {
                backCanvasRef.current = c;
              }}
              onCardClick={() => {
                if (viewMode === 'front') setViewMode('back');
                else if (viewMode === 'back') setViewMode('front');
              }}
            />

            {/* ZONA 3: Painel de Descarga e Impressão */}
            <div className="p-5 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Printer size={16} className="text-[#0f766e]" />
                  <span className="text-xs font-bold text-[#202C39] uppercase tracking-wider">
                    Opções de Exportação Prontas para Gráfica
                  </span>
                </div>
                <span className="text-[11px] font-mono font-semibold bg-white border border-slate-200 px-2.5 py-0.5 rounded-full text-slate-600">
                  300 DPI Vetorial / Raster
                </span>
              </div>

              {/* Action Buttons Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Button
                  variant="primary"
                  size="md"
                  icon={Download}
                  onClick={handleExportPngFront}
                  loading={isExporting}
                  className="w-full text-xs font-bold shadow-md bg-[#202C39] hover:bg-[#18222D]"
                >
                  PNG Frente (300 DPI)
                </Button>

                <Button
                  variant="primary"
                  size="md"
                  icon={Download}
                  onClick={handleExportPngBack}
                  loading={isExporting}
                  className="w-full text-xs font-bold shadow-md bg-[#202C39] hover:bg-[#18222D]"
                >
                  PNG Verso (300 DPI)
                </Button>

                <Button
                  variant="secondary"
                  size="md"
                  icon={FileText}
                  onClick={handleExportPDF}
                  loading={isExporting}
                  className="w-full text-xs font-bold shadow-md"
                >
                  PDF Gráfica (2 Páginas)
                </Button>
              </div>

              {/* Toast Notification */}
              {successToast && (
                <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-semibold animate-fadeIn">
                  <Check size={16} className="text-emerald-600 shrink-0" />
                  <span>{successToast}</span>
                </div>
              )}

              <p className="text-[11px] text-slate-500 leading-relaxed">
                • O arquivo PDF é gerado nas dimensões exatas de corte ({currentModel.dimensionsMm.width}×{currentModel.dimensionsMm.height} mm). Se activar sangria, adiciona 3mm de margem externa com guias e marcas de corte profissionais.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
