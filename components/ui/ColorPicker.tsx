'use client';

import React from 'react';

export interface ColorPickerProps {
  label?: string;
  value: string;
  onChange: (hex: string) => void;
  presets?: string[];
  helperText?: string;
}

const DEFAULT_PRESETS = [
  '#202C39', // Gunmetal
  '#99E1D9', // Tiffany
  '#F59E0B', // Gold
  '#FFFFFF', // White
  '#0F172A', // Slate 900
  '#1E293B', // Slate 800
  '#059669', // Emerald
  '#1E40AF', // Blue
  '#E1306C', // Instagram
  '#000000', // Black
];

export const ColorPicker: React.FC<ColorPickerProps> = ({
  label,
  value,
  onChange,
  presets = DEFAULT_PRESETS,
  helperText,
}) => {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-semibold text-slate-700 tracking-wide">
          {label}
        </label>
      )}

      <div className="flex items-center gap-2">
        <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-slate-300 shadow-sm shrink-0 cursor-pointer">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="absolute -top-3 -left-3 w-16 h-16 cursor-pointer border-0 p-0"
          />
        </div>

        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#000000"
          className="w-28 uppercase text-xs font-mono font-semibold py-2 px-3 border border-slate-200 rounded-xl focus:outline-none focus:border-[#99E1D9] focus:ring-2 focus:ring-[#99E1D9]/30"
          maxLength={7}
        />

        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          {presets.slice(0, 6).map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => onChange(color)}
              className={`w-6 h-6 rounded-lg border transition-transform hover:scale-110 shrink-0 ${
                value.toLowerCase() === color.toLowerCase()
                  ? 'ring-2 ring-[#202C39] border-white scale-105'
                  : 'border-slate-300'
              }`}
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      </div>

      {helperText && <p className="text-xs text-slate-500">{helperText}</p>}
    </div>
  );
};
