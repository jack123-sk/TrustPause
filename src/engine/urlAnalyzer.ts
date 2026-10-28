/**
 * URL and Domain Analysis
 * Local heuristic parsing of URLs embedded in messages.
 * Does NOT perform network calls or visit endpoints.
 */

import { ExtractedUrl } from '../types';

const URL_REGEX = /(?:https?:\/\/|www\.)[^\s<>"'{}|\\^`[\]]+/gi;

const SHORTENER_DOMAINS = new Set([
  'bit.ly',
  'tinyurl.com',
  't.co',
  'is.gd',
  'cutt.ly',
  'rb.gy',
  'ow.ly',
  'buff.ly',
  'tiny.cc',
  'rebrand.ly',
  'goo.gl',
]);

const IP_HOST_REGEX = /^(?:\d{1,3}\.){3}\d{1,3}(?::\d+)?$/;

// Sensitive brands frequently targeted by Indian phishing kits
const SENSITIVE_KEYWORDS = [
  'sbi',
  'hdfc',
  'icici',
  'axis',
  'pnb',
  'paytm',
  'phonepe',
  'gpay',
  'kyc',
  'refund',
  'verify',
  'secure',
  'update',
  'login',
  'portal',
  'electricity',
  'bill',
  'aadhaar',
  'pan',
];

/**
 * Extracts and inspects URLs from raw message text.
 */
export function extractAndAnalyzeUrls(text: string): ExtractedUrl[] {
  if (!text) return [];

  const matches = text.match(URL_REGEX);
  if (!matches) return [];

  const results: ExtractedUrl[] = [];
  const seenUrls = new Set<string>();

  for (const rawMatch of matches) {
    // Strip trailing punctuation often caught by regex in natural language
    const cleanedUrl = rawMatch.replace(/[.,!?;:)\]]+$/, '');

    if (seenUrls.has(cleanedUrl)) continue;
    seenUrls.add(cleanedUrl);

    try {
      const parsed = new URL(
        cleanedUrl.startsWith('http') ? cleanedUrl : `http://${cleanedUrl}`
      );

      const hostname = parsed.hostname.toLowerCase();
      const protocol = parsed.protocol.replace(':', '').toUpperCase();
      const isShortener = SHORTENER_DOMAINS.has(hostname);
      const isIpAddress = IP_HOST_REGEX.test(hostname);

      const isFictionalDemo =
        hostname.endsWith('.example') ||
        hostname.endsWith('.test') ||
        hostname.endsWith('.invalid') ||
        hostname.includes('example.com') ||
        hostname.includes('example.org');

      // Check if domain exhibits brand spoofing or hyphen chaining (e.g., sbi-kyc-update.com)
      let isSuspiciousPattern = false;
      let reason: string | undefined;

      if (isIpAddress) {
        isSuspiciousPattern = true;
        reason = 'URL points directly to a raw IP address instead of a recognized domain name.';
      } else if (isShortener) {
        isSuspiciousPattern = true;
        reason = 'URL uses a link-shortening service, concealing the actual destination.';
      } else if (isFictionalDemo) {
        reason = 'This is an illustrative, fictional demo domain that cannot lead to a live site.';
      } else {
        // Hyphenated keyword stacking: e.g. "sbi-support-portal"
        const matchedKeywords = SENSITIVE_KEYWORDS.filter((kw) => hostname.includes(kw));
        const hasMultipleKeywords = matchedKeywords.length >= 2;
        const hasHyphensWithKeyword = hostname.includes('-') && matchedKeywords.length >= 1;

        if (hasMultipleKeywords || hasHyphensWithKeyword) {
          isSuspiciousPattern = true;
          reason = `Domain contains banking/security keywords (${matchedKeywords.join(', ')}) with suspicious formatting or hyphenation.`;
        }
      }

      if (protocol === 'HTTP' && !isFictionalDemo) {
        reason = (reason ? `${reason} ` : '') + 'Uses unencrypted HTTP connection.';
      }

      results.push({
        raw: cleanedUrl,
        hostname,
        protocol,
        isShortener,
        isIpAddress,
        isSuspiciousPattern,
        isFictionalDemo,
        note: reason,
      });
    } catch {
      // Invalid URL syntax
      results.push({
        raw: cleanedUrl,
        hostname: 'unknown',
        protocol: 'UNKNOWN',
        isShortener: false,
        isIpAddress: false,
        isSuspiciousPattern: true,
        isFictionalDemo: false,
        note: 'Malformed URL structure detected.',
      });
    }
  }

  return results;
}
