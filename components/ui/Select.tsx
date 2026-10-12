'use client';

import React from 'react';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  helperText?: string;
  error?: string;
  options: SelectOption[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(({
  label,
  helperText,
  error,
  options,
  className = '',
  id,
  ...props
}, ref) => {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label htmlFor={selectId} className="text-xs font-semibold text-slate-700 tracking-wide">
          {label}
        </label>
      )}

      <div className="relative flex items-center">
        <select
          ref={ref}
          id={selectId}
          className={`
            w-full appearance-none bg-white border rounded-xl py-2.5 pl-3.5 pr-10 text-sm text-slate-900 transition-all duration-200
            ${error 
              ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-200' 
              : 'border-slate-200 hover:border-slate-300 focus:border-[#99E1D9] focus:ring-2 focus:ring-[#99E1D9]/30'
            }
            focus:outline-none shadow-sm
            disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed
            ${className}
          `}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <div className="absolute right-3.5 pointer-events-none text-slate-400">
          <ChevronDown size={16} />
        </div>
      </div>

      {error ? (
        <p className="text-xs text-rose-500 font-medium">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-slate-500">{helperText}</p>
      ) : null}
    </div>
  );
});

Select.displayName = 'Select';
