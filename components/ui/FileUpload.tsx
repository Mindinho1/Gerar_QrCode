'use client';

import React, { useRef } from 'react';
import { UploadCloud, X, Image as ImageIcon } from 'lucide-react';

export interface FileUploadProps {
  label?: string;
  helperText?: string;
  value?: string; // base64 / data URL
  onChange: (dataUrl?: string) => void;
  accept?: string;
  disabled?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  label,
  helperText,
  value,
  onChange,
  accept = 'image/png,image/jpeg,image/svg+xml,image/webp',
  disabled = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      alert('A imagem é muito grande. Escolha uma imagem de até 3MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      onChange(result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="text-xs font-semibold text-slate-700 tracking-wide">
          {label}
        </label>
      )}

      {value ? (
        <div className="relative flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
          <div className="w-12 h-12 rounded-lg bg-white border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="Preview" className="w-full h-full object-contain" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-800 truncate">Imagem carregada</p>
            <p className="text-[11px] text-emerald-600 font-medium">Pronta para impressão</p>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-white transition-colors"
            title="Remover imagem"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div
          onClick={() => !disabled && fileInputRef.current?.click()}
          className={`
            border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all
            ${disabled
              ? 'border-slate-200 bg-slate-50 cursor-not-allowed opacity-60'
              : 'border-slate-300 hover:border-[#99E1D9] hover:bg-[#99E1D9]/5 bg-white'
            }
          `}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileChange}
            disabled={disabled}
            className="hidden"
          />
          <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
            <UploadCloud size={18} />
          </div>
          <div className="text-center">
            <p className="text-xs font-semibold text-slate-700">
              Clique para carregar imagem
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">
              PNG, JPG, SVG até 3MB
            </p>
          </div>
        </div>
      )}

      {helperText && <p className="text-xs text-slate-500">{helperText}</p>}
    </div>
  );
};
