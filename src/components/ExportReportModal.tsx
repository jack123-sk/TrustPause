import React, { useState } from 'react';
import { AnalysisResult } from '../types';
import { redactSecrets } from '../engine/privacyScanner';
import { X, Copy, Check, Printer } from 'lucide-react';

interface ExportReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: AnalysisResult;
}

export const ExportReportModal: React.FC<ExportReportModalProps> = ({
  isOpen,
  onClose,
  result,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const generateMarkdownReport = (): string => {
    const timestamp = new Date().toISOString();
    return `# TrustPause Security Analysis Audit Report
Generated: ${timestamp}
Risk Level: ${result.overallRisk} (Heuristic Score: ${result.riskScore}/100)

## 1. Intention & Action Comparison
- Stated User Goal: ${result.selectedIntent}
- Mismatch Status: ${result.intentMismatchStatus}
- Assessment: ${result.primaryMismatchTitle}
- Finding: ${result.primaryMismatchExplanation}

## 2. Detected Actions Requested by Message
${
  result.detectedActions.length > 0
    ? result.detectedActions.map((a) => `- ${a.label} (${a.explanation})`).join('\n')
    : '- No specific imperative actions requested'
}

## 3. Warning Indicators Detected
${
  result.detectedIndicators.length > 0
    ? result.detectedIndicators
        .map(
          (i) =>
            `- [${i.severity}] ${i.name}: "${redactSecrets(i.matchedSnippet)}" - ${i.explanation}`
        )
        .join('\n')
    : '- No major warning indicators detected'
}

## 4. Destination Link Inspection
${
  result.extractedUrls.length > 0
    ? result.extractedUrls
        .map(
          (u) =>
            `- ${u.raw} [${u.hostname}] (Shortener: ${u.isShortener}, Suspicious: ${u.isSuspiciousPattern})`
        )
        .join('\n')
    : '- No external URLs detected'
}

## 5. Recommended Next Steps
${result.recommendedNextSteps.map((s, idx) => `${idx + 1}. ${s}`).join('\n')}

---
${result.disclaimer}
Privacy Notice: Sensitive numeric secrets (OTPs, PINs, card numbers) are automatically redacted. All evaluation was performed client-side in the browser.
`;
  };

  const reportText = generateMarkdownReport();

  const handleCopy = () => {
    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="export-report-title"
      onClick={onClose}
    >
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 id="export-report-title">Security Analysis Audit Report</h2>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
            This audit report contains your intention comparison, indicator breakdown, and recommended next steps. All sensitive codes have been redacted for privacy.
          </p>

          <textarea
            readOnly
            className="message-textarea"
            rows={10}
            value={reportText}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.78rem',
              backgroundColor: 'var(--bg-primary)',
            }}
          />

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn-primary"
              onClick={handleCopy}
              style={{ flex: 1 }}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Markdown Report'}</span>
            </button>

            <button
              type="button"
              className="btn-secondary"
              onClick={handlePrint}
            >
              <Printer size={16} />
              <span>Print</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
