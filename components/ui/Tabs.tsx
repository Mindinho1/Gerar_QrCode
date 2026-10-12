'use client';

import React from 'react';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string; size?: number }>;
  badge?: string | number;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  variant?: 'pill' | 'underline' | 'buttons';
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  variant = 'pill',
  className = '',
}) => {
  if (variant === 'underline') {
    return (
      <div className={`flex border-b border-slate-200 gap-6 overflow-x-auto ${className}`}>
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={`
                flex items-center gap-2 pb-3 pt-1 text-sm font-medium border-b-2 transition-all whitespace-nowrap
                ${isActive 
                  ? 'border-[#99E1D9] text-[#202C39] font-bold' 
                  : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'
                }
              `}
            >
              {Icon && <Icon size={16} />}
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span className={`text-xs px-2 py-0.5 rounded-full ${isActive ? 'bg-[#99E1D9]/30 text-[#202C39]' : 'bg-slate-100 text-slate-600'}`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`inline-flex p-1 bg-slate-100/90 rounded-2xl gap-1 max-w-full overflow-x-auto ${className}`}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`
              flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap
              ${isActive
                ? 'bg-white text-[#202C39] shadow-sm font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }
            `}
          >
            {Icon && <Icon size={16} className={isActive ? 'text-[#0f766e]' : 'text-slate-400'} />}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${isActive ? 'bg-[#99E1D9] text-[#202C39]' : 'bg-slate-200 text-slate-600'}`}>
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
