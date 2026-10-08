"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { 
  ArrowUpRight, 
  ArrowRight, 
  ShieldCheck, 
  FileText, 
  Layers, 
  Cpu, 
  Search, 
  Upload, 
  Camera, 
  Sliders, 
  ExternalLink,
  ChevronRight,
  Database,
  Lock,
  CheckCircle2,
  Info
} from "lucide-react";

export default function TrustLensLandingPage() {
  const [cursorHovered, setCursorHovered] = useState(false);

  // Custom Interactive Difference Cursor with LERP interpolation
  const cursorRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: -100, y: -100 });
  const currentPos = useRef({ x: -100, y: -100 });

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener("mousemove", onMouseMove);

    let animationFrameId: number;
    const renderCursor = () => {
      const ease = 0.18;
      currentPos.current.x += (mousePos.current.x - currentPos.current.x) * ease;
      currentPos.current.y += (mousePos.current.y - currentPos.current.y) * ease;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${currentPos.current.x - 16}px, ${currentPos.current.y - 16}px, 0) scale(${cursorHovered ? 2.5 : 1})`;
      }

      animationFrameId = requestAnimationFrame(renderCursor);
    };

    animationFrameId = requestAnimationFrame(renderCursor);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest("a, button, [data-interactive='true']")) {
        setCursorHovered(true);
      } else {
        setCursorHovered(false);
      }
    };

    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      cancelAnimationFrame(animationFrameId);
    };
  }, [cursorHovered]);

  return (
    <div className="relative min-h-screen bg-[#FFFFFF] text-[#000000] font-sans selection:bg-[#0055FF] selection:text-[#FFFFFF] cursor-none overflow-x-hidden">
      
      {/* 1. CUSTOM DIFFERENCE CURSOR */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-[9999] bg-[#FFFFFF] border border-[#000000] transition-transform duration-200 ease-out"
        style={{
          mixBlendMode: "difference",
          willChange: "transform",
        }}
      />

      {/* GLOBAL STYLES & TYPOGRAPHY SPEC */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Space+Mono:ital,wght@0,400;0,700&display=swap');

        body {
          cursor: none !important;
          background-color: #FFFFFF;
          color: #000000;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        a, button {
          cursor: none !important;
        }

        .font-headline {
          font-family: 'Inter', sans-serif;
          font-weight: 700;
          letter-spacing: -0.05em;
          line-height: 0.95;
        }

        .font-body {
          font-family: 'Inter', sans-serif;
          font-weight: 400;
          letter-spacing: -0.02em;
          line-height: 1.5;
        }

        .font-mono-meta {
          font-family: 'Space Mono', monospace;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        /* Subtle smooth grayscale transition */
        .img-editorial {
          filter: grayscale(100%);
          transition: filter 700ms cubic-bezier(0.16, 1, 0.3, 1), transform 700ms cubic-bezier(0.16, 1, 0.3, 1);
        }

        .img-editorial:hover, .group:hover .img-editorial {
          filter: grayscale(0%);
          transform: scale(1.03);
        }
      `}</style>

      {/* 2. NAVIGATION HEADER */}
      <header className="sticky top-0 left-0 w-full z-50 bg-[#FFFFFF]/90 backdrop-blur-md border-b border-[#000000]/10 px-6 sm:px-12 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-3 group">
          <img 
            src="/logo.png" 
            alt="TrustLens AI Logo" 
            className="w-8 h-8 object-contain" 
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
          <div className="flex flex-col">
            <span className="font-headline text-[17px] tracking-tight text-[#000000] group-hover:text-[#0055FF] transition-colors">
              TRUSTLENS AI
            </span>
            <span className="font-mono-meta text-[9px] text-[#737373]">
              VERIFICATION ENGINE
            </span>
          </div>
        </Link>

        <nav className="flex items-center space-x-6 sm:space-x-8 text-[13px] font-medium">
          <Link 
            href="/dashboard" 
            className="hidden md:inline-block text-[#525252] hover:text-[#000000] hover:underline transition-colors"
          >
            Overview
          </Link>
          <Link 
            href="/dashboard/evidence" 
            className="hidden sm:inline-block text-[#525252] hover:text-[#000000] hover:underline transition-colors"
          >
            Evidence Explorer
          </Link>
          <Link 
            href="/dashboard/analytics" 
            className="hidden md:inline-block text-[#525252] hover:text-[#000000] hover:underline transition-colors"
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
      </header>

      {/* 3. HERO SECTION */}
      <section className="min-h-[75vh] flex flex-col items-center justify-center text-center px-6 pt-20 pb-16 max-w-5xl mx-auto">
        
        {/* Multimodal Verification Badge */}
        <div className="inline-flex items-center px-3.5 py-1 mb-6 rounded-full border border-[#0055FF]/30 bg-[#0055FF]/5 text-[#0055FF] font-mono-meta text-[11px]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#0055FF] mr-2" />
          MULTIMODAL EVIDENCE VERIFICATION
        </div>

        {/* Primary Headline */}
        <h1 className="font-headline text-5xl sm:text-7xl md:text-8xl tracking-tight text-[#000000] leading-[0.92]">
          See the Evidence.<br />
          <span className="text-[#0055FF]">Verify the Claim.</span>
        </h1>

        {/* Supporting Copy */}
        <p className="font-body text-[19px] sm:text-[22px] text-[#525252] mt-8 max-w-2xl mx-auto leading-normal">
          TrustLens AI analyzes claim evidence across multiple verification signals, helping commerce teams identify suspicious claims and route uncertain cases for human review.
        </p>
        <p className="font-mono-meta text-[12px] text-[#737373] mt-3">
          AI-powered claim and evidence verification for commerce platforms.
        </p>

        {/* Hero CTA Actions */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center px-7 py-3.5 bg-[#000000] text-[#FFFFFF] font-mono-meta text-[12px] rounded-full hover:bg-[#0055FF] transition-colors"
          >
            Launch Verification Console <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
          <Link
            href="/dashboard/evidence"
            className="inline-flex items-center px-7 py-3.5 border border-[#000000]/15 text-[#000000] font-mono-meta text-[12px] rounded-full hover:border-[#000000] hover:bg-[#000000]/5 transition-colors"
          >
            Explore Evidence
          </Link>
        </div>

        {/* Supporting Capability Badges */}
        <div className="mt-14 pt-8 border-t border-[#000000]/10 flex flex-wrap items-center justify-center gap-6 text-[#737373] font-mono-meta text-[11px]">
          <span>[ MULTI-SIGNAL ANALYSIS ]</span>
          <span>•</span>
          <span>[ HUMAN-IN-THE-LOOP WORKFLOW ]</span>
          <span>•</span>
          <span>[ DUPLICATE DETECTION ]</span>
          <span>•</span>
          <span>[ AUDIT-READY DOSSIERS ]</span>
        </div>
      </section>

      {/* 4. SECTION 01 — THE PROBLEM */}
      <section className="max-w-4xl mx-auto px-6 py-20 border-t border-[#000000]/10">
        <div className="space-y-4">
          <div className="font-mono-meta text-[12px] text-[#0055FF]">
            01 // THE CHALLENGE
          </div>
          <h2 className="font-headline text-3xl sm:text-5xl text-[#000000]">
            Why commerce teams need better claim verification
          </h2>
          <p className="font-body text-[17px] text-[#525252] leading-relaxed pt-2">
            Customers increasingly submit photos, receipts, screenshots, and other evidence when requesting refunds or reporting damaged or missing items.
          </p>
          <p className="font-body text-[17px] text-[#525252] leading-relaxed">
            Teams face a difficult balance:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-6 bg-[#FFFFFF] border border-[#000000]/10 rounded-[12px] space-y-2">
              <span className="font-mono-meta text-[11px] text-[#e11d48] font-bold block">
                RISK OF UNCHECKED CLAIMS
              </span>
              <p className="font-body text-[15px] text-[#000000] font-medium">
                Approve unsupported claims too quickly and losses increase.
              </p>
              <p className="text-[13px] text-[#737373] leading-relaxed">
                Recycled photos, online screenshots, and unverified missing item claims lead to unaccounted financial leakage when approved without review.
              </p>
            </div>

            <div className="p-6 bg-[#FFFFFF] border border-[#000000]/10 rounded-[12px] space-y-2">
              <span className="font-mono-meta text-[11px] text-[#e11d48] font-bold block">
                MANUAL TRIAGE BOTTLENECK
              </span>
              <p className="font-body text-[15px] text-[#000000] font-medium">
                Send every claim to manual review and support teams become overloaded.
              </p>
              <p className="text-[13px] text-[#737373] leading-relaxed">
                Human investigators spend valuable hours squinting at waybill photos, checking historical tickets, and creating customer friction on genuine requests.
              </p>
            </div>
          </div>

          <div className="p-5 bg-[#0055FF]/5 border border-[#0055FF]/20 rounded-[12px] text-[14px] text-[#000000] leading-relaxed mt-4">
            <strong>The TrustLens Approach:</strong> TrustLens AI is designed to add an evidence-verification layer between claim submission and final human decision.
          </div>
        </div>
      </section>

      {/* 5. SECTION 02 — THE SOLUTION & VERIFICATION LAYERS */}
      <section className="max-w-5xl mx-auto px-6 py-20 border-t border-[#000000]/10">
        <div className="space-y-4 mb-12">
          <div className="font-mono-meta text-[12px] text-[#0055FF]">
            02 // THE VERIFICATION STACK
          </div>
          <h2 className="font-headline text-3xl sm:text-5xl text-[#000000]">
            Evidence verification across multiple independent signals
          </h2>
          <p className="font-body text-[18px] text-[#525252] max-w-3xl leading-relaxed">
            TrustLens AI combines multiple evidence signals to produce a verification-risk assessment that helps reviewers make informed decisions.
          </p>
          <div className="inline-flex items-center text-[12px] text-[#737373] font-mono-meta pt-1">
            <Info className="w-3.5 h-3.5 mr-1.5 text-[#0055FF]" />
            C2PA verifies provenance assertions; it does not prove that a claim itself is truthful.
          </div>
        </div>

        {/* The 7 Verification Layers (Real Code Implementation Only) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Layer 1 */}
          <div className="p-6 bg-[#FFFFFF] border border-[#000000]/10 rounded-[14px] space-y-2 hover:border-[#000000]/30 transition-colors">
            <div className="flex items-center justify-between">
              <span className="font-mono-meta text-[11px] text-[#0055FF] font-bold">LAYER 01</span>
              <span className="text-[10px] font-mono-meta text-[#737373] bg-[#000000]/5 px-2 py-0.5 rounded">SUPPORTED FORMATS</span>
            </div>
            <h3 className="font-headline text-[20px] text-[#000000]">
              Provenance Verification
            </h3>
            <p className="font-body text-[14px] text-[#525252] leading-relaxed">
              Checks supported provenance information such as C2PA and available content-provenance signals.
            </p>
            <p className="text-[12px] text-[#737373] italic">
              Note: Provenance signals inspect asserted digital origin. They do not definitively prove whether an incident physically occurred.
            </p>
          </div>

          {/* Layer 2 */}
          <div className="p-6 bg-[#FFFFFF] border border-[#000000]/10 rounded-[14px] space-y-2 hover:border-[#000000]/30 transition-colors">
            <div className="flex items-center justify-between">
              <span className="font-mono-meta text-[11px] text-[#0055FF] font-bold">LAYER 02</span>
              <span className="text-[10px] font-mono-meta text-[#737373] bg-[#000000]/5 px-2 py-0.5 rounded">METADATA & FORENSICS</span>
            </div>
            <h3 className="font-headline text-[20px] text-[#000000]">
              Image Forensics
            </h3>
            <p className="font-body text-[14px] text-[#525252] leading-relaxed">
              Analyzes metadata and image characteristics for potential manipulation or editing indicators.
            </p>
            <p className="text-[12px] text-[#737373] italic">
              Note: Anomaly markers highlight compression or noise irregularities; they do not definitively prove an image is fake.
            </p>
          </div>

          {/* Layer 3 */}
          <div className="p-6 bg-[#FFFFFF] border border-[#000000]/10 rounded-[14px] space-y-2 hover:border-[#000000]/30 transition-colors">
            <div className="flex items-center justify-between">
              <span className="font-mono-meta text-[11px] text-[#0055FF] font-bold">LAYER 03</span>
              <span className="text-[10px] font-mono-meta text-[#737373] bg-[#000000]/5 px-2 py-0.5 rounded">PERCEPTUAL SIMILARITY</span>
            </div>
            <h3 className="font-headline text-[20px] text-[#000000]">
              Similarity &amp; Duplicate Detection
            </h3>
            <p className="font-body text-[14px] text-[#525252] leading-relaxed">
              Compares evidence against previously stored evidence to identify potentially reused or highly similar images across claims.
            </p>
            <p className="text-[12px] text-[#737373]">
              Flags identical perceptual hashes across different order IDs or user accounts.
            </p>
          </div>

          {/* Layer 4 */}
          <div className="p-6 bg-[#FFFFFF] border border-[#000000]/10 rounded-[14px] space-y-2 hover:border-[#000000]/30 transition-colors">
            <div className="flex items-center justify-between">
              <span className="font-mono-meta text-[11px] text-[#0055FF] font-bold">LAYER 04</span>
              <span className="text-[10px] font-mono-meta text-[#737373] bg-[#000000]/5 px-2 py-0.5 rounded">TEXT EXTRACTION</span>
            </div>
            <h3 className="font-headline text-[20px] text-[#000000]">
              OCR &amp; Evidence Extraction
            </h3>
            <p className="font-body text-[14px] text-[#525252] leading-relaxed">
              Extracts readable text such as order IDs, dates, product names, labels, and receipt information when available in uploaded media.
            </p>
            <p className="text-[12px] text-[#737373]">
              Matches shipping labels and restaurant packaging slips with claim documentation.
            </p>
          </div>

          {/* Layer 5 */}
          <div className="p-6 bg-[#FFFFFF] border border-[#000000]/10 rounded-[14px] space-y-2 hover:border-[#000000]/30 transition-colors">
            <div className="flex items-center justify-between">
              <span className="font-mono-meta text-[11px] text-[#0055FF] font-bold">LAYER 05</span>
              <span className="text-[10px] font-mono-meta text-[#737373] bg-[#000000]/5 px-2 py-0.5 rounded">CONTEXT MATCHING</span>
            </div>
            <h3 className="font-headline text-[20px] text-[#000000]">
              Order Verification
            </h3>
            <p className="font-body text-[14px] text-[#525252] leading-relaxed">
              Compares extracted evidence with order information available to the platform (such as delivery timestamps and merchant items).
            </p>
            <p className="text-[12px] text-[#737373]">
              Verifies whether claim details correspond to legitimate dispatch records.
            </p>
          </div>

          {/* Layer 6 */}
          <div className="p-6 bg-[#FFFFFF] border border-[#000000]/10 rounded-[14px] space-y-2 hover:border-[#000000]/30 transition-colors">
            <div className="flex items-center justify-between">
              <span className="font-mono-meta text-[11px] text-[#0055FF] font-bold">LAYER 06</span>
              <span className="text-[10px] font-mono-meta text-[#737373] bg-[#000000]/5 px-2 py-0.5 rounded">HISTORICAL PATTERNS</span>
            </div>
            <h3 className="font-headline text-[20px] text-[#000000]">
              Behaviour Signals
            </h3>
            <p className="font-body text-[14px] text-[#525252] leading-relaxed">
              Analyzes claim history and claim patterns to identify unusual activity without jumping to unverified conclusions.
            </p>
            <p className="text-[12px] text-[#737373]">
              Flags elevated claim frequency or submission velocity for human investigation.
            </p>
          </div>

          {/* Layer 7: Spans Full Width */}
          <div className="md:col-span-2 p-6 bg-[#FFFFFF] border-2 border-[#000000] rounded-[14px] space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono-meta text-[11px] text-[#0055FF] font-bold">LAYER 07 • COMPOSITE OUTPUT</span>
              <span className="text-[10px] font-mono-meta text-[#000000] bg-[#0055FF]/10 text-[#0055FF] px-2 py-0.5 rounded font-bold">DECISION SUPPORT</span>
            </div>
            <h3 className="font-headline text-[22px] text-[#000000]">
              Verification Risk Assessment (0–100 Score)
            </h3>
            <p className="font-body text-[15px] text-[#525252] leading-relaxed">
              Combines available signals into a verification-risk score from 0–100.
            </p>
            <p className="text-[13px] text-[#000000] font-medium bg-[#000000]/5 p-3 rounded-[8px]">
              "The score is a decision-support signal, not a definitive fraud determination. Final determinations remain with authorized review teams."
            </p>
          </div>

        </div>

        {/* Content Provenance Note */}
        <div className="mt-8 p-4 border border-[#000000]/10 rounded-[10px] text-[13px] text-[#525252] leading-relaxed flex items-start space-x-3">
          <Info className="w-4 h-4 text-[#0055FF] shrink-0 mt-0.5" />
          <div>
            <strong>Supported AI &amp; Content Provenance Signals:</strong> Where supported, TrustLens can inspect available provenance signals such as C2PA and SynthID. Absence of a signal does not prove that media was human-created. TrustLens does not claim to detect every synthetic image or infer model origin from pixels alone.
          </div>
        </div>
      </section>

      {/* 6. VERIFICATION RISK SCORE EXPLANATION */}
      <section className="max-w-4xl mx-auto px-6 py-16 border-t border-[#000000]/10">
        <div className="space-y-3 mb-8 text-center sm:text-left">
          <span className="font-mono-meta text-[12px] text-[#0055FF]">
            RISK SCORING FRAMEWORK
          </span>
          <h2 className="font-headline text-3xl sm:text-4xl text-[#000000]">
            Verification Risk Bands
          </h2>
          <p className="font-body text-[16px] text-[#525252]">
            TrustLens combines available evidence signals into a 0–100 risk score to prioritize reviewer workload:
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 border border-[#000000]/10 rounded-[10px] bg-[#FFFFFF]">
            <div className="font-mono-meta text-[11px] text-[#0d9488] font-bold">LOW RISK</div>
            <div className="font-headline text-2xl text-[#000000] mt-1">0–39</div>
            <p className="text-[12px] text-[#737373] mt-2">Consistent signals, matching order records.</p>
          </div>
          <div className="p-4 border border-[#000000]/10 rounded-[10px] bg-[#FFFFFF]">
            <div className="font-mono-meta text-[11px] text-[#eab308] font-bold">MEDIUM RISK</div>
            <div className="font-headline text-2xl text-[#000000] mt-1">40–69</div>
            <p className="text-[12px] text-[#737373] mt-2">Minor signal discrepancies or missing metadata.</p>
          </div>
          <div className="p-4 border border-[#000000]/10 rounded-[10px] bg-[#FFFFFF]">
            <div className="font-mono-meta text-[11px] text-[#f97316] font-bold">HIGH RISK</div>
            <div className="font-headline text-2xl text-[#000000] mt-1">70–84</div>
            <p className="text-[12px] text-[#737373] mt-2">Elevated anomalies; routed to priority review queue.</p>
          </div>
          <div className="p-4 border border-[#000000]/10 rounded-[10px] bg-[#FFFFFF]">
            <div className="font-mono-meta text-[11px] text-[#e11d48] font-bold">CRITICAL RISK</div>
            <div className="font-headline text-2xl text-[#000000] mt-1">85–100</div>
            <p className="text-[12px] text-[#737373] mt-2">Multiple high-impact anomalies; requires investigation.</p>
          </div>
        </div>

        <p className="font-mono-meta text-[12px] text-[#737373] mt-6 text-center sm:text-left">
          * Risk scores support review workflows and should not be treated as proof of fraudulent intent.
        </p>
      </section>

      {/* 7. PRODUCT WORKFLOW SECTION */}
      <section className="max-w-4xl mx-auto px-6 py-20 border-t border-[#000000]/10">
        <div className="space-y-4 mb-10">
          <span className="font-mono-meta text-[12px] text-[#0055FF]">
            THE PROCESS
          </span>
          <h2 className="font-headline text-3xl sm:text-4xl text-[#000000]">
            Structured Human-in-the-Loop Workflow
          </h2>
          <p className="font-body text-[16px] text-[#525252]">
            TrustLens does not replace the final decision-maker. It gives review teams structured evidence and verification signals before action is taken.
          </p>
        </div>

        {/* Workflow Diagram */}
        <div className="p-6 bg-[#FFFFFF] border border-[#000000]/15 rounded-[14px]">
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 text-center">
            {[
              { step: "01", name: "Claim", desc: "Ticket created" },
              { step: "02", name: "Evidence", desc: "Photo / media ingest" },
              { step: "03", name: "Verification", desc: "Multi-signal extraction" },
              { step: "04", name: "Risk Score", desc: "0–100 assessment" },
              { step: "05", name: "Human Review", desc: "Reviewer inspection" },
              { step: "06", name: "Decision", desc: "Action & audit log" },
            ].map((node, i) => (
              <div key={node.step} className="p-3 bg-[#000000]/[0.02] border border-[#000000]/10 rounded-[8px] flex flex-col justify-between">
                <span className="font-mono-meta text-[10px] text-[#0055FF]">{node.step}</span>
                <span className="font-headline text-[15px] text-[#000000] my-1">{node.name}</span>
                <span className="text-[11px] text-[#737373]">{node.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. REAL EVIDENCE VS DEMO EVIDENCE (INPUT HANDLING) */}
      <section className="max-w-5xl mx-auto px-6 py-20 border-t border-[#000000]/10">
        <div className="space-y-3 mb-10">
          <span className="font-mono-meta text-[12px] text-[#0055FF]">
            INPUT CHANNELS
          </span>
          <h2 className="font-headline text-3xl sm:text-4xl text-[#000000]">
            Supported Evidence Input
          </h2>
          <p className="font-body text-[16px] text-[#525252]">
            TrustLens clearly distinguishes between production submissions and demonstrative sandbox records:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 border-2 border-[#000000] rounded-[14px] bg-[#FFFFFF] space-y-3">
            <div className="flex items-center space-x-2">
              <Upload className="w-5 h-5 text-[#0055FF]" />
              <span className="font-headline text-[18px]">REAL EVIDENCE</span>
            </div>
            <p className="text-[14px] text-[#525252] leading-relaxed">
              User uploaded or camera-captured evidence submitted during dispute filing.
            </p>
            <ul className="text-[13px] text-[#737373] space-y-1.5 font-mono-meta">
              <li>• Direct customer photo upload (JPEG, PNG, HEIC)</li>
              <li>• Courier camera capture at point of handover</li>
              <li>• SHA-256 integrity hash generated upon receipt</li>
              <li>• Stored securely with audit trail</li>
            </ul>
          </div>

          <div className="p-6 border border-[#000000]/20 rounded-[14px] bg-[#000000]/[0.02] space-y-3">
            <div className="flex items-center space-x-2">
              <Sliders className="w-5 h-5 text-[#737373]" />
              <span className="font-headline text-[18px]">DEMO EVIDENCE</span>
            </div>
            <p className="text-[14px] text-[#525252] leading-relaxed">
              Curated scenarios used to demonstrate the TrustLens verification workflow in sandbox mode.
            </p>
            <ul className="text-[13px] text-[#737373] space-y-1.5 font-mono-meta">
              <li>• Sample food spillage scenarios</li>
              <li>• Sample package crush and tear scenarios</li>
              <li>• Sample resealed box scenarios</li>
              <li>• Can be safely purged without affecting real data</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 9. EVIDENCE EXPLORER & RISK ANALYTICS PREVIEWS */}
      <section className="max-w-5xl mx-auto px-6 py-20 border-t border-[#000000]/10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Evidence Explorer Box */}
          <div className="p-8 border border-[#000000]/10 rounded-[16px] bg-[#FFFFFF] flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <span className="font-mono-meta text-[11px] text-[#0055FF]">SINGLE INVESTIGATION VIEW</span>
              <h3 className="font-headline text-2xl text-[#000000]">
                Evidence Explorer
              </h3>
              <p className="font-body text-[15px] text-[#525252] leading-relaxed">
                Inspect evidence, verification signals, similarity results, extracted text, and claim context from a single investigation view.
              </p>
            </div>
            <Link
              href="/dashboard/evidence"
              className="inline-flex items-center text-[13px] font-mono-meta font-bold text-[#0055FF] hover:underline"
            >
              Explore Evidence <ArrowRight className="w-4 h-4 ml-1.5" />
            </Link>
          </div>

          {/* Risk Analytics Box */}
          <div className="p-8 border border-[#000000]/10 rounded-[16px] bg-[#FFFFFF] flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <span className="font-mono-meta text-[11px] text-[#0055FF]">ORGANIZATION INTELLIGENCE</span>
              <h3 className="font-headline text-2xl text-[#000000]">
                Risk Analytics
              </h3>
              <p className="font-body text-[15px] text-[#525252] leading-relaxed">
                Understand verification trends, risk distribution, recurring signals, and review outcomes across your claims inside the console.
              </p>
            </div>
            <Link
              href="/dashboard/analytics"
              className="inline-flex items-center text-[13px] font-mono-meta font-bold text-[#0055FF] hover:underline"
            >
              View Risk Analytics <ArrowRight className="w-4 h-4 ml-1.5" />
            </Link>
          </div>

        </div>
      </section>

      {/* 10. TECHNICAL ARCHITECTURE SECTION (REAL STACK ONLY) */}
      <section className="max-w-4xl mx-auto px-6 py-20 border-t border-[#000000]/10">
        <div className="space-y-3 mb-10 text-center sm:text-left">
          <span className="font-mono-meta text-[12px] text-[#0055FF]">
            ARCHITECTURE
          </span>
          <h2 className="font-headline text-3xl sm:text-4xl text-[#000000]">
            Built for evidence-first verification
          </h2>
          <p className="font-body text-[16px] text-[#525252]">
            Technologies deployed across the TrustLens verification infrastructure:
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="p-4 border border-[#000000]/10 rounded-[10px]">
            <div className="font-mono-meta text-[10px] text-[#737373]">FRONTEND</div>
            <div className="font-bold text-[15px] text-[#000000] mt-1">Next.js + TypeScript</div>
          </div>
          <div className="p-4 border border-[#000000]/10 rounded-[10px]">
            <div className="font-mono-meta text-[10px] text-[#737373]">API SERVICE</div>
            <div className="font-bold text-[15px] text-[#000000] mt-1">FastAPI (Python)</div>
          </div>
          <div className="p-4 border border-[#000000]/10 rounded-[10px]">
            <div className="font-mono-meta text-[10px] text-[#737373]">DATABASE</div>
            <div className="font-bold text-[15px] text-[#000000] mt-1">PostgreSQL / Supabase</div>
          </div>
          <div className="p-4 border border-[#000000]/10 rounded-[10px]">
            <div className="font-mono-meta text-[10px] text-[#737373]">STORAGE</div>
            <div className="font-bold text-[15px] text-[#000000] mt-1">Supabase Storage</div>
          </div>
          <div className="p-4 border border-[#000000]/10 rounded-[10px]">
            <div className="font-mono-meta text-[10px] text-[#737373]">PROCESSING</div>
            <div className="font-bold text-[15px] text-[#000000] mt-1">Verification Pipeline</div>
          </div>
          <div className="p-4 border border-[#000000]/10 rounded-[10px]">
            <div className="font-mono-meta text-[10px] text-[#737373]">ANALYSIS LAYERS</div>
            <div className="font-bold text-[15px] text-[#000000] mt-1">Provenance + OCR + Hashes</div>
          </div>
        </div>
      </section>

      {/* 11. FINAL CTA SECTION */}
      <section className="max-w-4xl mx-auto px-6 py-24 border-t border-[#000000]/10 text-center space-y-6">
        <h2 className="font-headline text-4xl sm:text-6xl text-[#000000]">
          Your claims deserve more than a guess.
        </h2>
        <p className="font-body text-[19px] sm:text-[22px] text-[#525252] max-w-xl mx-auto">
          Give review teams the evidence they need to make better decisions.
        </p>
        <div className="pt-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center px-8 py-4 bg-[#000000] text-[#FFFFFF] font-mono-meta text-[13px] rounded-full hover:bg-[#0055FF] transition-colors"
          >
            Launch Verification Console <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </section>

      {/* 12. HIGH-CONTRAST DARK FOOTER */}
      <footer className="w-full bg-[#0A0A0A] text-[#FFFFFF] pt-16 pb-12 px-6 sm:px-12 md:px-24">
        <div className="max-w-6xl mx-auto">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 pb-16">
            
            {/* Column 1-2: Brand Information */}
            <div className="md:col-span-2 space-y-4 pr-6">
              <span className="text-[22px] font-bold tracking-tight text-[#FFFFFF]">
                TRUSTLENS AI
              </span>
              <p className="font-body text-[14px] text-[#737373] max-w-md leading-relaxed">
                AI-powered claim and evidence verification for commerce platforms. Analyzes uploaded claim evidence using provenance, image forensics, similarity, OCR, order context, and behavioural signals.
              </p>
              <div className="pt-2">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center px-5 py-2.5 bg-[#FFFFFF] text-[#0A0A0A] font-mono-meta text-[11px] rounded-full hover:bg-neutral-200 transition-colors"
                >
                  ENTER CONSOLE [↗]
                </Link>
              </div>
            </div>

            {/* Column 3: Platform Navigation */}
            <div className="space-y-3">
              <div className="font-mono-meta text-[12px] text-[#737373]">
                PLATFORM
              </div>
              <ul className="space-y-2 text-[14px] font-body">
                <li>
                  <Link href="/dashboard" className="hover:text-[#FFFFFF] text-[#737373] transition-colors">
                    Overview
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/claims" className="hover:text-[#FFFFFF] text-[#737373] transition-colors">
                    Claims Management
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/evidence" className="hover:text-[#FFFFFF] text-[#737373] transition-colors">
                    Evidence Explorer
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/analytics" className="hover:text-[#FFFFFF] text-[#737373] transition-colors">
                    Risk Analytics
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4: Resources */}
            <div className="space-y-3">
              <div className="font-mono-meta text-[12px] text-[#737373]">
                RESOURCES
              </div>
              <ul className="space-y-2 text-[14px] font-body">
                <li>
                  <a 
                    href="https://github.com/pv-srinivas1/TrustLens-AI" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="hover:text-[#FFFFFF] text-[#737373] transition-colors inline-flex items-center"
                  >
                    GitHub Repository <ExternalLink className="w-3 h-3 ml-1.5 opacity-50" />
                  </a>
                </li>
                <li>
                  <Link href="/dashboard/settings" className="hover:text-[#FFFFFF] text-[#737373] transition-colors">
                    Risk Engine Settings
                  </Link>
                </li>
                <li>
                  <span className="text-[#525252] text-[13px]">
                    FastAPI v2.4 Backend
                  </span>
                </li>
              </ul>
            </div>

          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono-meta text-[12px] text-[#737373]">
            <div>
              © 2026 TRUSTLENS AI • ALL RIGHTS RESERVED
            </div>
            <div className="flex items-center space-x-6 text-[11px]">
              <span>EVIDENCE-FIRST VERIFICATION</span>
              <span>•</span>
              <span>DECISION-SUPPORT PLATFORM</span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
