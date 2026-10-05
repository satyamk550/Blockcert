# 🔐 BlockCert

### Blockchain-Based Academic Credential Management & Verification System

BlockCert is a web-based academic credential management system designed to make the **issuance, storage, ownership, and verification of academic certificates** more secure and easier to manage.

The project explores the use of **Blockchain, IPFS, cryptographic hashing, and Web3 wallets** to create a tamper-evident credential verification system.

> **Project Status:** 🚧 Active Development  
> The current repository contains a functional frontend prototype with simulated blockchain, wallet, authentication, and IPFS layers. The real Python backend, smart-contract integration, and decentralized storage layer are planned as the next development phase.

---

## 📌 Problem

Traditional academic certificate verification can be slow, difficult to scale, and dependent on manual verification by educational institutions.

A typical verification process may require:

1. A student providing a certificate.
2. An organization contacting the issuing institution.
3. The institution manually checking its records.
4. The institution confirming whether the certificate is genuine.

This creates several problems:

- Manual verification takes time.
- Certificates can be forged or manipulated.
- Institutions need to maintain large centralized records.
- Third parties may have difficulty verifying certificates independently.
- Verification becomes difficult when records are spread across different systems.

---

## 💡 Proposed Solution

BlockCert aims to provide a platform where educational institutions can issue digital credentials and third parties can independently verify their authenticity.

The planned architecture combines:

```text
Institution
     │
     │ Issue Credential
     ▼
Python Backend
     │
     ├───────────────┐
     ▼               ▼
   IPFS          Blockchain
     │               │
     │ CID           │ Credential Hash
     └───────┬───────┘
             ▼
        Digital Credential
             │
             ▼
          Student
             │
             │ QR / Credential
             ▼
          Verifier
             │
             ▼
      Blockchain + IPFS
             │
             ▼
      Valid / Invalid
```

The goal is to make credential verification **tamper-evident, portable, and independently verifiable**.

---

# ✨ Features

## Current Frontend Prototype

### 🏫 Institution Portal

- Institution login interface
- Institution registration interface
- Institution dashboard
- Certificate issuance interface
- Student management interface
- Institution records interface
- Institution users interface
- Certificate issue result page

### 🎓 Student Portal

- Student login interface
- Student dashboard
- Credential display
- Certificate information
- Student-specific credential records

### 🔎 Verification Portal

- Certificate verification interface
- Certificate hash generation
- Credential lookup
- Verification status
- QR-based credential workflow

### 🎨 User Interface

- Responsive design
- Modern dashboard layouts
- Glassmorphism-inspired UI
- Responsive navigation
- Reusable CSS variables/components
- Animated interface elements
- Separate interfaces for institutions, students, and verifiers

---

# 🛠️ Technology Stack

## Frontend

| Technology | Purpose |
|---|---|
| HTML5 | Page structure |
| CSS3 | Styling and responsive design |
| JavaScript | Application logic and interactions |
| Tailwind CSS | Utility-based styling |
| SVG | Icons and visual elements |

## Planned Backend

| Technology | Purpose |
|---|---|
| Python | Backend development |
| FastAPI | REST API |
| PostgreSQL | Persistent database |
| SQLAlchemy | Database ORM |
| JWT / Session Authentication | User authentication |

## Blockchain

| Technology | Purpose |
|---|---|
| Solidity | Smart contract |
| Polygon Amoy | Development/test network |
| ethers.js | Web3 interaction |
| MetaMask | Wallet interaction |

## Decentralized Storage

| Technology | Purpose |
|---|---|
| IPFS | Decentralized credential/document storage |
| Pinata | IPFS pinning service |

---

# 🧩 Project Structure

```text
Blockcert/
│
├── assets/
│   └── images, media and other static assets
│
├── config/
│   └── blockchain configuration
│
├── css/
│   └── styles.css
│
├── js/
│   ├── app.js
│   ├── main.js
│   │
│   ├── modules/
│   │   ├── certificate.js
│   │   ├── contract.js
│   │   ├── ipfs.js
│   │   └── wallet.js
│   │
│   ├── pages/
│   └── utils/
│
├── src/
│   └── services/
│
├── index.html
│
├── institution.html
├── institution-login.html
├── institution-register.html
├── institution-dashboard.html
├── institution-issue.html
├── institution-issue-result.html
├── institution-records.html
├── institution-students.html
├── institution-users.html
│
├── student-login.html
├── student-dashboard.html
│
└── verification.html
```

---

# 🔄 Intended Credential Flow

