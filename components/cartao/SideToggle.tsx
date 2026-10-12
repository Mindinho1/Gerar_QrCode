'use client';

import React from 'react';
import { Eye, RotateCw, SplitSquareVertical } from 'lucide-react';

export type ViewFaceMode = 'front' | 'back' | 'split' | 'flip';

interface SideToggleProps {
  currentMode: ViewFaceMode;
  isFlipped: boolean;
  onChangeMode: (mode: ViewFaceMode) => void;
  onFlipToggle?: () => void;
  className?: string;
}

export const SideToggle: React.FC<SideToggleProps> = ({
  currentMode,
  isFlipped,
  onChangeMode,
  onFlipToggle,
  className = '',
}) => {
  return (
    <div className={`inline-flex items-center p-1.5 bg-slate-100 rounded-2xl border border-slate-200/80 gap-1 shadow-xs ${className}`}>
      <button
        type="button"
        onClick={() => onChangeMode('front')}
        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
          currentMode === 'front'
            ? 'bg-white text-[#202C39] shadow-sm'
            : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
        }`}
      >
        Frente
      </button>

      <button
        type="button"
        onClick={() => onChangeMode('back')}
        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
          currentMode === 'back'
            ? 'bg-white text-[#202C39] shadow-sm'
            : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
        }`}
      >
        Verso
      </button>

      <div className="w-[1px] h-4 bg-slate-300 mx-1" />

      <button
        type="button"
        onClick={() => onChangeMode('split')}
        className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
          currentMode === 'split'
            ? 'bg-[#202C39] text-white shadow-sm font-semibold'
            : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
        }`}
        title="Ver Frente e Verso lado a lado"
      >
        <SplitSquareVertical size={13} />
        <span className="hidden sm:inline">Ambas</span>
      </button>

      {onFlipToggle && (
        <button
          type="button"
          onClick={onFlipToggle}
          className="px-2.5 py-1.5 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-white/70 transition-all flex items-center gap-1"
          title="Virar Cartão (Girar)"
        >
          <RotateCw size={13} />
          <span className="hidden md:inline">Virar</span>
        </button>
      )}
    </div>
  );
};
