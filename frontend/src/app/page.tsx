import Link from "next/link";
import { ArrowRight, ShieldCheck, CheckCircle2, Terminal, ExternalLink } from "lucide-react";

export const metadata = {
  title: "TrustLens AI — Autonomous Claim Evidence Verification",
  description: "Multimodal AI evidence verification and return fraud defense for e-commerce and quick commerce platforms.",
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#ffffff] text-[#111111] font-sans antialiased selection:bg-[#111111] selection:text-white flex flex-col justify-between">
      
      {/* 1. MINIMAL HEADER */}
      <header className="w-full max-w-6xl mx-auto px-6 py-6 border-b border-[#111111]/15 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-3 group">
          <img 
            src="/logo.png" 
            alt="TrustLens AI Logo" 
            className="w-9 h-9 object-contain" 
          />
          <span className="font-bold text-[18px] tracking-tight text-[#111111]">
            TRUSTLENS AI
          </span>
        </Link>

        <nav className="flex items-center space-x-6 text-[14px] font-medium">
          <Link href="/dashboard" className="hidden sm:inline hover:underline text-[#111111]/80 hover:text-[#111111]">
            Overview
          </Link>
          <Link href="/dashboard/evidence" className="hidden sm:inline hover:underline text-[#111111]/80 hover:text-[#111111]">
            Evidence Explorer
          </Link>
          <Link href="/dashboard/analytics" className="hidden md:inline hover:underline text-[#111111]/80 hover:text-[#111111]">
            Risk Analytics
          </Link>
          <Link 
            href="/dashboard" 
            className="inline-flex items-center px-4 py-2 bg-[#111111] text-[#ffffff] text-[13px] font-semibold rounded-[8px] hover:bg-black/85 transition-colors"
          >
            Enter Dashboard <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </Link>
        </nav>
      </header>

      {/* 2. MIDDLE CONTENT — WHY THIS PROJECT */}
      <main className="w-full max-w-4xl mx-auto px-6 py-14 sm:py-20 flex-1">
        
        {/* Centered Logo & Title */}
        <div className="text-center mb-14">
          <img 
            src="/logo.png" 
            alt="TrustLens AI Logo" 
            className="w-24 h-24 object-contain mx-auto mb-6" 
          />
          <div className="inline-block px-3 py-1 mb-4 rounded-full border border-[#111111]/20 text-[12px] font-mono font-medium text-[#111111]/80">
            MULTIMODAL EVIDENCE VERIFICATION ENGINE
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#111111] mb-5 leading-tight">
            See the Evidence.<br />Verify the Claim.
          </h1>
          <p className="text-lg sm:text-xl text-[#111111]/75 max-w-2xl mx-auto font-normal leading-relaxed">
            TrustLens AI automates claim verification and stops return fraud in instant commerce through multimodal image forensics, C2PA provenance, duplicate search, and OCR waybill cross-matching.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link 
              href="/dashboard"
              className="inline-flex items-center px-6 py-3 bg-[#111111] text-[#ffffff] font-semibold text-[15px] rounded-[10px] hover:bg-black/90 transition-transform hover:-translate-y-0.5"
            >
              Launch Verification Console <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
            <Link 
              href="/dashboard/claims"
              className="inline-flex items-center px-6 py-3 border-2 border-[#111111] text-[#111111] font-semibold text-[15px] rounded-[10px] hover:bg-[#111111]/5 transition-colors"
            >
              Browse Active Claims
            </Link>
          </div>
        </div>

        {/* Narrative / Manifesto Section: Why This Project? */}
        <div className="border-t border-[#111111]/15 pt-12 space-y-12 text-[#111111]">
          
          {/* Section 1: The Problem */}
          <div className="space-y-3">
            <div className="text-[12px] font-mono font-bold tracking-wider uppercase text-[#111111]/60">
              01 — The Problem
            </div>
            <h2 className="text-2xl font-bold tracking-tight">
              Why high-velocity commerce is losing billions to unverified claims
            </h2>
            <p className="text-[15px] leading-relaxed text-[#111111]/80">
              Instant delivery and modern e-commerce platforms process millions of returns, refunds, and damaged-goods claims every month. When a customer reports that a food item spilled, an expensive gadget box arrived empty, or packaging was crushed, companies face an impossible trade-off:
            </p>
            <div className="pl-4 border-l-2 border-[#111111] space-y-2 text-[14px] text-[#111111]/85 my-4">
              <p><strong>Blind Instant Payouts:</strong> Approving claims without verification leads to rampant syndication fraud—recycled photos from Google Images, Photoshop-edited waybills, and AI-generated damage images.</p>
              <p><strong>Manual Human Bottlenecks:</strong> Routing every claim to human support agents causes severe backlog, frustrates genuine customers, and incurs massive support labor overhead.</p>
            </div>
          </div>

          {/* Section 2: What TrustLens AI Does */}
          <div className="space-y-3">
            <div className="text-[12px] font-mono font-bold tracking-wider uppercase text-[#111111]/60">
              02 — The Solution
            </div>
            <h2 className="text-2xl font-bold tracking-tight">
              Sub-second forensic intelligence for every claim photo
            </h2>
            <p className="text-[15px] leading-relaxed text-[#111111]/80">
              TrustLens AI replaces guesswork with cryptographic and forensic certainty. When a claim photo or video is uploaded, our engine analyzes the media across 7 independent inspection layers and computes a unified Risk Score (0 to 100) within 420 milliseconds:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 pt-3 text-[14px]">
              <div>
                <p className="font-bold text-[#111111]">1. C2PA Hardware Provenance</p>
                <p className="text-[#111111]/70 text-[13px]">Validates cryptographic hardware signing from original smartphone camera sensors.</p>
              </div>
              <div>
                <p className="font-bold text-[#111111]">2. SynthID & GenAI Detection</p>
                <p className="text-[#111111]/70 text-[13px]">Identifies synthetic diffusion artifacts, Midjourney, and generative AI alterations.</p>
              </div>
              <div>
                <p className="font-bold text-[#111111]">3. Image Compression & Noise Forensics</p>
                <p className="text-[#111111]/70 text-[13px]">Flags clone stamp edits, inconsistent JPEG quantization, and splicing edges.</p>
              </div>
              <div>
                <p className="font-bold text-[#111111]">4. Perceptual Duplicate Hashing</p>
                <p className="text-[#111111]/70 text-[13px]">Matches visual fingerprints against a historical database of past claims to catch recycled images.</p>
              </div>
              <div>
                <p className="font-bold text-[#111111]">5. OCR Waybill & Label Verification</p>
                <p className="text-[#111111]/70 text-[13px]">Reads printed tracking numbers, dates, and addresses to ensure they match order records.</p>
              </div>
              <div>
                <p className="font-bold text-[#111111]">6. Order Telemetry Fusion</p>
                <p className="text-[#111111]/70 text-[13px]">Cross-references driver delivery timestamps and geolocation against photo capture EXIF data.</p>
              </div>
              <div className="sm:col-span-2">
                <p className="font-bold text-[#111111]">7. Syndicate & Behavioral Analytics</p>
                <p className="text-[#111111]/70 text-[13px]">Detects shared device IDs, frequent claimers, and rapid refund-submission patterns.</p>
              </div>
            </div>
          </div>

          {/* Section 3: The Workflow */}
          <div className="space-y-3">
            <div className="text-[12px] font-mono font-bold tracking-wider uppercase text-[#111111]/60">
              03 — The Workflow
            </div>
            <h2 className="text-2xl font-bold tracking-tight">
              Zero-touch auto-triage with human-in-the-loop oversight
            </h2>
            <div className="bg-[#ffffff] border border-[#111111]/20 rounded-[10px] p-5 font-mono text-[12px] sm:text-[13px] leading-relaxed text-[#111111] space-y-1">
              <div>CLAIM CREATED (Customer submits photo + reason)</div>
              <div className="text-[#111111]/50">  ↓</div>
              <div>7-LAYER FORENSIC INGEST (C2PA · SynthID · Forensics · OCR · Duplicate Hash)</div>
              <div className="text-[#111111]/50">  ↓</div>
              <div>EVIDENCE FUSION &amp; RISK SCORING (0 to 100)</div>
              <div className="text-[#111111]/50">  ├── LOW RISK (0-39)    → Instant Auto-Approval (88.6% of volume)</div>
              <div className="text-[#111111]/50">  ├── MEDIUM RISK (40-69) → Secondary Signal Request</div>
              <div className="text-[#111111]/50">  └── HIGH/CRITICAL (70+) → Routed to Review Queue for Human Action</div>
            </div>
          </div>

          {/* Section 4: Live Access */}
          <div className="pt-4 border-t border-[#111111]/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="font-bold text-[16px] text-[#111111]">Ready to explore the dashboard?</div>
              <div className="text-[13px] text-[#111111]/70">Explore active demo claims, upload test evidence, inspect forensic metadata, and export audit reports.</div>
            </div>
            <Link 
              href="/dashboard"
              className="inline-flex items-center px-5 py-2.5 bg-[#111111] text-[#ffffff] font-semibold text-[14px] rounded-[8px] hover:bg-black/90 transition-colors whitespace-nowrap"
            >
              Open Console <ArrowRight className="w-4 h-4 ml-1.5" />
            </Link>
          </div>

        </div>

      </main>

      {/* 3. MINIMAL FOOTER */}
      <footer className="w-full border-t border-[#111111]/15 bg-[#ffffff]">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[13px] text-[#111111]/70">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-[#111111]">TRUSTLENS AI</span>
            <span>·</span>
            <span>Autonomous Evidence Intelligence</span>
          </div>

          <div className="flex items-center space-x-6">
            <Link href="/dashboard" className="hover:text-[#111111] hover:underline">
              Dashboard
            </Link>
            <Link href="/dashboard/claims" className="hover:text-[#111111] hover:underline">
              Claims
            </Link>
            <Link href="/dashboard/evidence" className="hover:text-[#111111] hover:underline">
              Evidence
            </Link>
            <Link href="/dashboard/analytics" className="hover:text-[#111111] hover:underline">
              Analytics
            </Link>
            <Link href="/dashboard/settings" className="hover:text-[#111111] hover:underline">
              Settings
            </Link>
            <a 
              href="https://github.com/pv-srinivas1/TrustLens-AI" 
              target="_blank" 
              rel="noreferrer"
              className="hover:text-[#111111] hover:underline inline-flex items-center"
            >
              GitHub <ExternalLink className="w-3 h-3 ml-1" />
            </a>
          </div>

          <div className="font-mono text-[11px] text-[#111111]/50">
            SYSTEM ONLINE • FASTAPI v2.4
          </div>
        </div>
      </footer>

    </div>
  );
}
