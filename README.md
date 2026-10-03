# ProofPass — Decentralized Document Wallet & Blockchain Verification Platform

> **“Verify the document. Trace the record. Trust the proof.”**

ProofPass is a DigiLocker-style digital document wallet combined with Ethereum-compatible blockchain-backed verification, tamper-evident audit trails, and transparent charity donation tracking.

---

## 1. PROJECT STRUCTURE

```
/
├── contracts/                        # Solidity Smart Contracts
│   ├── IssuerRegistry.sol            # Authorized institutional issuer registry
│   ├── CredentialRegistry.sol        # SHA-256 fingerprint anchoring & revocation
│   └── DonationRegistry.sol          # Transparent fund allocation & invoice evidence
├── src/
│   ├── blockchain/                   # Blockchain Service Abstraction Layer
│   │   ├── crypto.ts                 # SHA-256 hashing & Ed25519 digital signatures
│   │   └── BlockchainProvider.ts     # LocalBlockchainProvider (simulated EVM node)
│   ├── components/                   # Reusable UI Components
│   │   ├── Navbar.tsx                # Header with search, role switcher, Google sign-in
│   │   ├── Sidebar.tsx               # Desktop persistent navigation & node status
│   │   ├── MobileNav.tsx             # Mobile bottom navigation bar
│   │   ├── DemoBar.tsx               # 1-Click Hackathon 3-minute demo tour
│   │   ├── CertificateRenderer.tsx   # Official certificate layout with dynamic QR
│   │   ├── TamperDetector.tsx        # Drag & drop PDF integrity hashing & diff
│   │   ├── ProofGraph.tsx            # Interactive relationship DAG
│   │   ├── WhyTrustedModal.tsx       # Plain language trust explainer
│   │   ├── GeminiAIAuditModal.tsx    # Gemini 3.1 Pro Thinking + Google Search grounding
│   │   └── GoogleKeepExportModal.tsx # Export verified memo to Google Keep
│   ├── context/
│   │   └── AppContext.tsx            # Global state, active user, demo runner
│   ├── data/
│   │   └── mockData.ts               # Seed data for universities, NGOs, certificates
│   ├── pages/
│   │   ├── LandingPage.tsx           # Product overview & trust pipeline
│   │   ├── Dashboard.tsx             # Digital document wallet & metric cards
│   │   ├── MyDocuments.tsx           # Filterable wallet with search & sort
│   │   ├── DocumentDetail.tsx        # Version history timeline & revocation
│   │   ├── PublicVerifyPage.tsx      # Public QR verification (no login required)
│   │   ├── DonationTrackingPage.tsx  # Philanthropy breakdown & invoices
│   │   ├── IssueDocumentWizard.tsx   # 9-step issuer wizard
│   │   ├── IssuerPortal.tsx          # University/Company issuer dashboard
│   │   ├── AuditTrailPage.tsx        # Chronological audit timeline
│   │   └── SettingsPage.tsx          # Network provider & cryptographic settings
│   ├── services/
│   │   ├── api.ts                    # Backend API client
│   │   └── firebaseAuth.ts           # Firebase Google Sign-In integration
│   └── types/
│       └── index.ts                  # TypeScript interfaces & types
├── server.ts                         # Express full-stack server + Vite middleware
├── firebase-applet-config.json       # Firebase project configuration
└── package.json
```

---

## 2. SETUP INSTRUCTIONS

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server (runs full-stack Express on port 3000):
   ```bash
   npm run dev
   ```

3. Open your browser at `http://localhost:3000`.

---

## 3. ENVIRONMENT VARIABLES (`.env`)

```ini
# GEMINI_API_KEY: Injected automatically by Google AI Studio
GEMINI_API_KEY="your-gemini-api-key"

# APP_URL: Development or production base URL
APP_URL="http://localhost:3000"

# PORT: Server port (defaults to 3000)
PORT=3000
```

---

## 4. HOW TO START LOCAL BLOCKCHAIN & DEPLOY CONTRACTS

ProofPass implements the `BlockchainProvider` interface inside `src/blockchain/BlockchainProvider.ts` as `LocalBlockchainProvider`.

- **Local Development**: ProofPass starts with a simulated EVM block height `#18452312`, producing deterministic block hashes, gas receipts, and event logs without requiring local testnet installations or cryptocurrency.
- **Hardhat / Testnet Deployment**:
  To deploy the smart contracts in `/contracts/` to a live network (e.g. Polygon Amoy or Sepolia):
  ```bash
  npx hardhat run scripts/deploy.ts --network polygonAmoy
  ```
  Then update the RPC URL in `src/pages/SettingsPage.tsx`.

