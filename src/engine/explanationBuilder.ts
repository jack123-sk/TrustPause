/**
 * Plain-English Explanation and Safety Recommendations Builder
 * Transforms technical heuristic findings into actionable, non-jargon guidance.
 */

import {
  RiskLevel,
  IntentMismatchStatus,
  ScamIndicator,
  UserIntent,
} from '../types';

export interface ExplanationGuidance {
  primarySummary: string;
  recommendedSteps: string[];
  disclaimer: string;
}

export function buildExplanationAndSteps(
  riskLevel: RiskLevel,
  _mismatchStatus: IntentMismatchStatus,
  indicators: ScamIndicator[],
  selectedIntent: UserIntent,
  isInformational: boolean
): ExplanationGuidance {
  const steps: string[] = [];

  // Tailored steps based on detected threats and mismatches
  const hasOtpDemand = indicators.some((i) => i.category === 'OTP_OR_CREDENTIAL_THEFT');
  const hasRemoteAccess = indicators.some((i) => i.category === 'REMOTE_ACCESS_OR_MALWARE');
  const hasUpiPinTrap = indicators.some((i) => i.category === 'UPI_PIN_OR_COLLECT_TRAP');
  const hasSuspensionThreat = indicators.some((i) => i.category === 'ACCOUNT_SUSPENSION_OR_THREAT');
  const hasAdvanceFee = indicators.some((i) => i.category === 'ADVANCE_FEE_OR_FAKE_PRIZE');
  const hasAvoidVerification = indicators.some((i) => i.category === 'AVOID_VERIFICATION');
  const hasLinks = indicators.some((i) => i.category === 'SUSPICIOUS_LINK_OR_SHORTENER');

  if (hasOtpDemand) {
    steps.push('NEVER share your OTP, security PIN, or password with anyone, even someone claiming to be bank staff.');
    steps.push('If you already shared an OTP, immediately call your bank’s official 24x7 emergency helpline to freeze your account/cards.');
  }

  if (hasRemoteAccess) {
    steps.push('Do NOT install any screen-sharing applications (AnyDesk, TeamViewer, QuickSupport) requested by a caller or message.');
    steps.push('If already installed, immediately disconnect your phone from Wi-Fi/mobile data and uninstall the application.');
  }

  if (hasUpiPinTrap) {
    steps.push('Remember NPCI Rule: You NEVER need to enter your UPI PIN or scan a QR code to RECEIVE money.');
    steps.push('Decline any unexpected "Collect Requests" received on your Google Pay, PhonePe, or Paytm apps.');
  }

  if (hasAdvanceFee) {
    steps.push('Do not transfer processing fees or taxes to unlock refunds, prizes, or job offers. Real refunds credit automatically.');
  }

  if (hasAvoidVerification) {
    steps.push('Verify the request by placing a phone call to the known, saved phone number of your manager or colleague directly.');
  }

  if (hasSuspensionThreat || hasLinks) {
    steps.push('Do not tap links sent via SMS or WhatsApp claiming your bank account or electricity will be blocked.');
    steps.push('Log into your official banking app or electricity utility portal independently by typing the official address.');
  }

  // General fallback steps depending on overall risk
  if (riskLevel === 'LOW' && isInformational) {
    steps.push('Review this notification against your official bank passbook or statement to ensure you recognize the transaction.');
    steps.push('No action is needed if you recognize the transaction. Never reply to unsolicited confirmation messages requesting verification.');
  } else if (steps.length === 0) {
    if (selectedIntent === 'SEND_MONEY') {
      steps.push('Independently verify the recipient name, UPI ID, or account number through a trusted voice call before sending funds.');
      steps.push('Send a nominal amount (e.g., ₹1) first if dealing with a new or unfamiliar merchant to verify credentials.');
    } else {
      steps.push('Pause and do not click any links or reply to the sender.');
      steps.push('Contact the customer service number printed on the back of your official debit/credit card or utility bill.');
      steps.push('Report suspicious SMS messages in India to the National Cyber Crime Reporting Portal (cybercrime.gov.in) or call 1930.');
    }
  }

  let primarySummary: string;
  if (riskLevel === 'CRITICAL') {
    primarySummary =
      'CRITICAL WARNING: This message demands actions that pose an immediate danger to your account security (such as revealing secret authentication codes or granting device control). Exercise extreme caution and do not comply.';
  } else if (riskLevel === 'HIGH') {
    primarySummary =
      'HIGH RISK: The message exhibits strong indicators of a payment scam or coercive pressure designed to divert your money or credentials.';
  } else if (riskLevel === 'CAUTION') {
    primarySummary =
      'CAUTION: While no critical authentication threats were detected, the message requires careful independent verification before taking action.';
  } else {
    primarySummary =
      'LOW RISK INDICATORS: No major scam patterns or intent contradictions were detected in this message. However, TrustPause cannot independently verify the authenticity of the sender.';
  }

  const disclaimer =
    'Disclaimer: TrustPause provides heuristic, privacy-preserving analysis to assist your decision-making. It does not replace independent verification and cannot guarantee that any message is 100% genuine or malicious.';

  return {
    primarySummary,
    recommendedSteps: steps,
    disclaimer,
  };
}
