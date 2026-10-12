'use client';

import React from 'react';
import { LayoutTemplate, QrCode, Sparkles } from 'lucide-react';

export const PlacaThumbnail: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`relative w-full aspect-[105/148] rounded-xl overflow-hidden bg-gradient-to-b from-slate-900 via-[#18222D] to-[#202C39] text-white shadow-md p-4 flex flex-col justify-between items-center text-center select-none ${className}`}>
      {/* Acrylic stand top highlight */}
      <div className="w-16 h-1 rounded-full bg-[#99E1D9]/40 mb-1" />

      {/* Brand Header */}
      <div>
        <h4 className="text-xs font-bold tracking-tight text-white uppercase">
          Bistrô & Lounge
        </h4>
        <p className="text-[9px] text-[#99E1D9] font-medium">
          Menu Digital & Wi-Fi
        </p>
      </div>

      {/* High impact center QR */}
      <div className="w-24 h-24 rounded-2xl bg-white p-2 flex flex-col items-center justify-center shadow-lg border-2 border-[#99E1D9]/40 my-auto">
        <QrCode size={68} className="text-[#202C39]" />
      </div>

      {/* Instruction footer */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1 text-[8px] uppercase tracking-wider font-bold bg-[#99E1D9]/20 text-[#99E1D9] px-2 py-0.5 rounded-full">
          <Sparkles size={10} /> Aponte a câmara
        </div>
        <p className="text-[8px] text-slate-400">
          Mesa 12 • Pedidos & Pagamentos
        </p>
      </div>
    </div>
  );
};
