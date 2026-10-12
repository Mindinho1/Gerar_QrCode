'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { CardFormData, CARD_MODELS } from '@/lib/cardModels';
import { renderFrontFace, renderBackFace } from '@/lib/cardCanvasRenderer';
import { ViewFaceMode } from './SideToggle';
import { Eye, Layers, Printer, Scissors, Sparkles } from 'lucide-react';

interface CardPreviewProps {
  formData: CardFormData;
  viewMode: ViewFaceMode;
  includeBleed: boolean;
  onFrontCanvasReady?: (canvas: HTMLCanvasElement) => void;
  onBackCanvasReady?: (canvas: HTMLCanvasElement) => void;
  onCardClick?: () => void;
  isFlipped?: boolean;
}

export const CardPreview: React.FC<CardPreviewProps> = ({
  formData,
  viewMode,
  includeBleed,
  onFrontCanvasReady,
  onBackCanvasReady,
  onCardClick,
  isFlipped = false,
}) => {
  const frontCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const backCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const currentModel = CARD_MODELS.find((m) => m.id === formData.modelId) || CARD_MODELS[0];

  // Update canvas rendering
  const updateCanvases = useCallback(async () => {
    if (frontCanvasRef.current) {
      await renderFrontFace(frontCanvasRef.current, formData, {
        is300DPI: false,
        includeBleed,
        bleedMm: 3,
      });
      if (onFrontCanvasReady) {
        onFrontCanvasReady(frontCanvasRef.current);
      }
    }
    if (backCanvasRef.current) {
      await renderBackFace(backCanvasRef.current, formData, {
        is300DPI: false,
        includeBleed,
        bleedMm: 3,
      });
      if (onBackCanvasReady) {
        onBackCanvasReady(backCanvasRef.current);
      }
    }
  }, [formData, includeBleed, onFrontCanvasReady, onBackCanvasReady]);

  useEffect(() => {
    updateCanvases();
  }, [updateCanvases]);

  return (
    <div className="w-full flex flex-col items-center">
      {/* Visual Canvas Stage */}
      <div className="w-full bg-[#F8FAFC] border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-inner flex items-center justify-center min-h-[380px] sm:min-h-[440px] relative overflow-hidden">
        {/* Subtle grid pattern background */}
        <div
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#CBD5E1 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />

        {/* Bleed active banner */}
        {includeBleed && (
          <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-900 text-xs font-semibold backdrop-blur-sm">
            <Scissors size={13} className="text-amber-700" />
            <span>Sangria 3mm activa (marcas de corte incluídas)</span>
          </div>
        )}

        {/* View Mode: Split (Both Faces) */}
        {viewMode === 'split' ? (
          <div className="flex flex-col lg:flex-row items-center justify-center gap-8 w-full z-10">
            {/* Front */}
            <div className="flex flex-col items-center gap-2 max-w-full">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider bg-white px-3 py-1 rounded-full border border-slate-200 shadow-xs">
                Frente (Anverso)
              </span>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 hover:scale-[1.01]">
                <canvas
                  ref={frontCanvasRef}
                  className="max-w-full h-auto object-contain block"
                  style={{
                    width: '100%',
                    maxWidth: currentModel.id === 'table_tent' ? '240px' : '360px',
                    aspectRatio: currentModel.aspectRatio,
                  }}
                />
              </div>
            </div>

            {/* Back */}
            <div className="flex flex-col items-center gap-2 max-w-full">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider bg-white px-3 py-1 rounded-full border border-slate-200 shadow-xs">
                Verso (Reverso)
              </span>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 hover:scale-[1.01]">
                <canvas
                  ref={backCanvasRef}
                  className="max-w-full h-auto object-contain block"
                  style={{
                    width: '100%',
                    maxWidth: currentModel.id === 'table_tent' ? '240px' : '360px',
                    aspectRatio: currentModel.aspectRatio,
                  }}
                />
              </div>
            </div>
          </div>
        ) : (
          /* Single Face Mode */
          <div className="flex flex-col items-center gap-3 z-10 max-w-full">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider bg-white px-3.5 py-1 rounded-full border border-slate-200 shadow-xs">
              {viewMode === 'front' ? 'Frente (Anverso)' : 'Verso (Reverso)'}
            </span>

            <div
              onClick={onCardClick}
              className="relative rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 hover:scale-[1.01] cursor-pointer"
            >
              {/* We always keep both canvases in DOM so they stay rendered, but show the active one */}
              <canvas
                ref={frontCanvasRef}
                className={`max-w-full h-auto object-contain ${viewMode === 'front' ? 'block' : 'hidden'}`}
                style={{
                  width: '100%',
                  maxWidth: currentModel.id === 'table_tent' ? '280px' : '440px',
                  aspectRatio: currentModel.aspectRatio,
                }}
              />
              <canvas
                ref={backCanvasRef}
                className={`max-w-full h-auto object-contain ${viewMode === 'back' ? 'block' : 'hidden'}`}
                style={{
                  width: '100%',
                  maxWidth: currentModel.id === 'table_tent' ? '280px' : '440px',
                  aspectRatio: currentModel.aspectRatio,
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Card Info Details */}
      <div className="w-full flex items-center justify-between pt-3 px-2 text-xs text-slate-500">
        <span className="font-semibold text-slate-700">
          {currentModel.name}
        </span>
        <span className="font-mono">
          {currentModel.dimensionsMm.width} × {currentModel.dimensionsMm.height} mm • 300 DPI Raster
        </span>
      </div>
    </div>
  );
};
