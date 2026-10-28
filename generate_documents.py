"""
TrustPause Document & Presentation Generator
Generates:
1. TrustPause_Presentation.pptx (12 high-impact widescreen slides)
2. TrustPause_Complete_Project_Guide.docx (Comprehensive simple English project document)
"""

import sys
import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

import docx
from docx import Document
from docx.shared import Inches as DocInches, Pt as DocPt, RGBColor as DocRGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

# --- Color Palette ---
COLOR_BG_DARK = RGBColor(11, 15, 25)       # #0b0f19
COLOR_CARD = RGBColor(19, 28, 46)          # #131c2e
COLOR_BORDER = RGBColor(30, 41, 59)        # #1e293b
COLOR_BLUE = RGBColor(59, 130, 246)        # #3b82f6
COLOR_LIGHT_BLUE = RGBColor(147, 197, 253) # #93c5fd
COLOR_RED = RGBColor(239, 68, 68)          # #ef4444
COLOR_AMBER = RGBColor(245, 158, 11)       # #f59e0b
COLOR_GREEN = RGBColor(16, 185, 129)       # #10b981
COLOR_TEXT_WHITE = RGBColor(248, 250, 252) # #f8fafc
COLOR_TEXT_MUTED = RGBColor(148, 163, 184) # #94a3b8