---

## 5. DEMO CREDENTIALS

ProofPass includes pre-configured demo personas accessible via the top-right profile switcher or instant 1-click login:

| Role | Persona | Email | Purpose |
|------|---------|-------|---------|
| **HOLDER** | Rahul Sharma | `student@demo.com` | View student digital wallet & credentials |
| **ISSUER** | Dr. Suresh Varma | `issuer@abcuniversity.demo` | Issue degrees, manage versions & revoke |
| **DONOR** | Rahul Sharma | `donor@demo.com` | Track ₹10,000 School Library donation |
| **ADMIN** | Security Admin | `admin@proofpass.demo` | System oversight & contract auditing |

---

## 6. CORE DEMO SCRIPTS (3-MINUTE HACKATHON STORY)

### Demo 1 — Issue Certificate
1. Click **1. Issue** on the top Demo Bar (or switch to ABC University).
2. The 9-step wizard loads. Choose **Degree Certificate**, enter recipient details for Rahul Sharma.
3. Click **Compute SHA-256 & Sign** -> View the instant cryptographic hash.
4. Click **Anchor to Blockchain & Issue** -> View the confirmed Block # and generated QR code.

### Demo 2 — Public Verification
1. Click **2. Verify** on the top Demo Bar.
2. The Public Verification page opens for `TC-UNI-2026-00128` (B.Tech Degree).
3. Notice:
   - Big bold **AUTHENTIC DOCUMENT** green card.
   - All 6 checks green: Issuer recognized, Digital signature valid, Blockchain proof found, Hash matches, Version verified, Not revoked.
   - Interactive Proof Graph showing `Issuer -> Credential -> Hash -> Blockchain Tx`.

### Demo 3 — Tamper Detection (The Signature Feature)
1. Click **3. Simulate Tamper** on the top Demo Bar (or scroll to the Tamper Detector dropzone).
2. Click **Simulate Altered Marks PDF** (which simulates changing marks from 82% to 92%).
3. The system computes the SHA-256 hash of the modified file and matches it against the genesis block.
4. The system immediately turns RED:
   - **TAMPERING DETECTED**
   - Shows original hash: `0xa81f...` vs altered hash: `0x73bc...`
   - Explains in plain language: *"This file has changed since the original document was issued."*

### Demo 4 — Version History
1. Click **4. Version History** on the top Demo Bar.
2. View XYZ Technologies Internship Certificate (`TC-XYZ-2026-00452`).
3. Notice:
   - **V1 (Provisional Frontend Intern)** is marked **SUPERSEDED**.
   - **V2 (Software Engineer Intern - Web3 & Systems)** is marked **CURRENT**.
   - The original certificate is never erased; both versions maintain independent blockchain transaction proofs.

### Demo 5 — Revocation
1. Click **5. Revoke** on the top Demo Bar.
2. View the Postgraduate Diploma in Cybersecurity (`TC-UNI-2026-00094`).
3. Shows a prominent 🔴 **OFFICIALLY REVOKED** banner with the formal revocation notice, reason, timestamp, and audit trail.

### Demo 6 — Donation Transparency
1. Click **6. Track Donation** on the top Demo Bar.
2. Inspect Donation `#DON-2026-0192` for ₹10,000 to Helping Hands Foundation.
3. See 100% allocation breakdown:
   - Books & Science Kits: ₹6,000 (Invoice INV-102)
   - Study Furniture: ₹2,500 (Purchase Order PUR-88)
   - Rural Freight & Logistics: ₹1,500 (Receipt REC-21)
4. Click **View**, **Verify**, or **Proof** on any invoice to verify its independent cryptographic hash and blockchain receipt.

---

## 7. WHERE BLOCKCHAIN IS USED vs WHAT REMAINS OFF-CHAIN

### Recorded On-Chain:
- Document ID & Certificate Number
- SHA-256 cryptographic fingerprints
- Issuer public key identity & digital signature
- Block height & timestamp
- Version sequence and parent version hash
- Revocation status and official reason

### Kept Strictly Off-Chain (Privacy Protected):
- Full PDF files and graphical renderings
- Student Aadhaar / National ID numbers
- Personal phone numbers and home addresses
- Private passwords and authentication tokens
- Sensitive banking and donor details

---

## 8. FUTURE PRODUCTION ROADMAP
- Zero-Knowledge Proofs (zk-SNARKs) to verify marks thresholds (e.g. `Marks >= 75%`) without disclosing exact grades.
- Hardware Security Module (HSM) and KMS key integration for institutional signing keys.
- Direct DigiLocker API adapter for Indian National Academic Depository (NAD) interoperability.
