'use client';

import React from 'react';
import { Award, QrCode } from 'lucide-react';

export const PretoDouradoThumbnail: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`relative w-full aspect-[90/50] rounded-xl overflow-hidden bg-[#0A0D14] text-white shadow-md p-4 flex flex-col justify-between border border-amber-500/20 select-none ${className}`}>
      {/* Luxury gold border outline */}
      <div className="absolute inset-2 border border-amber-400/20 rounded-lg pointer-events-none" />

      {/* Header Monogram */}
      <div className="flex items-start justify-between relative z-10">
        <div className="flex items-center gap-1.5">
          <Award size={14} className="text-amber-400" />
          <span className="text-[9px] uppercase tracking-widest text-amber-300 font-semibold">
            LUXURY EDITION
          </span>
        </div>
        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-600 to-amber-300 p-[1px] flex items-center justify-center">
          <div className="w-full h-full bg-[#0A0D14] rounded-full flex items-center justify-center text-[10px] font-serif font-bold text-amber-300">
            AR
          </div>
        </div>
      </div>

      {/* Centered Name */}
      <div className="text-center relative z-10">
        <h4 className="text-sm font-serif font-bold text-amber-100 tracking-wider">
          Aurum & Royal
        </h4>
        <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto my-1" />
        <p className="text-[9px] uppercase tracking-widest text-slate-400 font-light">
          Private Banking & Law
        </p>
      </div>

      {/* Bottom */}
      <div className="flex items-center justify-between text-[8px] text-slate-400 relative z-10 px-1">
        <span>Lisboa • Londres</span>
        <span className="text-amber-400 font-medium flex items-center gap-1">
          <QrCode size={11} /> 1 QR Frente/Verso
        </span>
      </div>
    </div>
  );
};
