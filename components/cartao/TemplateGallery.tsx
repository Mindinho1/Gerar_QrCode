'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CARD_MODELS, ModelId, CardModelDefinition } from '@/lib/cardModels';
import { ClassicoThumbnail } from './templates/Classico';
import { IdVerdeThumbnail } from './templates/IdVerde';
import { PretoDouradoThumbnail } from './templates/PretoDourado';
import { PlacaThumbnail } from './templates/Placa';
import { RedesThumbnail } from './templates/Redes';
import { ServicosThumbnail } from './templates/Servicos';
import { Tabs } from '@/components/ui/Tabs';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Sparkles, CheckCircle2, QrCode } from 'lucide-react';

export type GalleryFilter = 'todos' | 'visita' | 'redes' | 'placa' | 'premium';

const MODEL_TAGS: Record<ModelId, { label: string; isGold?: boolean; isCyan?: boolean }> = {
  classic_card: { label: 'Até 3 QR' },
  social_card: { label: 'Até 3 QR' },
  dark_green_id: { label: '1 QR • Crachá Tech', isCyan: true },
  gold_premium: { label: '1 QR • Selo Dourado', isGold: true },
  table_tent: { label: 'Placa de mesa' },
  services_card: { label: '1 QR • Especialidades' },
};

const THUMBNAILS: Record<ModelId, React.ReactNode> = {
  classic_card: <ClassicoThumbnail />,
  social_card: <RedesThumbnail />,
  dark_green_id: <IdVerdeThumbnail />,
  gold_premium: <PretoDouradoThumbnail />,
  table_tent: <PlacaThumbnail />,
  services_card: <ServicosThumbnail />,
};

export const TemplateGallery: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<GalleryFilter>('todos');

  const filterTabs = [
    { id: 'todos', label: 'Todos os Modelos' },
    { id: 'visita', label: 'Cartão de Visita' },
    { id: 'redes', label: 'Redes Sociais' },
    { id: 'placa', label: 'Placa de Mesa' },
    { id: 'premium', label: 'Premium & Luxo' },
  ];

  const filteredModels = CARD_MODELS.filter((model) => {
    if (activeFilter === 'todos') return true;
    if (activeFilter === 'visita') return model.id === 'classic_card' || model.id === 'services_card';
    if (activeFilter === 'redes') return model.id === 'social_card';
    if (activeFilter === 'placa') return model.id === 'table_tent';
    if (activeFilter === 'premium') return model.id === 'gold_premium' || model.id === 'dark_green_id';
    return true;
  });

  return (
    <div className="w-full space-y-8">
      {/* Filter Tabs */}
      <div className="flex justify-center">
        <Tabs
          tabs={filterTabs}
          activeTab={activeFilter}
          onChange={(id) => setActiveFilter(id as GalleryFilter)}
        />
      </div>

      {/* Grid of Templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredModels.map((model) => {
          const tag = MODEL_TAGS[model.id];
          return (
            <div
              key={model.id}
              className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 overflow-hidden flex flex-col group"
            >
              {/* Thumbnail Container */}
              <div className="p-5 pb-3 bg-gradient-to-b from-slate-50 to-white flex items-center justify-center min-h-[220px]">
                <div className="w-full max-w-[340px] transform group-hover:scale-[1.02] transition-transform duration-300">
                  {THUMBNAILS[model.id]}
                </div>
              </div>

              {/* Card Meta & Details */}
              <div className="p-6 pt-3 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                        tag.isGold
                          ? 'bg-amber-50 text-amber-800 border-amber-300'
                          : tag.isCyan
                          ? 'bg-teal-50 text-teal-800 border-teal-300'
                          : 'bg-[#99E1D9]/25 text-[#0f766e] border-[#99E1D9]'
                      }`}
                    >
                      {tag.label}
                    </span>
                    <span className="text-xs font-mono font-medium text-slate-500">
                      {model.dimensionsMm.width}×{model.dimensionsMm.height} mm
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#202C39] group-hover:text-[#0f766e] transition-colors leading-snug">
                    {model.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {model.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {model.features.map((feat, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 text-[11px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md"
                      >
                        <CheckCircle2 size={11} className="text-[#0f766e]" />
                        <span>{feat}</span>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <Link href={`/cartoes/${model.id}`} className="block">
                    <Button
                      variant="primary"
                      size="md"
                      icon={ArrowRight}
                      iconPosition="right"
                      className="w-full bg-[#202C39] hover:bg-[#18222D]"
                    >
                      Personalizar este modelo
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
