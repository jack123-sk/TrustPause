import React from 'react';
import { AnalysisResult } from '../types';
import { MismatchHeroCard } from './MismatchHeroCard';
import { EvidenceList } from './EvidenceList';
import { UrlAnalysisCard } from './UrlAnalysisCard';
import { SafetyRecommendations } from './SafetyRecommendations';
import { AlertCircle, AlertTriangle, CheckCircle, ShieldAlert, Download, Clock } from 'lucide-react';

interface ResultsDashboardProps {
  result: AnalysisResult;
  onOpenExport: () => void;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({
  result,
  onOpenExport,
}) => {
  const getBannerDetails = () => {
    switch (result.overallRisk) {
      case 'CRITICAL':
        return {
          icon: <ShieldAlert size={22} aria-hidden="true" />,
          title: 'CRITICAL WARNING',
          subtext: 'High-risk security action detected (OTP/PIN/Remote Access demand).',
        };
      case 'HIGH':
        return {
          icon: <AlertTriangle size={22} aria-hidden="true" />,
          title: 'HIGH RISK DETECTED',
          subtext: 'Message contains strong indicators of an intentional payment trap or coercion.',
        };
      case 'CAUTION':
        return {
          icon: <AlertCircle size={22} aria-hidden="true" />,
          title: 'CAUTION ADVISED',
          subtext: 'Potentially suspicious indicators detected. Verify independently before acting.',
        };
      case 'LOW':
      default:
        return {
          icon: <CheckCircle size={22} aria-hidden="true" />,
          title: 'LOW RISK INDICATORS',
          subtext: 'No major scam indicators detected by current checks. Authenticity unverified.',
        };
    }
  };

  const banner = getBannerDetails();

  return (
    <section
      className="card-panel results-panel"
      aria-label="Analysis Results"
      aria-live="polite"
    >
      <div className="card-header-bar">
        <div className="card-title-group">
          <span className="step-indicator-badge" aria-hidden="true">3</span>
          <h2>Analysis Findings & Risk Evaluation</h2>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              fontSize: '0.75rem',
              color: 'var(--text-dim)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <Clock size={12} aria-hidden="true" /> {result.processingTimeMs}ms local
          </span>

          <button
            type="button"
            className="btn-secondary"
            style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
            onClick={onOpenExport}
            aria-label="Export or Print Analysis Report"
          >
            <Download size={14} aria-hidden="true" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Top Level Risk Banner */}
      <div className={`risk-banner ${result.overallRisk}`}>
        <div className="risk-badge-headline">
          <div className="risk-badge-icon">{banner.icon}</div>
          <div className="risk-badge-text">
            <div className="level-name">{banner.title}</div>
            <div className="level-subtext">{banner.subtext}</div>
          </div>
        </div>

        <div className="risk-score-display" title="Transparent Heuristic Risk Score (0-100)">
          <span className="risk-score-num">{result.riskScore}</span>
          <span className="risk-score-denom">/100</span>
        </div>
      </div>

      {/* Intent Mismatch Hero Card */}
      <MismatchHeroCard result={result} />

      {/* Evidence & Warning Indicators */}
      <EvidenceList
        indicators={result.detectedIndicators}
        negatedAdvisories={result.negatedAdvisoriesDetected}
      />

      {/* URL Inspection if applicable */}
      <UrlAnalysisCard urls={result.extractedUrls} />

      {/* Tailored Safety Steps */}
      <SafetyRecommendations
        steps={result.recommendedNextSteps}
        disclaimer={result.disclaimer}
      />
    </section>
  );
};
