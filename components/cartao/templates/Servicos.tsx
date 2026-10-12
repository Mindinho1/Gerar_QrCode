'use client';

import React from 'react';
import { Stethoscope, CheckCircle2, QrCode } from 'lucide-react';

export const ServicosThumbnail: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`relative w-full aspect-[90/50] rounded-xl overflow-hidden bg-[#1A4959] text-white shadow-md p-3.5 flex flex-col justify-between select-none ${className}`}>
      {/* Top Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-teal-500/30 flex items-center justify-center text-[#99E1D9]">
            <Stethoscope size={14} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white leading-tight">Clínica Vitalis</h4>
            <p className="text-[9px] text-[#99E1D9]">Medicina & Estética</p>
          </div>
        </div>
        <span className="text-[8px] bg-white/10 px-2 py-0.5 rounded-full text-slate-200">
          Consultas
        </span>
      </div>

      {/* Services List Preview */}
      <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[8px] text-slate-200 my-1">
        <div className="flex items-center gap-1">
          <span className="w-1 h-1 rounded-full bg-[#99E1D9]" /> Harmonização Facial
        </div>
        <div className="flex items-center gap-1">
          <span className="w-1 h-1 rounded-full bg-[#99E1D9]" /> Dermatologia
        </div>
        <div className="flex items-center gap-1">
          <span className="w-1 h-1 rounded-full bg-[#99E1D9]" /> Nutrição Clínica
        </div>
        <div className="flex items-center gap-1">
          <span className="w-1 h-1 rounded-full bg-[#99E1D9]" /> Bioestimuladores
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-[8px] text-slate-300 border-t border-white/15 pt-1">
        <span>+351 21 000 0000</span>
        <span className="text-[#99E1D9] font-medium flex items-center gap-1">
          <QrCode size={11} /> 1 QR Frente/Verso
        </span>
      </div>
    </div>
  );
};
