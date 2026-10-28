/**
 * Privacy Scanner and Secret Redaction
 * Ensures sensitive user data (OTPs, PINs, card numbers) are detected and redacted.
 * Analysis is strictly in-memory and ephemeral.
 */

import { PrivacyDetection } from '../types';

const OTP_CANDIDATE_REGEX = /\b(?:\d{4}|\d{6})\b/g;
const CARD_NUMBER_REGEX = /\b(?:\d{4}[-\s]?){3}\d{4}\b/g;

/**
 * Scans text for secrets and returns detection flags and notice.
 */
export function scanPrivacy(text: string): PrivacyDetection {
  if (!text) {
    return {
      containsPotentialOtp: false,
      containsPotentialCard: false,
    };
  }

  const hasCard = CARD_NUMBER_REGEX.test(text);
  // Check for 4-6 digit codes, particularly if nearby words like otp, code, pin, verification exist
  const hasOtpContext = /\b(otp|code|pin|password|verification)\b/i.test(text);
  const otpMatches = text.match(OTP_CANDIDATE_REGEX);
  const hasPotentialOtp = Boolean(otpMatches && (hasOtpContext || otpMatches.length > 0));

  let maskedSnippetNotice: string | undefined;
  if (hasPotentialOtp || hasCard) {
    maskedSnippetNotice =
      'Sensitive numeric codes or payment numbers were detected in this message. For your security, TrustPause masks these values and processes text entirely within your local browser.';
  }

  return {
    containsPotentialOtp: hasPotentialOtp,
    containsPotentialCard: hasCard,
    maskedSnippetNotice,
  };
}

/**
 * Redacts secrets from snippets before rendering in the UI or exporting reports.
 */
export function redactSecrets(snippet: string): string {
  if (!snippet) return '';

  return snippet
    // Mask potential card numbers: 1234-5678-9012-3456 -> ****-****-****-3456
    .replace(CARD_NUMBER_REGEX, (match) => {
      const clean = match.replace(/[-\s]/g, '');
      const last4 = clean.slice(-4);
      return `[CARD: ****-****-****-${last4}]`;
    })
    // Mask potential OTPs (4-6 digits near authentication words)
    .replace(/\b(otp|code|pin|verification\s+code)[:\s]+(\d{4,6})\b/gi, (_full, prefix, _code) => {
      return `${prefix}: [PROTECTED-CODE-REDACTED]`;
    });
}
