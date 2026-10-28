# TrustPause Architecture & Threat Model

*Technical Documentation & System Design*

---

## 1. Architectural Philosophy

Traditional endpoint and perimeter email/SMS defenses rely almost exclusively on **threat intelligence feeds, URL blacklists, and domain reputation lookups**. While effective against mass malware campaigns, these mechanisms systematically fail against modern conversational fraud and payment traps:

1. **Legitimate Payment Channels:** Scammers frequently instruct victims to send money via legitimate UPI IDs, PhonePe collect requests, or authentic payment gateways.
2. **Dynamic / Clean Channels:** Attacks executed over private WhatsApp chats, SMS alphanumeric headers (e.g. `VK-SBIBNK`), or short-lived mobile phone numbers exhibit zero domain-level indicators.
3. **Cognitive Blind Spots:** Fraud succeeds when the victim's psychological goal (*"I want to receive my ₹2,000 refund"*) blinds them to the operational instruction (*"Enter your UPI PIN to approve the collect request"*).

**TrustPause** shifts the defensive paradigm from pure signature detection to **Intent-Action Reconciliation**:

$$\text{Risk} = f(\text{Declared Goal}, \text{Demanded Action}, \text{Coercive Context}, \text{Structural Artifacts})$$

---

## 2. Component Architecture

```
                    ┌───────────────────────────────────────────────┐
                    │               User Interface                  │
                    │   (React 18 + Accessible CSS Design Tokens)   │
                    └───────────────────────┬───────────────────────┘
                                            │
                                            ▼
                    ┌───────────────────────────────────────────────┐
                    │           TrustPause Orchestrator             │
                    │               (src/engine/analyzer.ts)        │
                    └───────┬───────────────┼───────────────┬───────┘
                            │               │               │
            ┌───────────────┘               │               └───────────────┐
            ▼                               ▼                               ▼
┌───────────────────────┐       ┌───────────────────────┐       ┌───────────────────────┐
│ Linguistic Context    │       │ Privacy & Secret      │       │ Local URL & Domain    │
│ Parser                │       │ Redaction Scanner     │       │ Analyzer              │
│ - Negation detection  │       │ - OTP detection       │       │ - Shortener detection │
│ - Advisory recognition│       │ - Card masking        │       │ - IP host parsing     │
│ - Reported speech     │       │ - Ephemeral memory    │       │ - Phishing keywords   │
└───────────┬───────────┘       └───────────┬───────────┘       └───────────┬───────────┘
            │                               │                               │
            └───────────────────────┬───────┴───────────────────────────────┘
                                    │
                                    ▼
                    ┌───────────────────────────────────────────────┐
                    │         Intent-Action Compatibility           │
                    │  - Declared User Goal vs Requested Actions    │
                    │  - Contradiction Detection (e.g. Receive/Pay) │
                    │  - NPCI / UPI Protocol Compliance             │
                    └───────────────────────┬───────────────────────┘
                                            │
                                            ▼
                    ┌───────────────────────────────────────────────┐
                    │          Scam Indicator Engine                │
                    │  - 12 Modular Fraud Vector Checkers           │
                    │  - Urgency, Suspension, Impersonation         │
                    │  - Remote Access (AnyDesk/TeamViewer)         │
                    └───────────────────────┬───────────────────────┘
                                            │
                                            ▼
                    ┌───────────────────────────────────────────────┐
                    │      Deterministic Risk Scoring Engine        │
                    │  - Deduplicated Category Contributions        │
                    │  - Absolute Safety Overrides (OTP/PIN/Remote) │
                    │  - 4-Tier Transparent Classification          │
                    └───────────────────────────────────────────────┘
```

---

## 3. Indian Digital Payment Threat Modeling

TrustPause incorporates explicit domain logic for the Indian digital payment landscape:

