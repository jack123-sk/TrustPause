import React from 'react';
import { CheckCircle, AlertOctagon } from 'lucide-react';

interface SafetyRecommendationsProps {
  steps: string[];
  disclaimer: string;
}

export const SafetyRecommendations: React.FC<SafetyRecommendationsProps> = ({
  steps,
  disclaimer,
}) => {
  return (
    <div className="recommendations-box">
      <div className="section-subhead" style={{ marginBottom: '6px' }}>
        <span>Recommended Action Plan</span>
        <CheckCircle size={15} style={{ color: '#60a5fa' }} aria-hidden="true" />
      </div>

      <ul className="steps-list">
        {steps.map((step, idx) => (
          <li key={idx} className="step-list-item">
            <span className="step-check-icon">
              <CheckCircle size={16} aria-hidden="true" />
            </span>
            <span>{step}</span>
          </li>
        ))}
      </ul>

      <div
        style={{
          marginTop: 'var(--space-md)',
          paddingTop: 'var(--space-sm)',
          borderTop: '1px solid var(--border-subtle)',
          fontSize: '0.75rem',
          color: 'var(--text-dim)',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '6px',
        }}
      >
        <AlertOctagon size={13} style={{ flexShrink: 0, marginTop: '2px' }} aria-hidden="true" />
        <span>{disclaimer}</span>
      </div>
    </div>
  );
};
