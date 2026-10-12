'use client';

import React from 'react';
import { ModelId, CARD_MODELS } from '@/lib/cardModels';
import { CreditCard, Share2, Shield, Award, LayoutTemplate, Stethoscope, CheckCircle2 } from 'lucide-react';

interface ModelCardPickerProps {
  selectedModel: ModelId;
  onSelect: (modelId: ModelId) => void;
}

const MODEL_ICONS: Record<ModelId, React.ReactNode> = {
  classic_card: <CreditCard className="w-5 h-5 text-indigo-400" />,
  social_card: <Share2 className="w-5 h-5 text-pink-400" />,
  dark_green_id: <Shield className="w-5 h-5 text-emerald-400" />,
  gold_premium: <Award className="w-5 h-5 text-amber-400" />,
  table_tent: <LayoutTemplate className="w-5 h-5 text-cyan-400" />,
  services_card: <Stethoscope className="w-5 h-5 text-teal-400" />,
};

export const ModelCardPicker: React.FC<ModelCardPickerProps> = ({
  selectedModel,
  onSelect,
}) => {
  return (
    <div className="model-picker-container">
      <div className="model-picker-grid">
        {CARD_MODELS.map((model) => {
          const isSelected = model.id === selectedModel;
          return (
            <button
              key={model.id}
              type="button"
              onClick={() => onSelect(model.id)}
              className={`model-card-btn ${isSelected ? 'model-selected' : ''}`}
            >
              <div className="model-card-top">
                <div className="model-card-icon-badge">
                  {MODEL_ICONS[model.id]}
                </div>
                <span className="model-dim-pill">
                  {model.dimensionsMm.width}×{model.dimensionsMm.height} mm
                </span>
              </div>

              <div className="model-card-content">
                <h3 className="model-card-title">{model.name}</h3>
                <p className="model-card-tagline">{model.tagline}</p>
                
                <div className="model-features-row">
                  {model.features.map((feat, idx) => (
                    <span key={idx} className="feature-chip">
                      <CheckCircle2 size={12} className="text-emerald-400 shrink-0" />
                      <span>{feat}</span>
                    </span>
                  ))}
                </div>
              </div>

              {isSelected && (
                <div className="model-active-indicator">
                  <span>Modelo Ativo</span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
