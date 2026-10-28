import { describe, it, expect } from 'vitest';
import { analyzeMessage } from '../../src/engine/analyzer';

describe('TrustPause Core Detection Engine', () => {
  // 1. Refund Payment Mismatch
  it('detects contradiction when user intends to RECEIVE money but message asks to pay a fee', () => {
    const text = 'Your ₹2,000 refund is ready. Pay a processing fee of ₹199 to receive it.';
    const result = analyzeMessage(text, 'RECEIVE_MONEY');

    expect(result.intentMismatchStatus).toBe('CONTRADICTION');
    expect(result.overallRisk).toBe('HIGH');
    expect(result.detectedActions.some((a) => a.type === 'PAY_FEE')).toBe(true);
    expect(result.primaryMismatchExplanation).toContain("You're trying to receive money, but this message asks you to approve a payment");
  });

  // 2. Legitimate Notification (Benign)
  it('correctly handles benign legitimate notifications without falsely flagging them as scams', () => {
    const text = 'Your electricity bill payment of ₹850 was successful. Thank you for using our service.';
    const result = analyzeMessage(text, 'VERIFY_INFORMATION');

    expect(result.overallRisk).toBe('LOW');
    expect(result.isPureInformational).toBe(true);
    expect(result.detectedIndicators.length).toBe(0);
    expect(result.riskScore).toBeLessThan(25);
  });

  // 3. Legitimate Refund Credited (Intent: RECEIVE_MONEY)
  it('does not invent a payment request when message reports refund has been credited', () => {
    const text = 'Your refund has been credited to your account. Thank you for using our service.';
    const result = analyzeMessage(text, 'RECEIVE_MONEY');

    expect(result.overallRisk).toBe('LOW');
    expect(result.intentMismatchStatus).toBe('CONSISTENT_INFORMATIONAL');
    expect(result.detectedActions.some((a) => a.type === 'PAY_FEE')).toBe(false);
  });

  // 4. OTP Disclosure Request (Critical)
  it('flags OTP disclosure as CRITICAL warning even under VERIFY_INFORMATION intent', () => {
    const text = 'Your account will be blocked in 10 minutes. Share the OTP you received with our support agent immediately.';
    const result = analyzeMessage(text, 'VERIFY_INFORMATION');

    expect(result.overallRisk).toBe('CRITICAL');
    expect(result.detectedIndicators.some((i) => i.id === 'req-share-otp')).toBe(true);
    expect(result.detectedIndicators.some((i) => i.id === 'ind-suspension-threat')).toBe(true);
    expect(result.detectedIndicators.some((i) => i.id === 'ind-artificial-urgency')).toBe(true);
    expect(result.riskScore).toBeGreaterThanOrEqual(80);
  });

  // 5. UPI PIN to Receive Money (Critical NPCI safety rule)
  it('flags entering UPI PIN to receive money as CRITICAL contradiction', () => {
    const text = 'Enter your UPI PIN to claim your prize money of ₹5,000.';
    const result = analyzeMessage(text, 'RECEIVE_MONEY');

    expect(result.overallRisk).toBe('CRITICAL');
    expect(result.detectedIndicators.some((i) => i.id === 'req-upi-pin-receive')).toBe(true);
    expect(result.intentMismatchStatus).toBe('CONTRADICTION');
  });

  // 6. Remote Access Software Request (Critical)
  it('flags remote support software installation and access code requests as CRITICAL', () => {
    const text = 'Install this remote-support app and share the access code so we can resolve your bank account issue.';
    const result = analyzeMessage(text, 'VERIFY_INFORMATION');

    expect(result.overallRisk).toBe('CRITICAL');
    expect(result.detectedIndicators.some((i) => i.id === 'req-remote-access')).toBe(true);
  });

  // 7. Advance Fee Scam
  it('detects advance fee demands to unlock money or prizes', () => {
    const text = 'Congratulations! You have won ₹50,000. Pay ₹999 as a processing charge to claim your prize.';
    const result = analyzeMessage(text, 'RECEIVE_MONEY');

    expect(result.overallRisk).toBe('HIGH');
    expect(result.detectedIndicators.some((i) => i.id === 'ind-fake-prize')).toBe(true);
    expect(result.detectedIndicators.some((i) => i.id === 'req-advance-fee')).toBe(true);
  });

  // 8. Urgent Manager Transfer Trap
  it('flags managerial coercion and prohibition against verification', () => {
    const text = 'This is your manager. Transfer ₹25,000 to this new account immediately. Do not call me.';
    const result = analyzeMessage(text, 'SEND_MONEY');

    expect(result.overallRisk).toBe('HIGH');
    expect(result.detectedIndicators.some((i) => i.id === 'ind-authority-impersonation')).toBe(true);
    expect(result.detectedIndicators.some((i) => i.id === 'ind-avoid-verification')).toBe(true);
    expect(result.detectedIndicators.some((i) => i.id === 'ind-artificial-urgency')).toBe(true);
  });

  // 9. Negated Actions & Advisories ("Never share your OTP with anyone")
  it('recognizes safety advisories and does NOT treat "Never share your OTP" as an OTP theft request', () => {
    const text = 'Security Notice from your bank: Never share your OTP with anyone. Keep your PIN confidential.';
    const result = analyzeMessage(text, 'VERIFY_INFORMATION');

    expect(result.overallRisk).toBe('LOW');
    expect(result.detectedIndicators.some((i) => i.id === 'req-share-otp')).toBe(false);
    expect(result.negatedAdvisoriesDetected.length).toBeGreaterThan(0);
  });

  // 10. Quoted or Past Reported Narratives
  it('does not falsely trigger instructions when user narrates a past scam attempt', () => {
    const text = 'The scammer told me to approve a payment, but I did not do it.';
    const result = analyzeMessage(text, 'OTHER_NOT_SURE');

    expect(result.detectedActions.some((a) => a.type === 'APPROVE_PAYMENT')).toBe(false);
    expect(result.overallRisk).not.toBe('CRITICAL');
  });

  // 11. Empty Message Handling
  it('handles empty or whitespace messages safely without errors', () => {
    const result = analyzeMessage('   ', 'RECEIVE_MONEY');
    expect(result.overallRisk).toBe('LOW');
    expect(result.riskScore).toBe(0);
    expect(result.primaryMismatchTitle).toBe('No Message Content Provided');
  });

  // 12. Extremely Long Messages
  it('handles extremely long messages (10,000+ characters) efficiently without timeout or crash', () => {
    const longText = 'Urgent bank alert. '.repeat(1000);
    const start = performance.now();
    const result = analyzeMessage(longText, 'VERIFY_INFORMATION');
    const elapsed = performance.now() - start;

    expect(result).toBeDefined();
    expect(elapsed).toBeLessThan(1000); // Must execute in under 1 second locally
  });

  // 13. Deduplication of Multiple Indicators
  it('prevents runaway score inflation when multiple similar phrases appear', () => {
    const text = 'Immediately act now immediately right now urgently immediately.';
    const result = analyzeMessage(text, 'OTHER_NOT_SURE');
    const urgencyIndicators = result.detectedIndicators.filter((i) => i.category === 'URGENCY_OR_PRESSURE');
    expect(urgencyIndicators.length).toBe(1);
  });

  // 14. Action Matches Intention (Send Money)
  it('identifies intent alignment when user wants to send money, while emphasizing verification', () => {
    const text = 'Please transfer ₹500 to the person you are purchasing this item from.';
    const result = analyzeMessage(text, 'SEND_MONEY');

    expect(result.intentMismatchStatus).toBe('MATCH_VERIFY_NEEDED');
    expect(result.overallRisk).toBe('CAUTION');
    expect(result.recommendedNextSteps.some((s) => s.toLowerCase().includes('verify'))).toBe(true);
  });

  // 15. Multiple Requested Actions in One Message
  it('detects multiple distinct requested actions when message asks user to click link and approve payment', () => {
    const text = 'Your ₹2,000 refund is ready. Click this link and approve the payment.';
    const result = analyzeMessage(text, 'RECEIVE_MONEY');

    expect(result.detectedActions.some((a) => a.type === 'CLICK_LINK')).toBe(true);
    expect(result.detectedActions.some((a) => a.type === 'APPROVE_PAYMENT')).toBe(true);
    expect(result.intentMismatchStatus).toBe('CONTRADICTION');
    expect(result.overallRisk).toBe('HIGH');
  });

  // 16. Suspicious URL Shortener and Brand Spoofing
  it('identifies URL shorteners and brand keyword stacking in URLs', () => {
    const text = 'Urgent: update your KYC now at https://bit.ly/sbi-verify-kyc before midnight.';
    const result = analyzeMessage(text, 'VERIFY_INFORMATION');

    expect(result.extractedUrls.length).toBe(1);
    expect(result.extractedUrls[0].isShortener).toBe(true);
    expect(result.detectedIndicators.some((i) => i.category === 'SUSPICIOUS_LINK_OR_SHORTENER')).toBe(true);
  });

  // 17. Raw IP Address URL
  it('identifies raw IP address in URL as suspicious structure', () => {
    const text = 'Verify your bank login here: http://192.168.1.100/login.html';
    const result = analyzeMessage(text, 'VERIFY_INFORMATION');

    expect(result.extractedUrls.length).toBe(1);
    expect(result.extractedUrls[0].isIpAddress).toBe(true);
  });

  // 18. UPI Collect Request Trap
  it('detects UPI collect request trap intended to steal money under receive goal', () => {
    const text = 'Refund collect request of ₹1,500. Approve the collect request to get your money.';
    const result = analyzeMessage(text, 'RECEIVE_MONEY');

    expect(result.overallRisk).toBe('CRITICAL');
    expect(result.detectedIndicators.some((i) => i.id === 'req-upi-pin-receive')).toBe(true);
  });

  // 19. Unspecified Intent ("OTHER_NOT_SURE")
  it('handles "OTHER_NOT_SURE" intent without forcing false comparisons', () => {
    const text = 'Your electricity bill payment of ₹850 was successful.';
    const result = analyzeMessage(text, 'OTHER_NOT_SURE');

    expect(result.intentMismatchStatus).toBe('UNSPECIFIED_INTENT');
    expect(result.overallRisk).toBe('LOW');
  });
});
