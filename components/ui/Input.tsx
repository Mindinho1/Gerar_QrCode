'use client';

import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  icon?: React.ComponentType<{ className?: string; size?: number }>;
  prefixAddon?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  label,
  helperText,
  error,
  icon: Icon,
  prefixAddon,
  className = '',
  id,
  ...props
}, ref) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-xs font-semibold text-slate-700 tracking-wide">
          {label}
        </label>
      )}

      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3.5 text-slate-400 pointer-events-none flex items-center justify-center">
            <Icon size={16} />
          </div>
        )}

        {prefixAddon && (
          <div className="absolute left-3.5 text-xs font-medium text-slate-500 pointer-events-none select-none">
            {prefixAddon}
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          className={`
            w-full bg-white border rounded-xl py-2.5 text-sm text-slate-900 transition-all duration-200
            placeholder:text-slate-400 placeholder:text-xs
            ${Icon ? 'pl-10' : prefixAddon ? 'pl-14' : 'pl-3.5'}
            pr-3.5
            ${error 
              ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-200' 
              : 'border-slate-200 hover:border-slate-300 focus:border-[#99E1D9] focus:ring-2 focus:ring-[#99E1D9]/30'
            }
            focus:outline-none shadow-sm
            disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed
            ${className}
          `}
          {...props}
        />
      </div>

      {error ? (
        <p className="text-xs text-rose-500 font-medium">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-slate-500">{helperText}</p>
      ) : null}
    </div>
  );
});

Input.displayName = 'Input';
