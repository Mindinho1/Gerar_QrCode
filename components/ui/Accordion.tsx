'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export interface AccordionSectionProps {
  id: string;
  title: string;
  subtitle?: string;
  icon?: React.ComponentType<{ className?: string; size?: number }>;
  badge?: string;
  isOpen?: boolean;
  onToggle?: () => void;
  children: React.ReactNode;
}

export const AccordionItem: React.FC<AccordionSectionProps> = ({
  title,
  subtitle,
  icon: Icon,
  badge,
  isOpen = false,
  onToggle,
  children,
}) => {
  return (
    <div className="border border-slate-200/80 rounded-2xl bg-white shadow-sm overflow-hidden transition-all duration-200">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50/70 transition-colors gap-3"
      >
        <div className="flex items-center gap-3 min-w-0">
          {Icon && (
            <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-[#202C39] shrink-0 border border-slate-200/50">
              <Icon size={18} />
            </div>
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-[#202C39] truncate">{title}</h3>
              {badge && (
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#99E1D9]/30 text-[#0f766e]">
                  {badge}
                </span>
              )}
            </div>
            {subtitle && (
              <p className="text-xs text-slate-500 truncate mt-0.5">{subtitle}</p>
            )}
          </div>
        </div>

        <div className={`text-slate-400 transform transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-[#202C39]' : ''}`}>
          <ChevronDown size={18} />
        </div>
      </button>

      {isOpen && (
        <div className="px-4 pb-4 pt-1 border-t border-slate-100 animate-fadeIn">
          {children}
        </div>
      )}
    </div>
  );
};

export interface AccordionProps {
  children: React.ReactNode;
  className?: string;
}

export const Accordion: React.FC<AccordionProps> = ({ children, className = '' }) => {
  return <div className={`flex flex-col gap-3 ${className}`}>{children}</div>;
};
