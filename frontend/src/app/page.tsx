"use client";

import { useState, useEffect } from "react";
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

  // Lock body scroll when mobile menu is open and listen for ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileMenuOpen]);

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#000000] font-sans selection:bg-[#0055FF] selection:text-[#FFFFFF] overflow-x-hidden flex flex-col justify-between">
      
      {/* GLOBAL STYLES & TYPOGRAPHY SPEC */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Space+Mono:wght@400;700&display=swap');

        body {
          background-color: #FFFFFF;
          color: #000000;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        .font-headline {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          font-weight: 800;
          letter-spacing: -0.04em;
          line-height: 1.0;
        }

        .font-mono-meta {
          font-family: 'Space Mono', monospace;
          font-size: 12px;
          letter-spacing: 0.04em;
        }
      `}</style>

      {/* 1. NAVIGATION HEADER (56-64px height, safe padding, 36-44px logo) */}
      <header className="sticky top-0 left-0 w-full z-50 bg-[#FFFFFF]/95 backdrop-blur-md border-b border-[#000000]/10 px-4 sm:px-8 md:px-12 h-14 sm:h-16 flex items-center justify-between">
        
        {/* Brand Link with 36-44px Navbar Logo */}
        <Link href="/" className="flex items-center space-x-3 group">
          <img 
            src="/logo.png" 
            alt="TrustLens AI Logo" 
            className="w-10 h-10 sm:w-11 sm:h-11 object-contain transition-transform group-hover:scale-105" 
          />
          <div className="flex flex-col">
            <span className="font-headline text-[16px] sm:text-[18px] tracking-tight text-[#000000] group-hover:text-[#0055FF] transition-colors">
              TRUSTLENS AI
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

        {/* Mobile Hamburger Button with >= 44x44px touch target */}
        <div className="flex md:hidden items-center space-x-2">
          <Link
            href="/dashboard"
            className="inline-flex items-center px-3 py-1.5 bg-[#000000] text-[#FFFFFF] font-mono-meta text-[11px] rounded-full hover:bg-[#0055FF] transition-colors"
          >
            Console
          </Link>
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="w-11 h-11 flex items-center justify-center border-2 border-[#000000]/15 rounded-[10px] bg-white text-[#000000] hover:bg-[#000000]/5 transition-colors focus:outline-none focus:ring-2 focus:ring-[#000000]"
            aria-label="Open navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* MOBILE SLIDE-IN DRAWER & BACKDROP */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex" role="dialog" aria-modal="true">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-200" 
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer */}
          <div className="relative w-[280px] max-w-[85vw] h-full bg-[#FFFFFF] z-10 flex flex-col justify-between p-5 border-r border-[#000000]/15 shadow-2xl transition-transform duration-200 ease-out transform translate-x-0">
            <div className="space-y-5">
              {/* Drawer Header with Close Button */}
              <div className="flex items-center justify-between pb-3 border-b border-[#000000]/10">
                <div className="flex items-center space-x-2.5">
                  <img src="/logo.png" alt="TrustLens AI" className="w-8 h-8 object-contain" />
                  <span className="font-headline text-[16px] text-[#000000]">TrustLens AI</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-10 h-10 flex items-center justify-center border border-[#000000]/20 rounded-[8px] bg-neutral-100 text-[#000000] hover:bg-neutral-200 transition-colors"
                  aria-label="Close navigation menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Links */}
              <div className="space-y-1.5">
                <div className="font-mono-meta text-[10px] text-[#0055FF] font-bold uppercase mb-2">
                  NAVIGATION
                </div>
                {[
                  { name: "Overview", href: "/dashboard", icon: Grid },
                  { name: "Evidence Explorer", href: "/dashboard/evidence", icon: Layers },
                  { name: "Risk Analytics", href: "/dashboard/analytics", icon: ShieldAlert },
                  { name: "Claims Management", href: "/dashboard/claims", icon: FileText },
                  { name: "Review Queue", href: "/dashboard/review-queue", icon: CheckSquare },
                  { name: "Platform Settings", href: "/dashboard/settings", icon: Settings },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-3 p-3 min-h-[44px] rounded-[10px] border border-transparent hover:border-[#000000]/20 hover:bg-[#000000]/5 text-[14px] font-semibold text-[#000000] transition-colors"
                  >
                    <item.icon className="w-4 h-4 text-[#0055FF] shrink-0" />
                    <span>{item.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Drawer Bottom CTA */}
            <div className="pt-4 border-t border-[#000000]/10 space-y-2">
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center py-3 min-h-[44px] bg-[#000000] text-[#FFFFFF] font-mono-meta text-[12px] rounded-full hover:bg-[#0055FF] transition-colors"
              >
                Enter Dashboard <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
              <p className="text-center font-mono-meta text-[10px] text-[#737373]">
                Evidence-First Claim Verification
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 2. COMPACT HERO SECTION WITH SUBSTANTIALLY BIGGER LOGO */}
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-8 md:px-12 py-10 sm:py-16 space-y-12 sm:space-y-16 w-full min-w-0">
        
        <section className="text-center space-y-5 sm:space-y-6 max-w-3xl mx-auto w-full">
          {/* 1. SUBSTANTIALLY BIGGER HERO LOGO: 110-130px mobile, 150-180px desktop, up to 185-200px on large desktop */}
          <div className="flex justify-center pb-2 pt-1">
            <img 
              src="/logo.png" 
              alt="TrustLens AI Brand Logo" 
              className="w-[120px] sm:w-[145px] md:w-[170px] lg:w-[185px] h-auto max-w-full object-contain transition-transform hover:scale-105 duration-300 drop-shadow-sm select-none" 
            />
          </div>

          {/* 2. CRISP BADGE */}
          <div className="inline-flex items-center px-3.5 py-1.5 rounded-full border border-[#0055FF]/30 bg-[#0055FF]/5 text-[#0055FF] font-mono-meta text-[10px] sm:text-[11px] font-semibold max-w-full tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0055FF] mr-2 shrink-0 animate-pulse" />
            <span className="truncate">MULTIMODAL EVIDENCE VERIFICATION ENGINE</span>
          </div>

          {/* 3. BOLD, SHARP, MODERN SANS-SERIF HEADLINE (Weight 800, clamp 40-72px, no blur) */}
          <h1 className="font-headline font-extrabold text-[40px] sm:text-[52px] md:text-[66px] lg:text-[72px] text-[#000000] tracking-tight leading-[1.0] select-text">
            See the Evidence.<br />
            <span className="text-[#0055FF]">Verify the Claim.</span>
          </h1>

          {/* 4. PROFESSIONAL CRISP PARAGRAPH (17-20px desktop, 15-17px mobile, weight 500, line-height 1.6) */}
          <p className="text-[15px] sm:text-[17px] md:text-[19px] font-medium text-[#111111] max-w-2xl mx-auto leading-[1.6] px-1 opacity-100">
            TrustLens AI analyzes claim evidence across multiple verification signals, helping commerce teams identify suspicious claims and route uncertain cases for human review.
          </p>

          <p className="font-mono-meta text-[11px] sm:text-[12px] text-[#555555] font-medium">
            AI-powered claim and evidence verification for commerce platforms.
          </p>

          {/* 5. CRISP BUTTONS (Font-weight 600-700, >= 44px touch targets) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3 w-full max-w-md mx-auto sm:max-w-none">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3.5 min-h-[46px] bg-[#000000] text-[#FFFFFF] font-sans font-bold text-[13px] tracking-wide rounded-full hover:bg-[#0055FF] active:scale-[0.98] transition-all shadow-sm"
            >
              Launch Verification Console <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
            <Link
              href="/dashboard/claims"
              className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3.5 min-h-[46px] border-2 border-[#000000] text-[#000000] font-sans font-bold text-[13px] tracking-wide rounded-full hover:bg-[#000000] hover:text-[#FFFFFF] active:scale-[0.98] transition-all"
            >
              Browse Active Claims
            </Link>
          </div>
        </section>

        {/* 3. THE PROBLEM & APPROACH (1-col on mobile, 3-col on desktop) */}
        <section className="border-t border-[#000000]/10 pt-8 sm:pt-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            <div className="space-y-2 p-4 sm:p-0 bg-neutral-50 sm:bg-transparent rounded-[10px]">
              <span className="font-mono-meta text-[10px] sm:text-[11px] text-[#0055FF]">01 // THE CHALLENGE</span>
              <h2 className="font-headline text-[18px] sm:text-[20px] text-[#000000]">
                Why claim verification matters
              </h2>
              <p className="text-[13px] sm:text-[14px] text-[#525252] leading-relaxed">
                Customers submit photos, receipts, and screenshots for refund requests. Teams struggle between automated payouts causing loss, and manual triage overwhelming support teams.
              </p>
            </div>

            <div className="space-y-2 p-4 sm:p-0 bg-neutral-50 sm:bg-transparent rounded-[10px]">
              <span className="font-mono-meta text-[10px] sm:text-[11px] text-[#0055FF]">02 // THE SOLUTION</span>
              <h2 className="font-headline text-[18px] sm:text-[20px] text-[#000000]">
                Multi-signal risk assessment
              </h2>
              <p className="text-[13px] sm:text-[14px] text-[#525252] leading-relaxed">
                TrustLens combines independent evidence signals—provenance, forensics, duplicate hashes, and OCR—to calculate a 0–100 risk assessment that informs human reviewers.
              </p>
            </div>

            <div className="space-y-2 p-4 sm:p-0 bg-neutral-50 sm:bg-transparent rounded-[10px]">
              <span className="font-mono-meta text-[10px] sm:text-[11px] text-[#0055FF]">03 // HUMAN-IN-THE-LOOP</span>
              <h2 className="font-headline text-[18px] sm:text-[20px] text-[#000000]">
                Decision-support workflow
              </h2>
              <p className="text-[13px] sm:text-[14px] text-[#525252] leading-relaxed">
                TrustLens does not replace human reviewers. It provides structured dossiers and anomaly alerts so investigators can make fast, audit-ready decisions.
              </p>
            </div>
          </div>
        </section>

        {/* 4. REAL CAPABILITIES (1-col mobile, 2-col tablet, 3-col desktop) */}
        <section className="border-t border-[#000000]/10 pt-8 sm:pt-10 space-y-5 sm:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-1 sm:gap-2">
            <div>
              <span className="font-mono-meta text-[10px] sm:text-[11px] text-[#0055FF]">REAL PRODUCT CAPABILITIES</span>
              <h2 className="font-headline text-xl sm:text-2xl md:text-3xl text-[#000000]">
                Evidence Verification Signals
              </h2>
            </div>
            <p className="font-mono-meta text-[10px] sm:text-[11px] text-[#737373]">
              * C2PA verifies assertions, not claim truthfulness.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-4">
            
            <div className="p-4 border border-[#000000]/10 rounded-[10px] space-y-1.5 hover:border-[#000000]/30 transition-colors">
              <span className="font-mono-meta text-[10px] text-[#0055FF] font-bold">01 • PROVENANCE</span>
              <h3 className="font-bold text-[14px] sm:text-[15px] text-[#000000]">Provenance Verification</h3>
              <p className="text-[12px] sm:text-[13px] text-[#525252] leading-relaxed">
                Inspects C2PA and available content-provenance metadata when present in file manifests.
              </p>
            </div>

            <div className="p-4 border border-[#000000]/10 rounded-[10px] space-y-1.5 hover:border-[#000000]/30 transition-colors">
              <span className="font-mono-meta text-[10px] text-[#0055FF] font-bold">02 • FORENSICS</span>
              <h3 className="font-bold text-[14px] sm:text-[15px] text-[#000000]">Image Forensics</h3>
              <p className="text-[12px] sm:text-[13px] text-[#525252] leading-relaxed">
                Analyzes metadata and compression characteristics for potential editing or splicing markers.
              </p>
            </div>

            <div className="p-4 border border-[#000000]/10 rounded-[10px] space-y-1.5 hover:border-[#000000]/30 transition-colors">
              <span className="font-mono-meta text-[10px] text-[#0055FF] font-bold">03 • SIMILARITY</span>
              <h3 className="font-bold text-[14px] sm:text-[15px] text-[#000000]">Similarity &amp; Duplicates</h3>
              <p className="text-[12px] sm:text-[13px] text-[#525252] leading-relaxed">
                Compares evidence against past claims using perceptual hashing to flag reused images.
              </p>
            </div>

            <div className="p-4 border border-[#000000]/10 rounded-[10px] space-y-1.5 hover:border-[#000000]/30 transition-colors">
              <span className="font-mono-meta text-[10px] text-[#0055FF] font-bold">04 • OCR EXTRACTION</span>
              <h3 className="font-bold text-[14px] sm:text-[15px] text-[#000000]">OCR &amp; Text Extraction</h3>
              <p className="text-[12px] sm:text-[13px] text-[#525252] leading-relaxed">
                Extracts order numbers, dates, addresses, and product labels from packaging and receipts.
              </p>
            </div>

            <div className="p-4 border border-[#000000]/10 rounded-[10px] space-y-1.5 hover:border-[#000000]/30 transition-colors">
              <span className="font-mono-meta text-[10px] text-[#0055FF] font-bold">05 • ORDER CONTEXT</span>
              <h3 className="font-bold text-[14px] sm:text-[15px] text-[#000000]">Order Verification</h3>
              <p className="text-[12px] sm:text-[13px] text-[#525252] leading-relaxed">
                Cross-references extracted details against platform order records and delivery timestamps.
              </p>
            </div>

            <div className="p-4 border border-[#000000]/10 rounded-[10px] space-y-1.5 hover:border-[#000000]/30 transition-colors">
              <span className="font-mono-meta text-[10px] text-[#0055FF] font-bold">06 • BEHAVIOUR</span>
              <h3 className="font-bold text-[14px] sm:text-[15px] text-[#000000]">Behaviour Signals</h3>
              <p className="text-[12px] sm:text-[13px] text-[#525252] leading-relaxed">
                Identifies elevated claim activity and frequency anomalies across user accounts.
              </p>
            </div>

          </div>

          {/* Layer 7: Composite Output Banner */}
          <div className="p-4 border-2 border-[#000000] rounded-[10px] bg-[#FFFFFF] flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono-meta text-[10px] sm:text-[11px] text-[#0055FF] font-bold">LAYER 07</span>
                <span className="text-[14px] sm:text-[15px] font-bold text-[#000000]">0–100 Verification Risk Assessment</span>
              </div>
              <p className="text-[12px] sm:text-[13px] text-[#525252] mt-1">
                Combines available signals into Low (0–39), Medium (40–69), High (70–84), and Critical (85–100) triage bands.
              </p>
            </div>
            <div className="text-[11px] font-mono-meta text-[#737373] bg-[#000000]/5 px-3 py-1.5 rounded-[6px] shrink-0 self-start sm:self-auto">
              DECISION-SUPPORT ONLY
            </div>
          </div>
        </section>

        {/* 5. WORKFLOW & EVIDENCE SEGREGATION */}
        <section className="border-t border-[#000000]/10 pt-8 sm:pt-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            
            {/* Workflow Pipeline */}
            <div className="p-4 sm:p-5 border border-[#000000]/10 rounded-[12px] space-y-3">
              <span className="font-mono-meta text-[10px] sm:text-[11px] text-[#0055FF]">REVIEW LIFECYCLE</span>
              <h3 className="font-headline text-[17px] sm:text-[18px]">Claim to Decision Workflow</h3>
              <div className="flex items-center justify-between text-center font-mono-meta text-[9px] sm:text-[11px] text-[#000000] pt-2 overflow-x-auto pb-1">
                <div className="p-1.5 sm:p-2 border border-[#000000]/15 rounded bg-[#000000]/[0.02] shrink-0">Claim</div>
                <span className="px-1 text-[#737373]">→</span>
                <div className="p-1.5 sm:p-2 border border-[#000000]/15 rounded bg-[#000000]/[0.02] shrink-0">Evidence</div>
                <span className="px-1 text-[#737373]">→</span>
                <div className="p-1.5 sm:p-2 border border-[#000000]/15 rounded bg-[#000000]/[0.02] shrink-0">Verify</div>
                <span className="px-1 text-[#737373]">→</span>
                <div className="p-1.5 sm:p-2 border border-[#000000]/15 rounded bg-[#000000]/[0.02] shrink-0">Review</div>
                <span className="px-1 text-[#737373]">→</span>
                <div className="p-1.5 sm:p-2 border border-[#000000]/15 rounded bg-[#000000]/[0.02] shrink-0">Decision</div>
              </div>
              <p className="text-[12px] text-[#737373] pt-1">
                TrustLens supports reviewers with structured evidence dossiers before any payout or rejection is executed.
              </p>
            </div>

            {/* Real vs Demo Evidence */}
            <div className="p-4 sm:p-5 border border-[#000000]/10 rounded-[12px] space-y-3">
              <span className="font-mono-meta text-[10px] sm:text-[11px] text-[#0055FF]">INPUT SEGREGATION</span>
              <h3 className="font-headline text-[17px] sm:text-[18px]">Real vs Demo Evidence</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-[13px]">
                <div className="p-3 border border-[#000000]/20 rounded-[8px]">
                  <span className="font-bold block text-[#000000]">Real Evidence</span>
                  <p className="text-[11px] sm:text-[12px] text-[#737373] mt-1">Uploaded customer dispute media with SHA-256 integrity hash.</p>
                </div>
                <div className="p-3 border border-dashed border-[#000000]/25 rounded-[8px] bg-[#000000]/[0.02]">
                  <span className="font-bold block text-[#000000]">Demo Evidence</span>
                  <p className="text-[11px] sm:text-[12px] text-[#737373] mt-1">Simulated sandbox cases for testing verification pipelines safely.</p>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* 6. CONSOLE ACCESS & ARCHITECTURE */}
        <section className="border-t border-[#000000]/10 pt-8 sm:pt-10 text-center space-y-4 sm:space-y-5">
          <div className="space-y-2">
            <h2 className="font-headline text-2xl sm:text-3xl md:text-4xl text-[#000000]">
              Your claims deserve more than a guess.
            </h2>
            <p className="text-[14px] sm:text-[16px] text-[#525252] max-w-xl mx-auto">
              Give review teams the evidence and signals they need to make better decisions.
            </p>
          </div>

          <div className="pt-1">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3.5 min-h-[44px] bg-[#000000] text-[#FFFFFF] font-mono-meta text-[12px] rounded-full hover:bg-[#0055FF] transition-colors"
            >
              Launch Verification Console <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>

          <div className="pt-3 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-[#737373] font-mono-meta text-[10px] sm:text-[11px]">
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
      <footer className="w-full border-t border-[#000000]/10 bg-[#FFFFFF] py-6 px-4 sm:px-8 md:px-12">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-[12px] sm:text-[13px] text-[#737373] text-center sm:text-left">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-[#000000]">TRUSTLENS AI</span>
            <span>·</span>
            <span>Evidence Verification</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <Link href="/dashboard" className="hover:text-[#000000] transition-colors min-h-[32px] inline-flex items-center">Overview</Link>
            <Link href="/dashboard/claims" className="hover:text-[#000000] transition-colors min-h-[32px] inline-flex items-center">Claims</Link>
            <Link href="/dashboard/review-queue" className="hover:text-[#000000] transition-colors min-h-[32px] inline-flex items-center">Queue</Link>
            <Link href="/dashboard/evidence" className="hover:text-[#000000] transition-colors min-h-[32px] inline-flex items-center">Evidence</Link>
            <Link href="/dashboard/analytics" className="hover:text-[#000000] transition-colors min-h-[32px] inline-flex items-center">Analytics</Link>
            <Link href="/dashboard/settings" className="hover:text-[#000000] transition-colors min-h-[32px] inline-flex items-center">Settings</Link>
            <a 
              href="https://github.com/pv-srinivas1/TrustLens-AI" 
              target="_blank" 
              rel="noreferrer"
              className="hover:text-[#000000] transition-colors inline-flex items-center min-h-[32px]"
            >
              GitHub <ExternalLink className="w-3 h-3 ml-1 opacity-60" />
            </a>
          </div>

          <div className="font-mono-meta text-[10px] text-[#737373]/70">
            DECISION-SUPPORT PLATFORM
          </div>
        </div>
      </footer>

    </div>
  );
}
