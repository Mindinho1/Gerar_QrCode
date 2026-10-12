'use client';

import React from 'react';
import { CreditCard, QrCode } from 'lucide-react';

export const ClassicoThumbnail: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`relative w-full aspect-[90/50] rounded-xl overflow-hidden bg-[#182B49] text-white shadow-md p-4 flex flex-col justify-between select-none ${className}`}>
      {/* Background subtle diagonal stripe */}
      <div className="absolute top-0 right-0 w-32 h-full bg-white/5 transform skew-x-12 pointer-events-none" />
      
      {/* Header */}
      <div className="flex items-start justify-between relative z-10">
        <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-400/40 flex items-center justify-center font-bold text-amber-300 text-xs font-serif">
          DM
        </div>
        <span className="text-[9px] tracking-wider uppercase text-slate-300 font-medium">
          Torre Empresarial
        </span>
      </div>

      {/* Center name */}
      <div className="relative z-10">
        <h4 className="text-sm font-serif font-bold text-white tracking-wide">
          Dr. David Montoya
        </h4>
        <p className="text-[10px] text-amber-400 font-medium">
          Cirurgião Especialista
        </p>
      </div>

      {/* Footer contacts & QR icon hint */}
      <div className="flex items-center justify-between text-[8px] text-slate-300 border-t border-white/10 pt-1.5 relative z-10">
        <span>+351 91 234 5678</span>
        <div className="flex items-center gap-1 text-slate-200">
          <QrCode size={11} className="text-amber-300" />
          <span>Até 3 QR no verso</span>
        </div>
      </div>
    </div>
  );
};