The final system is intended to follow this flow.

### 1. Institution Authentication

An authorized institution logs into the BlockCert platform.

```text
Institution
     ↓
Authentication API
     ↓
Institution Dashboard
```

### 2. Certificate Creation

The institution enters credential information such as:

- Student name
- Student/roll number
- Degree
- Course
- Institution
- Issue date
- Credential details

### 3. Credential Hash

A cryptographic hash is generated from the credential data.

```text
Credential Data
      ↓
SHA-256 / Cryptographic Hash
      ↓
Credential Hash
```

The hash acts as a tamper-evident fingerprint of the credential.

### 4. IPFS Storage

The certificate document is intended to be uploaded to IPFS.

```text
Certificate
     ↓
IPFS
     ↓
CID
```

The CID can then be associated with the credential record.

### 5. Blockchain Registration

The credential hash and relevant metadata are intended to be registered through a Solidity smart contract.

```text
Credential Hash
      +
IPFS CID
      ↓
Smart Contract
      ↓
Blockchain
```

### 6. Student Access

The student can access their issued credentials through the student dashboard.

### 7. Verification

A third party can provide or scan the credential.

The system can then:

```text
Credential
     ↓
Hash
     ↓
Blockchain Record
     ↓
Compare
     ↓
VALID / INVALID
```

---

# ⚠️ Current Implementation Status

This section is intentionally explicit.

The current repository is a **frontend/prototype stage**, not a production-ready decentralized credential platform.

### 🟢 Implemented

- Responsive frontend
- Institution UI
- Student UI
- Verification UI
- Certificate issuance workflow UI
- Certificate records UI
- Dashboard interfaces
- JavaScript application structure
- Certificate data handling
- Client-side credential/hash workflow
- Prototype verification flow
- Prototype QR-related workflow
- Blockchain/IPFS service abstractions
- Configuration structure for blockchain integration

### 🟡 Prototype / Simulated

The following components currently use simulated or client-side implementations:

- Wallet connection
- Blockchain transactions
- Blockchain certificate registration
- IPFS upload
- Authentication
- Persistent credential storage
- Cross-user verification

For example, the current wallet layer provides a simulated wallet address rather than performing a real MetaMask connection.

Similarly, the blockchain module currently provides a prototype hashing/transaction abstraction rather than submitting an actual blockchain transaction.

The IPFS layer currently handles the file locally rather than uploading it to a production IPFS pinning service.

### 🔴 Not Yet Production Ready

The following still need to be implemented:

- Real Python backend
- Persistent database
- Real user authentication
- Secure password handling
- Real MetaMask integration
- Deployed Solidity smart contract
- Real blockchain transactions
- Real IPFS/Pinata integration
- Server-side authorization
- Production-grade certificate verification
- Secure secrets/environment configuration
- Automated tests
- Deployment infrastructure

---

# 🏗️ Planned Architecture

The next version of BlockCert will introduce a Python backend.

```text
                         ┌───────────────────┐
                         │     Frontend      │
                         │   HTML/CSS/JS     │
                         └─────────┬─────────┘
                                   │
                              REST API
                                   │
                         ┌─────────▼─────────┐
                         │   Python Backend  │
                         │      FastAPI      │
                         └─────────┬─────────┘
                                   │
                ┌──────────────────┼──────────────────┐
                │                  │                  │
                ▼                  ▼                  ▼
        ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
        │ PostgreSQL   │   │    IPFS      │   │  Blockchain  │
        │   Database   │   │   / Pinata   │   │   Polygon    │
        └──────────────┘   └──────────────┘   └──────────────┘
```

### Backend Responsibilities

The Python backend will handle:

- User authentication
- Institution management
- Student records
- Certificate metadata
- Certificate issuance
- Verification requests
- Database operations
- IPFS communication
- Blockchain interaction
- Authorization
- API validation

---

# 🔐 Security Considerations

Security is an important part of the project because academic credentials contain sensitive information.

The production version will avoid storing unnecessary personal information directly on a public blockchain.

Instead, the architecture is intended to separate:

```text
Personal / Application Data
          ↓
       Database

Certificate File
          ↓
          IPFS

Proof / Hash / Status
          ↓
      Blockchain
```

This reduces unnecessary exposure of personal information while still providing a tamper-evident verification mechanism.

The production implementation will also use:

- Password hashing
- Environment variables
- Secure authentication
- Server-side authorization
- Input validation
- API authentication
- Rate limiting
- Secure database access
- Contract access control

---

# 🧪 Development Roadmap

