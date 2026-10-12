'use client';

import React from 'react';
import { Share2, QrCode } from 'lucide-react';

export const RedesThumbnail: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`relative w-full aspect-[90/50] rounded-xl overflow-hidden bg-[#0F172A] text-white shadow-md p-4 flex flex-col justify-between select-none border border-slate-800 ${className}`}>
      {/* Top Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#E1306C] to-amber-500 p-[2px]">
            <div className="w-full h-full bg-[#0F172A] rounded-full flex items-center justify-center font-bold text-[10px]">
              AS
            </div>
          </div>
          <div>
            <h4 className="text-xs font-bold text-white leading-tight">Alexandre Silva</h4>
            <p className="text-[9px] text-[#E1306C] font-semibold">@alexandredesign</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-5 h-5 rounded-full bg-[#25D366]/20 flex items-center justify-center text-[#25D366] text-[9px] font-bold">W</div>
          <div className="w-5 h-5 rounded-full bg-[#E1306C]/20 flex items-center justify-center text-[#E1306C] text-[9px] font-bold">I</div>
        </div>
      </div>

      {/* Center bio */}
      <p className="text-[9px] text-slate-300 line-clamp-1">
        Criador de Conteúdo & Design Digital • Conecte-se
      </p>

      {/* Bottom */}
      <div className="flex items-center justify-between text-[8px] text-slate-400 border-t border-slate-800 pt-1.5">
        <span>Maputo • Moçambique</span>
        <span className="text-[#99E1D9] font-medium flex items-center gap-1">
          <QrCode size={11} /> Até 3 QR no verso
        </span>
      </div>
    </div>
  );
};
