import React from 'react';
import { ExtractedUrl } from '../types';
import { Link2, AlertCircle } from 'lucide-react';

interface UrlAnalysisCardProps {
  urls: ExtractedUrl[];
}

export const UrlAnalysisCard: React.FC<UrlAnalysisCardProps> = ({ urls }) => {
  if (urls.length === 0) return null;

  return (
    <div className="evidence-section">
      <div className="section-subhead">
        <span>Extracted Destination Link Analysis ({urls.length})</span>
        <Link2 size={14} aria-hidden="true" />
      </div>

      <div className="evidence-items-list">
        {urls.map((u, idx) => (
          <div key={idx} className="evidence-item-card">
            <div className="evidence-card-top">
              <span className="evidence-indicator-name" style={{ fontFamily: 'var(--font-mono)' }}>
                {u.hostname}
              </span>
              <span
                className={`severity-pill ${
                  u.isShortener || u.isIpAddress || u.isSuspiciousPattern
                    ? 'HIGH'
                    : 'LOW'
                }`}
              >
                {u.isShortener
                  ? 'SHORTENED LINK'
                  : u.isIpAddress
                  ? 'RAW IP HOST'
                  : u.isFictionalDemo
                  ? 'DEMO LINK'
                  : 'STANDARD URL'}
              </span>
            </div>

            <div className="evidence-matched-snippet" style={{ color: '#93c5fd' }}>
              {u.raw}
            </div>

            {u.note && (
              <p className="evidence-explanation" style={{ color: '#fef08a' }}>
                <AlertCircle size={13} style={{ display: 'inline', marginRight: '4px' }} />
                {u.note}
              </p>
            )}

            <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '4px' }}>
              Safety note: TrustPause inspects URL text patterns locally and never loads external websites.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