def create_presentation(output_path):
    prs = Presentation()
    # 16:9 Widescreen dimensions
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    def set_slide_background(slide, color):
        background = slide.background
        fill = background.fill
        fill.solid()
        fill.fore_color.rgb = color

    def add_header(slide, category, title):
        # Category Pill / Super-title
        cat_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(11.7), Inches(0.4))
        tf_cat = cat_box.text_frame
        tf_cat.word_wrap = True
        p_cat = tf_cat.paragraphs[0]
        p_cat.text = category.upper()
        p_cat.font.size = Pt(11)
        p_cat.font.bold = True
        p_cat.font.color.rgb = COLOR_BLUE

        # Main Title
        title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.7), Inches(11.7), Inches(0.8))
        tf_title = title_box.text_frame
        tf_title.word_wrap = True
        p_title = tf_title.paragraphs[0]
        p_title.text = title
        p_title.font.size = Pt(24)
        p_title.font.bold = True
        p_title.font.color.rgb = COLOR_TEXT_WHITE

    def add_card(slide, left, top, width, height, bg_color=COLOR_CARD, border_color=COLOR_BORDER):
        shape = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
        shape.fill.solid()
        shape.fill.fore_color.rgb = bg_color
        shape.line.color.rgb = border_color
        shape.line.width = Pt(1.5)
        return shape

    # ==========================================
    # SLIDE 1: Title Slide
    # ==========================================
    s1 = prs.slides.add_slide(blank_layout)
    set_slide_background(s1, COLOR_BG_DARK)

    # Main Brand Card
    add_card(s1, Inches(1.5), Inches(1.2), Inches(10.333), Inches(5.1), COLOR_CARD, COLOR_BLUE)

    tb = s1.shapes.add_textbox(Inches(2.0), Inches(1.6), Inches(9.333), Inches(4.2))
    tf = tb.text_frame
    tf.word_wrap = True

    p0 = tf.paragraphs[0]
    p0.text = "TIMES OF INDIA TECHNOLOGY COMPETITION"
    p0.font.size = Pt(12)
    p0.font.bold = True
    p0.font.color.rgb = COLOR_BLUE
    p0.space_after = Pt(14)

    p1 = tf.add_paragraph()
    p1.text = "TrustPause"
    p1.font.size = Pt(44)
    p1.font.bold = True
    p1.font.color.rgb = COLOR_TEXT_WHITE
    p1.space_after = Pt(6)

    p2 = tf.add_paragraph()
    p2.text = "Pause. Understand. Protect."
    p2.font.size = Pt(20)
    p2.font.color.rgb = COLOR_LIGHT_BLUE
    p2.space_after = Pt(20)

    p3 = tf.add_paragraph()
    p3.text = "A Human-Centred Cybersecurity Application that Stops Digital Payment Fraud by Comparing What You Intend to Do With What a Message Asks You to Do."
    p3.font.size = Pt(14)
    p3.font.color.rgb = COLOR_TEXT_MUTED
    p3.space_after = Pt(24)

    p4 = tf.add_paragraph()
    p4.text = "Category: Cybersecurity · Digital Payment Safety · Fraud Prevention · 100% In-Browser Privacy"
    p4.font.size = Pt(12)
    p4.font.bold = True
    p4.font.color.rgb = COLOR_GREEN

    # ==========================================
    # SLIDE 2: The Real-World Problem
    # ==========================================
    s2 = prs.slides.add_slide(blank_layout)
    set_slide_background(s2, COLOR_BG_DARK)
    add_header(s2, "The Real-World Problem", "Why Smart People Lose Money to Digital Payment Scams")

    # Left Column: The Problem Explanation
    add_card(s2, Inches(0.8), Inches(1.6), Inches(5.6), Inches(5.2))
    tb2_left = s2.shapes.add_textbox(Inches(1.1), Inches(1.8), Inches(5.0), Inches(4.8))
    tf2_l = tb2_left.text_frame
    tf2_l.word_wrap = True

    p = tf2_l.paragraphs[0]
    p.text = "The Psychology of Action Confusion"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = COLOR_TEXT_WHITE
    p.space_after = Pt(12)

    bullets = [
        "In India, digital payment fraud is now the #1 cybercrime reported on the 1930 helpline.",
        "Most victims do NOT fail because they are foolish or uneducated.",
        "They fail because fraudsters create ACTION CONFUSION.",
        "When people expect money to arrive, their brain is primed to see 'Refund', 'Cashback', or 'Approved'.",
        "They fail to notice that the message is actually asking them to SEND money or APPROVE an outgoing payment!"
    ]
    for b in bullets:
        pb = tf2_l.add_paragraph()
        pb.text = "• " + b
        pb.font.size = Pt(13)
        pb.font.color.rgb = COLOR_TEXT_MUTED
        pb.space_after = Pt(10)

    # Right Column: The Classic Refund Trap
    add_card(s2, Inches(6.8), Inches(1.6), Inches(5.7), Inches(5.2), RGBColor(69, 10, 10), COLOR_RED)
    tb2_right = s2.shapes.add_textbox(Inches(7.1), Inches(1.8), Inches(5.1), Inches(4.8))
    tf2_r = tb2_right.text_frame
    tf2_r.word_wrap = True

    p = tf2_r.paragraphs[0]
    p.text = "Real Life Example: The Refund Trap"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = RGBColor(254, 202, 202)
    p.space_after = Pt(12)

    p_msg = tf2_r.add_paragraph()
    p_msg.text = 'The Message Received:\n"Your ₹2,000 refund is ready. Pay a processing fee of ₹199 to claim it."'
    p_msg.font.size = Pt(13)
    p_msg.font.bold = True
    p_msg.font.color.rgb = COLOR_TEXT_WHITE
    p_msg.space_after = Pt(16)

    p_intent = tf2_r.add_paragraph()
    p_intent.text = "WHAT YOU INTEND TO DO:\n👉 RECEIVE ₹2,000 (Money comes IN)"
    p_intent.font.size = Pt(13)
    p_intent.font.bold = True
    p_intent.font.color.rgb = COLOR_GREEN
    p_intent.space_after = Pt(14)

    p_demands = tf2_r.add_paragraph()
    p_demands.text = "WHAT THE MESSAGE DEMANDS:\n👉 PAY ₹199 FEE (Money goes OUT)"
    p_demands.font.size = Pt(13)
    p_demands.font.bold = True
    p_demands.font.color.rgb = COLOR_RED
    p_demands.space_after = Pt(14)

    p_res = tf2_r.add_paragraph()
    p_res.text = "🚨 MASSIVE CONTRADICTION! Legitimate refunds credit your account automatically. They NEVER ask for a fee!"
    p_res.font.size = Pt(12)
    p_res.font.bold = True
    p_res.font.color.rgb = COLOR_LIGHT_BLUE

    # ==========================================
    # SLIDE 3: Why Existing Tools Miss This
    # ==========================================
    s3 = prs.slides.add_slide(blank_layout)
    set_slide_background(s3, COLOR_BG_DARK)
    add_header(s3, "Competitive Analysis", "Why Traditional Antivirus & URL Scanners Fail")

    cols = [
        ("Traditional URL Scanners", [
            "Check if a web address is on a known blacklist.",
            "Useless against WhatsApp or direct SMS messages with zero links.",
            "Useless if scammers generate a new, clean domain minutes earlier.",
            "Never asks: 'What is the user trying to do?'"
        ], COLOR_BORDER),
        ("Traditional SMS Spam Blockers", [
            "Filter messages based on unknown numbers or spam keywords.",
            "Scammers spoof official bank sender IDs (e.g., 'VK-SBIBNK').",
            "Can trigger false alarms on genuine bank receipts.",
            "Cannot explain the real financial danger in simple terms."
        ], COLOR_BORDER),
        ("TrustPause's Solution", [
            "Analyzes the RELATIONSHIP between your goal and the requested action.",
            "Doesn't care if the sender is unknown; it checks what they ask you to do.",
            "Encodes official NPCI & RBI rules into plain English.",
            "Catches the fraud BEFORE you click approve or type your PIN."
        ], COLOR_BLUE)
    ]

    for idx, (col_title, items, border_c) in enumerate(cols):
        left_pos = Inches(0.8 + idx * 4.0)
        card_bg = COLOR_CARD if border_c != COLOR_BLUE else RGBColor(16, 30, 56)
        add_card(s3, left_pos, Inches(1.6), Inches(3.7), Inches(5.2), card_bg, border_c)

        tb_col = s3.shapes.add_textbox(left_pos + Inches(0.2), Inches(1.8), Inches(3.3), Inches(4.8))
        tf_c = tb_col.text_frame
        tf_c.word_wrap = True

        p = tf_c.paragraphs[0]
        p.text = col_title
        p.font.size = Pt(16)
        p.font.bold = True
        p.font.color.rgb = COLOR_BLUE if border_c == COLOR_BLUE else COLOR_TEXT_WHITE
        p.space_after = Pt(14)

        for it in items:
            pi = tf_c.add_paragraph()
            pi.text = "• " + it
            pi.font.size = Pt(12)
            pi.font.color.rgb = COLOR_TEXT_MUTED
            pi.space_after = Pt(10)

    # ==========================================
    # SLIDE 4: The 4 Primary User Intentions
    # ==========================================
    s4 = prs.slides.add_slide(blank_layout)
    set_slide_background(s4, COLOR_BG_DARK)
    add_header(s4, "Core User Experience", "Step 1: Tell TrustPause What You Are Trying to Do")

    intents = [
        ("A. Receive Money", "Expecting a refund, merchant cashback, lottery, salary, or scholarship.", "Alerts if message asks for a payment, fee, collect request, or UPI PIN.", COLOR_GREEN),
        ("B. Send Money", "Paying a merchant, electricity bill, friend, or donating to charity.", "Alerts if urgency is extreme, accounts changed, or caller forbids phone verification.", COLOR_BLUE),
        ("C. Verify Information", "Checking bank debit alerts, package delivery updates, or KYC status.", "Critical alert if message demands an OTP, password, or remote screen sharing.", COLOR_AMBER),
        ("D. Share Access / Support", "Assisting technical customer support or approving a new device login.", "Severe warning explaining that remote tools (AnyDesk) give callers full control.", COLOR_RED),
    ]

    for idx, (title, desc, rule, color) in enumerate(intents):
        row = idx // 2
        col = idx % 2
        left_pos = Inches(0.8 + col * 5.9)
        top_pos = Inches(1.6 + row * 2.7)

        add_card(s4, left_pos, top_pos, Inches(5.6), Inches(2.4), COLOR_CARD, color)

        tb_int = s4.shapes.add_textbox(left_pos + Inches(0.25), top_pos + Inches(0.2), Inches(5.1), Inches(2.0))
        tf_i = tb_int.text_frame
        tf_i.word_wrap = True

        p = tf_i.paragraphs[0]
        p.text = title
        p.font.size = Pt(16)
        p.font.bold = True
        p.font.color.rgb = color
        p.space_after = Pt(6)

        p_desc = tf_i.add_paragraph()
        p_desc.text = "Goal: " + desc
        p_desc.font.size = Pt(12)
        p_desc.font.color.rgb = COLOR_TEXT_WHITE
        p_desc.space_after = Pt(6)

        p_rule = tf_i.add_paragraph()
        p_rule.text = "Protection: " + rule
        p_rule.font.size = Pt(11)
        p_rule.font.color.rgb = COLOR_TEXT_MUTED

    # ==========================================
    # SLIDE 5: The Detection Engine Architecture
    # ==========================================
    s5 = prs.slides.add_slide(blank_layout)
    set_slide_background(s5, COLOR_BG_DARK)
    add_header(s5, "Engine Architecture", "Modular, Explainable, Multi-Layered Detection")

    steps = [
        ("1. Privacy & Redaction", "Scans text for OTPs & card numbers. Redacts them in memory so secrets are never exposed on screen or in reports."),
        ("2. Context & Negations", "Distinguishes active demands from safety advisories ('Never share OTP') and reported speech ('The caller told me to...')."),
        ("3. Action Extractor", "Extracts imperative commands: Pay Fee, Enter UPI PIN, Click Link, Share OTP, Install Remote Screen Tool, etc."),
        ("4. Intent Reconciliation", "Compares extracted actions with declared user goal. Identifies CONTRADICTIONS under official NPCI/RBI rules."),
        ("5. Scoring & Override", "Calculates non-duplicative score (0-100). Safety override guarantees CRITICAL risk for OTP or UPI PIN traps."),
        ("6. Plain-English Guide", "Builds actionable recommendations, why it matters, and generates exportable audit reports.")
    ]

    for idx, (title, desc) in enumerate(steps):
        row = idx // 3
        col = idx % 3
        left_pos = Inches(0.8 + col * 3.9)
        top_pos = Inches(1.6 + row * 2.7)

        add_card(s5, left_pos, top_pos, Inches(3.7), Inches(2.4), COLOR_CARD, COLOR_BORDER)

        tb_s = s5.shapes.add_textbox(left_pos + Inches(0.2), top_pos + Inches(0.2), Inches(3.3), Inches(2.0))
        tf_s = tb_s.text_frame
        tf_s.word_wrap = True

        p = tf_s.paragraphs[0]
        p.text = title
        p.font.size = Pt(15)
        p.font.bold = True
        p.font.color.rgb = COLOR_BLUE
        p.space_after = Pt(8)

        pd = tf_s.add_paragraph()
        pd.text = desc
        pd.font.size = Pt(11)
        pd.font.color.rgb = COLOR_TEXT_MUTED
        pd.space_after = Pt(4)

    # ==========================================
    # SLIDE 6: 8 Predefined Competition Demo Scenarios
    # ==========================================
    s6 = prs.slides.add_slide(blank_layout)
    set_slide_background(s6, COLOR_BG_DARK)
    add_header(s6, "Interactive Testing", "8 Pre-Loaded Competition Scenarios for Instant Testing")

    demos = [
        ("Demo 1: Refund Fee Mismatch", "User wants refund; message asks for ₹199 processing fee.", "HIGH RISK · Contradiction"),
        ("Demo 2: OTP Disclosure Threat", "'Account blocked in 10 mins. Share OTP with agent.'", "CRITICAL · Credential Theft"),
        ("Demo 3: Lottery / Prize Advance Fee", "'You won ₹50,000. Pay ₹999 fee to claim your prize.'", "HIGH RISK · Advance Fee"),
        ("Demo 4: Remote Access Trap", "'Install remote-support app and share access code.'", "CRITICAL · Device Hijack"),
        ("Demo 5: Legitimate Notification", "'Your electricity bill payment of ₹850 was successful.'", "LOW RISK · Benign Receipt"),
        ("Demo 6: Urgent Manager Transfer", "'This is your manager. Transfer ₹25,000. Do not call.'", "HIGH RISK · Impersonation"),
        ("Demo 7: Fake Bank Link & Threat", "'Account suspended today. Verify: fictional-bank.test'", "HIGH RISK · Phishing Link"),
        ("Demo 8: Action Matches Intention", "'Transfer ₹500 to the seller you are buying from.'", "CAUTION · Verify Recipient")
    ]

    for idx, (title, snippet, verdict) in enumerate(demos):
        row = idx // 2
        col = idx % 2
        left_pos = Inches(0.8 + col * 5.9)
        top_pos = Inches(1.5 + row * 1.35)

        border_c = COLOR_RED if "CRITICAL" in verdict else (COLOR_AMBER if "HIGH" in verdict else (COLOR_GREEN if "LOW" in verdict else COLOR_BLUE))
        add_card(s6, left_pos, top_pos, Inches(5.6), Inches(1.2), COLOR_CARD, border_c)

        tb_d = s6.shapes.add_textbox(left_pos + Inches(0.2), top_pos + Inches(0.1), Inches(5.2), Inches(1.0))
        tf_d = tb_d.text_frame
        tf_d.word_wrap = True

        p = tf_d.paragraphs[0]
        p.text = title + "  (" + verdict + ")"
        p.font.size = Pt(12)
        p.font.bold = True
        p.font.color.rgb = COLOR_TEXT_WHITE

        pd = tf_d.add_paragraph()
        pd.text = snippet
        pd.font.size = Pt(10)
        pd.font.color.rgb = COLOR_TEXT_MUTED

    # ==========================================
    # SLIDE 7: Understanding Context & Avoiding False Alarms
    # ==========================================
    s7 = prs.slides.add_slide(blank_layout)
    set_slide_background(s7, COLOR_BG_DARK)
    add_header(s7, "Linguistic Intelligence", "Why TrustPause Avoids Stupid False Alarms")

    add_card(s7, Inches(0.8), Inches(1.6), Inches(5.6), Inches(5.2), COLOR_CARD, COLOR_GREEN)
    tb7_l = s7.shapes.add_textbox(Inches(1.1), Inches(1.8), Inches(5.0), Inches(4.8))
    tf7_l = tb7_l.text_frame
    tf7_l.word_wrap = True

    p = tf7_l.paragraphs[0]
    p.text = "Case 1: The Safety Advisory"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = COLOR_GREEN
    p.space_after = Pt(10)

    p_ex1 = tf7_l.add_paragraph()
    p_ex1.text = 'Message:\n"Security Tip: Never share your OTP with anyone. Bank staff will never ask for your PIN."'
    p_ex1.font.size = Pt(12)
    p_ex1.font.bold = True
    p_ex1.font.color.rgb = COLOR_TEXT_WHITE
    p_ex1.space_after = Pt(12)

    p_eval1 = tf7_l.add_paragraph()
    p_eval1.text = "• Naive Tools: See the words 'OTP' and 'PIN' -> Flag as DANGER! (False Positive)\n\n• TrustPause Engine: Detects 'Never share' and 'will never ask'. Understands this is a protective advisory.\n\n• Outcome: LOW RISK. User is praised for recognizing official bank security advice."
    p_eval1.font.size = Pt(12)
    p_eval1.font.color.rgb = COLOR_TEXT_MUTED

    add_card(s7, Inches(6.8), Inches(1.6), Inches(5.7), Inches(5.2), COLOR_CARD, COLOR_BLUE)
    tb7_r = s7.shapes.add_textbox(Inches(7.1), Inches(1.8), Inches(5.1), Inches(4.8))
    tf7_r = tb7_r.text_frame
    tf7_r.word_wrap = True

    p = tf7_r.paragraphs[0]
    p.text = "Case 2: The User Complaint / Past Story"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = COLOR_LIGHT_BLUE
    p.space_after = Pt(10)

    p_ex2 = tf7_r.add_paragraph()
    p_ex2.text = 'Message:\n"The caller told me to approve a payment of ₹5,000, but I refused and cut the call."'
    p_ex2.font.size = Pt(12)
    p_ex2.font.bold = True
    p_ex2.font.color.rgb = COLOR_TEXT_WHITE
    p_ex2.space_after = Pt(12)

    p_eval2 = tf7_r.add_paragraph()
    p_eval2.text = "• Naive Tools: See 'approve a payment of ₹5,000' -> Thinks the user is being told to pay right now!\n\n• TrustPause Engine: Recognizes narrative voice ('caller told me', 'but I refused'). Does not extract this as an active imperative.\n\n• Outcome: Correctly distinguishes reported past events from live threats."
    p_eval2.font.size = Pt(12)
    p_eval2.font.color.rgb = COLOR_TEXT_MUTED

    # ==========================================
    # SLIDE 8: 100% Privacy-First Architecture
    # ==========================================
    s8 = prs.slides.add_slide(blank_layout)
    set_slide_background(s8, COLOR_BG_DARK)
    add_header(s8, "Privacy by Design", "Your Private Data Never Leaves Your Device")

    pillars = [
        ("100% In-Browser Execution", "All text parsing, regex matching, URL checking, and scoring runs locally in the client browser using modern JavaScript. Zero cloud API calls.", COLOR_GREEN),
        ("Zero Telemetry & Logging", "TrustPause has NO third-party trackers, NO Google Analytics, NO error relays, and NO server databases storing your messages.", COLOR_BLUE),
        ("Automatic Secret Masking", "If you accidentally paste a real 6-digit OTP or a 16-digit debit card number, TrustPause masks it on screen and redacts it from exported reports.", COLOR_AMBER),
        ("Instant Memory Wipe", "Nothing is written to LocalStorage or cookies. When you click 'Clear' or close the browser tab, all message data is completely erased.", COLOR_RED)
    ]

    for idx, (title, desc, color) in enumerate(pillars):
        left_pos = Inches(0.8 + idx * 3.0)
        add_card(s8, left_pos, Inches(1.6), Inches(2.8), Inches(5.2), COLOR_CARD, color)

        tb_p = s8.shapes.add_textbox(left_pos + Inches(0.15), Inches(1.8), Inches(2.5), Inches(4.8))
        tf_p = tb_p.text_frame
        tf_p.word_wrap = True

        p = tf_p.paragraphs[0]
        p.text = title
        p.font.size = Pt(16)
        p.font.bold = True
        p.font.color.rgb = color
        p.space_after = Pt(14)

        pd = tf_p.add_paragraph()
        pd.text = desc
        pd.font.size = Pt(12)
        pd.font.color.rgb = COLOR_TEXT_MUTED
        pd.space_after = Pt(10)

    # ==========================================
    # SLIDE 9: How We Built It (Tech Stack)
    # ==========================================
    s9 = prs.slides.add_slide(blank_layout)
    set_slide_background(s9, COLOR_BG_DARK)
    add_header(s9, "Technical Implementation", "Built from Scratch with Industrial Engineering Standards")

    tech_items = [
        ("React 18 & TypeScript", "Strict type safety across domain types (UserIntent, RequestedAction, ScamIndicator, RiskLevel) ensuring zero runtime surprises."),
        ("Vite 6 Fast Bundler", "Production bundle is only 227 kB JS and 16 kB CSS, compiling in under 6 seconds with instant hot-module replacement."),
        ("Vanilla CSS Design Tokens", "Curated HSL dark palette with high-contrast accessibility (WCAG 2.2 AA compliant), visible focus rings, and aria-live regions."),
        ("Vitest Test Suite", "33 automated unit and component tests passing with 100% success rate, verifying all 8 demo scenarios and edge cases."),
        ("Zero Server Dependency", "Completely self-contained static application that can be hosted on Vercel, Netlify, GitHub Pages, or run completely offline."),
        ("0 Security Vulnerabilities", "Clean npm audit with zero moderate, high, or critical vulnerabilities across all dependencies.")
    ]

    for idx, (title, desc) in enumerate(tech_items):
        row = idx // 3
        col = idx % 3
        left_pos = Inches(0.8 + col * 3.9)
        top_pos = Inches(1.6 + row * 2.7)

        add_card(s9, left_pos, top_pos, Inches(3.7), Inches(2.4), COLOR_CARD, COLOR_BORDER)

        tb_t = s9.shapes.add_textbox(left_pos + Inches(0.2), top_pos + Inches(0.2), Inches(3.3), Inches(2.0))
        tf_t = tb_t.text_frame
        tf_t.word_wrap = True

        p = tf_t.paragraphs[0]
        p.text = title
        p.font.size = Pt(15)
        p.font.bold = True
        p.font.color.rgb = COLOR_BLUE
        p.space_after = Pt(8)

        pd = tf_t.add_paragraph()
        pd.text = desc
        pd.font.size = Pt(11)
        pd.font.color.rgb = COLOR_TEXT_MUTED

    # ==========================================
    # SLIDE 10: How to Use TrustPause (3 Easy Steps)
    # ==========================================
    s10 = prs.slides.add_slide(blank_layout)
    set_slide_background(s10, COLOR_BG_DARK)
    add_header(s10, "User Guide", "How Everyday People Can Protect Themselves in 3 Steps")

    guide_steps = [
        ("Step 1: Pick Your Goal", [
            "Select what you are trying to do.",
            "Choose from: Receive Money, Send Money, Verify Information, or Share Access.",
            "If you're unsure, select 'Not Sure / Other'."
        ], COLOR_BLUE),
        ("Step 2: Paste the Message", [
            "Copy any suspicious SMS, WhatsApp text, or email you received.",
            "Paste it into the message box.",
            "Or click any of the 8 Demo buttons to test instant examples!"
        ], COLOR_AMBER),
        ("Step 3: Read Findings & Act", [
            "Click 'Analyse Message' (instant result).",
            "See if an Intent Contradiction exists.",
            "Follow the plain-English Recommended Action checklist.",
            "Click 'Export Report' to save or print an audit summary."
        ], COLOR_GREEN)
    ]

    for idx, (title, bullets_list, color) in enumerate(guide_steps):
        left_pos = Inches(0.8 + idx * 4.0)
        add_card(s10, left_pos, Inches(1.6), Inches(3.7), Inches(5.2), COLOR_CARD, color)

        tb_g = s10.shapes.add_textbox(left_pos + Inches(0.2), Inches(1.8), Inches(3.3), Inches(4.8))
        tf_g = tb_g.text_frame
        tf_g.word_wrap = True

        p = tf_g.paragraphs[0]
        p.text = title
        p.font.size = Pt(18)
        p.font.bold = True
        p.font.color.rgb = color
        p.space_after = Pt(16)

        for b in bullets_list:
            pb = tf_g.add_paragraph()
            pb.text = "• " + b
            pb.font.size = Pt(13)
            pb.font.color.rgb = COLOR_TEXT_WHITE
            pb.space_after = Pt(12)

    # ==========================================
    # SLIDE 11: Indian Payment Rules & Cyber Safety
    # ==========================================
    s11 = prs.slides.add_slide(blank_layout)
    set_slide_background(s11, COLOR_BG_DARK)
    add_header(s11, "National Regulatory Alignment", "Ground Truth Rules of Indian Payment Systems (NPCI & RBI)")

    rules = [
        ("Rule 1: UPI PIN is ONLY for Debiting", "In the Unified Payments Interface (UPI) system created by NPCI, entering your UPI PIN always DEBITS money from your bank account. You NEVER need to enter a UPI PIN or scan a QR code to RECEIVE money.", COLOR_RED),
        ("Rule 2: Remote Access is a Screen Trap", "Bank and payment executives are strictly prohibited from asking users to install remote support apps (AnyDesk, TeamViewer, QuickSupport). Sharing your code lets callers read your live SMS OTPs.", COLOR_AMBER),
        ("Rule 3: OTPs Approve Debits", "One-Time Passwords authorize transactions and password resets. Never read out an OTP over the phone to anyone claiming to be your bank manager or electricity board.", COLOR_BLUE),
        ("Emergency Helpline: 1930 & cybercrime.gov.in", "If you suspect you have been tricked or funds were debited, immediately call the National Cyber Crime Helpline at 1930 within the 'Golden Hour' to freeze fraudulent transfers.", COLOR_GREEN)
    ]

    for idx, (title, desc, color) in enumerate(rules):
        row = idx // 2
        col = idx % 2
        left_pos = Inches(0.8 + col * 5.9)
        top_pos = Inches(1.6 + row * 2.7)

        add_card(s11, left_pos, top_pos, Inches(5.6), Inches(2.4), COLOR_CARD, color)

        tb_r = s11.shapes.add_textbox(left_pos + Inches(0.25), top_pos + Inches(0.2), Inches(5.1), Inches(2.0))
        tf_r = tb_r.text_frame
        tf_r.word_wrap = True

        p = tf_r.paragraphs[0]
        p.text = title
        p.font.size = Pt(15)
        p.font.bold = True
        p.font.color.rgb = color
        p.space_after = Pt(8)

        pd = tf_r.add_paragraph()
        pd.text = desc
        pd.font.size = Pt(11)
        pd.font.color.rgb = COLOR_TEXT_MUTED

    # ==========================================
    # SLIDE 12: Conclusion & Future Roadmap
    # ==========================================
    s12 = prs.slides.add_slide(blank_layout)
    set_slide_background(s12, COLOR_BG_DARK)
    add_header(s12, "Summary & Next Steps", "TrustPause: Empowering Digital Citizens with Intent-Aware Defense")

    add_card(s12, Inches(1.5), Inches(1.6), Inches(10.333), Inches(5.2), COLOR_CARD, COLOR_BLUE)

    tb12 = s12.shapes.add_textbox(Inches(1.9), Inches(1.9), Inches(9.5), Inches(4.6))
    tf12 = tb12.text_frame
    tf12.word_wrap = True

    p = tf12.paragraphs[0]
    p.text = "Why TrustPause Wins in the Real World:"
    p.font.size = Pt(20)
    p.font.bold = True
    p.font.color.rgb = COLOR_TEXT_WHITE
    p.space_after = Pt(14)

    concl_points = [
        "Addresses the ROOT CAUSE of financial fraud: Action confusion rather than just malicious URLs.",
        "Completely Explainable: Transparent scoring and plain-English reasons make it understandable to non-technical citizens.",
        "Zero False Claims: Never pretends an unflagged message is '100% Safe'; always encourages independent verification.",
        "100% Privacy by Design: Evaluates text inside the local browser without uploading private messages to servers.",
        "Roadmap: Expansion to Indian regional languages (Hindi, Tamil, Telugu), mobile PWA installability, and local WebAssembly AI."
    ]
    for cp in concl_points:
        p_c = tf12.add_paragraph()
        p_c.text = "✔ " + cp
        p_c.font.size = Pt(13)
        p_c.font.color.rgb = COLOR_LIGHT_BLUE
        p_c.space_after = Pt(10)

    p_close = tf12.add_paragraph()
    p_close.text = "Pause. Understand. Protect.  |  Thank you!"
    p_close.font.size = Pt(16)
    p_close.font.bold = True
    p_close.font.color.rgb = COLOR_GREEN

    # Save presentation
    prs.save(output_path)
    print(f"Presentation saved successfully to: {output_path}")


