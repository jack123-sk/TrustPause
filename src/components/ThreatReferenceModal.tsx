import { X, BookOpen, AlertTriangle } from 'lucide-react';

interface ThreatReferenceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ThreatReferenceModal: React.FC<ThreatReferenceModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="threat-guide-title"
      onClick={onClose}
    >
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 id="threat-guide-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BookOpen size={20} style={{ color: '#60a5fa' }} aria-hidden="true" />
            <span>Digital Payment Fraud Primer (NPCI & RBI Guidelines)</span>
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
          {/* Rule 1: UPI PIN */}
          <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)', borderLeft: '3px solid #ef4444' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f87171', marginBottom: '4px' }}>
              1. The Golden Rule of UPI (NPCI Architecture)
            </h3>
            <p>
              Entering your UPI PIN or scanning a payment QR code <strong>ALWAYS debits money</strong> from your account. You NEVER need to enter a UPI PIN or accept a &ldquo;Collect Request&rdquo; on PhonePe, Google Pay, or Paytm to receive money or refunds.
            </p>
          </div>

          {/* Rule 2: Remote Access */}
          <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)', borderLeft: '3px solid #f97316' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fed7aa', marginBottom: '4px' }}>
              2. Screen-Sharing Applications (AnyDesk, TeamViewer, QuickSupport)
            </h3>
            <p>
              Scammers pose as bank or customer support executives and ask you to install remote support apps to &ldquo;resolve an issue&rdquo; or &ldquo;verify KYC&rdquo;. Sharing your 9-digit access code allows the caller to view your phone screen, read your incoming SMS OTPs in real-time, and transfer funds.
            </p>
          </div>

          {/* Rule 3: Advance Fees */}
          <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)', borderLeft: '3px solid #f59e0b' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fef3c7', marginBottom: '4px' }}>
              3. Advance Fee & Refund Traps
            </h3>
            <p>
              Legitimate refunds, cashbacks, and government schemes are credited automatically through Direct Benefit Transfer (DBT) or payment gateways. Any demand for an upfront &ldquo;processing fee&rdquo;, &ldquo;clearance charge&rdquo;, or &ldquo;refundable deposit&rdquo; is fraudulent.
            </p>
          </div>

          {/* Rule 4: Coercive Urgency */}
          <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)', borderLeft: '3px solid #3b82f6' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#93c5fd', marginBottom: '4px' }}>
              4. Artificial Urgency & Avoiding Verification
            </h3>
            <p>
              Scammers fabricate panic (&ldquo;Electricity disconnected tonight&rdquo;, &ldquo;Account blocked in 10 minutes&rdquo;) or impersonate managers while forbidding phone calls (&ldquo;Do not call me&rdquo;). This isolates victims from verifying with actual family or bank branches.
            </p>
          </div>

          <div style={{ backgroundColor: 'rgba(59, 130, 246, 0.08)', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--brand-blue-border)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={18} style={{ color: '#60a5fa', flexShrink: 0 }} aria-hidden="true" />
            <span style={{ fontSize: '0.8rem', color: '#bfdbfe' }}>
              Indian National Cyber Crime Helpline: Dial <strong>1930</strong> or visit <strong>cybercrime.gov.in</strong> immediately if you suspect fraudulent transactions.
            </span>
          </div>

          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
            <button type="button" className="btn-secondary" style={{ width: '100%' }} onClick={onClose}>
              Close Reference Guide
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
