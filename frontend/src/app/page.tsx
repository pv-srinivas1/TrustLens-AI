"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  ArrowRight, 
  ExternalLink,
  Menu,
  X,
  Grid,
  FileText,
  CheckSquare,
  Layers,
  ShieldAlert,
  Settings
} from "lucide-react";

export default function TrustLensLandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#000000] font-sans selection:bg-[#0055FF] selection:text-[#FFFFFF] overflow-x-hidden flex flex-col justify-between">
      
      {/* GLOBAL STYLES & TYPOGRAPHY SPEC */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap');

        body {
          background-color: #FFFFFF;
          color: #000000;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .font-headline {
          font-family: 'Inter', sans-serif;
          font-weight: 700;
          letter-spacing: -0.04em;
          line-height: 1.05;
        }

        .font-mono-meta {
          font-family: 'Space Mono', monospace;
          font-size: 12px;
          letter-spacing: 0.05em;
        }
      `}</style>

      {/* 1. NAVIGATION HEADER WITH PROMINENT LOGO & MOBILE HAMBURGER */}
      <header className="sticky top-0 left-0 w-full z-50 bg-[#FFFFFF]/95 backdrop-blur-md border-b border-[#000000]/10 px-6 sm:px-12 py-3.5 flex items-center justify-between">
        {/* Brand Link with BIGGER LOGO */}
        <Link href="/" className="flex items-center space-x-3.5 group">
          <img 
            src="/logo.png" 
            alt="TrustLens AI Logo" 
            className="w-11 h-11 sm:w-12 sm:h-12 object-contain transition-transform group-hover:scale-105" 
          />
          <div className="flex flex-col">
            <span className="font-headline text-[17px] sm:text-[19px] tracking-tight text-[#000000] group-hover:text-[#0055FF] transition-colors">
              TRUSTLENS AI
            </span>
            <span className="font-mono-meta text-[9px] text-[#737373] hidden sm:block">
              VERIFICATION ENGINE
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-7 text-[13px] font-medium">
          <Link 
            href="/dashboard" 
            className="text-[#525252] hover:text-[#000000] transition-colors"
          >
            Overview
          </Link>
          <Link 
            href="/dashboard/claims" 
            className="text-[#525252] hover:text-[#000000] transition-colors"
          >
            Claims
          </Link>
          <Link 
            href="/dashboard/review-queue" 
            className="text-[#525252] hover:text-[#000000] transition-colors"
          >
            Review Queue
          </Link>
          <Link 
            href="/dashboard/evidence" 
            className="text-[#525252] hover:text-[#000000] transition-colors"
          >
            Evidence Explorer
          </Link>
          <Link 
            href="/dashboard/analytics" 
            className="text-[#525252] hover:text-[#000000] transition-colors"
          >
            Risk Analytics
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center px-4 py-2 bg-[#000000] text-[#FFFFFF] font-mono-meta text-[11px] rounded-full hover:bg-[#0055FF] transition-colors"
          >
            Enter Dashboard <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </Link>
        </nav>

        {/* Mobile Hamburger Toggle Button */}
        <div className="flex md:hidden items-center space-x-3">
          <Link
            href="/dashboard"
            className="inline-flex items-center px-3 py-1.5 bg-[#000000] text-[#FFFFFF] font-mono-meta text-[10px] rounded-full hover:bg-[#0055FF] transition-colors"
          >
            Console
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 border border-[#000000]/20 rounded-[8px] bg-white text-[#000000] hover:bg-[#000000]/5 transition-colors focus:outline-none"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* MOBILE DROPDOWN / DRAWER NAVIGATION */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed top-[69px] left-0 w-full h-[calc(100vh-69px)] bg-[#FFFFFF] z-40 border-b border-[#000000]/15 flex flex-col justify-between p-6 overflow-y-auto animate-in slide-in-from-top-2 duration-200">
          <div className="space-y-4">
            <div className="font-mono-meta text-[11px] text-[#0055FF] font-bold">
              PLATFORM WORKSPACE
            </div>
            <div className="space-y-2">
              {[
                { name: "Overview", href: "/dashboard", icon: Grid },
                { name: "Claims Management", href: "/dashboard/claims", icon: FileText },
                { name: "Review Queue", href: "/dashboard/review-queue", icon: CheckSquare },
                { name: "Evidence Explorer", href: "/dashboard/evidence", icon: Layers },
                { name: "Risk Analytics", href: "/dashboard/analytics", icon: ShieldAlert },
                { name: "Settings", href: "/dashboard/settings", icon: Settings },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-3 p-3 rounded-[10px] border border-[#000000]/10 hover:border-[#000000] hover:bg-[#000000]/5 text-[15px] font-semibold text-[#000000] transition-colors"
                >
                  <item.icon className="w-4 h-4 text-[#0055FF]" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-[#000000]/10 space-y-3">
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center py-3 bg-[#000000] text-[#FFFFFF] font-mono-meta text-[12px] rounded-full hover:bg-[#0055FF] transition-colors"
            >
              Launch Verification Console <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
            <p className="text-center font-mono-meta text-[10px] text-[#737373]">
              TrustLens AI Decision Support Console
            </p>
          </div>
        </div>
      )}

      {/* 2. COMPACT HERO SECTION WITH BIG LOGO */}
      <main className="flex-1 max-w-5xl mx-auto px-6 py-10 sm:py-14 space-y-14">
        
        <section className="text-center space-y-5 max-w-3xl mx-auto">
          {/* BIGGER HERO LOGO */}
          <div className="flex justify-center">
            <img 
              src="/logo.png" 
              alt="TrustLens AI Logo" 
              className="w-24 h-24 sm:w-28 sm:h-28 object-contain transition-transform hover:scale-105 duration-300 drop-shadow-sm" 
            />
          </div>

          <div className="inline-flex items-center px-3.5 py-1 rounded-full border border-[#0055FF]/25 bg-[#0055FF]/5 text-[#0055FF] font-mono-meta text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0055FF] mr-2" />
            MULTIMODAL EVIDENCE VERIFICATION
          </div>

          <h1 className="font-headline text-4xl sm:text-6xl md:text-7xl text-[#000000] tracking-tight leading-[1.02]">
            See the Evidence.<br />
            <span className="text-[#0055FF]">Verify the Claim.</span>
          </h1>

          <p className="text-[17px] sm:text-[19px] text-[#525252] max-w-2xl mx-auto leading-relaxed">
            TrustLens AI analyzes claim evidence across multiple verification signals, helping commerce teams identify suspicious claims and route uncertain cases for human review.
          </p>

          <p className="font-mono-meta text-[11px] text-[#737373]">
            AI-powered claim and evidence verification for commerce platforms.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
            <Link
              href="/dashboard"
              className="inline-flex items-center px-6 py-3 bg-[#000000] text-[#FFFFFF] font-mono-meta text-[12px] rounded-full hover:bg-[#0055FF] transition-colors"
            >
              Launch Verification Console <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
            <Link
              href="/dashboard/evidence"
              className="inline-flex items-center px-6 py-3 border border-[#000000]/20 text-[#000000] font-mono-meta text-[12px] rounded-full hover:border-[#000000] hover:bg-[#000000]/5 transition-colors"
            >
              Explore Evidence
            </Link>
          </div>
        </section>

        {/* 3. THE PROBLEM & APPROACH (COMPACT EDITORIAL ROW) */}
        <section className="border-t border-[#000000]/10 pt-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <span className="font-mono-meta text-[11px] text-[#0055FF]">01 // THE CHALLENGE</span>
              <h2 className="font-headline text-[20px] text-[#000000]">
                Why claim verification matters
              </h2>
              <p className="text-[14px] text-[#525252] leading-relaxed">
                Customers submit photos, receipts, and screenshots for refund requests. Teams struggle between automated payouts causing loss, and manual triage overwhelming support teams.
              </p>
            </div>

            <div className="space-y-2">
              <span className="font-mono-meta text-[11px] text-[#0055FF]">02 // THE SOLUTION</span>
              <h2 className="font-headline text-[20px] text-[#000000]">
                Multi-signal risk assessment
              </h2>
              <p className="text-[14px] text-[#525252] leading-relaxed">
                TrustLens combines independent evidence signals—provenance, forensics, duplicate hashes, and OCR—to calculate a 0–100 risk assessment that informs human reviewers.
              </p>
            </div>

            <div className="space-y-2">
              <span className="font-mono-meta text-[11px] text-[#0055FF]">03 // HUMAN-IN-THE-LOOP</span>
              <h2 className="font-headline text-[20px] text-[#000000]">
                Decision-support workflow
              </h2>
              <p className="text-[14px] text-[#525252] leading-relaxed">
                TrustLens does not replace human reviewers. It provides structured dossiers and anomaly alerts so investigators can make fast, audit-ready decisions.
              </p>
            </div>
          </div>
        </section>

        {/* 4. REAL CAPABILITIES (COMPACT 6-LAYER GRID + COMPOSITE BANNER) */}
        <section className="border-t border-[#000000]/10 pt-10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <span className="font-mono-meta text-[11px] text-[#0055FF]">REAL PRODUCT CAPABILITIES</span>
              <h2 className="font-headline text-2xl sm:text-3xl text-[#000000]">
                Evidence Verification Signals
              </h2>
            </div>
            <p className="font-mono-meta text-[11px] text-[#737373]">
              * C2PA verifies assertions, not claim truthfulness.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            
            <div className="p-4 border border-[#000000]/10 rounded-[10px] space-y-1.5 hover:border-[#000000]/30 transition-colors">
              <span className="font-mono-meta text-[10px] text-[#0055FF] font-bold">01 • PROVENANCE</span>
              <h3 className="font-bold text-[15px] text-[#000000]">Provenance Verification</h3>
              <p className="text-[13px] text-[#525252] leading-relaxed">
                Inspects C2PA and available content-provenance metadata when present in file manifests.
              </p>
            </div>

            <div className="p-4 border border-[#000000]/10 rounded-[10px] space-y-1.5 hover:border-[#000000]/30 transition-colors">
              <span className="font-mono-meta text-[10px] text-[#0055FF] font-bold">02 • FORENSICS</span>
              <h3 className="font-bold text-[15px] text-[#000000]">Image Forensics</h3>
              <p className="text-[13px] text-[#525252] leading-relaxed">
                Analyzes metadata and compression characteristics for potential editing or splicing markers.
              </p>
            </div>

            <div className="p-4 border border-[#000000]/10 rounded-[10px] space-y-1.5 hover:border-[#000000]/30 transition-colors">
              <span className="font-mono-meta text-[10px] text-[#0055FF] font-bold">03 • SIMILARITY</span>
              <h3 className="font-bold text-[15px] text-[#000000]">Similarity &amp; Duplicates</h3>
              <p className="text-[13px] text-[#525252] leading-relaxed">
                Compares evidence against past claims using perceptual hashing to flag reused images.
              </p>
            </div>

            <div className="p-4 border border-[#000000]/10 rounded-[10px] space-y-1.5 hover:border-[#000000]/30 transition-colors">
              <span className="font-mono-meta text-[10px] text-[#0055FF] font-bold">04 • OCR EXTRACTION</span>
              <h3 className="font-bold text-[15px] text-[#000000]">OCR &amp; Text Extraction</h3>
              <p className="text-[13px] text-[#525252] leading-relaxed">
                Extracts order numbers, dates, addresses, and product labels from packaging and receipts.
              </p>
            </div>

            <div className="p-4 border border-[#000000]/10 rounded-[10px] space-y-1.5 hover:border-[#000000]/30 transition-colors">
              <span className="font-mono-meta text-[10px] text-[#0055FF] font-bold">05 • ORDER CONTEXT</span>
              <h3 className="font-bold text-[15px] text-[#000000]">Order Verification</h3>
              <p className="text-[13px] text-[#525252] leading-relaxed">
                Cross-references extracted details against platform order records and delivery timestamps.
              </p>
            </div>

            <div className="p-4 border border-[#000000]/10 rounded-[10px] space-y-1.5 hover:border-[#000000]/30 transition-colors">
              <span className="font-mono-meta text-[10px] text-[#0055FF] font-bold">06 • BEHAVIOUR</span>
              <h3 className="font-bold text-[15px] text-[#000000]">Behaviour Signals</h3>
              <p className="text-[13px] text-[#525252] leading-relaxed">
                Identifies elevated claim activity and frequency anomalies across user accounts.
              </p>
            </div>

          </div>

          {/* Layer 7: Composite Output Banner */}
          <div className="p-4 border-2 border-[#000000] rounded-[10px] bg-[#FFFFFF] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono-meta text-[11px] text-[#0055FF] font-bold">LAYER 07</span>
                <span className="text-[15px] font-bold text-[#000000]">0–100 Verification Risk Assessment</span>
              </div>
              <p className="text-[13px] text-[#525252] mt-1">
                Combines available signals into Low (0–39), Medium (40–69), High (70–84), and Critical (85–100) triage bands.
              </p>
            </div>
            <div className="text-[12px] font-mono-meta text-[#737373] bg-[#000000]/5 px-3 py-1.5 rounded-[6px] shrink-0">
              DECISION-SUPPORT ONLY
            </div>
          </div>
        </section>

        {/* 5. WORKFLOW & EVIDENCE SEGREGATION */}
        <section className="border-t border-[#000000]/10 pt-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Workflow Pipeline */}
            <div className="p-5 border border-[#000000]/10 rounded-[12px] space-y-3">
              <span className="font-mono-meta text-[11px] text-[#0055FF]">REVIEW LIFECYCLE</span>
              <h3 className="font-headline text-[18px]">Claim to Decision Workflow</h3>
              <div className="flex items-center justify-between text-center font-mono-meta text-[10px] sm:text-[11px] text-[#000000] pt-2">
                <div className="p-2 border border-[#000000]/15 rounded bg-[#000000]/[0.02]">Claim</div>
                <span>→</span>
                <div className="p-2 border border-[#000000]/15 rounded bg-[#000000]/[0.02]">Evidence</div>
                <span>→</span>
                <div className="p-2 border border-[#000000]/15 rounded bg-[#000000]/[0.02]">Verify</div>
                <span>→</span>
                <div className="p-2 border border-[#000000]/15 rounded bg-[#000000]/[0.02]">Review</div>
                <span>→</span>
                <div className="p-2 border border-[#000000]/15 rounded bg-[#000000]/[0.02]">Decision</div>
              </div>
              <p className="text-[12px] text-[#737373] pt-1">
                TrustLens supports reviewers with structured evidence dossiers before any payout or rejection is executed.
              </p>
            </div>

            {/* Real vs Demo Evidence */}
            <div className="p-5 border border-[#000000]/10 rounded-[12px] space-y-3">
              <span className="font-mono-meta text-[11px] text-[#0055FF]">INPUT SEGREGATION</span>
              <h3 className="font-headline text-[18px]">Real vs Demo Evidence</h3>
              <div className="grid grid-cols-2 gap-3 pt-1 text-[13px]">
                <div className="p-3 border border-[#000000]/20 rounded-[8px]">
                  <span className="font-bold block text-[#000000]">Real Evidence</span>
                  <p className="text-[12px] text-[#737373] mt-1">Uploaded customer dispute media with SHA-256 integrity hash.</p>
                </div>
                <div className="p-3 border border-dashed border-[#000000]/25 rounded-[8px] bg-[#000000]/[0.02]">
                  <span className="font-bold block text-[#000000]">Demo Evidence</span>
                  <p className="text-[12px] text-[#737373] mt-1">Simulated sandbox cases for testing verification pipelines safely.</p>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* 6. CONSOLE ACCESS & ARCHITECTURE */}
        <section className="border-t border-[#000000]/10 pt-10 text-center space-y-5">
          <div className="space-y-2">
            <h2 className="font-headline text-3xl sm:text-4xl text-[#000000]">
              Your claims deserve more than a guess.
            </h2>
            <p className="text-[16px] text-[#525252] max-w-xl mx-auto">
              Give review teams the evidence and signals they need to make better decisions.
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/dashboard"
              className="inline-flex items-center px-7 py-3.5 bg-[#000000] text-[#FFFFFF] font-mono-meta text-[12px] rounded-full hover:bg-[#0055FF] transition-colors"
            >
              Launch Verification Console <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-[#737373] font-mono-meta text-[11px]">
            <span>Next.js + TypeScript</span>
            <span>•</span>
            <span>FastAPI Backend</span>
            <span>•</span>
            <span>PostgreSQL / Supabase</span>
            <span>•</span>
            <span>Multi-Signal Forensics</span>
          </div>
        </section>

      </main>

      {/* 7. RESTRAINED MINIMAL FOOTER */}
      <footer className="w-full border-t border-[#000000]/10 bg-[#FFFFFF] py-6 px-6 sm:px-12">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-[13px] text-[#737373]">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-[#000000]">TRUSTLENS AI</span>
            <span>·</span>
            <span>Evidence-First Claim Verification</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6">
            <Link href="/dashboard" className="hover:text-[#000000] transition-colors">Overview</Link>
            <Link href="/dashboard/claims" className="hover:text-[#000000] transition-colors">Claims</Link>
            <Link href="/dashboard/review-queue" className="hover:text-[#000000] transition-colors">Queue</Link>
            <Link href="/dashboard/evidence" className="hover:text-[#000000] transition-colors">Evidence</Link>
            <Link href="/dashboard/analytics" className="hover:text-[#000000] transition-colors">Analytics</Link>
            <Link href="/dashboard/settings" className="hover:text-[#000000] transition-colors">Settings</Link>
            <a 
              href="https://github.com/pv-srinivas1/TrustLens-AI" 
              target="_blank" 
              rel="noreferrer"
              className="hover:text-[#000000] transition-colors inline-flex items-center"
            >
              GitHub <ExternalLink className="w-3 h-3 ml-1 opacity-60" />
            </a>
          </div>

          <div className="font-mono-meta text-[11px] text-[#737373]/70">
            DECISION-SUPPORT PLATFORM
          </div>
        </div>
      </footer>

    </div>
  );
}
