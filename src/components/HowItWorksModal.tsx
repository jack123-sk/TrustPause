import React from 'react';
import { X, CheckCircle, ArrowRight, Lightbulb } from 'lucide-react';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="how-it-works-title"
      onClick={onClose}
    >
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 id="how-it-works-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Lightbulb size={20} style={{ color: '#60a5fa' }} aria-hidden="true" />
            <span>How TrustPause Works</span>
          </h2>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
          <p>
            Traditional mobile and email security tools primarily rely on <strong>URL blocklists</strong> and <strong>known sender reputations</strong>. When scammers use clean domains, direct SMS messages, or fresh telephone numbers, traditional tools often fail to raise an alarm.
          </p>

          <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#93c5fd', marginBottom: '6px' }}>
              The Intent-Mismatch Principle
            </h3>
            <p>
              Digital payment fraud almost always hinges on a <strong>contradiction</strong> between what the victim intends to do and what the message asks them to do.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px', color: 'var(--text-primary)', fontWeight: 600 }}>
              <span style={{ color: '#60a5fa' }}>Your Goal: Receive Money</span>
              <ArrowRight size={16} />
              <span style={{ color: '#ef4444' }}>Message Asks: Approve Payment / Pay Fee</span>
            </div>
          </div>

          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.5rem' }}>
            Multi-Layered Detection Engine
          </h3>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <CheckCircle size={16} style={{ color: '#3b82f6', marginTop: '2px', flexShrink: 0 }} />
              <span><strong>Linguistic Context Parser:</strong> Distinguishes direct imperative commands from legitimate security advisories (e.g. &ldquo;Never share your OTP&rdquo;) or reported narratives.</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <CheckCircle size={16} style={{ color: '#3b82f6', marginTop: '2px', flexShrink: 0 }} />
              <span><strong>Indian Payment Safety Rules:</strong> Deeply integrates National Payments Corporation of India (NPCI) and Reserve Bank of India (RBI) rules—such as the fundamental rule that you never need a UPI PIN to receive money.</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <CheckCircle size={16} style={{ color: '#3b82f6', marginTop: '2px', flexShrink: 0 }} />
              <span><strong>100% In-Browser Privacy:</strong> Your text never leaves your device. No cloud APIs, no telemetry, and zero remote logging.</span>
            </li>
          </ul>

          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem', marginTop: '0.5rem' }}>
            <button type="button" className="btn-primary" style={{ width: '100%' }} onClick={onClose}>
              Got It, Continue to Workspace
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
