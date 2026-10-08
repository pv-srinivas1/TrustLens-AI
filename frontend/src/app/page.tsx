"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Plus, X, ArrowRight, ShieldCheck, Layers, ExternalLink } from "lucide-react";

interface MarqueeCard {
  id: string;
  title: string;
  tag: string;
  image: string;
  radiusClass: string;
}

interface ProjectItem {
  id: string;
  title: string;
  category: string;
  year: string;
  image: string;
  href: string;
}

const MARQUEE_CARDS: MarqueeCard[] = [
  {
    id: "m1",
    title: "SPILLED MEAL FORENSICS",
    tag: "TAMPER DETECTED",
    image: "/demo-evidence/damaged-food-01.jpg",
    radiusClass: "rounded-tl-[100px] rounded-br-[20px] rounded-tr-[12px] rounded-bl-[12px]",
  },
  {
    id: "m2",
    title: "CRUSHED SHIPMENT CARTON",
    tag: "HARDWARE PROVENANCE",
    image: "/demo-evidence/damaged-package-01.jpg",
    radiusClass: "rounded-tr-[100px] rounded-bl-[40px] rounded-tl-[12px] rounded-br-[12px]",
  },
  {
    id: "m3",
    title: "RESEALED INNER PACKAGING",
    tag: "SYNTHETIC AI ANOMALY",
    image: "/demo-evidence/missing-item-01.jpg",
    radiusClass: "rounded-[40px]",
  },
  {
    id: "m4",
    title: "WAYBILL MISMATCH EXTRACTION",
    tag: "OCR DISCREPANCY",
    image: "/demo-evidence/receipt-01.jpg",
    radiusClass: "rounded-tl-[100px] rounded-br-[20px] rounded-tr-[12px] rounded-bl-[12px]",
  },
  {
    id: "m5",
    title: "DELIVERY DAMAGE DISPUTE",
    tag: "TELEMETRY MATCH",
    image: "/demo-evidence/delivery-damage-01.jpg",
    radiusClass: "rounded-tr-[100px] rounded-bl-[40px] rounded-tl-[12px] rounded-br-[12px]",
  },
  {
    id: "m6",
    title: "WRONG PRODUCT INGESTION",
    tag: "INVOICE VERIFIED",
    image: "/demo-evidence/wrong-product-01.jpg",
    radiusClass: "rounded-[40px]",
  },
  {
    id: "m7",
    title: "DUPLICATE CLAIM CLUSTER",
    tag: "HASH MATCH 100%",
    image: "/demo-evidence/damaged-food-02.jpg",
    radiusClass: "rounded-tl-[100px] rounded-br-[20px] rounded-tr-[12px] rounded-bl-[12px]",
  },
];

const PROJECTS: ProjectItem[] = [
  {
    id: "CLM-1001",
    title: "Meal Spillage & Packaging Forensics",
    category: "C2PA Provenance • Manipulation Indicators",
    year: "2026",
    image: "/demo-evidence/damaged-food-01.jpg",
    href: "/dashboard/claims/CLM-1001",
  },
  {
    id: "CLM-1029",
    title: "Doorstep Logistics Crush Analysis",
    category: "Compression Noise • Subnet Frequency",
    year: "2026",
    image: "/demo-evidence/damaged-package-01.jpg",
    href: "/dashboard/claims/CLM-1029",
  },
  {
    id: "CLM-1031",
    title: "Missing Item Tampered Box Inquest",
    category: "Perceptual Hash • External Fraud Cluster",
    year: "2026",
    image: "/demo-evidence/missing-item-01.jpg",
    href: "/dashboard/claims/CLM-1031",
  },
  {
    id: "CLM-1003",
    title: "Courier Dropoff Puncture Ingestion",
    category: "OCR Waybill Alignment • Telemetry",
    year: "2026",
    image: "/demo-evidence/delivery-damage-01.jpg",
    href: "/dashboard/claims/CLM-1003",
  },
];