## Phase 1 - Frontend Prototype

- [x] Landing page
- [x] Institution interface
- [x] Student interface
- [x] Verification interface
- [x] Certificate issuance workflow
- [x] Dashboard interfaces
- [x] Prototype credential handling

## Phase 2 - Python Backend

- [ ] FastAPI setup
- [ ] PostgreSQL database
- [ ] SQLAlchemy models
- [ ] Institution authentication
- [ ] Student authentication
- [ ] JWT/session management
- [ ] Certificate API
- [ ] Verification API

## Phase 3 - Blockchain

- [ ] Write Solidity smart contract
- [ ] Deploy contract to Polygon Amoy
- [ ] Implement issuer authorization
- [ ] Implement certificate issuance
- [ ] Implement certificate lookup
- [ ] Implement credential revocation
- [ ] Connect backend/frontend to contract
- [ ] Replace simulated blockchain transactions

## Phase 4 - IPFS

- [ ] Configure Pinata
- [ ] Upload certificate documents
- [ ] Store CIDs
- [ ] Retrieve documents
- [ ] Connect CID with blockchain credential record

## Phase 5 - Verification

- [ ] Standard QR code generation
- [ ] QR verification
- [ ] Hash comparison
- [ ] Blockchain lookup
- [ ] IPFS document verification
- [ ] Revocation checking
- [ ] Public verification endpoint

## Phase 6 - Production

- [ ] Automated tests
- [ ] Security audit
- [ ] API documentation
- [ ] Deployment
- [ ] Monitoring
- [ ] CI/CD
- [ ] Production database
- [ ] Domain and HTTPS

---

# 🚀 Running the Current Prototype

The current version is a frontend application and does not require a Python backend.

### Clone the repository

```bash
git clone https://github.com/satyamk550/Blockcert.git
```

### Enter the project

```bash
cd Blockcert
```

### Run locally

Because the project currently uses static HTML/CSS/JavaScript, it can be served using a local development server.

For example, with VS Code, install the **Live Server** extension and open:

```text
index.html
```

Then launch it with Live Server.

Alternatively, any static HTTP server can be used.

---

# 🧑‍💻 Development Goals

BlockCert is being developed as a learning and engineering project focused on combining:

- Web development
- Python backend development
- Blockchain
- Smart contracts
- Web3
- Decentralized storage
- Database systems
- Authentication
- API development
- Cybersecurity

The project is intentionally being developed incrementally, starting with the frontend prototype and moving toward a complete backend-driven architecture.

---

# 📚 Learning Objectives

Through BlockCert, the project aims to provide practical experience with:

### Python

- Python backend development
- REST APIs
- FastAPI
- Database integration
- Authentication
- API security

### Blockchain

- Solidity
- Smart contract development
- Transaction lifecycle
- Wallet interaction
- Web3 application architecture
- On-chain verification

### Distributed Storage

- IPFS
- Content addressing
- CIDs
- Decentralized document storage

### Software Engineering

- Modular JavaScript
- API architecture
- Database design
- Authentication
- Security
- Deployment
- Version control

---

# 📸 Screenshots

Screenshots of the BlockCert interface can be added here as the project evolves.

Recommended screenshots:

1. Landing page
2. Institution dashboard
3. Certificate issuance page
4. Student dashboard
5. Verification page
6. Successful verification result
7. Blockchain transaction
8. IPFS credential

Example:

```markdown
![BlockCert Dashboard](assets/screenshots/dashboard.png)
```

---

# 🔮 Future Improvements

Potential future improvements include:

- W3C Verifiable Credentials compatibility
- Decentralized identity integration
- Institution wallet-based authorization
- Credential revocation registry
- Batch certificate issuance
- Public verification URLs
- Mobile-friendly verification
- Email notifications
- Certificate expiration support
- Role-based access control
- Audit logs
- Analytics dashboard
- Multi-institution support

---

# ⚠️ Disclaimer

BlockCert is currently a development/academic project.

The current version should **not** be considered a production-ready credential verification infrastructure.

Blockchain, IPFS, authentication, and backend components are being implemented incrementally. Some integrations in the current frontend are simulated for development and demonstration purposes.

---

# 👨‍💻 Contributors

### Satyam Kumar

Blockchain Engineering Student  
Interested in Blockchain, Web3, Python, AI/ML and Software Development.

GitHub:  
https://github.com/satyamk550

---

# 📄 License

This project does not currently specify a license.

A suitable open-source license should be added before the project is intended for external contribution or redistribution.
