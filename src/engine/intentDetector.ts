/**
 * Intent-Mismatch Detection Engine
 * Compares the user's declared goal with the explicit actions requested by the message.
 * Incorporates Indian digital payment context (NPCI / UPI safety architecture).
 */

import {
  UserIntent,
  DetectedAction,
  IntentMismatchStatus,
  RequestedActionType,
} from '../types';
import { MessageContext, isClauseImperative } from './contextParser';

interface ActionRule {
  type: RequestedActionType;
  label: string;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  explanation: string;
  matcher: (text: string, context: MessageContext) => string | null;
}

export const ACTION_RULES: ActionRule[] = [
  // 1. Pay Fee / Processing Charge
  {
    type: 'PAY_FEE',
    label: 'Pay an Upfront Fee or Processing Charge',
    confidence: 'HIGH',
    explanation: 'The message instructs you to pay a fee, charge, or deposit.',
    matcher: (text, context) => {
      const match = text.match(
        /\b(?:pay|deposit)\s+(?:a\s+)?(?:processing\s+)?(?:fee|charge|deposit|amount|cost)\b|\bpay\s+[₹$]?\s*[\d,]+\s+(?:as\s+(?:a\s+)?)?(?:processing\s+charge|processing\s+fee|processing|charge|fee)?\s*(?:to\s+(?:receive|claim|release|unlock|get))?/i
      );
      if (match && isClauseImperative(match[0], context)) return match[0];
      return null;
    },
  },

  // 2. Enter UPI PIN / QR Scan
  {
    type: 'ENTER_UPI_PIN',
    label: 'Enter UPI PIN or Scan Payment QR',
    confidence: 'HIGH',
    explanation:
      'The message instructs you to enter your UPI PIN or scan a QR code to complete the transaction.',
    matcher: (text, context) => {
      const match = text.match(
        /\b(?:enter|put|type)\s+(?:your\s+)?upi\s+pin\b|\bscan\s+(?:this\s+)?(?:qr|payment\s+qr)\b/i
      );
      if (match && isClauseImperative(match[0], context)) return match[0];
      return null;
    },
  },

  // 3. Approve Payment / Debit
  {
    type: 'APPROVE_PAYMENT',
    label: 'Approve a Payment or Collect Request',
    confidence: 'HIGH',
    explanation:
      'The message asks you to approve or authorize an outgoing debit or collect request.',
    matcher: (text, context) => {
      const match = text.match(
        /\bapprove\s+(?:the\s+)?(?:payment|transaction|debit|collect\s+request|request)\b/i
      );
      if (match && isClauseImperative(match[0], context)) return match[0];
      return null;
    },
  },

  // 4. Transfer Money
  {
    type: 'TRANSFER_MONEY',
    label: 'Transfer or Send Money',
    confidence: 'HIGH',
    explanation:
      'The message requests that you transfer funds or remit money to an account or UPI ID.',
    matcher: (text, context) => {
      const match = text.match(
        /\b(?:transfer|remit|send)\s+[₹$]?\s*[\d,]+\s+(?:to\s+this|to\s+account|to\s+the\s+person|immediately)/i
      );
      if (match && isClauseImperative(match[0], context)) return match[0];
      return null;
    },
  },

  // 5. Share OTP / Passcode
  {
    type: 'SHARE_OTP',
    label: 'Disclose OTP or Verification Code',
    confidence: 'HIGH',
    explanation:
      'The message explicitly requests that you share an OTP or security passcode.',
    matcher: (text, context) => {
      const match = text.match(
        /\b(?:share|send|provide|give|tell)\s+(?:the\s+)?(?:otp|code|verification\s+code)\b/i
      );
      if (match && isClauseImperative(match[0], context)) return match[0];
      return null;
    },
  },

  // 6. Grant Remote Access / Screen Sharing
  {
    type: 'GRANT_REMOTE_ACCESS',
    label: 'Install Remote Tool or Share Access Code',
    confidence: 'HIGH',
    explanation:
      'The message instructs you to install remote support apps or disclose screen-sharing credentials.',
    matcher: (text, context) => {
      const match = text.match(
        /\b(?:install|download)\s+(?:this\s+)?remote[- ]support\s+app\b|\bshare\s+(?:the\s+)?access\s+code\b|\bgive\s+(?:the\s+)?caller\s+control\b/i
      );
      if (match && isClauseImperative(match[0], context)) return match[0];
      return null;
    },
  },

  // 7. Click Link
  {
    type: 'CLICK_LINK',
    label: 'Click or Open an External Link',
    confidence: 'HIGH',
    explanation: 'The message instructs you to click an embedded link or visit a website.',
    matcher: (text, context) => {
      const match = text.match(
        /\b(?:click|open|tap|visit|follow)\s+(?:the|this|our)?\s*(?:link|url|website|portal)\b|\busing\s+the\s+link\s+below\b/i
      );
      if (match && isClauseImperative(match[0], context)) return match[0];
      return null;
    },
  },

  // 8. Install Application / APK
  {
    type: 'INSTALL_APP',
    label: 'Install Application or APK File',
    confidence: 'HIGH',
    explanation: 'The message requests installing an app or APK file from a link or message.',
    matcher: (text, context) => {
      const match = text.match(
        /\b(?:install|download)\s+(?:this|the)?\s*(?:app|application|apk|\.apk)\b/i
      );
      if (match && isClauseImperative(match[0], context)) return match[0];
      return null;
    },
  },

  // 9. Verify Account / Details
  {
    type: 'VERIFY_ACCOUNT',
    label: 'Verify Account or Personal Details',
    confidence: 'MEDIUM',
    explanation: 'The message asks you to verify personal, banking, or account information.',
    matcher: (text, context) => {
      const match = text.match(
        /\bverify\s+(?:your\s+)?(?:account|details|identity|kyc|pan|information)\b/i
      );
      if (match && isClauseImperative(match[0], context)) return match[0];
      return null;
    },
  },

  // 10. Informational Notification (Pure Confirmation, no imperative demand)
  {
    type: 'INFORMATIONAL_NOTIFICATION',
    label: 'Informational Notification',
    confidence: 'HIGH',
    explanation: 'The message provides a status update or confirmation without demanding any action.',
    matcher: (text, context) => {
      if (context.isEntirelyInformational) {
        const match = text.match(
          /\b(?:was\s+successful|has\s+been\s+credited|payment\s+received|thank\s+you\s+for\s+using)\b/i
        );
        return match ? match[0] : 'Informational receipt';
      }
      return null;
    },
  },
];