export default function EditorialLandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
      // Linear interpolation (lerp) for smooth lagging effect
      const ease = 0.18;
      currentPos.current.x += (mousePos.current.x - currentPos.current.x) * ease;
      currentPos.current.y += (mousePos.current.y - currentPos.current.y) * ease;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${currentPos.current.x - 16}px, ${currentPos.current.y - 16}px, 0) scale(${cursorHovered ? 2.5 : 1})`;
      }

      animationFrameId = requestAnimationFrame(renderCursor);
    };

    animationFrameId = requestAnimationFrame(renderCursor);

    // Add hover listeners to interactive tags
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
    <div className="relative min-h-screen bg-[#FFFFFF] text-[#000000] font-sans selection:bg-[#000000] selection:text-[#FFFFFF] cursor-none overflow-x-hidden">
      
      {/* 1. CUSTOM DIFFERENCE CURSOR */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-[9999] bg-[#FFFFFF] border border-[#000000] transition-transform duration-200 ease-out"
        style={{
          mixBlendMode: "difference",
          willChange: "transform",
        }}
      />

      {/* STYLES FOR EDITORIAL SPEC */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Space+Mono:ital,wght@0,400;0,700&display=swap');

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
          line-height: 0.9;
        }

        .font-body {
          font-family: 'Inter', sans-serif;
          font-weight: 400;
          letter-spacing: -0.02em;
          line-height: 1.5;
        }

        .font-mono-meta {
          font-family: 'Space Mono', monospace;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        /* Marquee Animation */
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }

        .animate-marquee {
          display: flex;
          width: max-content;
          animation: marquee 30s linear infinite;
        }

        .marquee-container:hover .animate-marquee {
          animation-play-state: paused;
        }

        /* Smooth Reveal with cubic-bezier(0.16, 1, 0.3, 1) */
        .reveal-char {
          display: inline-block;
          animation: revealUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes revealUp {
          0% {
            opacity: 0;
            transform: translateY(100%);
          }
          100% {
            opacity: 1;
            transform: translateY(0%);
          }
        }

        /* Grayscale to full color transition over 700ms */
        .img-editorial {
          filter: grayscale(100%);
          transition: filter 700ms cubic-bezier(0.16, 1, 0.3, 1), transform 700ms cubic-bezier(0.16, 1, 0.3, 1);
        }

        .img-editorial:hover, .group:hover .img-editorial {
          filter: grayscale(0%);
          transform: scale(1.05);
        }
      `}</style>

      {/* 2. FIXED NAVIGATION HEADER */}
      <header 
        className="fixed top-0 left-0 w-full z-50 px-6 sm:px-12 md:px-24 py-6 flex items-center justify-between"
        style={{ mixBlendMode: "difference" }}
      >
        <Link 
          href="/" 
          className="text-[#FFFFFF] text-[24px] font-[700] tracking-tighter lowercase select-none"
        >
          sd
        </Link>

        <div className="flex items-center space-x-6">
          <Link 
            href="/dashboard" 
            className="hidden sm:inline-block text-[#FFFFFF] font-mono-meta text-[12px] hover:underline"
          >
            LAUNCH CONSOLE [↗]
          </Link>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-[#FFFFFF] p-2 hover:opacity-80 transition-opacity"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 stroke-[2]" />
            ) : (
              <Plus className="w-6 h-6 stroke-[2]" />
            )}
          </button>
        </div>
      </header>

      {/* FULLSCREEN EDITORIAL OVERLAY MENU */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#0A0A0A] text-[#FFFFFF] flex flex-col justify-between p-8 sm:p-16 md:p-24 animate-in fade-in duration-300">
          <div className="pt-16">
            <div className="font-mono-meta text-[12px] text-[#737373] mb-6">
              STUDIO NAVIGATION • TRUSTLENS AI
            </div>
            <nav className="flex flex-col space-y-4">
              {[
                { title: "Verification Dashboard", href: "/dashboard" },
                { title: "Claims Pipeline", href: "/dashboard/claims" },
                { title: "Evidence Inspector", href: "/dashboard/evidence" },
                { title: "Risk Analytics", href: "/dashboard/analytics" },
                { title: "Settings & Risk Engine", href: "/dashboard/settings" },
              ].map((item, idx) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="font-headline text-3xl sm:text-5xl md:text-6xl hover:text-[#737373] transition-colors flex items-center group"
                >
                  <span className="font-mono-meta text-sm mr-4 opacity-50">0{idx + 1}</span>
                  {item.title}
                  <ArrowUpRight className="w-8 h-8 ml-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))}
            </nav>
          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between text-sm text-[#737373]">
            <div>C2PA Cryptographic Provenance • Google SynthID GenAI Detection</div>
            <div className="font-mono-meta">FASTAPI v2.4 • POSTGRESQL CONNECTED</div>
          </div>
        </div>
      )}

      {/* 3. HERO SECTION */}
      <section className="min-h-[80vh] flex flex-col items-center justify-center text-center px-6 pt-32 pb-16">
        
        {/* Staggered Letter Reveal Headline */}
        <div className="overflow-hidden">
          <h1 className="font-headline text-[13vw] sm:text-[12vw] tracking-tighter leading-[0.88] select-none uppercase">
            {"TRUSTLENS".split("").map((char, index) => (
              <span
                key={index}
                className="reveal-char"
                style={{
                  animationDelay: `${index * 60}ms`,
                }}
              >
                {char}
              </span>
            ))}
          </h1>
        </div>

        {/* Sub-headline */}
        <p className="font-body text-[20px] sm:text-[24px] text-[#525252] mt-8 max-w-2xl mx-auto leading-tight">
          Autonomous evidence verification, forensic provenance, and claim fraud defense for instant commerce.
        </p>

        {/* Direct Action Link */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center px-8 py-3.5 bg-[#000000] text-[#FFFFFF] font-mono-meta text-[13px] rounded-full hover:bg-[#525252] transition-colors"
          >
            ENTER DASHBOARD <ArrowUpRight className="w-4 h-4 ml-2" />
          </Link>
          <Link
            href="/dashboard/evidence"
            className="inline-flex items-center px-8 py-3.5 border border-[#000000]/10 text-[#000000] font-mono-meta text-[13px] rounded-full hover:border-[#000000] transition-colors"
          >
            EXPLORE EVIDENCE REPOSITORY
          </Link>
        </div>

        {/* Subtle Metadata Pill */}
        <div className="mt-14 inline-flex items-center space-x-3 text-[#737373] font-mono-meta text-[12px]">
          <span>[ 7-LAYER FORENSIC FUSION ]</span>
          <span>•</span>
          <span>[ 420MS TRIAGE LATENCY ]</span>
          <span>•</span>
          <span>[ 88.6% AUTOMATION ]</span>
        </div>
      </section>

      {/* 4. INFINITE PROJECT MARQUEE */}
      <section className="w-full overflow-hidden py-12 border-t border-b border-[#000000]/10 marquee-container">
        <div className="animate-marquee flex items-center space-x-8">
          {[...MARQUEE_CARDS, ...MARQUEE_CARDS].map((card, idx) => (
            <div
              key={`${card.id}-${idx}`}
              className={`w-[260px] sm:w-[320px] aspect-[5/7] overflow-hidden bg-[#F5F5F5] border border-[#000000]/10 shrink-0 relative group ${card.radiusClass}`}
              data-interactive="true"
            >
              <img
                src={card.image}
                alt={card.title}
                className="w-full h-full object-cover img-editorial"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/damage.jpg";
                }}
              />
              <div className="absolute inset-0 bg-[#000000]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 p-3 bg-white/95 backdrop-blur-sm border border-[#000000]/10 rounded-[8px]">
                <div className="font-mono-meta text-[10px] text-[#737373] tracking-widest">{card.tag}</div>
                <div className="font-headline text-[13px] text-[#000000] mt-0.5 truncate">{card.title}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. CENTERED INTRODUCTORY STATEMENT */}
      <section className="max-w-4xl mx-auto px-6 py-28 text-center space-y-6">
        <div className="font-mono-meta text-[13px] text-[#737373]">
          01 // THE MANIFESTO
        </div>
        <h2 className="font-headline text-3xl sm:text-5xl md:text-6xl text-[#000000] leading-[1.05]">
          "We replace blind refund payouts and manual support queues with sub-second mathematical certainty."
        </h2>
        <p className="font-body text-[17px] sm:text-[19px] text-[#525252] max-w-2xl mx-auto leading-relaxed pt-2">
          From synthetic diffusion spills to clone-stamped package tears, TrustLens AI decodes hardware provenance, perceptual duplicate hashes, and OCR waybills in real time.
        </p>
      </section>

      {/* 6. TWO-COLUMN PROJECT GRID */}
      <section className="max-w-6xl mx-auto px-6 sm:px-12 pb-28">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 pb-4 border-b border-[#000000]/10">
          <div>
            <span className="font-mono-meta text-[13px] text-[#737373] block mb-1">
              02 // INVESTIGATION ARCHIVE
            </span>
            <h3 className="font-headline text-3xl sm:text-4xl text-[#000000]">
              Active Case Studies
            </h3>
          </div>
          <Link
            href="/dashboard/claims"
            className="font-mono-meta text-[13px] text-[#000000] hover:underline mt-4 sm:mt-0 inline-flex items-center"
          >
            VIEW ALL 1,284 CLAIMS [↗]
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
          {PROJECTS.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="group block"
              data-interactive="true"
            >
              {/* 4:3 Aspect Ratio Image Container */}
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[14px] bg-[#F5F5F5] border border-[#000000]/10 mb-4">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover img-editorial"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/damage.jpg";
                  }}
                />
                
                {/* Hover-triggered Overlay (black 10% opacity) */}
                <div className="absolute inset-0 bg-[#000000]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Top-Right Arrow-Up-Right Icon */}
                <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-[#FFFFFF] border border-[#000000]/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0 shadow-sm">
                  <ArrowUpRight className="w-5 h-5 text-[#000000]" />
                </div>

                <div className="absolute top-4 left-4 px-2.5 py-1 bg-[#FFFFFF]/90 backdrop-blur-sm border border-[#000000]/10 rounded font-mono-meta text-[10px]">
                  {item.id}
                </div>
              </div>

              {/* Bottom Metadata Row */}
              <div className="pt-3 border-t border-[#000000]/10 flex items-start justify-between">
                <div>
                  <h4 className="font-headline text-[24px] text-[#000000] group-hover:text-[#525252] transition-colors leading-tight">
                    {item.title}
                  </h4>
                  <p className="font-mono-meta text-[12px] text-[#737373] mt-1">
                    {item.category}
                  </p>
                </div>
                <span className="font-mono-meta text-[14px] text-[#000000] shrink-0 ml-4 font-bold">
                  {item.year}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 7. HIGH-CONTRAST DARK FOOTER */}
      <footer className="w-full bg-[#0A0A0A] text-[#FFFFFF] pt-20 pb-12 px-6 sm:px-12 md:px-24">
        <div className="max-w-6xl mx-auto">
          
          {/* Four-Column Grid on Desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 pb-16">
            
            {/* Column 1-2: Large Brand Name and Short Bio */}
            <div className="md:col-span-2 space-y-4 pr-6">
              <span className="text-[28px] font-[700] tracking-tighter lowercase select-none">
                sd / trustlens
              </span>
              <p className="font-body text-[15px] text-[#737373] max-w-md leading-relaxed">
                TrustLens AI is an autonomous creative studio and forensic verification platform designed for high-velocity commerce. Built on Inter typography, sub-second signal fusion, and human-in-the-loop oversight.
              </p>
              <div className="pt-2">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center px-5 py-2.5 bg-[#FFFFFF] text-[#0A0A0A] font-mono-meta text-[12px] rounded-full hover:bg-neutral-200 transition-colors"
                >
                  LAUNCH PLATFORM [↗]
                </Link>
              </div>
            </div>

            {/* Column 3: Socials List */}
            <div className="space-y-3">
              <div className="font-mono-meta text-[13px] text-[#737373]">
                SOCIALS
              </div>
              <ul className="space-y-2 text-[14px] font-body">
                <li>
                  <a 
                    href="https://github.com/pv-srinivas1/TrustLens-AI" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="hover:text-[#737373] transition-colors inline-flex items-center"
                  >
                    GitHub Repository <ExternalLink className="w-3 h-3 ml-1.5 opacity-50" />
                  </a>
                </li>
                <li>
                  <a href="#twitter" className="hover:text-[#737373] transition-colors">
                    Twitter / X
                  </a>
                </li>
                <li>
                  <a href="#linkedin" className="hover:text-[#737373] transition-colors">
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a href="#discord" className="hover:text-[#737373] transition-colors">
                    Discord Community
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 4: Contact & Platform List */}
            <div className="space-y-3">
              <div className="font-mono-meta text-[13px] text-[#737373]">
                PLATFORM
              </div>
              <ul className="space-y-2 text-[14px] font-body">
                <li>
                  <Link href="/dashboard" className="hover:text-[#737373] transition-colors">
                    Overview Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/claims" className="hover:text-[#737373] transition-colors">
                    Claims Management
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/evidence" className="hover:text-[#737373] transition-colors">
                    Evidence Repository
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/analytics" className="hover:text-[#737373] transition-colors">
                    Risk Analytics
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/settings" className="hover:text-[#737373] transition-colors">
                    Organization Settings
                  </Link>
                </li>
              </ul>
            </div>

          </div>

          {/* Bottom Bar: Thin border-top (white at 10% opacity) */}
          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono-meta text-[13px] text-[#737373]">
            <div>
              © 2026 TRUSTLENS AI STUDIO. ALL RIGHTS RESERVED.
            </div>
            <div className="flex items-center space-x-6 text-[12px]">
              <span>C2PA HARDWARE SIGNING</span>
              <span>•</span>
              <span>SYNTHID DETECTOR</span>
              <span>•</span>
              <span>FASTAPI v2.4</span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
