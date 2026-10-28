/**
 * TrustPause Type Definitions
 * Core domain types for human-centered intent comparison and scam detection.
 */

export type UserIntent =
  | 'RECEIVE_MONEY'
  | 'SEND_MONEY'
  | 'VERIFY_INFORMATION'
  | 'SHARE_ACCESS'
  | 'OTHER_NOT_SURE';

export interface UserIntentOption {
  id: UserIntent;
  label: string;
  shortDescription: string;
  examples: string[];
  icon: string;
}

export type RequestedActionType =
  | 'APPROVE_PAYMENT'
  | 'PAY_FEE'
  | 'TRANSFER_MONEY'
  | 'SCAN_QR'
  | 'ENTER_UPI_PIN'
  | 'SHARE_OTP'
  | 'REVEAL_PASSWORD'
  | 'ENTER_BANK_DETAILS'
  | 'CLICK_LINK'
  | 'INSTALL_APP'
  | 'GRANT_REMOTE_ACCESS'
  | 'APPROVE_LOGIN'
  | 'VERIFY_ACCOUNT'
  | 'DOWNLOAD_ATTACHMENT'
  | 'CONTACT_PHONE'
  | 'SHARE_PERSONAL_INFO'
  | 'INFORMATIONAL_NOTIFICATION';

export interface DetectedAction {
  type: RequestedActionType;
  label: string;
  matchedSnippet: string;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  explanation: string;
}

export type IntentMismatchStatus =
  | 'CONTRADICTION'        // Direct conflict: e.g. Wants to receive money, but asked to pay / enter UPI PIN
  | 'CRITICAL_RISK_ACTION' // Action itself is inherently dangerous regardless of intent (e.g. share OTP)
  | 'MATCH_WITH_PRESSURE'  // Action aligns with intent, but high urgency, strange account, or pressure
  | 'MATCH_VERIFY_NEEDED'  // Action aligns with intent, but recipient/link still requires independent check
  | 'CONSISTENT_INFORMATIONAL' // Informational notification matching verification
  | 'UNSPECIFIED_INTENT';  // User selected "Other / Not sure"

export type RiskLevel =
  | 'LOW'        // LOW RISK INDICATORS - No major warning indicators detected
  | 'CAUTION'    // CAUTION - One or more potentially suspicious indicators detected
  | 'HIGH'       // HIGH RISK - Strong indicators of a potentially harmful request
  | 'CRITICAL';  // CRITICAL WARNING - Especially dangerous request (OTP, remote access, UPI PIN to receive)

export type IndicatorSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type IndicatorCategory =
  | 'INTENT_MISMATCH'
  | 'OTP_OR_CREDENTIAL_THEFT'
  | 'UPI_PIN_OR_COLLECT_TRAP'
  | 'ADVANCE_FEE_OR_FAKE_PRIZE'
  | 'REMOTE_ACCESS_OR_MALWARE'
  | 'URGENCY_OR_PRESSURE'
  | 'ACCOUNT_SUSPENSION_OR_THREAT'
  | 'IMPERSONATION'
  | 'SUSPICIOUS_LINK_OR_SHORTENER'
  | 'AVOID_VERIFICATION';

export interface ScamIndicator {
  id: string;
  category: IndicatorCategory;
  name: string;
  severity: IndicatorSeverity;
  scoreContribution: number;
  matchedSnippet: string;
  explanation: string;
  whyItMatters: string;
}

export interface ExtractedUrl {
  raw: string;
  hostname: string;
  protocol: string;
  isShortener: boolean;
  isIpAddress: boolean;
  isSuspiciousPattern: boolean;
  isFictionalDemo: boolean;
  note?: string;
}

export interface PrivacyDetection {
  containsPotentialOtp: boolean;
  containsPotentialCard: boolean;
  maskedSnippetNotice?: string;
}

export interface AnalysisResult {
  overallRisk: RiskLevel;
  riskScore: number; // 0 - 100
  selectedIntent: UserIntent;
  detectedActions: DetectedAction[];
  intentMismatchStatus: IntentMismatchStatus;
  primaryMismatchTitle: string;
  primaryMismatchExplanation: string;
  whyItMatters: string;
  detectedIndicators: ScamIndicator[];
  negatedAdvisoriesDetected: string[];
  extractedUrls: ExtractedUrl[];
  privacyDetection: PrivacyDetection;
  recommendedNextSteps: string[];
  confidenceAssessment: string;
  disclaimer: string;
  processingTimeMs: number;
  isPureInformational: boolean;
}

export interface DemoScenario {
  id: string;
  title: string;
  category: string;
  messageText: string;
  intendedGoal: UserIntent;
  summary: string;
  expectedRiskLevel: RiskLevel;
  expectedKeyFindings: string[];
  educationalTakeaway: string;
}
