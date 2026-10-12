'use client';

import React from 'react';
import { Shield, QrCode, User } from 'lucide-react';

export const IdVerdeThumbnail: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`relative w-full aspect-[90/54] rounded-xl overflow-hidden bg-[#060B0E] text-white shadow-md p-3.5 flex flex-col justify-between border border-emerald-500/30 select-none ${className}`}>
      {/* Circuit lines decorative glow */}
      <div className="absolute inset-0 bg-radial-gradient from-emerald-950/40 via-transparent to-transparent pointer-events-none" />
      
      {/* Top row */}
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-1.5">
          <Shield size={13} className="text-emerald-400" />
          <span className="text-[9px] font-mono font-bold tracking-wider text-emerald-400 uppercase">
            SECURE PASS
          </span>
        </div>
        <span className="text-[8px] font-mono text-slate-400">#98/B-2079</span>
      </div>

      {/* Center user + QR */}
      <div className="flex items-center gap-3 relative z-10">
        <div className="w-9 h-9 rounded-full bg-slate-800 border-2 border-emerald-400 flex items-center justify-center shrink-0">
          <User size={18} className="text-emerald-300" />
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="text-xs font-bold text-white tracking-tight truncate">
            Makhdoom Nouman
          </h4>
          <p className="text-[9px] text-emerald-400 font-medium truncate">
            Tech Lead & Security
          </p>
        </div>
        <div className="w-8 h-8 rounded-lg bg-white p-0.5 flex items-center justify-center shrink-0 shadow-sm">
          <QrCode size={26} className="text-black" />
        </div>
      </div>

      {/* Bottom bar */}
      <div className="flex items-center justify-between text-[8px] text-slate-400 border-t border-slate-800 pt-1 relative z-10">
        <span className="truncate">Digital Identity Access</span>
        <span className="text-emerald-400 font-semibold">1 QR Frente</span>
      </div>
    </div>
  );
};
