import React, { useState } from 'react';
import { UserIntent, AnalysisResult, DemoScenario } from './types';
import { analyzeMessage } from './engine/analyzer';
import { Header } from './components/Header';
import { IntentSelector } from './components/IntentSelector';
import { MessageInput } from './components/MessageInput';
import { DemoSelector } from './components/DemoSelector';
import { ResultsDashboard } from './components/ResultsDashboard';
import { HowItWorksModal } from './components/HowItWorksModal';
import { ThreatReferenceModal } from './components/ThreatReferenceModal';
import { PrivacyManifestoModal } from './components/PrivacyManifestoModal';
import { ExportReportModal } from './components/ExportReportModal';
import { ShieldCheck, ShieldAlert } from 'lucide-react';

export const App: React.FC = () => {
  const [selectedIntent, setSelectedIntent] = useState<UserIntent>('RECEIVE_MONEY');
  const [messageText, setMessageText] = useState<string>(
    'Your ₹2,000 refund is ready. Pay a processing fee of ₹199 to receive it.'
  );
  const [activeDemoId, setActiveDemoId] = useState<string | undefined>('demo-refund-fee');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(() => {
    // Initial analysis on load so judges immediately see the working engine
    return analyzeMessage(
      'Your ₹2,000 refund is ready. Pay a processing fee of ₹199 to receive it.',
      'RECEIVE_MONEY'
    );
  });

  // Modal Dialog States
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [showThreatGuide, setShowThreatGuide] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showExport, setShowExport] = useState(false);

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    // Instant heuristic evaluation
    const result = analyzeMessage(messageText, selectedIntent);
    setAnalysisResult(result);
    setIsAnalyzing(false);
  };

  const handleSelectDemo = (demo: DemoScenario) => {
    setActiveDemoId(demo.id);
    setSelectedIntent(demo.intendedGoal);
    setMessageText(demo.messageText);
    const result = analyzeMessage(demo.messageText, demo.intendedGoal);
    setAnalysisResult(result);
  };

  const handleClear = () => {
    setMessageText('');
    setActiveDemoId(undefined);
    setAnalysisResult(null);
  };

  return (
    <div className="site-wrapper">
      <Header
        onOpenHowItWorks={() => setShowHowItWorks(true)}
        onOpenThreatGuide={() => setShowThreatGuide(true)}
        onOpenPrivacy={() => setShowPrivacy(true)}
      />

      <main className="app-container" id="analyzer">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-pill">
            <ShieldCheck size={14} aria-hidden="true" />
            <span>Human-Centred Digital Payment Defense</span>
          </div>

          <h1 className="hero-title">
            Pause. Understand. <span className="highlight">Protect.</span>
          </h1>

          <p className="hero-subtitle">
            Most digital payment scams succeed because people misunderstand what a message is asking them to do.
            TrustPause compares what you <strong>intend to do</strong> with what the message <strong>demands</strong>.
          </p>
        </section>

        {/* Core Workspace Grid */}
        <div className="workspace-grid">
          {/* Left Column: Input and Configuration */}
          <div className="card-panel">
            <IntentSelector
              selectedIntent={selectedIntent}
              onSelectIntent={(intent) => {
                setSelectedIntent(intent);
                setActiveDemoId(undefined);
                if (messageText.trim().length > 0) {
                  const updated = analyzeMessage(messageText, intent);
                  setAnalysisResult(updated);
                }
              }}
            />

            <MessageInput
              messageText={messageText}
              onChangeText={(text) => {
                setMessageText(text);
                setActiveDemoId(undefined);
              }}
              onAnalyze={handleAnalyze}
              onClear={handleClear}
              isAnalyzing={isAnalyzing}
            />

            <DemoSelector
              onSelectDemo={handleSelectDemo}
              activeDemoId={activeDemoId}
            />
          </div>

          {/* Right Column: Analysis Results Dashboard */}
          <div>
            {analysisResult ? (
              <ResultsDashboard
                result={analysisResult}
                onOpenExport={() => setShowExport(true)}
              />
            ) : (
              <div
                className="card-panel"
                style={{
                  textAlign: 'center',
                  padding: '3rem 1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '1rem',
                }}
              >
                <div
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#60a5fa',
                  }}
                >
                  <ShieldAlert size={32} />
                </div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                  Ready to Analyse
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '380px' }}>
                  Paste a message from SMS, WhatsApp, or an email, or select any of the 8 competition demo scenarios on the left to inspect the detection engine.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="site-footer" role="contentinfo">
        <div className="footer-inner">
          <div className="footer-disclaimer">
            <strong>TrustPause</strong> · Developed for Times of India Competition.
            <br />
            Educational cybersecurity tool designed according to Reserve Bank of India (RBI) and National Payments Corporation of India (NPCI) fraud awareness frameworks. Never share your OTP or enter a UPI PIN to receive money.
          </div>
          <div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
              Client-Side Deterministic Rule Engine · v1.0.0
            </span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <HowItWorksModal
        isOpen={showHowItWorks}
        onClose={() => setShowHowItWorks(false)}
      />

      <ThreatReferenceModal
        isOpen={showThreatGuide}
        onClose={() => setShowThreatGuide(false)}
      />

      <PrivacyManifestoModal
        isOpen={showPrivacy}
        onClose={() => setShowPrivacy(false)}
      />

      {analysisResult && (
        <ExportReportModal
          isOpen={showExport}
          onClose={() => setShowExport(false)}
          result={analysisResult}
        />
      )}
    </div>
  );
};
