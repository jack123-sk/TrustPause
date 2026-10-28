import React from 'react';
import { ScamIndicator } from '../types';
import { redactSecrets } from '../engine/privacyScanner';
import { Shield, CheckCircle2 } from 'lucide-react';

interface EvidenceListProps {
  indicators: ScamIndicator[];
  negatedAdvisories: string[];
}

export const EvidenceList: React.FC<EvidenceListProps> = ({
  indicators,
  negatedAdvisories,
}) => {
  return (
    <div className="evidence-section">
      <div className="section-subhead">
        <span>Detected Warning Indicators ({indicators.length})</span>
        <Shield size={14} aria-hidden="true" />
      </div>

      {indicators.length === 0 ? (
        <div className="evidence-item-card" style={{ textAlign: 'center', padding: '1.25rem' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            No explicit scam indicators or coercion patterns were detected in this message.
          </p>
        </div>
      ) : (
        <div className="evidence-items-list">
          {indicators.map((ind) => (
            <div key={ind.id} className="evidence-item-card">
              <div className="evidence-card-top">
                <span className="evidence-indicator-name">{ind.name}</span>
                <span className={`severity-pill ${ind.severity}`}>{ind.severity}</span>
              </div>

              <div className="evidence-matched-snippet">
                &ldquo;{redactSecrets(ind.matchedSnippet)}&rdquo;
              </div>

              <p className="evidence-explanation">{ind.explanation}</p>
            </div>
          ))}
        </div>
      )}

      {negatedAdvisories.length > 0 && (
        <div
          className="evidence-item-card"
          style={{
            marginTop: '0.75rem',
            borderColor: 'rgba(16, 185, 129, 0.3)',
            backgroundColor: 'rgba(6, 78, 59, 0.2)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#6ee7b7', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>
            <CheckCircle2 size={16} aria-hidden="true" />
            <span>Recognized Safety Warnings in Message (Context Filter Applied)</span>
          </div>
          <p style={{ fontSize: '0.8rem', color: '#d1fae5' }}>
            The engine recognized that phrases like &ldquo;{negatedAdvisories.join(', ')}&rdquo; are safety advisories, not instructions demanded of you.
          </p>
        </div>
      )}
    </div>
  );
};
