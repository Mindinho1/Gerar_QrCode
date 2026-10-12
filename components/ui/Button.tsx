'use client';

import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gold' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ComponentType<{ className?: string; size?: number }>;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2.5 gap-2',
    lg: 'text-base px-6 py-3.5 gap-2.5 font-semibold',
  };

  const variantStyles = {
    primary: 'bg-[#202C39] text-white hover:bg-[#18222D] focus:ring-[#202C39]/40 shadow-sm hover:shadow',
    secondary: 'bg-[#99E1D9] text-[#202C39] font-semibold hover:bg-[#7FD1C8] focus:ring-[#99E1D9]/50 shadow-sm hover:shadow',
    outline: 'border border-slate-300 text-[#202C39] hover:bg-slate-100 hover:border-slate-400 focus:ring-slate-300',
    ghost: 'text-[#202C39] hover:bg-slate-100/80 focus:ring-slate-200',
    gold: 'bg-amber-500 text-slate-900 font-semibold hover:bg-amber-400 focus:ring-amber-500/50 shadow-sm hover:shadow',
    danger: 'bg-rose-600 text-white hover:bg-rose-700 focus:ring-rose-500/40 shadow-sm',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : Icon && iconPosition === 'left' ? (
        <Icon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} className="shrink-0" />
      ) : null}

      {children}

      {!loading && Icon && iconPosition === 'right' && (
        <Icon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} className="shrink-0" />
      )}
    </button>
  );
};
