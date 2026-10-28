/**
 * Transparent Heuristic Risk Scoring System
 * Computes deterministic score (0-100) and user-facing risk level.
 * Guarantees that critical indicators (e.g. OTP theft, remote access) trigger CRITICAL warnings
 * regardless of overall numerical score.
 */

import { RiskLevel, ScamIndicator, IntentMismatchStatus } from '../types';

export interface ScoreBreakdown {
  numericalScore: number;
  overallRisk: RiskLevel;
  criticalOverrideTriggered: boolean;
  scoreFactors: Array<{ label: string; points: number }>;
  confidenceAssessment: string;
}

export function calculateRiskScore(
  indicators: ScamIndicator[],
  mismatchStatus: IntentMismatchStatus,
  isPureInformational: boolean
): ScoreBreakdown {
  const scoreFactors: Array<{ label: string; points: number }> = [];
  let baseScore = 0;

  // 1. Intent Mismatch Contribution
  if (mismatchStatus === 'CONTRADICTION') {
    const points = 35;
    baseScore += points;
    scoreFactors.push({
      label: 'Direct Intent Contradiction (Action conflicts with intended goal)',
      points,
    });
  } else if (mismatchStatus === 'CRITICAL_RISK_ACTION') {
    const points = 45;
    baseScore += points;
    scoreFactors.push({
      label: 'Inherently Dangerous Action (OTP disclosure or Remote Device Access)',
      points,
    });
  } else if (mismatchStatus === 'MATCH_WITH_PRESSURE') {
    const points = 25;
    baseScore += points;
    scoreFactors.push({
      label: 'Action Matches Goal but Coercive Pressure or Isolation Detected',
      points,
    });
  } else if (mismatchStatus === 'MATCH_VERIFY_NEEDED') {
    const points = 15;
    baseScore += points;
    scoreFactors.push({
      label: 'Action Matches Goal (Recipient and Destination Require Verification)',
      points,
    });
  }

  // 2. Scam Indicators Contribution (Deduplicated by category)
  const categoryMaxPoints: Record<string, number> = {};

  for (const ind of indicators) {
    // Keep highest score per category to prevent runaway duplicate scoring
    const currentMax = categoryMaxPoints[ind.category] || 0;
    if (ind.scoreContribution > currentMax) {
      categoryMaxPoints[ind.category] = ind.scoreContribution;
    }
  }

  for (const [category, points] of Object.entries(categoryMaxPoints)) {
    baseScore += points;
    scoreFactors.push({
      label: `Detected Indicator: ${category.replace(/_/g, ' ')}`,
      points,
    });
  }

  // Clamp raw score between 0 and 100
  let finalScore = Math.min(100, Math.max(0, baseScore));

  // If purely informational with no indicators or contradictions, keep score very low
  if (isPureInformational && indicators.length === 0 && mismatchStatus === 'CONSISTENT_INFORMATIONAL') {
    finalScore = Math.min(10, finalScore);
  }

  // 3. Determine Risk Level & Check Critical Override
  const hasCriticalIndicator = indicators.some((i) => i.severity === 'CRITICAL');
  const hasCriticalMismatch = mismatchStatus === 'CRITICAL_RISK_ACTION';
  const hasHighIndicator = indicators.some((i) => i.severity === 'HIGH');
  const hasContradiction = mismatchStatus === 'CONTRADICTION';

  let overallRisk: RiskLevel;
  let criticalOverrideTriggered = false;

  if (hasCriticalIndicator || hasCriticalMismatch) {
    overallRisk = 'CRITICAL';
    criticalOverrideTriggered = true;
    finalScore = Math.max(85, finalScore);
  } else if (finalScore >= 50 || hasHighIndicator || hasContradiction) {
    overallRisk = 'HIGH';
    finalScore = Math.max(50, finalScore);
  } else if (finalScore >= 20 || mismatchStatus === 'MATCH_VERIFY_NEEDED' || indicators.length > 0) {
    overallRisk = 'CAUTION';
  } else {
    overallRisk = 'LOW';
  }

  const confidenceAssessment =
    indicators.length >= 2 || criticalOverrideTriggered
      ? 'High confidence heuristic assessment based on explicit evidence.'
      : 'Moderate confidence heuristic assessment. Evaluate context independently.';

  return {
    numericalScore: finalScore,
    overallRisk,
    criticalOverrideTriggered,
    scoreFactors,
    confidenceAssessment,
  };
}
