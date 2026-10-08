# TrustLens AI
**AI-Powered Refund & Claim Verification Platform**

*Verify the claim. Protect the refund. Trust the evidence.*

## Overview
TrustLens AI is an AI-powered trust and safety platform designed to help digital commerce platforms verify customer refund, return, delivery and service claims.

The system combines digital content provenance, image forensics, duplicate-evidence detection, behavioural analytics, order consistency and explainable risk scoring to determine how a claim should be handled.

TrustLens is designed for food delivery, quick commerce, e-commerce, travel and marketplace platforms.

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
TrustLens AI uses multiple independent signals and combines them into an explainable claim-risk score.

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
Every high-risk result should provide understandable reasons.
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
- **Frontend**: Next.js, TypeScript, Tailwind CSS, shadcn/ui, Recharts
- **Backend**: Python, FastAPI
- **Database/Storage**: PostgreSQL, Supabase, Cloudflare R2 / S3
- **Processing**: Redis, Celery
- **Computer Vision**: OpenCV, Pillow, ImageHash, Image embeddings
- **AI/Provenance**: Multimodal vision models, C2PA, OpenAI Provenance API
- **DevOps**: Docker, GitHub Actions, Vercel/Render
