import React from 'react';
import { X, Lock, ShieldCheck, CheckCircle } from 'lucide-react';

interface PrivacyManifestoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyManifestoModal: React.FC<PrivacyManifestoModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="privacy-manifesto-title"
      onClick={onClose}
    >
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 id="privacy-manifesto-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Lock size={20} style={{ color: '#10b981' }} aria-hidden="true" />
            <span>Privacy-First Architecture Guarantee</span>
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

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.6 }}>
          <p>
            When dealing with suspicious messages, users frequently paste private information—such as transaction amounts, phone numbers, or even partial account details.
          </p>

          <div style={{ backgroundColor: 'rgba(6, 78, 59, 0.25)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#34d399', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={18} />
              <span>Zero-Data Transmission Model</span>
            </h3>
            <p style={{ color: '#d1fae5' }}>
              TrustPause performs 100% of its text evaluation, URL parsing, and intent matching <strong>locally in your web browser</strong> using client-side JavaScript.
            </p>
          </div>

          <h3 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Our Privacy Principles:
          </h3>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <CheckCircle size={16} style={{ color: '#10b981', marginTop: '2px', flexShrink: 0 }} />
              <span><strong>No Cloud Relays:</strong> Your message is never sent to external servers or remote AI APIs.</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <CheckCircle size={16} style={{ color: '#10b981', marginTop: '2px', flexShrink: 0 }} />
              <span><strong>Zero Persistence by Default:</strong> We do not store messages in LocalStorage, IndexedDB, or server databases. When you click &ldquo;Clear&rdquo; or refresh the page, all data vanishes.</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <CheckCircle size={16} style={{ color: '#10b981', marginTop: '2px', flexShrink: 0 }} />
              <span><strong>Automatic Secret Redaction:</strong> If an active OTP or payment card number is identified in the text, it is masked on screen and excluded from reports.</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <CheckCircle size={16} style={{ color: '#10b981', marginTop: '2px', flexShrink: 0 }} />
              <span><strong>No Third-Party Analytics:</strong> No tracking pixels, Google Analytics, or commercial advertising SDKs are installed.</span>
            </li>
          </ul>

          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
            <button type="button" className="btn-primary" style={{ width: '100%' }} onClick={onClose}>
              Acknowledge & Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
