'use client';

import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CardEditor } from '@/components/cartao/CardEditor';
import { ModelId, CARD_MODELS } from '@/lib/cardModels';

interface ClientCardEditorPageProps {
  modelo: string;
}

export default function ClientCardEditorPage({ modelo }: ClientCardEditorPageProps) {
  const validModel = CARD_MODELS.find((m) => m.id === modelo);
  const effectiveModelId = validModel ? (modelo as ModelId) : 'classic_card';

  return (
    <div className="min-h-screen flex flex-col bg-[#FCFFFF]">
      <Header />

      <main className="flex-1 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CardEditor modelId={effectiveModelId} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
