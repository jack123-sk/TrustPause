import { describe, it, expect } from 'vitest';
import { scanPrivacy, redactSecrets } from '../../src/engine/privacyScanner';

describe('Privacy Scanner and Redaction', () => {
  it('detects and redacts potential 6-digit OTP codes', () => {
    const text = 'Your verification code OTP: 489123. Do not share.';
    const detection = scanPrivacy(text);
    expect(detection.containsPotentialOtp).toBe(true);

    const redacted = redactSecrets(text);
    expect(redacted).not.toContain('489123');
    expect(redacted).toContain('[PROTECTED-CODE-REDACTED]');
  });

  it('detects and redacts potential 16-digit credit card numbers', () => {
    const text = 'Card number: 4111 2222 3333 4444 expired.';
    const detection = scanPrivacy(text);
    expect(detection.containsPotentialCard).toBe(true);

    const redacted = redactSecrets(text);
    expect(redacted).not.toContain('4111 2222 3333 4444');
    expect(redacted).toContain('[CARD: ****-****-****-4444]');
  });
});