/**
 * Extracts all requested actions from the message taking linguistic context into account.
 */
export function extractRequestedActions(
  text: string,
  context: MessageContext
): DetectedAction[] {
  const detected: DetectedAction[] = [];
  const seenTypes = new Set<RequestedActionType>();

  for (const rule of ACTION_RULES) {
    if (seenTypes.has(rule.type)) continue;

    const matchedSnippet = rule.matcher(text, context);
    if (matchedSnippet) {
      seenTypes.add(rule.type);
      detected.push({
        type: rule.type,
        label: rule.label,
        matchedSnippet,
        confidence: rule.confidence,
        explanation: rule.explanation,
      });
    }
  }

  return detected;
}

export interface IntentComparisonResult {
  status: IntentMismatchStatus;
  title: string;
  explanation: string;
  whyItMatters: string;
}

/**
 * Evaluates the detected actions against the user's declared goal.
 */
export function compareIntentWithActions(
  intent: UserIntent,
  actions: DetectedAction[],
  context: MessageContext
): IntentComparisonResult {
  const actionTypes = new Set(actions.map((a) => a.type));

  // Case 1: Unspecified Intent
  if (intent === 'OTHER_NOT_SURE') {
    return {
      status: 'UNSPECIFIED_INTENT',
      title: 'General Security Evaluation (Intent Not Specified)',
      explanation:
        'Because no specific intention was selected, TrustPause evaluated the message for independent scam patterns, coercion, and credential demands.',
      whyItMatters:
        'Always pause to clarify your own goal before responding to unsolicited messages.',
    };
  }

  // Case 2: User wants to RECEIVE MONEY
  if (intent === 'RECEIVE_MONEY') {
    const hasPaymentDemand =
      actionTypes.has('PAY_FEE') ||
      actionTypes.has('APPROVE_PAYMENT') ||
      actionTypes.has('ENTER_UPI_PIN') ||
      actionTypes.has('TRANSFER_MONEY');

    if (hasPaymentDemand) {
      return {
        status: 'CONTRADICTION',
        title: 'Intent Contradiction: You Want to Receive Money, but Message Demands Payment',
        explanation:
          "You're trying to receive money, but this message asks you to approve a payment, pay a fee, or enter a PIN. That action causes money to leave your account rather than arrive in it.",
        whyItMatters:
          'Under National Payments Corporation of India (NPCI) guidelines, receiving money or refunds into a bank or UPI account NEVER requires entering a UPI PIN, scanning a QR code, or paying an upfront release fee. Authentic refunds credit automatically.',
      };
    }

    if (context.isEntirelyInformational || actionTypes.has('INFORMATIONAL_NOTIFICATION')) {
      return {
        status: 'CONSISTENT_INFORMATIONAL',
        title: 'Action Aligns with Goal: Informational Credit Notice',
        explanation:
          'Your intention is to receive money, and this message appears to be an informational notification reporting that funds were credited. It does not ask you to transfer funds or share credentials.',
        whyItMatters:
          'While no payment demands were detected, always confirm that funds actually appear in your official banking or UPI app balance before delivering goods or providing services.',
      };
    }
  }

  // Case 3: User wants to SEND MONEY
  if (intent === 'SEND_MONEY') {
    const hasTransferRequest =
      actionTypes.has('TRANSFER_MONEY') ||
      actionTypes.has('PAY_FEE') ||
      actionTypes.has('APPROVE_PAYMENT');

    if (hasTransferRequest) {
      return {
        status: 'MATCH_VERIFY_NEEDED',
        title: 'Action Matches Stated Goal, but Verification is Required',
        explanation:
          'The message asks you to send or transfer money, which matches your declared intention. However, matching your intention does NOT make the transaction safe.',
        whyItMatters:
          'Fraudsters exploit intentional transfers using fake invoices, impersonated managers, or altered account numbers. Always verify the recipient identity through an established phone number or trusted channel before hitting send.',
      };
    }
  }

  // Case 4: User wants to VERIFY INFORMATION
  if (intent === 'VERIFY_INFORMATION') {
    if (actionTypes.has('SHARE_OTP') || actionTypes.has('ENTER_UPI_PIN')) {
      return {
        status: 'CRITICAL_RISK_ACTION',
        title: 'Severe Contradiction: Information Verification Never Requires Disclosing OTPs or PINs',
        explanation:
          'You intended to check or verify an account status, but the message instructs you to disclose an OTP or enter your UPI PIN.',
        whyItMatters:
          'One-Time Passwords authenticate transactions and logins. Disclosing an OTP gives the caller or sender immediate authorization to empty your account or take over your services.',
      };
    }

    if (actionTypes.has('GRANT_REMOTE_ACCESS') || actionTypes.has('INSTALL_APP')) {
      return {
        status: 'CRITICAL_RISK_ACTION',
        title: 'Severe Contradiction: Routine Verification Never Requires Remote Screen Access',
        explanation:
          'You intended to verify account information, but the message instructs you to install remote support software or share an access code.',
        whyItMatters:
          'Remote screen-sharing applications (AnyDesk, QuickSupport, TeamViewer) allow third parties to inspect your phone screen, read your incoming SMS OTPs, and hijack payment apps.',
      };
    }

    if (actionTypes.has('CLICK_LINK') || actionTypes.has('VERIFY_ACCOUNT')) {
      return {
        status: 'CONTRADICTION',
        title: 'Suspicious Verification Channel: Avoid External Links',
        explanation:
          'You intended to verify account details, but the message directs you to an external website or unverified link.',
        whyItMatters:
          'Phishing websites closely replicate legitimate bank portals. You should always navigate directly to your bank or service provider app or official website rather than tapping SMS links.',
      };
    }

    if (context.isEntirelyInformational || actionTypes.has('INFORMATIONAL_NOTIFICATION')) {
      return {
        status: 'CONSISTENT_INFORMATIONAL',
        title: 'Status Update Consistent with Verification',
        explanation:
          'The message provides a status update or confirmation without demanding that you click unverified links, disclose secrets, or make payments.',
        whyItMatters:
          'The message appears informational. Verify against your official banking statements if you did not initiate the transaction.',
      };
    }
  }

  // Case 5: User wants to SHARE ACCESS / SUPPORT
  if (intent === 'SHARE_ACCESS') {
    if (actionTypes.has('GRANT_REMOTE_ACCESS') || actionTypes.has('SHARE_OTP')) {
      return {
        status: 'CRITICAL_RISK_ACTION',
        title: 'High Risk Action: Sharing Access to Device or Authentication Secrets',
        explanation:
          'You indicated an intent to provide access or assist support. The message asks for remote control software or one-time codes.',
        whyItMatters:
          'Even when expecting tech support, authentic bank or payment executives are strictly prohibited from requesting remote device access or one-time passcodes.',
      };
    }
  }

  // Default Fallback
  if (actions.length === 0 || context.hasSafetyAdvisory || context.isEntirelyInformational) {
    return {
      status: 'CONSISTENT_INFORMATIONAL',
      title: context.hasSafetyAdvisory ? 'Official Security Advisory Detected' : 'Informational Content (No Demands Detected)',
      explanation:
        context.hasSafetyAdvisory
          ? 'This message appears to be a legitimate security notice or warning. It advises caution rather than requesting that you perform sensitive actions.'
          : 'No urgent payment requests, credential demands, or suspicious actions were requested in this message.',
      whyItMatters:
        'Informational messages and advisories should still be independently cross-referenced with your official banking records.',
    };
  }

  return {
    status: 'MATCH_VERIFY_NEEDED',
    title: 'Review Requested Action Against Your Intended Goal',
    explanation:
      'Evaluate whether the action requested by this message genuinely aligns with what you intended to achieve.',
    whyItMatters:
      'Taking a pause before acting gives you time to verify through official, trusted channels.',
  };
}