def create_word_document(output_path):
    doc = Document()

    # Set Margins (1 inch all around)
    for section in doc.sections:
        section.top_margin = DocInches(1)
        section.bottom_margin = DocInches(1)
        section.left_margin = DocInches(1)
        section.right_margin = DocInches(1)

    # Styles helper
    def add_title(text):
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        run = p.add_run(text)
        run.font.name = 'Calibri'
        run.font.size = DocPt(26)
        run.font.bold = True
        run.font.color.rgb = DocRGBColor(30, 58, 138) # Dark Navy
        p.paragraph_format.space_after = DocPt(4)

    def add_subtitle(text):
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        run = p.add_run(text)
        run.font.name = 'Calibri'
        run.font.size = DocPt(15)
        run.font.italic = True
        run.font.color.rgb = DocRGBColor(59, 130, 246) # Blue
        p.paragraph_format.space_after = DocPt(20)

    def add_heading_1(text):
        p = doc.add_paragraph()
        run = p.add_run(text)
        run.font.name = 'Calibri'
        run.font.size = DocPt(18)
        run.font.bold = True
        run.font.color.rgb = DocRGBColor(30, 58, 138)
        p.paragraph_format.space_before = DocPt(18)
        p.paragraph_format.space_after = DocPt(6)

    def add_heading_2(text):
        p = doc.add_paragraph()
        run = p.add_run(text)
        run.font.name = 'Calibri'
        run.font.size = DocPt(14)
        run.font.bold = True
        run.font.color.rgb = DocRGBColor(37, 99, 235)
        p.paragraph_format.space_before = DocPt(14)
        p.paragraph_format.space_after = DocPt(4)

    def add_heading_3(text):
        p = doc.add_paragraph()
        run = p.add_run(text)
        run.font.name = 'Calibri'
        run.font.size = DocPt(12)
        run.font.bold = True
        run.font.color.rgb = DocRGBColor(51, 65, 85)
        p.paragraph_format.space_before = DocPt(8)
        p.paragraph_format.space_after = DocPt(2)

    def add_body(text):
        p = doc.add_paragraph()
        run = p.add_run(text)
        run.font.name = 'Calibri'
        run.font.size = DocPt(11)
        run.font.color.rgb = DocRGBColor(30, 41, 59)
        p.paragraph_format.line_spacing = 1.15
        p.paragraph_format.space_after = DocPt(6)
        return p

    def add_bullet(text, bold_prefix=""):
        p = doc.add_paragraph(style='List Bullet')
        p.paragraph_format.space_after = DocPt(4)
        p.paragraph_format.line_spacing = 1.15
        if bold_prefix:
            r_pre = p.add_run(bold_prefix + " ")
            r_pre.font.name = 'Calibri'
            r_pre.font.size = DocPt(11)
            r_pre.font.bold = True
            r_pre.font.color.rgb = DocRGBColor(15, 23, 42)
        r_text = p.add_run(text)
        r_text.font.name = 'Calibri'
        r_text.font.size = DocPt(11)
        r_text.font.color.rgb = DocRGBColor(51, 65, 85)

    def add_callout(title, body_text, border_rgb="3B82F6", bg_rgb="F0F7FF"):
        tbl = doc.add_table(rows=1, cols=1)
        tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
        cell = tbl.cell(0, 0)
        cell.width = DocInches(6.5)

        tcPr = cell._tc.get_or_add_tcPr()
        # Shading
        shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{bg_rgb}"/>')
        tcPr.append(shd)

        # Left border only
        borders = parse_xml(f'''
            <w:tcBorders {nsdecls("w")}>
                <w:top w:val="none"/>
                <w:left w:val="single" w:sz="24" w:space="0" w:color="{border_rgb}"/>
                <w:bottom w:val="none"/>
                <w:right w:val="none"/>
            </w:tcBorders>
        ''')
        tcPr.append(borders)

        cp = cell.paragraphs[0]
        cp.paragraph_format.space_before = DocPt(4)
        cp.paragraph_format.space_after = DocPt(4)
        r_title = cp.add_run(f"📌 {title}\n")
        r_title.font.name = 'Calibri'
        r_title.font.size = DocPt(11)
        r_title.font.bold = True
        r_title.font.color.rgb = DocRGBColor(30, 58, 138)

        r_body = cp.add_run(body_text)
        r_body.font.name = 'Calibri'
        r_body.font.size = DocPt(10.5)
        r_body.font.color.rgb = DocRGBColor(30, 41, 59)

        doc.add_paragraph().paragraph_format.space_after = DocPt(6)

    # ==========================================
    # Title & Metadata
    # ==========================================
    add_title("TrustPause: Complete Project Guide & Technical Documentation")
    add_subtitle("Tagline: Pause. Understand. Protect.\nProject Category: Cybersecurity, Digital Payment Safety, Human-Centred Security\nPrepared for: Times of India Technology Competition")

    add_callout(
        "Project Essence at a Glance",
        "TrustPause is a privacy-first web application that protects people from digital payment scams. Instead of merely checking if a web link is on a blacklist, TrustPause compares what the user is trying to accomplish with what a message demands they do. If someone intends to receive a refund but the message asks them to approve a payment or enter a UPI PIN, TrustPause sounds an immediate alarm in plain, easy-to-understand English.",
        "10B981", "ECFDF5"
    )

    # ==========================================
    # Chapter 1: The Problem
    # ==========================================
    add_heading_1("1. The Problem TrustPause Solves")
    add_body("Online payment fraud (UPI scams, fake refund scams, electricity bill disconnection threats, and OTP theft) is now the fastest-growing cybercrime in India. Millions of everyday citizens lose their hard-earned savings each year.")
    add_body("A crucial discovery behind this project is that smart, educated people do not fall for scams because they are foolish. They fall for scams because fraudsters create ACTION CONFUSION.")
    add_body("For example, consider a person who ordered something online and canceled it. They expect a ₹2,000 refund. A few hours later, they receive an SMS saying:")

    add_callout(
        "Classic Scam Example",
        "\"Your ₹2,000 refund is ready. Click this link and approve the payment to receive your money.\"",
        "EF4444", "FEF2F2"
    )

    add_body("Notice the contradiction:")
    add_bullet("The user intends to RECEIVE money (money should enter their bank account).", "User Intention:")
    add_bullet("The message asks the user to APPROVE a payment or PAY a fee (money will leave their bank account).", "Message Demand:")
    add_body("Traditional security tools—like mobile antivirus and spam URL blocklists—often fail here. Scammers use new telephone numbers, direct WhatsApp messages, or genuine UPI collect requests on PhonePe/Google Pay. Traditional tools do not know what the user was trying to do. TrustPause solves this by bridging the gap between human intention and requested action.")

    # ==========================================
    # Chapter 2: How TrustPause Works
    # ==========================================
    add_heading_1("2. How TrustPause Works (The Core Innovation)")
    add_body("TrustPause works in three simple, transparent steps:")
    add_bullet("The user selects what they are trying to achieve from 5 clear options: Receive Money, Send Money, Verify Information, Share Access / Support, or Not Sure / Other.", "Step 1 (Select Goal):")
    add_bullet("The user pastes the suspicious SMS, WhatsApp chat, or email text into the analyzer box.", "Step 2 (Paste Message):")
    add_bullet("The deterministic engine runs locally in the browser in less than 50 milliseconds, extracts all requested actions, compares them against the goal, calculates a risk score (0-100), and provides a plain-English checklist of what to do next.", "Step 3 (Analyze & Understand):")

    add_heading_2("The Four Main User Intentions")
    add_bullet("For people expecting refunds, cashbacks, sale payments, salaries, or scholarship grants. If the message asks to pay a fee, enter a UPI PIN, or approve a payment, TrustPause triggers an immediate High Risk or Critical Mismatch alert.", "1. Receive Money:")
    add_bullet("For people paying utility bills, sending money to family, or buying items. If the action matches, TrustPause reminds the user that matching is NOT proof of safety—they must independently verify the recipient.", "2. Send Money:")
    add_bullet("For people checking debit alerts or account notices. If the message demands an OTP, password, or remote screen sharing, TrustPause flags a Critical security alarm.", "3. Verify Information:")
    add_bullet("For people interacting with technical customer support. TrustPause explains that legitimate bank staff will NEVER ask you to install AnyDesk or share remote access codes.", "4. Share Access:")
    add_bullet("For people who received an unsolicited message and have no idea what it is about. TrustPause evaluates independent threats without forcing a misleading comparison.", "5. Not Sure / Other:")

    # ==========================================
    # Chapter 3: Technologies Used
    # ==========================================
    add_heading_1("3. Technologies & Tools Used to Build the Project")
    add_body("TrustPause was built using modern, production-grade web technologies without unnecessary third-party bloat:")

    add_heading_2("Frontend & Core Architecture")
    add_bullet("Provides a fast, modular component structure with state management.", "React 18:")
    add_bullet("Enforces strict type safety across all domain models (UserIntent, RequestedAction, ScamIndicator, RiskLevel) to eliminate runtime errors.", "TypeScript 5.7:")
    add_bullet("Next-generation build tool and local development server, creating a production bundle in under 6 seconds.", "Vite 6.2:")
    add_bullet("Custom design system with HSL variables, WCAG 2.2 AA compliant contrast ratios, accessible focus rings, and clean cybersecurity dark-mode aesthetics.", "Vanilla CSS (Design Tokens):")
    add_bullet("Lightweight, clean, accessible vector icons for all user interface elements.", "Lucide React:")

    add_heading_2("Testing & Verification Suite")
    add_bullet("Blazing fast unit and integration test runner executing 33 comprehensive tests in ~2.9 seconds.", "Vitest 5.0:")
    add_bullet("Simulates real user clicks, radio button selections, and form clearing to verify accessible DOM interactions.", "React Testing Library & JSDOM:")
    add_bullet("Automated Chromium browser testing verifying real user workflows, live demo clicks, and modals.", "Antigravity Browser Subagent:")

    add_heading_2("100% Client-Side Privacy Stack")
    add_bullet("Zero external cloud APIs are called during text evaluation. Message text is held only in computer RAM and is instantly erased when the user clicks 'Clear'.", "Zero-Telemetry Architecture:")
    add_bullet("Detects 4-6 digit numbers looking like OTPs and 16-digit card numbers, automatically redacting them so secrets are never displayed or exported.", "Privacy Secret Redactor:")

    # ==========================================
    # Chapter 4: How It Was Built
    # ==========================================
    add_heading_1("4. How This Project Was Built Step-by-Step")
    add_body("Here is the chronological engineering journey followed to develop TrustPause:")

    add_heading_2("Phase 1: Domain Modeling & Threat Analysis")
    add_body("We started by analyzing the official advisories issued by the Reserve Bank of India (RBI) and the National Payments Corporation of India (NPCI). We categorized the top payment scams into 12 core fraud vectors, including UPI PIN traps, advance-fee refunds, remote-access screen hijacking, and CEO/manager impersonation.")

    add_heading_2("Phase 2: Building the Detection Engine (engine/)")
    add_body("We implemented an explainable, deterministic rule engine structured into separate focused modules:")
    add_bullet("Tokenizes the text into sentences, identifies negation words ('never', 'do not'), detects safety advisories ('Bank will never ask for your PIN'), and detects reported past speech ('The caller told me to pay, but I refused'). This prevents false alarms on genuine bank safety notices.", "contextParser.ts:")
    add_bullet("Extracts explicit imperative commands from the message text (Pay Fee, Approve Payment, Enter UPI PIN, Click Link, Share OTP, Install Remote Tool, etc.).", "intentDetector.ts:")
    add_bullet("Implements 12 independent fraud vector rules with plain-English rationales and severity classifications (LOW, MEDIUM, HIGH, CRITICAL).", "scamIndicators.ts:")
    add_bullet("Inspects web links locally without loading them, identifying URL shorteners (bit.ly), raw IP addresses, and brand-spoofing keywords.", "urlAnalyzer.ts:")
    add_bullet("Detects and masks active OTPs and credit card numbers.", "privacyScanner.ts:")
    add_bullet("Calculates a transparent 0-100 score, deduplicating repetitive words, and enforcing an absolute CRITICAL override if an OTP or UPI PIN trap is detected.", "riskScoring.ts:")
    add_bullet("Generates a clear explanation and 3-4 specific, actionable steps tailored to the findings.", "explanationBuilder.ts:")
    add_bullet("Coordinates the entire analysis pipeline in under 50 milliseconds.", "analyzer.ts:")

    add_heading_2("Phase 3: Building the Accessible User Interface (components/)")
    add_body("We crafted a modern, professional cybersecurity interface with a dark slate palette, clear step indicators, and instant visual feedback:")
    add_bullet("Brand identity with live in-browser privacy status indicator and navigation modal triggers.", "Header:")
    add_bullet("Accessible radio-group cards with icons and descriptions for all 4 primary intentions plus 'Not Sure'.", "IntentSelector:")
    add_bullet("Accessible textarea with live character counter, clear button, and privacy reassurance.", "MessageInput:")
    add_bullet("1-click interactive buttons for all 8 competition scenarios.", "DemoSelector:")
    add_bullet("Shows the Risk Level banner, 0-100 score meter, Mismatch Hero Card, Evidence List, Link Inspector, and Safety Checklist.", "ResultsDashboard:")
    add_bullet("Educational guides explaining the innovation, NPCI guidelines, privacy architecture, and report export.", "Modals:")

    add_heading_2("Phase 4: Automated Testing & Verification")
    add_body("We wrote 33 comprehensive automated tests covering:")
    add_bullet("Validating expected risk levels and key findings for all 8 scenarios.", "Every Predefined Demo Scenario:")
    add_bullet("Testing messages like 'Never share your OTP' to guarantee they are recognized as safety advice, not attacks.", "Advisory & Negation Filtering:")
    add_bullet("Testing empty messages, single words, and 10,000+ character stress tests.", "Edge Cases & Long Text:")
    add_bullet("Testing shorteners, raw IP addresses, and brand spoofing.", "URL Heuristics:")
    add_bullet("Testing that clicking Demo 2 displays CRITICAL WARNING and that the Clear button resets the screen.", "Component Interactions:")

    # ==========================================
    # Chapter 5: How to Install and Run
    # ==========================================
    add_heading_1("5. How to Install and Run TrustPause")
    add_body("TrustPause is extremely easy for any developer or judge to run locally:")

    add_heading_2("System Requirements")
    add_bullet("Node.js v18.0.0 or higher (v20+ recommended)", "Node.js:")
    add_bullet("npm v9.0.0 or higher", "npm:")
    add_bullet("Any modern web browser (Google Chrome, Microsoft Edge, Mozilla Firefox, Safari)", "Browser:")

    add_heading_2("Step-by-Step Installation Commands")
    add_bullet("Open your command prompt or terminal and run:\n`git clone https://github.com/your-username/TrustPause.git`\n`cd TrustPause`", "1. Clone the Repository:")
    add_bullet("Run:\n`npm install`\n(Installs React, Vite, TypeScript, Lucide React, and Vitest. Zero vulnerabilities).", "2. Install Dependencies:")
    add_bullet("Run:\n`npm run dev`\n(Starts the local development server at http://localhost:5173).", "3. Start Development Server:")
    add_bullet("Open your browser and navigate to http://localhost:5173 to interact with the application.", "4. Open in Browser:")

    add_heading_2("Other Useful Commands")
    add_bullet("`npm test` — Executes all 33 automated tests.", "Run Tests:")
    add_bullet("`npm run build` — Compiles TypeScript and creates the production distribution in `dist/`.", "Production Build:")
    add_bullet("`npm run preview` — Locally previews the compiled production build.", "Preview Build:")

    # ==========================================
    # Chapter 6: Step-by-Step User Guide
    # ==========================================
    add_heading_1("6. Step-by-Step User Guide")
    add_body("Here is how anyone can use TrustPause to analyze a message:")

    add_heading_2("Step 1: Choose Your Goal")
    add_body("Click on the card that best matches what you are trying to do:\n"
             "• Receive Money (Expecting a refund, cashback, payment from buyer)\n"
             "• Send Money (Paying a bill, merchant, or friend)\n"
             "• Verify Information (Checking an SMS alert, bank notification, order status)\n"
             "• Share Access / Support (Working with customer service, granting login approvals)\n"
             "• Not Sure / Other (General safety check)")

    add_heading_2("Step 2: Paste the Message")
    add_body("Copy the text message from WhatsApp, SMS, or an email and paste it into the textarea box. Alternatively, you can click on any of the 8 Demo buttons in the 'Try an Illustrative Demo' box to load instant real-world examples.")

    add_heading_2("Step 3: Click 'Analyse Message'")
    add_body("Click the blue 'Analyse Message' button. Within milliseconds, the Results Dashboard will display:")
    add_bullet("LOW RISK INDICATORS (Green), CAUTION ADVISED (Amber), HIGH RISK DETECTED (Orange/Red), or CRITICAL WARNING (Red).", "1. Overall Risk Banner:")
    add_bullet("A transparent score from 0 to 100 with confidence assessment.", "2. Heuristic Risk Score:")
    add_bullet("Visually places your stated goal side-by-side with what the message asks you to do, clearly highlighting any contradiction.", "3. Intent Comparison Hero Card:")
    add_bullet("Explains the underlying payment rule (e.g. why legitimate refunds never ask for upfront fees).", "4. Why This Matters Box:")
    add_bullet("Lists every detected warning indicator, matched text snippet, and why it is dangerous.", "5. Evidence List:")
    add_bullet("A clear, numbered checklist of practical actions you should take right now.", "6. Recommended Action Plan:")
    add_bullet("Allows you to copy or print a clean Markdown audit report with all sensitive OTPs/card numbers redacted.", "7. Export Report:")

    # ==========================================
    # Chapter 7: The 8 Demo Scenarios
    # ==========================================
    add_heading_1("7. The 8 Predefined Competition Demo Scenarios")
    add_body("TrustPause comes with 8 built-in demo scenarios representing the most common fraud patterns:")

    demos_table_data = [
        ("Demo 1: Refund Payment Mismatch", "RECEIVE_MONEY", "HIGH RISK", "User expects refund; message asks for ₹199 processing fee. Contradiction detected."),
        ("Demo 2: OTP Disclosure Under Threat", "VERIFY_INFORMATION", "CRITICAL", "Demands OTP within 10 minutes under threat of account block. Absolute critical override."),
        ("Demo 3: Lottery / Prize Advance Fee", "RECEIVE_MONEY", "HIGH RISK", "Claims you won ₹50,000 but demands upfront ₹999 processing charge."),
        ("Demo 4: Remote Access Support Trap", "VERIFY_INFORMATION", "CRITICAL", "Asks user to install remote support app (AnyDesk) and share code to 'resolve bank issue'."),
        ("Demo 5: Legitimate Notification", "VERIFY_INFORMATION", "LOW RISK", "Receipt: 'Electricity bill payment of ₹850 successful.' Correctly identified as informational."),
        ("Demo 6: Urgent Manager Transfer", "SEND_MONEY", "HIGH RISK", "'This is your manager. Transfer ₹25,000 immediately. Do not call me.' Impersonation detected."),
        ("Demo 7: Fake Bank Link & Threat", "VERIFY_INFORMATION", "HIGH RISK", "Account suspension threat coupled with unverified external destination link."),
        ("Demo 8: Action Matches Intention", "SEND_MONEY", "CAUTION", "'Transfer ₹500 to the seller.' Action aligns, but reminds user to verify recipient details.")
    ]

    tbl = doc.add_table(rows=1, cols=4)
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    hdr_cells = tbl.rows[0].cells
    headers = ["Scenario Name", "Selected Goal", "Expected Risk", "Key Takeaway"]
    for i, h in enumerate(headers):
        hdr_cells[i].text = h
        hdr_cells[i].paragraphs[0].runs[0].font.bold = True
        hdr_cells[i].paragraphs[0].runs[0].font.name = 'Calibri'
        hdr_cells[i].paragraphs[0].runs[0].font.color.rgb = DocRGBColor(255, 255, 255)
        # Background
        shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="1E3A8A"/>')
        hdr_cells[i]._tc.get_or_add_tcPr().append(shd)

    for row_data in demos_table_data:
        row_cells = tbl.add_row().cells
        for col_idx, cell_value in enumerate(row_data):
            row_cells[col_idx].text = cell_value
            p = row_cells[col_idx].paragraphs[0]
            p.runs[0].font.name = 'Calibri'
            p.runs[0].font.size = DocPt(9.5)
            # Add light zebra striping or padding
            p.paragraph_format.space_before = DocPt(3)
            p.paragraph_format.space_after = DocPt(3)

    doc.add_paragraph().paragraph_format.space_after = DocPt(10)

    # ==========================================
    # Chapter 8: Indian Payment Safety Rules
    # ==========================================
    add_heading_1("8. Essential Indian Payment Safety Rules (NPCI & RBI)")
    add_body("TrustPause encodes official guidelines from the National Payments Corporation of India (NPCI) and the Reserve Bank of India (RBI):")

    add_callout(
        "Golden Rule 1: UPI PIN is ONLY for Debiting Money",
        "Entering your UPI PIN or scanning a payment QR code ALWAYS takes money OUT of your bank account. You NEVER need to enter a UPI PIN, scan a QR code, or accept a 'Collect Request' to RECEIVE money or refunds. Legitimate money transfers and merchant refunds credit your account automatically.",
        "EF4444", "FEF2F2"
    )

    add_callout(
        "Golden Rule 2: Bank Staff NEVER Ask for OTPs",
        "One-Time Passwords (OTPs) are cryptographic security authorizations for debits, logins, and card resets. Authentic bank representatives will NEVER ask you to disclose an OTP over the phone or via chat.",
        "F59E0B", "FFFBEB"
    )

    add_callout(
        "Golden Rule 3: Remote Access Apps Hijack Your Screen",
        "Screen-sharing applications like AnyDesk, TeamViewer, QuickSupport, and RustDesk give an external caller complete visual and touch control of your phone. Attackers can view your banking apps and read incoming OTPs in real-time.",
        "3B82F6", "EFF6FF"
    )

    add_callout(
        "Golden Rule 4: The 1930 Cybercrime Helpline",
        "If you suspect you have transferred funds to a fraudster or shared sensitive credentials, immediately call the National Cyber Crime Helpline at 1930 or file a report at cybercrime.gov.in. Acting within the 'Golden Hour' allows law enforcement to freeze money in the recipient's account.",
        "10B981", "ECFDF5"
    )

    # ==========================================
    # Chapter 9: FAQs
    # ==========================================
    add_heading_1("9. Frequently Asked Questions (FAQs)")

    faqs = [
        ("Does TrustPause send my messages to an AI server?", "No! 100% of the analysis runs locally inside your web browser. No text is sent to OpenAI, Google, or any cloud server. Your data never leaves your device."),
        ("What happens if I accidentally paste a message containing my real OTP or card number?", "TrustPause automatically detects 4-6 digit numeric codes and 16-digit card numbers, masking them on your screen and redacting them from exported reports."),
        ("Does TrustPause claim that an unflagged message is 100% safe?", "Never. In cybersecurity, no automated tool can guarantee that an unflagged message is genuine. TrustPause states: 'LOW RISK INDICATORS: No major warning indicators were detected by the current checks' and always reminds users to independently check their official banking app."),
        ("Can TrustPause be used offline without an internet connection?", "Yes. Because TrustPause is built as a static application with client-side deterministic rules, it can run completely offline once the page is loaded."),
        ("How does TrustPause know it's not a false alarm?", "TrustPause uses a multi-clause context parser that recognizes safety advisories ('Never share your OTP') and reported past dialogue ('The caller asked me to pay, but I said no'). This prevents false alarms on legitimate bank notices.")
    ]

    for q, a in faqs:
        add_heading_3("Q: " + q)
        add_body("A: " + a)

    # Save Word document
    doc.save(output_path)
    print(f"Word document saved successfully to: {output_path}")

if __name__ == '__main__':
    pptx_path = os.path.join(r"c:\Users\Arun\OneDrive\Desktop\TrustPause", "TrustPause_Presentation.pptx")
    docx_path = os.path.join(r"c:\Users\Arun\OneDrive\Desktop\TrustPause", "TrustPause_Complete_Project_Guide.docx")

    create_presentation(pptx_path)
    create_word_document(docx_path)
