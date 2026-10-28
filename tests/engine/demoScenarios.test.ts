import { describe, it, expect } from 'vitest';
import { DEMO_SCENARIOS } from '../../src/data/demoScenarios';
import { analyzeMessage } from '../../src/engine/analyzer';

describe('TrustPause Predefined Demo Scenarios', () => {
  DEMO_SCENARIOS.forEach((demo) => {
    it(`evaluates ${demo.title} matching its expected risk level (${demo.expectedRiskLevel})`, () => {
      const result = analyzeMessage(demo.messageText, demo.intendedGoal);

      // Verify the expected risk level
      expect(result.overallRisk).toBe(demo.expectedRiskLevel);

      // Verify scenario-specific attributes
      if (demo.id === 'demo-refund-fee') {
        expect(result.intentMismatchStatus).toBe('CONTRADICTION');
        expect(result.detectedActions.some((a) => a.type === 'PAY_FEE')).toBe(true);
      } else if (demo.id === 'demo-otp-pressure') {
        expect(result.detectedIndicators.some((i) => i.id === 'req-share-otp')).toBe(true);
        expect(result.detectedIndicators.some((i) => i.id === 'ind-suspension-threat')).toBe(true);
      } else if (demo.id === 'demo-prize-fee') {
        expect(result.detectedIndicators.some((i) => i.id === 'ind-fake-prize')).toBe(true);
        expect(result.detectedIndicators.some((i) => i.id === 'req-advance-fee')).toBe(true);
      } else if (demo.id === 'demo-remote-access') {
        expect(result.detectedIndicators.some((i) => i.id === 'req-remote-access')).toBe(true);
      } else if (demo.id === 'demo-legitimate-receipt') {
        expect(result.isPureInformational).toBe(true);
        expect(result.detectedIndicators.length).toBe(0);
      } else if (demo.id === 'demo-urgent-transfer') {
        expect(result.detectedIndicators.some((i) => i.id === 'ind-authority-impersonation')).toBe(true);
        expect(result.detectedIndicators.some((i) => i.id === 'ind-avoid-verification')).toBe(true);
      } else if (demo.id === 'demo-suspicious-link') {
        expect(result.extractedUrls.length).toBeGreaterThan(0);
        expect(result.detectedIndicators.some((i) => i.id === 'ind-suspension-threat')).toBe(true);
      } else if (demo.id === 'demo-matching-intent') {
        expect(result.intentMismatchStatus).toBe('MATCH_VERIFY_NEEDED');
      }
    });
  });
});
