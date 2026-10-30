# TrustLens Technologies
**AI-Powered Refund & Claim Verification Platform**

*Verify the claim. Protect the refund. Trust the evidence.*

## Overview
TrustLens Technologies is an AI-powered trust and safety platform designed to help digital commerce platforms verify customer refund, return, delivery and service claims.

The system combines digital content provenance, image forensics, duplicate-evidence detection, behavioural analytics, order consistency and explainable risk scoring to determine how a claim should be handled.

TrustLens is designed for food delivery, quick commerce, e-commerce, travel and marketplace platforms.

## Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/pv-srinivas1/TrustLens-AI.git
cd TrustLens-AI
```

### 2. Configure Environment Variables
Copy the templates to create local configuration files:
```bash
# Backend
cp backend/.env.example backend/.env

# Frontend
cp frontend/.env.example frontend/.env.local
```

### 3. Run Locally

#### Using Docker Compose:
```bash
docker-compose up -d
```

#### Running Manually:
- **Backend**:
  ```bash
  cd backend
  python -m venv venv
  .\venv\Scripts\activate   # Windows (or source venv/bin/activate on Linux/Mac)
  pip install -r requirements.txt
  uvicorn app.main:app --reload --port 8000
  ```
- **Frontend**:
  ```bash
  cd frontend
  npm install
  npm run dev
  ```

## Problem Statement
Modern digital platforms process a large number of refund and complaint requests every day.
Common claims include:
- Damaged product
- Missing item
- Wrong item
- Spoiled food
- Empty package
- Undelivered order
- Defective product
- Tampered package
- Cancelled booking
- Refund not received

The verification problem becomes more difficult as users gain access to generative AI and sophisticated image-editing tools.
A customer may submit a realistic-looking image as evidence of a damaged or missing product. Metadata may also be removed through screenshots, compression or editing.
Therefore, a platform should not rely on a single AI detector.

## Proposed Solution
TrustLens Technologies uses multiple independent signals and combines them into an explainable claim-risk score.

**Verification layers**
- C2PA Content Credentials
- Supported AI watermark/provenance checks
- Image metadata analysis
- Image manipulation analysis
- AI-generation probability
- Perceptual image similarity
- Duplicate evidence detection
- Order consistency
- Delivery verification
- Customer claim behaviour
- Historical claim analysis
- Explainable risk scoring

**Core Principle**
TrustLens does not attempt to declare a customer guilty based on a single signal.
Instead:
`Evidence ↓ Verification Signals ↓ Evidence Fusion ↓ Risk Score ↓ Recommended Action ↓ Human Review where necessary`

## Risk Engine
The risk engine produces a score between 0 and 100.
- **0–30 (Low risk)**: PROCESS ACCORDING TO PLATFORM POLICY
- **31–60 (Medium risk)**: REQUEST ADDITIONAL EVIDENCE
- **61–80 (High risk)**: HUMAN REVIEW
- **81–100 (Critical risk)**: TRUST & SAFETY ESCALATION

## Explainability
Every high-risk result provides understandable reasons.
Example:
```
Risk Score: 87
Signals: 
+22 Repeated similar claims 
+18 Provenance signal detected 
+17 Image manipulation indicator 
+14 Unusual claim frequency 
+11 Order/claim inconsistency 
+09 Similar evidence detected
```

## Technology Stack
- **Frontend**: Next.js 15, TypeScript, Tailwind CSS, shadcn/ui, Recharts
- **Backend**: Python 3.11+, FastAPI, SQLAlchemy, Alembic
- **Database/Storage**: PostgreSQL, Supabase, Cloudflare R2 / S3
- **Processing**: Redis, Celery
- **Computer Vision**: OpenCV, Pillow, ImageHash, Image embeddings
- **AI/Provenance**: Multimodal vision models, C2PA
- **Deployment**: Docker, Vercel, Render

## License
MIT License. Open-source and free to contribute.
