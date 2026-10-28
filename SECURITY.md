# Security Policy

## 1. Responsible Security Principles in TrustPause

TrustPause is built with security and privacy by design:

1. **Client-Side Execution:** The message evaluation engine runs 100% within the user's web browser. Message text is held in ephemeral memory and is never transmitted over the internet or logged.
2. **Zero Ingestion of Real Credentials:** TrustPause never asks users to submit real banking credentials, passwords, or live OTPs. 
3. **Automated Secret Redaction:** Potential OTPs and payment card numbers are automatically masked from screen renderings and audit exports.
4. **Safe Demo Links:** All demo scenarios use RFC 2606 reserved domains (`.example`, `.test`, `example.com`) to prevent accidental redirection to malicious servers.
5. **Strict Content Security Policy (CSP):** The application is configured with a strict CSP prohibiting unsafe inline scripts, external script injections, or unauthorized remote connections.

---

## 2. Supported Versions

| Version | Supported | Description |
| :--- | :--- | :--- |
| `1.0.x` | Yes | Active Competition Prototype |

---

## 3. Reporting a Vulnerability

If you discover a security vulnerability or privacy flaw in TrustPause, please report it responsibly:

- **Email:** Contact the maintainers directly via repository contact channels.
- **Do NOT file public issues** detailing zero-day vulnerabilities or exploits until an investigation has been conducted.
- Provide a clear Proof of Concept (PoC) and description of the impact.

We commit to acknowledging your report within 48 hours and working promptly on remediation.
