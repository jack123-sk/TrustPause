import React from 'react';
import { ShieldCheck, HelpCircle, BookOpen, Lock } from 'lucide-react';

interface HeaderProps {
  onOpenHowItWorks: () => void;
  onOpenThreatGuide: () => void;
  onOpenPrivacy: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenHowItWorks,
  onOpenThreatGuide,
  onOpenPrivacy,
}) => {
  return (
    <header className="site-header" role="banner">
      <div className="header-inner">
        <a href="#analyzer" className="brand-wrapper" aria-label="TrustPause Home">
          <div className="brand-icon-box" aria-hidden="true">
            <ShieldCheck size={26} strokeWidth={2.2} />
          </div>
          <div className="brand-text">
            <h1>TrustPause</h1>
            <span className="tagline">Pause. Understand. Protect.</span>
          </div>
        </a>

        <div className="header-nav">
          <div className="privacy-badge-pill" title="All detection runs locally inside your web browser.">
            <span className="privacy-pulse-dot" aria-hidden="true"></span>
            <span>100% In-Browser · Zero Tracking</span>
          </div>

          <button
            type="button"
            className="nav-btn"
            onClick={onOpenHowItWorks}
            aria-label="Learn how TrustPause works"
          >
            <HelpCircle size={15} aria-hidden="true" />
            <span>How It Works</span>
          </button>

          <button
            type="button"
            className="nav-btn"
            onClick={onOpenThreatGuide}
            aria-label="View Digital Payment Scam Reference"
          >
            <BookOpen size={15} aria-hidden="true" />
            <span>Scam Guide (NPCI/RBI)</span>
          </button>

          <button
            type="button"
            className="nav-btn"
            onClick={onOpenPrivacy}
            aria-label="View Privacy and Security Architecture"
          >
            <Lock size={15} aria-hidden="true" />
            <span>Privacy</span>
          </button>
        </div>
      </div>
    </header>
  );
};
