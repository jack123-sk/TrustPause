import React from 'react';
import { DemoScenario } from '../types';
import { DEMO_SCENARIOS } from '../data/demoScenarios';
import { Sparkles } from 'lucide-react';

interface DemoSelectorProps {
  onSelectDemo: (demo: DemoScenario) => void;
  activeDemoId?: string;
}

export const DemoSelector: React.FC<DemoSelectorProps> = ({
  onSelectDemo,
  activeDemoId,
}) => {
  return (
    <div className="demo-section-wrapper">
      <div className="demo-section-header">
        <h3>
          <Sparkles size={16} aria-hidden="true" style={{ color: '#60a5fa' }} />
          <span>Try an Illustrative Demo (Competition Scenarios)</span>
        </h3>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          1-Click Test for Judges
        </span>
      </div>

      <div className="demo-chips-grid">
        {DEMO_SCENARIOS.map((demo) => {
          const isActive = activeDemoId === demo.id;
          return (
            <button
              key={demo.id}
              type="button"
              className={`demo-chip-button ${isActive ? 'active' : ''}`}
              onClick={() => onSelectDemo(demo)}
              title={demo.summary}
            >
              <div className="demo-chip-title">
                <span>{demo.title}</span>
                <span style={{ fontSize: '0.68rem', color: '#93c5fd', fontWeight: 500 }}>
                  {demo.category}
                </span>
              </div>
              <span className="demo-chip-desc">{demo.summary}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
