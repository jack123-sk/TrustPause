/**
 * Context and Linguistic Analysis
 * Distinguishes between:
 * 1. Imperative requests directed at the user ("Pay ₹199", "Share the OTP")
 * 2. Security advisories and negated warnings ("Never share your OTP", "Bank will never ask for your PIN")
 * 3. User-reported past narratives ("The scammer told me to approve a payment, but I did not do it")
 * 4. Informational confirmations ("Your payment of ₹850 was successful")
 */

export interface ParsedSentence {
  raw: string;
  isNegated: boolean;
  isSecurityAdvisory: boolean;
  isReportedNarrative: boolean;
  isInformationalReceipt: boolean;
  matchedAdvisoryPattern?: string;
}

export interface MessageContext {
  sentences: ParsedSentence[];
  hasSafetyAdvisory: boolean;
  advisoryPhrases: string[];
  isEntirelyInformational: boolean;
  isUserNarrative: boolean;
}

// Patterns that signal a security warning or negative instruction
const ADVISORY_PATTERNS: RegExp[] = [
  /\bnever\s+share\b/i,
  /\bnever\s+disclose\b/i,
  /\bnever\s+give\b/i,
  /\bnever\s+tell\b/i,
  /\bnever\s+send\b/i,
  /\bdo\s+not\s+share\b/i,
  /\bdon'?t\s+share\b/i,
  /\bdo\s+not\s+disclose\b/i,
  /\bdon'?t\s+disclose\b/i,
  /\bdo\s+not\s+give\b/i,
  /\bdon'?t\s+give\b/i,
  /\bwill\s+never\s+ask\b/i,
  /\bdoes\s+not\s+ask\b/i,
  /\bnever\s+asks?\s+for\b/i,
  /\bdo\s+not\s+transfer\b/i,
  /\bnever\s+enter\s+upi\s+pin\s+to\s+receive\b/i,
  /\bsafety\s+tip\b/i,
  /\bbe\s+aware\s+of\s+fraud\b/i,
  /\bcaution:\s*never\b/i,
];

// Patterns signaling past narrative or quoted scammer dialogue
const REPORTED_NARRATIVE_PATTERNS: RegExp[] = [
  /\b(scammer|caller|stranger|person)\s+(told|asked|instructed|demanded)\s+me\b/i,
  /\bi\s+was\s+told\s+to\b/i,
  /\bthey\s+asked\s+me\s+to\b/i,
  /\bhe\s+asked\s+me\s+to\b/i,
  /\bshe\s+asked\s+me\s+to\b/i,
  /\bbut\s+i\s+did\s+not\b/i,
  /\bso\s+i\s+refused\b/i,
  /\bi\s+did\s+not\s+(do|send|share|approve)\b/i,
];

// Informational receipt or status updates without actionable demands
const INFORMATIONAL_RECEIPT_PATTERNS: RegExp[] = [
  /\bwas\s+successful\b/i,
  /\bhas\s+been\s+credited\b/i,
  /\bpayment\s+received\b/i,
  /\bthank\s+you\s+for\s+using\b/i,
  /\btransaction\s+successful\b/i,
  /\bhas\s+been\s+debited\b/i,
  /\bbalance\s+is\b/i,
  /\bbill\s+paid\s+successfully\b/i,
  /\brecharge\s+successful\b/i,
];

// Imperative request markers (calls to action)
const IMPERATIVE_ACTION_MARKERS: RegExp[] = [
  /\b(pay|transfer|send|approve|share|click|install|download|call|contact|verify|scan|enter)\b/i,
];

/**
 * Splits text into individual sentences while preserving numbers and URLs.
 */
export function splitIntoSentences(text: string): string[] {
  if (!text || text.trim().length === 0) return [];

  // Replace common abbreviations to prevent incorrect splits
  const sanitized = text
    .replace(/\b(e\.g\.|i\.e\.|mr\.|mrs\.|dr\.|vs\.)/gi, (m) => m.replace(/\./g, '___DOT___'))
    // Prevent splitting on decimal numbers like ₹2,000.50
    .replace(/(\d+)\.(\d+)/g, '$1___DOT___$2');

  const rawSentences = sanitized.split(/[.!?\n\r]+/).map((s) =>
    s.replace(/___DOT___/g, '.').trim()
  );

  return rawSentences.filter((s) => s.length > 0);
}

/**
 * Parses a single sentence for negation, advisories, and narrative voice.
 */
export function parseSentence(sentence: string): ParsedSentence {
  let isSecurityAdvisory = false;
  let matchedAdvisoryPattern: string | undefined;

  for (const pattern of ADVISORY_PATTERNS) {
    const match = sentence.match(pattern);
    if (match) {
      isSecurityAdvisory = true;
      matchedAdvisoryPattern = match[0];
      break;
    }
  }

  const isReportedNarrative = REPORTED_NARRATIVE_PATTERNS.some((p) => p.test(sentence));
  const isInformationalReceipt = INFORMATIONAL_RECEIPT_PATTERNS.some((p) => p.test(sentence));

  const generalNegation = /\b(never|do not|don'?t|should not|shouldn'?t|must not|mustn'?t|not)\b/i.test(
    sentence
  );

  return {
    raw: sentence,
    isNegated: generalNegation || isSecurityAdvisory,
    isSecurityAdvisory,
    isReportedNarrative,
    isInformationalReceipt,
    matchedAdvisoryPattern,
  };
}

/**
 * Extracts overall context and filters sentences where actions are legitimately requested
 * rather than warned against or narrated.
 */
export function analyzeMessageContext(text: string): MessageContext {
  const sentences = splitIntoSentences(text).map(parseSentence);

  const advisoryPhrases: string[] = [];
  let hasSafetyAdvisory = false;
  let hasReportedNarrative = false;
  let allInformational = sentences.length > 0;

  for (const s of sentences) {
    if (s.isSecurityAdvisory && s.matchedAdvisoryPattern) {
      hasSafetyAdvisory = true;
      advisoryPhrases.push(s.matchedAdvisoryPattern);
    }
    if (s.isReportedNarrative) {
      hasReportedNarrative = true;
    }
    // If a sentence contains an imperative action marker and is not an informational receipt,
    // then the message is not purely informational
    if (!s.isInformationalReceipt && IMPERATIVE_ACTION_MARKERS.some((p) => p.test(s.raw))) {
      allInformational = false;
    }
  }

  return {
    sentences,
    hasSafetyAdvisory,
    advisoryPhrases,
    isEntirelyInformational: allInformational && sentences.length > 0,
    isUserNarrative: hasReportedNarrative,
  };
}

/**
 * Determines whether a specific phrase in the message is part of an active imperative instruction
 * or negated/advisory.
 */
export function isClauseImperative(clause: string, context: MessageContext): boolean {
  // If the clause matches any advisory pattern directly, it is NOT an imperative action demanded of the user
  for (const pattern of ADVISORY_PATTERNS) {
    if (pattern.test(clause)) return false;
  }

  // If the sentence containing this clause is a reported narrative or negated advisory, skip
  for (const sentence of context.sentences) {
    if (sentence.raw.includes(clause)) {
      if (sentence.isSecurityAdvisory || sentence.isReportedNarrative) {
        return false;
      }
    }
  }

  return true;
}
