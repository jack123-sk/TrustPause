import React from 'react';
import { UserIntent } from '../types';
import { USER_INTENT_OPTIONS } from '../data/demoScenarios';
import { ArrowDownLeft, ArrowUpRight, ShieldCheck, KeyRound, HelpCircle } from 'lucide-react';

interface IntentSelectorProps {
  selectedIntent: UserIntent;
  onSelectIntent: (intent: UserIntent) => void;
}

const ICONS: Record<string, React.ReactNode> = {
  ArrowDownLeft: <ArrowDownLeft size={20} aria-hidden="true" />,
  ArrowUpRight: <ArrowUpRight size={20} aria-hidden="true" />,
  ShieldCheck: <ShieldCheck size={20} aria-hidden="true" />,
  KeyRound: <KeyRound size={20} aria-hidden="true" />,
  HelpCircle: <HelpCircle size={20} aria-hidden="true" />,
};

export const IntentSelector: React.FC<IntentSelectorProps> = ({
  selectedIntent,
  onSelectIntent,
}) => {
  return (
    <div className="intent-selector-wrapper">
      <div className="card-header-bar">
        <div className="card-title-group">
          <span className="step-indicator-badge" aria-hidden="true">1</span>
          <h2 id="intent-heading">What are you trying to accomplish?</h2>
        </div>
      </div>

      <div
        className="intent-grid"
        role="radiogroup"
        aria-labelledby="intent-heading"
      >
        {USER_INTENT_OPTIONS.map((opt) => {
          const isSelected = selectedIntent === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              className={`intent-option ${isSelected ? 'selected' : ''}`}
              onClick={() => onSelectIntent(opt.id)}
            >
              <div className="intent-option-header">
                <span className="intent-icon-wrapper">
                  {ICONS[opt.icon] || <ShieldCheck size={20} />}
                </span>
                <span className="intent-option-title">{opt.label}</span>
              </div>
              <span className="intent-option-desc">{opt.shortDescription}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
