# TrustPause

> **Pause. Understand. Protect.**
> *A Human-Centred Cybersecurity Application for Digital Payment Safety.*

[![Tests](https://img.shields.io/badge/Vitest-33%20Passed-10b981.svg)](tests/)
[![Security](https://img.shields.io/badge/Security-0%20Vulnerabilities-10b981.svg)](SECURITY.md)
[![Privacy](https://img.shields.io/badge/Privacy-100%25%20Local%20Client--Side-3b82f6.svg)](docs/ARCHITECTURE.md)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 1. Project Overview

**TrustPause** is a digital payment safety and fraud prevention application developed for the **Times of India Competition**. 

Digital payment fraud frequently succeeds not because people fail to recognize suspicious technical artifacts (such as invalid SSL certificates or unknown IPs), but because **they misunderstand the fundamental action a message is asking them to perform**.

### The Core Problem

Consider a consumer expecting a ₹2,000 refund from an e-commerce platform. They receive an SMS:

> *"Your ₹2,000 refund is ready. Click this link and approve the payment."*

* **User Intention:** **RECEIVE MONEY**
* **Requested Action:** **APPROVE A PAYMENT**

The user expects funds to arrive in their account, but the message instructs them to authorize an outgoing debit. Traditional security tools that only inspect sender domains or URL blocklists often miss this deception if the link is fresh or sent via direct WhatsApp/SMS channels.

**TrustPause solves this by introducing intention-aware message analysis:** it explicitly compares what the user is trying to accomplish against what the message demands, flagging dangerous contradictions in plain language before money leaves their account.

---

## 2. Key Features

- **Intent-Mismatch Engine:** Compares declared user goals (*Receive Money*, *Send Money*, *Verify Information*, *Share Access*, *Other*) against extracted imperative actions (*Pay Fee*, *Enter UPI PIN*, *Approve Debit*, *Share OTP*, *Remote Access*).
- **NPCI & RBI Payment Rules:** Encodes National Payments Corporation of India (NPCI) guidelines—specifically that **receiving money via UPI NEVER requires entering a UPI PIN, scanning a QR code, or paying upfront release charges**.
- **Contextual Linguistic Analysis:** Distinguishes active scam commands from benign safety advisories (e.g. recognizing that *"Never share your OTP with anyone"* is safety advice, not an attack).
- **Privacy-First Architecture (100% In-Browser):** Evaluates messages entirely client-side using deterministic TypeScript rules. Zero server relays, zero tracking SDKs, zero telemetry.
- **Secret Redaction:** Automatically detects and redacts 4–6 digit OTP candidates and payment card numbers before rendering or exporting reports.
- **Interactive Competition Demo Suite:** Includes 8 pre-configured real-world scenarios for 1-click evaluation by competition judges.
- **Exportable Audit Reports:** Generates clean, printable Markdown audit summaries with sensitive data masked and disclaimers preserved.
- **WCAG 2.2 AA Accessibility:** Semantic HTML5 landmarks, visible focus states, high-contrast HSL color palettes, screen reader polite announcements, and full keyboard operability.

---

## 3. Technology Stack

- **Frontend Core:** React 18, TypeScript 5.7, Vite 6.2
- **Styling:** Vanilla CSS with HSL design tokens and CSS custom properties (no bloated Tailwind or runtime CSS-in-JS dependencies)
- **Icons:** Lucide React
- **Testing:** Vitest 5.0, React Testing Library, JSDOM
- **End-to-End Verification:** Antigravity Browser Subagent & Playwright-ready

---

## 4. Installation & Getting Started

### Prerequisites

- **Node.js:** v18.0.0 or later (v24+ recommended)
- **npm:** v9.0.0 or later

### Quick Start

```bash
# 1. Clone repository
git clone https://github.com/your-username/TrustPause.git
cd TrustPause

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev

# 4. Open browser
# Navigate to http://localhost:5173
```

### Production Build

```bash
# Compile TypeScript and bundle production assets
npm run build

# Preview production build locally
npm run preview
```

### Running Automated Tests

```bash
# Run all unit, integration, and scenario tests
npm test

# Run tests in interactive watch mode
npm run test:watch
```

---

## 5. Detection Engine Architecture

TrustPause operates as a modular, explainable rule engine structured under `src/engine/`:

```
src/
├── engine/
│   ├── contextParser.ts       # Sentence splitting, negation, advisories & reported speech
│   ├── urlAnalyzer.ts         # Local domain extraction, shorteners, IP hosts, phishing keywords
│   ├── privacyScanner.ts      # Detection and masking of OTPs and card numbers
│   ├── intentDetector.ts      # Action extraction & intention compatibility matrix
│   ├── scamIndicators.ts      # 12 independent fraud vector rules (OTP, AnyDesk, UPI PIN, etc.)
│   ├── riskScoring.ts         # Deterministic scoring (0-100) with critical safety overrides
│   ├── explanationBuilder.ts  # Plain-English summaries and tailored next steps
│   └── analyzer.ts            # Main pipeline orchestrator
├── data/
│   └── demoScenarios.ts       # 8 competition demo scenarios with pedagogical takeaways
└── components/                # Accessible React UI components
```

### Risk Level Classifications

1. **LOW RISK INDICATORS:** No major warning indicators detected by current checks. *(Explicitly noted that text authenticity cannot be guaranteed without bank verification).*
2. **CAUTION:** One or more potentially suspicious indicators or intent matches requiring independent recipient verification.
3. **HIGH RISK:** Strong indicators of intentional deception, advance-fee fraud, or managerial coercion.
4. **CRITICAL WARNING:** Message demands an inherently dangerous action (such as disclosing an OTP, granting AnyDesk/TeamViewer remote access, or entering a UPI PIN to receive funds). Triggers an immediate Critical alert regardless of overall score.

---

## 6. Predefined Competition Demo Scenarios

TrustPause includes 8 1-click test scenarios covering key digital payment fraud archetypes:

| Scenario | Input Message | User Intent | Expected Risk | Core Insight |
| :--- | :--- | :--- | :--- | :--- |
| **Demo 1** | *"Your ₹2,000 refund is ready. Pay a processing fee of ₹199 to receive it."* | `RECEIVE_MONEY` | **HIGH RISK** | Contradiction detected. Advance fees are fraudulent; real refunds credit automatically. |
| **Demo 2** | *"Your account will be blocked in 10 minutes. Share the OTP you received with our support agent immediately."* | `VERIFY_INFORMATION` | **CRITICAL** | OTP disclosure demand combined with artificial urgency and suspension threats. |
| **Demo 3** | *"Congratulations! You have won ₹50,000. Pay ₹999 as a processing charge to claim your prize."* | `RECEIVE_MONEY` | **HIGH RISK** | Unsolicited prize advance fee. Legitimate lotteries never demand upfront fees. |
| **Demo 4** | *"Install this remote-support app and share the access code so we can resolve your bank account issue."* | `VERIFY_INFORMATION` | **CRITICAL** | Remote screen-sharing tools allow attackers to observe incoming OTPs and control devices. |
| **Demo 5** | *"Your electricity bill payment of ₹850 was successful. Thank you for using our service."* | `VERIFY_INFORMATION` | **LOW RISK** | Purely informational receipt. Does not trigger false alarms. |
| **Demo 6** | *"This is your manager. Transfer ₹25,000 to this new account immediately. Do not call me."* | `SEND_MONEY` | **HIGH RISK** | Executive impersonation coupled with deliberate isolation from independent verification. |
| **Demo 7** | *"Your bank account will be suspended today. Verify your details using the link below: http://fictional-bank-verify.example.test"* | `VERIFY_INFORMATION` | **HIGH RISK** | Suspension pressure combined with unverified external destination link. |
| **Demo 8** | *"Please transfer ₹500 to the person you are purchasing this item from."* | `SEND_MONEY` | **CAUTION** | Action matches user goal, but intent match is NOT proof of safety; recipient requires verification. |

---

## 7. Competition Demonstration Guide

For a step-by-step walkthrough script for judges and mentors, see [`docs/DEMO_GUIDE.md`](docs/DEMO_GUIDE.md).

---

## 8. Privacy & Responsible Security

- **Client-Side Only:** No text is transmitted over the network or saved in cloud databases.
- **No Third-Party Analytics:** Zero external tracking scripts or advertising trackers.
- **Safe Handling:** Test messages and fictional URLs (`.example`, `.test`) cannot direct users to live malicious infrastructure.

For detailed vulnerability disclosure policies and prototype boundaries, consult [`SECURITY.md`](SECURITY.md).

---

## 9. Current Limitations & Roadmap

- **Rule-Based Heuristic Prototype:** The current engine is deterministic and transparent. Future iterations will explore on-device local WebAssembly NLP (e.g. ONNX Runtime Web / quantized Transformers) for nuanced semantic understanding.
- **Multilingual Support:** Currently optimized for English digital payment communications common in India. Roadmap includes Tamil, Hindi, and Telugu payment scam dialects.
- **Text-Only Evaluation:** Does not resolve live DNS or query external threat intelligence feeds by default to preserve user privacy.

---

## 10. License

Released under the [MIT License](LICENSE).