### A. The UPI PIN Fallacy (NPCI Safety Rule)
* **Fraud Vector:** Fraudsters send QR codes or Google Pay / PhonePe "Collect Requests" claiming the victim must scan or enter their 4-digit or 6-digit PIN to "claim" cashback or a refund.
* **Ground Truth Rule:** The Unified Payments Interface (UPI) specification created by the National Payments Corporation of India (NPCI) dictates that **a UPI PIN is exclusively used to authorize debits (outflows)**. Receiving money or receiving a refund requires zero user PIN interaction.
* **Engine Response:** If the user intent is `RECEIVE_MONEY` and the message instructs entering a UPI PIN or approving a collect request, an immediate `CONTRADICTION` with `CRITICAL` risk is flagged.

### B. Remote Screen-Sharing Hijacking
* **Fraud Vector:** Impersonators convince victims to download AnyDesk, TeamViewer, QuickSupport, or RustDesk under the guise of "resolving account holds" or "updating KYC".
* **Ground Truth Rule:** Screen-sharing applications grant complete visual and input control over mobile devices, allowing attackers to view incoming 2-Factor Authentication SMS codes.
* **Engine Response:** Any request to install remote support tools or reveal access codes triggers an absolute `CRITICAL` warning override.

### C. Advance-Fee & Refund Processing Charges
* **Fraud Vector:** Demanding small administrative fees (e.g., ₹199 or ₹999) to release larger lottery prizes, job salaries, or e-commerce refunds.
* **Ground Truth Rule:** Commercial payment gateways and Indian direct-benefit transfer systems credit net refunds directly without requiring upfront deposits.
* **Engine Response:** Flagged as `ADVANCE_FEE_OR_FAKE_PRIZE` and categorized as `HIGH RISK`.

---

## 4. Context & Linguistic Parsing

A critical weakness in naive keyword matching is triggering false alarms on legitimate bank notices or user complaints. TrustPause solves this with a multi-clause context parser:

1. **Safety Advisories vs Imperatives:**
   * Message: *"Never share your OTP with anyone, even bank staff."*
   * *Naive Result:* Flags OTP request (False Positive).
   * *TrustPause Result:* Identifies advisory pattern `\bnever\s+share\b`, classifies sentence as a security warning, and suppresses offensive indicators.
2. **Reported Speech vs Active Demands:**
   * Message: *"The scammer told me to approve a payment, but I refused."*
   * *TrustPause Result:* Identifies past narrative markers (`\bscammer\s+told\s+me\b`, `\bbut\s+i\s+refused\b`), preventing action extraction.
3. **Pure Informational Notifications:**
   * Message: *"Your electricity bill payment of ₹850 was successful."*
   * *TrustPause Result:* Classifies status update as informational; no action demands extracted.

---

## 5. Scoring Algorithm & Safety Overrides

The numerical score ($S \in [0, 100]$) is computed deterministically:

1. **Intent Mismatch Score:**
   * Direct Contradiction (`CONTRADICTION`): $+35$ points
   * Inherently Dangerous Action (`CRITICAL_RISK_ACTION`): $+45$ points
   * Intent Aligns with Pressure (`MATCH_WITH_PRESSURE`): $+25$ points
   * Intent Aligns, Verification Needed (`MATCH_VERIFY_NEEDED`): $+15$ points
2. **Indicator Contributions (Deduplicated):**
   * The highest single point score per category is counted to prevent inflation from repeated words.
3. **Absolute Safety Overrides:**
   * Regardless of whether the calculated score is high or low, any verified occurrence of:
     - Disclosing an OTP or authentication code to an unverified party
     - Installing remote screen-sharing tools or disclosing access codes
     - Entering a UPI PIN or accepting a collect request to receive money
   * **Guarantees an immediate `CRITICAL WARNING` classification** ($S \ge 85$).

---

## 6. Privacy & Security Assurance

- **Zero Remote Telemetry:** The application operates 100% in-browser. No network requests are made during message analysis.
- **Client-Side Secret Masking:** Active 4-6 digit numeric OTPs and credit/debit card numbers are redacted on screen and in exportable reports.
- **Fictional Testing Domains:** In accordance with RFC 2606, test URLs use `.example` and `.test` top-level domains.
