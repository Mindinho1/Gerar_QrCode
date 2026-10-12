'use client';

import React from 'react';
import { QRType } from '@/lib/builders';
import { isMandatorySocialType, BRAND_SVGS } from '@/lib/brandIcons';
import { ColorPicker } from '@/components/ui/ColorPicker';
import { FileUpload } from '@/components/ui/FileUpload';
import { Lock, Sparkles, Sliders, ShieldCheck } from 'lucide-react';

export interface QRStyleSettings {
  fgColor: string;
  bgColor: string;
  errorCorrection: 'L' | 'M' | 'Q' | 'H';
  customLogoUrl?: string;
  logoSizePercent: number; // 15 to 28
  margin: number;
}

interface QRStyleOptionsProps {
  type: QRType;
  styleSettings: QRStyleSettings;
  onChange: (updated: QRStyleSettings) => void;
}

export const QR_PALETTES = [
  { name: 'Gunmetal Clássico', fg: '#202C39', bg: '#FFFFFF' },
  { name: 'Tiffany Noturno', fg: '#0F766E', bg: '#FFFFFF' },
  { name: 'Preto Puro', fg: '#000000', bg: '#FFFFFF' },
  { name: 'Azul Marinho', fg: '#1E293B', bg: '#FFFFFF' },
  { name: 'Dourado Escuro', fg: '#B45309', bg: '#FFFFFF' },
  { name: 'Esmeralda', fg: '#047857', bg: '#FFFFFF' },
];

export const QRStyleOptions: React.FC<QRStyleOptionsProps> = ({
  type,
  styleSettings,
  onChange,
}) => {
  const isSocial = isMandatorySocialType(type);
  const socialBrand = isSocial ? BRAND_SVGS[type as keyof typeof BRAND_SVGS] : null;

  return (
    <div className="space-y-6">
      {/* Color Swatches */}
      <div>
        <label className="text-xs font-semibold text-slate-700 tracking-wide block mb-2">
          Combinações de Cores Rápidas
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {QR_PALETTES.map((pal) => (
            <button
              key={pal.name}
              type="button"
              onClick={() => onChange({ ...styleSettings, fgColor: pal.fg, bgColor: pal.bg })}
              className={`flex items-center gap-2 p-2 rounded-xl border text-xs font-medium transition-all ${
                styleSettings.fgColor.toLowerCase() === pal.fg.toLowerCase()
                  ? 'border-[#99E1D9] bg-[#99E1D9]/15 ring-2 ring-[#99E1D9]/30 text-[#202C39] font-bold'
                  : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
              }`}
            >
              <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0" style={{ backgroundColor: pal.fg }} />
              <span className="truncate">{pal.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Color Pickers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        <ColorPicker
          label="Cor do QR Code (Frente)"
          value={styleSettings.fgColor}
          onChange={(fg) => onChange({ ...styleSettings, fgColor: fg })}
          helperText="Recomendamos cores escuras para contraste ideal."
        />
        <ColorPicker
          label="Cor de Fundo"
          value={styleSettings.bgColor}
          onChange={(bg) => onChange({ ...styleSettings, bgColor: bg })}
          helperText="Mantenha fundo claro para leitura rápida em scanners."
        />
      </div>

      {/* Central Logo Section */}
      <div className="pt-2 border-t border-slate-100">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold text-slate-700 tracking-wide">
            Logo Central
          </label>
          {isSocial && (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              <Lock size={12} />
              Ícone Oficial Automático
            </span>
          )}
        </div>

        {isSocial && socialBrand ? (
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-xs">
              <svg viewBox="0 0 24 24" className="w-6 h-6" fill={socialBrand.color}>
                <path d={socialBrand.path} />
              </svg>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">
                Selo oficial {socialBrand.name} aplicado no centro
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                O logotipo oficial é renderizado com badge de alto contraste e correção de erro (H) para garantir legibilidade instantânea em qualquer leitor. O campo de upload personalizado fica bloqueado para este tipo.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <FileUpload
              value={styleSettings.customLogoUrl}
              onChange={(logo) =>
                onChange({
                  ...styleSettings,
                  customLogoUrl: logo,
                  errorCorrection: logo ? 'H' : styleSettings.errorCorrection,
                })
              }
              helperText="Carregue a marca da sua empresa ou avatar. Ajustamos a correção de erro para alta densidade."
            />

            {styleSettings.customLogoUrl && (
              <div>
                <div className="flex justify-between text-xs text-slate-600 mb-1">
                  <span>Tamanho do Logo no Centro</span>
                  <span className="font-mono">{styleSettings.logoSizePercent}%</span>
                </div>
                <input
                  type="range"
                  min={16}
                  max={26}
                  value={styleSettings.logoSizePercent}
                  onChange={(e) =>
                    onChange({
                      ...styleSettings,
                      logoSizePercent: Number(e.target.value),
                    })
                  }
                  className="w-full accent-[#202C39] cursor-pointer"
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Margem e Nível de Erro */}
      <div className="pt-2 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-slate-700 tracking-wide block mb-1.5">
            Margem de Segurança (Quiet Zone)
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => onChange({ ...styleSettings, margin: m })}
                className={`flex-1 py-1.5 text-xs rounded-xl font-semibold border transition-all ${
                  styleSettings.margin === m
                    ? 'border-[#99E1D9] bg-[#99E1D9]/20 text-[#202C39]'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                {m}x
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 tracking-wide block mb-1.5">
            Correção de Erro
          </label>
          <div className="flex gap-1.5">
            {(['L', 'M', 'Q', 'H'] as const).map((lvl) => {
              const isLockedH = (isSocial || styleSettings.customLogoUrl) && lvl !== 'H';
              return (
                <button
                  key={lvl}
                  type="button"
                  disabled={isLockedH}
                  onClick={() => onChange({ ...styleSettings, errorCorrection: lvl })}
                  className={`flex-1 py-1.5 text-xs rounded-xl font-semibold border transition-all ${
                    styleSettings.errorCorrection === lvl
                      ? 'border-[#202C39] bg-[#202C39] text-white'
                      : isLockedH
                      ? 'opacity-40 cursor-not-allowed bg-slate-100 border-slate-200 text-slate-400'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                  title={lvl === 'H' ? 'Alta (30% redundância, ideal com logo)' : `Nível ${lvl}`}
                >
                  {lvl}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
