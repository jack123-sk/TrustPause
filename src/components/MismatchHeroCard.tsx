import React from 'react';
import { AnalysisResult } from '../types';
import { USER_INTENT_OPTIONS } from '../data/demoScenarios';
import { AlertTriangle, CheckCircle, Info, ShieldAlert } from 'lucide-react';

interface MismatchHeroCardProps {
  result: AnalysisResult;
}

export const MismatchHeroCard: React.FC<MismatchHeroCardProps> = ({ result }) => {
  const intentOption = USER_INTENT_OPTIONS.find((o) => o.id === result.selectedIntent);
  const intentLabel = intentOption ? intentOption.label : 'General Review';

  const requestedActionsText =
    result.detectedActions.length > 0
      ? result.detectedActions.map((a) => a.label).join(' & ')
      : result.isPureInformational
      ? 'Informational status notification (No action demanded)'
      : 'No specific imperative action requested';

  const isContradiction =
    result.intentMismatchStatus === 'CONTRADICTION' ||
    result.intentMismatchStatus === 'CRITICAL_RISK_ACTION';

  return (
    <div className="comparison-hero-card">
      <div className="comparison-dual-columns">
        <div className="comparison-column">
          <div className="comparison-column-label">Your Stated Intention</div>
          <div className="comparison-column-value" style={{ color: '#93c5fd' }}>
            {intentLabel}
          </div>
        </div>

        <div className="comparison-column">
          <div className="comparison-column-label">What This Message Demands</div>
          <div
            className="comparison-column-value"
            style={{ color: isContradiction ? '#f87171' : '#34d399' }}
          >
            {requestedActionsText}
          </div>
        </div>
      </div>

      <div
        className={`mismatch-explanation-box ${
          isContradiction ? 'critical' : 'neutral'
        }`}
      >
        <div className="mismatch-explanation-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {isContradiction ? (
            <ShieldAlert size={18} style={{ color: '#ef4444' }} aria-hidden="true" />
          ) : result.overallRisk === 'LOW' ? (
            <CheckCircle size={18} style={{ color: '#10b981' }} aria-hidden="true" />
          ) : (
            <AlertTriangle size={18} style={{ color: '#f59e0b' }} aria-hidden="true" />
          )}
          <span>{result.primaryMismatchTitle}</span>
        </div>
        <p className="mismatch-explanation-body">{result.primaryMismatchExplanation}</p>
      </div>

      <div className="why-matters-card">
        <div className="why-matters-header">
          <Info size={14} aria-hidden="true" />
          <span>Why This Matters</span>
        </div>
        <p>{result.whyItMatters}</p>
      </div>
    </div>
  );
};
