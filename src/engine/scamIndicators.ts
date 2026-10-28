/**
 * Scam Indicator Detection Modules
 * Evaluates contextual evidence across multiple fraud vectors.
 * Incorporates linguistic context to prevent false alarms on advisories or receipts.
 */

import { ScamIndicator, ExtractedUrl } from '../types';
import { MessageContext, isClauseImperative } from './contextParser';

export interface IndicatorRule {
  id: string;
  category: ScamIndicator['category'];
  name: string;
  severity: ScamIndicator['severity'];
  scoreContribution: number;
  explanation: string;
  whyItMatters: string;
  matcher: (text: string, context: MessageContext, urls: ExtractedUrl[]) => string | null;
}

export const SCAM_INDICATOR_RULES: IndicatorRule[] = [
  // 1. CRITICAL: Request to Share OTP or Passwords
  {
    id: 'req-share-otp',
    category: 'OTP_OR_CREDENTIAL_THEFT',
    name: 'Request to Disclose OTP / Passcode',
    severity: 'CRITICAL',
    scoreContribution: 40,
    explanation:
      'The message explicitly requests that you share an OTP, verification code, or password.',
    whyItMatters:
      'One-Time Passwords (OTPs) authenticate debits and access approvals. Legitimate banks and support representatives will NEVER ask you to disclose an OTP.',
    matcher: (text, context) => {
      // Must not be an advisory like "Never share your OTP"
      const patterns = [
        /\b(?:share|send|provide|give|tell|enter)\s+(?:the\s+)?otp\b/i,
        /\botp\s+(?:you\s+received\s+)?with\s+(?:our\s+)?(?:agent|executive|support|caller|me)\b/i,
        /\bshare\s+the\s+(?:verification\s+)?code\b/i,
        /\bforward\s+(?:the\s+)?(?:otp|code|sms)\b/i,
      ];

      for (const p of patterns) {
        const match = text.match(p);
        if (match && isClauseImperative(match[0], context)) {
          return match[0];
        }
      }
      return null;
    },
  },

  // 2. CRITICAL: Remote Access / Screen-Sharing Application Request
  {
    id: 'req-remote-access',
    category: 'REMOTE_ACCESS_OR_MALWARE',
    name: 'Remote Access / Screen-Sharing Request',
    severity: 'CRITICAL',
    scoreContribution: 38,
    explanation:
      'The message instructs you to install remote-support tools (e.g. AnyDesk, TeamViewer, QuickSupport) or disclose an access code.',
    whyItMatters:
      'Granting remote screen access allows an attacker to control your device, observe live OTPs, and initiate financial transfers without your realization.',
    matcher: (text, context) => {
      const patterns = [
        /\b(?:install|download)\s+(?:this\s+)?remote[- ]support\s+app\b/i,
        /\bshare\s+(?:the\s+)?access\s+code\b/i,
        /\b(?:anydesk|teamviewer|quicksupport|rustdesk|screen\s+share)\b/i,
        /\bgive\s+(?:the\s+)?caller\s+control\s+of\s+your\s+phone\b/i,
        /\bconnect\s+to\s+remote\s+session\b/i,
      ];

      for (const p of patterns) {
        const match = text.match(p);
        if (match && isClauseImperative(match[0], context)) {
          return match[0];
        }
      }
      return null;
    },
  },

  // 3. CRITICAL: UPI PIN Trap to Receive Money
  {
    id: 'req-upi-pin-receive',
    category: 'UPI_PIN_OR_COLLECT_TRAP',
    name: 'UPI PIN / Approval Trap to Receive Money',
    severity: 'CRITICAL',
    scoreContribution: 40,
    explanation:
      'The message asks you to enter your UPI PIN or approve a payment request in order to "receive" funds.',
    whyItMatters:
      'In India\'s UPI architecture (NPCI), entering your UPI PIN always DEBITS money from your account. You NEVER need to enter a UPI PIN or accept a collect request to receive money.',
    matcher: (text, context) => {
      const patterns = [
        /\benter\s+(?:your\s+)?upi\s+pin\s+to\s+(?:receive|claim|get)\b/i,
        /\bscan\s+(?:this\s+)?qr\s+(?:code\s+)?to\s+(?:receive|get|claim)\b/i,
        /\bapprove\s+(?:the\s+)?(?:collect\s+request|payment)\s+to\s+(?:receive|get)\b/i,
        /\benter\s+pin\s+for\s+refund\b/i,
      ];

      for (const p of patterns) {
        const match = text.match(p);
        if (match && isClauseImperative(match[0], context)) {
          return match[0];
        }
      }
      return null;
    },
  },

  // 4. HIGH: Advance Fee / Processing Charge Request
  {
    id: 'req-advance-fee',
    category: 'ADVANCE_FEE_OR_FAKE_PRIZE',
    name: 'Advance Fee / Processing Charge Demand',
    severity: 'HIGH',
    scoreContribution: 25,
    explanation:
      'The message demands an upfront payment or processing charge to release a larger payment, refund, loan, or prize.',
    whyItMatters:
      'Advance-fee fraud relies on promising a lucrative payout once a small administrative or clearance fee is paid. Once paid, the fraudster disappears.',
    matcher: (text, context) => {
      const patterns = [
        /\bpay\s+(?:a\s+)?(?:processing\s+fee|processing\s+charge|refundable\s+deposit|clearance\s+fee|service\s+charge)\s+of\s+[₹$]?\s*[\d,]+/i,
        /\bpay\s+[₹$]?\s*[\d,]+\s+(?:as\s+(?:a\s+)?)?(?:processing\s+charge|processing\s+fee|charge|fee|deposit)\s+to\s+(?:claim|receive|get|unlock)/i,
        /\bpay\s+[₹$]?\s*[\d,]+\s+to\s+(?:release|unlock|receive)\s+your\s+(?:refund|prize|money)/i,
      ];

      for (const p of patterns) {
        const match = text.match(p);
        if (match && isClauseImperative(match[0], context)) {
          return match[0];
        }
      }
      return null;
    },
  },

  // 5. HIGH: Lottery or Unsolicited Prize Claim
  {
    id: 'ind-fake-prize',
    category: 'ADVANCE_FEE_OR_FAKE_PRIZE',
    name: 'Unsolicited Prize / Lottery Claim',
    severity: 'HIGH',
    scoreContribution: 22,
    explanation:
      'The message claims you have won a substantial sum of money or lottery prize without any prior contest participation.',
    whyItMatters:
      'Legitimate organizations and government lotteries do not inform winners via random SMS or WhatsApp messages requiring immediate action.',
    matcher: (text) => {
      const patterns = [
        /\bcongratulations!?\s+you\s+have\s+won\s+[₹$]?\s*[\d,]+/i,
        /\byou\s+have\s+won\s+(?:the\s+)?(?:lottery|lucky\s+draw|cash\s+prize)\b/i,
        /\byou\s+are\s+selected\s+for\s+(?:a\s+)?cash\s+reward\b/i,
      ];

      for (const p of patterns) {
        const match = text.match(p);
        if (match) {
          return match[0];
        }
      }
      return null;
    },
  },

  // 6. HIGH: Account Suspension / Utility Disconnection Threat
  {
    id: 'ind-suspension-threat',
    category: 'ACCOUNT_SUSPENSION_OR_THREAT',
    name: 'Account Suspension or Disconnection Threat',
    severity: 'HIGH',
    scoreContribution: 24,
    explanation:
      'The message creates fear by threatening imminent account suspension, KYC termination, or service stoppage.',
    whyItMatters:
      'Urgent threats induce psychological panic, prompting victims to act impulsively before independently verifying the claim with their bank or utility provider.',
    matcher: (text, context) => {
      const patterns = [
        /\baccount\s+will\s+be\s+(?:blocked|suspended|deactivated|closed|frozen)\b/i,
        /\belectricity\s+will\s+be\s+(?:disconnected|cut\s+off)\s+(?:tonight|today|immediately)\b/i,
        /\bkyc\s+(?:is\s+)?expired\b/i,
        /\bpan\s+card\s+not\s+updated\b/i,
        /\bsim\s+will\s+be\s+deactivated\b/i,
      ];

      for (const p of patterns) {
        const match = text.match(p);
        if (match && isClauseImperative(match[0], context)) {
          return match[0];
        }
      }
      return null;
    },
  },

  // 7. HIGH: Pressure to Avoid Independent Verification
  {
    id: 'ind-avoid-verification',
    category: 'AVOID_VERIFICATION',
    name: 'Pressure to Avoid Independent Verification',
    severity: 'HIGH',
    scoreContribution: 22,
    explanation:
      'The sender explicitly instructs you not to call, not to contact the branch, or to keep the transaction secret.',
    whyItMatters:
      'This tactic isolates the victim from colleagues, bank representatives, or family members who would instantly expose the deception.',
    matcher: (text) => {
      const patterns = [
        /\bdo\s+not\s+call\s+me\b/i,
        /\bdon'?t\s+call\s+me\b/i,
        /\bdo\s+not\s+(?:contact|visit)\s+(?:the\s+)?branch\b/i,
        /\bkeep\s+this\s+strictly\s+confidential\b/i,
        /\bdo\s+not\s+discuss\s+with\s+anyone\b/i,
        /\breply\s+only\s+(?:on|via)\s+(?:whatsapp|this\s+number)\b/i,
      ];

      for (const p of patterns) {
        const match = text.match(p);
        // Note: here "do not call" is the exact coercion phrase from the scammer!
        if (match) {
          return match[0];
        }
      }
      return null;
    },
  },

  // 8. MEDIUM: High Urgency & Time Pressure
  {
    id: 'ind-artificial-urgency',
    category: 'URGENCY_OR_PRESSURE',
    name: 'Artificial Urgency and Tight Deadlines',
    severity: 'MEDIUM',
    scoreContribution: 15,
    explanation:
      'The message uses aggressive time-sensitive language urging you to act immediately or within minutes.',
    whyItMatters:
      'Creating a false sense of urgency prevents victims from taking a moment to think rationally, pause, or verify.',
    matcher: (text) => {
      const patterns = [
        /\b(?:within|in)\s+\d+\s+(?:minutes|mins|hours)\b/i,
        /\bimmediately\b/i,
        /\burgently\b/i,
        /\blast\s+chance\b/i,
        /\baction\s+required\s+now\b/i,
      ];

      for (const p of patterns) {
        const match = text.match(p);
        if (match) {
          return match[0];
        }
      }
      return null;
    },
  },

  // 9. HIGH: Authority / Manager Impersonation
  {
    id: 'ind-authority-impersonation',
    category: 'IMPERSONATION',
    name: 'Authority / Executive Impersonation',
    severity: 'HIGH',
    scoreContribution: 20,
    explanation:
      'The message claims to be sent by a workplace supervisor, executive, or law enforcement official.',
    whyItMatters:
      'Workplace and executive impersonation (CEO fraud) exploits social hierarchy and deference to authority to force fast compliance.',
    matcher: (text) => {
      const patterns = [
        /\bthis\s+is\s+your\s+(?:manager|boss|ceo|director|managing\s+director)\b/i,
        /\bi\s+am\s+your\s+(?:manager|supervisor)\b/i,
        /\bcalling\s+from\s+(?:the\s+)?(?:cbi|police|customs|cyber\s+crime\s+cell)\b/i,
      ];

      for (const p of patterns) {
        const match = text.match(p);
        if (match) {
          return match[0];
        }
      }
      return null;
    },
  },

  // 10. HIGH: Brand Impersonation in Unverified Channel
  {
    id: 'ind-brand-impersonation',
    category: 'IMPERSONATION',
    name: 'Financial Institution or Utility Brand Reference',
    severity: 'MEDIUM',
    scoreContribution: 10,
    explanation:
      'The message references a major bank, telecom, or public service provider alongside action demands.',
    whyItMatters:
      'Scammers impersonate trusted institutions like SBI, HDFC, or electricity utilities to make their fraudulent requests seem authentic.',
    matcher: (text, context) => {
      // Don't flag if it's purely a benign receipt ("Your electricity bill payment of ₹850 was successful")
      if (context.isEntirelyInformational) return null;

      const patterns = [
        /\b(?:sbi|state\s+bank|hdfc|icici|axis\s+bank|punjab\s+national\s+bank|pnb)\b/i,
        /\b(?:income\s+tax\s+department|electricity\s+board|india\s+post)\b/i,
      ];

      for (const p of patterns) {
        const match = text.match(p);
        if (match) {
          return match[0];
        }
      }
      return null;
    },
  },

  // 11. HIGH: Suspicious URL or Phishing Link
  {
    id: 'ind-suspicious-url',
    category: 'SUSPICIOUS_LINK_OR_SHORTENER',
    name: 'Suspicious Destination Link or Shortener',
    severity: 'HIGH',
    scoreContribution: 20,
    explanation:
      'The message contains a shortened URL, an IP address, or a domain mimicking financial institutions.',
    whyItMatters:
      'Phishing websites replicate login screens, KYC update portals, and payment gateways to siphon credentials and credentials.',
    matcher: (_text, _context, urls) => {
      for (const u of urls) {
        if (u.isShortener || u.isIpAddress || u.isSuspiciousPattern) {
          return `${u.raw} (${u.note || 'Suspicious structure'})`;
        }
        if (u.isFictionalDemo) {
          return `${u.raw} (Illustrative test domain)`;
        }
      }
      return null;
    },
  },

  // 12. HIGH: Request to Install APK or Unverified App
  {
    id: 'ind-apk-download',
    category: 'REMOTE_ACCESS_OR_MALWARE',
    name: 'Request to Sideload APK / Unverified App',
    severity: 'HIGH',
    scoreContribution: 25,
    explanation:
      'The message urges you to download or sideload an Android APK package or third-party executable.',
    whyItMatters:
      'Malicious APKs forwarded via WhatsApp or SMS routinely request SMS permissions to intercept incoming banking OTPs automatically.',
    matcher: (text) => {
      const patterns = [
        /\b(?:download|install)\s+(?:the\s+)?(?:apk|\.apk)\b/i,
        /\bdownload\s+(?:the\s+)?app\s+from\s+link\b/i,
        /\binstall\s+(?:the\s+)?update\s+app\b/i,
      ];

      for (const p of patterns) {
        const match = text.match(p);
        if (match) {
          return match[0];
        }
      }
      return null;
    },
  },
];

/**
 * Evaluates the full suite of scam indicators against the message and its context.
 */
export function detectScamIndicators(
  text: string,
  context: MessageContext,
  urls: ExtractedUrl[]
): ScamIndicator[] {
  const indicators: ScamIndicator[] = [];
  const evaluatedIds = new Set<string>();

  for (const rule of SCAM_INDICATOR_RULES) {
    if (evaluatedIds.has(rule.id)) continue;

    const matchedSnippet = rule.matcher(text, context, urls);
    if (matchedSnippet) {
      evaluatedIds.add(rule.id);
      indicators.push({
        id: rule.id,
        category: rule.category,
        name: rule.name,
        severity: rule.severity,
        scoreContribution: rule.scoreContribution,
        matchedSnippet,
        explanation: rule.explanation,
        whyItMatters: rule.whyItMatters,
      });
    }
  }

  return indicators;
}
