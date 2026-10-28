/**
 * Main Analysis Orchestrator
 * Coordinates context parsing, intent-action comparison, URL inspection,
 * indicator evaluation, risk calculation, and explanation generation.
 */

import { UserIntent, AnalysisResult } from '../types';
import { analyzeMessageContext } from './contextParser';
import { extractAndAnalyzeUrls } from './urlAnalyzer';
import { scanPrivacy } from './privacyScanner';
import { extractRequestedActions, compareIntentWithActions } from './intentDetector';
import { detectScamIndicators } from './scamIndicators';
import { calculateRiskScore } from './riskScoring';
import { buildExplanationAndSteps } from './explanationBuilder';

/**
 * Analyzes a message against a stated user intent.
 * 100% in-browser, deterministic, local evaluation.
 */
export function analyzeMessage(rawText: string, intent: UserIntent): AnalysisResult {
  const startTime = typeof performance !== 'undefined' ? performance.now() : Date.now();

  // 1. Sanitize and length check
  const text = (rawText || '').trim();

  // Edge case: empty message
  if (!text) {
    return {
      overallRisk: 'LOW',
      riskScore: 0,
      selectedIntent: intent,
      detectedActions: [],
      intentMismatchStatus: 'UNSPECIFIED_INTENT',
      primaryMismatchTitle: 'No Message Content Provided',
      primaryMismatchExplanation: 'Please paste a suspicious message or choose an illustrative demo scenario to begin analysis.',
      whyItMatters: 'TrustPause requires message text to evaluate intent compatibility and detect scam indicators.',
      detectedIndicators: [],
      negatedAdvisoriesDetected: [],
      extractedUrls: [],
      privacyDetection: { containsPotentialOtp: false, containsPotentialCard: false },
      recommendedNextSteps: ['Paste an SMS, WhatsApp message, or email text into the input field.'],
      confidenceAssessment: 'No input provided.',
      disclaimer: 'TrustPause provides heuristic analysis to assist personal decision-making.',
      processingTimeMs: 0,
      isPureInformational: false,
    };
  }

  // 2. Scan for privacy tokens (OTPs, PINs, card numbers)
  const privacyDetection = scanPrivacy(text);

  // 3. Analyze linguistic context (advisories, negations, reported narrative)
  const context = analyzeMessageContext(text);

  // 4. Extract and inspect embedded URLs safely
  const extractedUrls = extractAndAnalyzeUrls(text);

  // 5. Extract actions requested by the message
  const detectedActions = extractRequestedActions(text, context);

  // 6. Compare requested actions against user intent
  const comparison = compareIntentWithActions(intent, detectedActions, context);

  // 7. Detect independent scam indicators
  const detectedIndicators = detectScamIndicators(text, context, extractedUrls);

  // 8. Calculate risk score and level
  const scoring = calculateRiskScore(
    detectedIndicators,
    comparison.status,
    context.isEntirelyInformational
  );

  // 9. Build plain-English explanation and recommended next steps
  const explanationGuidance = buildExplanationAndSteps(
    scoring.overallRisk,
    comparison.status,
    detectedIndicators,
    intent,
    context.isEntirelyInformational
  );

  const endTime = typeof performance !== 'undefined' ? performance.now() : Date.now();
  const processingTimeMs = Math.round((endTime - startTime) * 100) / 100;

  return {
    overallRisk: scoring.overallRisk,
    riskScore: scoring.numericalScore,
    selectedIntent: intent,
    detectedActions,
    intentMismatchStatus: comparison.status,
    primaryMismatchTitle: comparison.title,
    primaryMismatchExplanation: comparison.explanation,
    whyItMatters: comparison.whyItMatters,
    detectedIndicators,
    negatedAdvisoriesDetected: context.advisoryPhrases,
    extractedUrls,
    privacyDetection,
    recommendedNextSteps: explanationGuidance.recommendedSteps,
    confidenceAssessment: scoring.confidenceAssessment,
    disclaimer: explanationGuidance.disclaimer,
    processingTimeMs,
    isPureInformational: context.isEntirelyInformational,
  };
}
