# Contributing to TrustPause

Thank you for your interest in contributing to **TrustPause**! This project was created for the Times of India Competition to improve human-centred digital payment safety.

---

## 1. Local Development Setup

1. Fork and clone the repository:
   ```bash
   git clone https://github.com/your-username/TrustPause.git
   cd TrustPause
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run tests to ensure your baseline environment is green:
   ```bash
   npm test
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

---

## 2. Coding Standards

- **TypeScript Strict Mode:** All code must be strictly typed. Avoid `any`.
- **Vanilla CSS & Tokens:** Use CSS custom properties defined in `src/styles/tokens.css`. Do not add Tailwind or CSS-in-JS libraries.
- **Privacy First:** Never introduce external network calls, logging libraries, or telemetry that transmits pasted message text.
- **Deterministic Explanations:** Every detection rule must provide a human-readable explanation and a `whyItMatters` rationale.

---

## 3. How to Add a New Detection Rule

1. Open `src/engine/scamIndicators.ts`.
2. Define a new rule object conforming to `IndicatorRule`:
   ```typescript
   {
     id: 'ind-custom-vector',
     category: 'ACCOUNT_SUSPENSION_OR_THREAT',
     name: 'Descriptive Rule Name',
     severity: 'HIGH', // 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
     scoreContribution: 20,
     explanation: 'Clear explanation of what was detected.',
     whyItMatters: 'Financial or security impact in plain English.',
     matcher: (text, context, urls) => {
       // Return the matched snippet if detected and imperative; otherwise return null
       const match = text.match(/\byour-regex-here\b/i);
       return match ? match[0] : null;
     },
   }
   ```
3. Add a corresponding unit test in `tests/engine/analyzer.test.ts`.

---

## 4. How to Add a Test

1. Open or create a test file in `tests/engine/` or `tests/components/`.
2. Write a focused test using Vitest:
   ```typescript
   it('flags new custom scam vector accurately', () => {
     const text = 'Your custom suspicious text example.';
     const result = analyzeMessage(text, 'RECEIVE_MONEY');
     expect(result.detectedIndicators.some(i => i.id === 'ind-custom-vector')).toBe(true);
   });
   ```
3. Verify test execution:
   ```bash
   npm test
   ```

---

## 5. How to Report a Bug or Suggest a Feature

- Search existing issues to ensure it has not already been reported.
- Open a GitHub Issue detailing:
  - The exact message text tested.
  - The selected user intent.
  - The expected risk assessment vs. the actual result.
  - Rationale based on NPCI, RBI, or industry security best practices.
