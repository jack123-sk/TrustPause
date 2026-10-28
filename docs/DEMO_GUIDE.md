# TrustPause: Competition Live Demonstration Guide
*For the Times of India Technology Competition*

This guide outlines the exact, tested 12-step presentation sequence to demonstrate **TrustPause** live in front of the competition judges.

---

## Presentation Pitch (30-Second Intro)
> *"Judges, digital payment fraud is now the single largest category of cybercrime in India. Most victims do not fall for fake websites; they fall for **action confusion**. When someone expects a refund, they are psychologically primed to see their money arrive. When an SMS says 'Pay ₹199 to release your ₹2,000 refund', traditional spam filters and URL scanners pass the message because it contains clean links or plain text. 
> 
> TrustPause introduces **human-centred intent analysis**: we pause, examine what the user intended to do, compare it with what the message actually demands, and flag the contradiction before their bank account is debited."*

---

## Live Demonstration Sequence (Step-by-Step)

### Step 1: Open TrustPause
- Navigate to the running application (`http://localhost:5173`).
- Point out the clean cybersecurity aesthetic, the tagline (*Pause. Understand. Protect.*), and the **100% In-Browser · Zero Tracking** badge in the header.

### Step 2: The Core Problem Statement
- Explain to judges: *"Traditional security focuses on 'Is this domain on a blacklist?'. But what if the fraudster asks you to pay via genuine UPI or send money directly? The problem isn't the channel—it is the contradiction between your goal and the message's demand."*

### Step 3: Set Intended Goal
- In **Step 1 (What are you trying to accomplish?)**, select **"Receive Money"** (Expecting a refund, cashback, or transfer).

### Step 4: Input the Refund Message
- Under **Step 2**, observe the pre-filled text or paste:
  ```
  Your ₹2,000 refund is ready. Pay a processing fee of ₹199 to receive it.
  ```

### Step 5 & 6: Run Analysis and Showcase the Mismatch
- Click **"Analyse Message"** (or observe the live results).
- Point to the **Intent Comparison Hero Card**:
  - **Your Stated Intention:** *Receive Money*
  - **What This Message Demands:** *Pay an Upfront Fee or Processing Charge*
  - **Contradiction Title:** *Intent Contradiction: You Want to Receive Money, but Message Demands Payment*

### Step 7: Plain English Explanation
- Read the **Why This Matters** box:
  > *"Under National Payments Corporation of India (NPCI) guidelines, receiving money or refunds into a bank or UPI account NEVER requires entering a UPI PIN, scanning a QR code, or paying an upfront release fee. Authentic refunds credit automatically."*

### Step 8: Actionable Safety Steps
- Show the **Recommended Action Plan** checklist:
  - Do not pay processing fees to release refunds.
  - Check transaction status inside your official banking app independently.
  - Dial 1930 or visit cybercrime.gov.in if funds were debited.

### Step 9: Run Demo 2 (OTP Disclosure Under Threat)
- In the **Try an Illustrative Demo** grid, click **Demo 2: OTP Disclosure Under Threat**.
- Observe how the screen instantly shifts to **CRITICAL WARNING** with a score of $\ge 80/100$:
  - Flagged: *Request to Disclose OTP / Passcode*
  - Flagged: *Artificial Urgency and Tight Deadlines* (&ldquo;in 10 minutes&rdquo;)
  - Flagged: *Account Suspension Threat*
- Explain: *"Notice that even if the user selected 'Verify Information', TrustPause enforces an absolute safety override: legitimate verification never permits disclosing an OTP to a caller."*

### Step 10 & 11: Run Demo 5 (Legitimate Notification)
- Click **Demo 5: Possibly Legitimate Notification** (*"Your electricity bill payment of ₹850 was successful. Thank you for using our service."*).
- Show the judges that TrustPause **does not classify every message as a scam**:
  - Banner: **LOW RISK INDICATORS**
  - Score: Low ($\le 10/100$)
  - Status: *Informational Notification (No demands detected)*
  - Emphasize the responsible disclaimer: *"We explain that no scam patterns were detected, while honestly reminding the user that text authenticity cannot be guaranteed without checking their bank statement."*

### Step 12: Showcase Privacy Architecture & Report Export
- Click **"Privacy"** in the top navigation:
  - Explain that **100% of detection runs locally in the browser**.
  - No messages or secrets are sent to cloud AI servers or backend databases.
- Click **"Export Report"**:
  - Show the generated Markdown audit summary with OTPs/card numbers redacted.
  - Demonstrate that judges can paste their own custom SMS or WhatsApp messages live and observe the engine's behavior in real time!
