"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { 
  ArrowRight, 
  ShieldCheck, 
  Search, 
  Activity, 
  Camera, 
  Cpu, 
  CheckCircle2,
  AlertTriangle
} from "lucide-react";

export default function TrustLensLandingPage() {
  const [currentYear, setCurrentYear] = useState(2026);
  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <div className="min-h-screen bg-white text-[#111827] font-sans selection:bg-[#2563EB] selection:text-white flex flex-col justify-between">
      {/* GLOBAL TYPOGRAPHY: Inter */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        body {
          font-family: 'Inter', sans-serif;
          background-color: #FFFFFF;
        }
      `}</style>

      {/* 2. NAVIGATION BAR */}
      <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <img src="/logo.png" alt="TrustLens Logo" className="w-8 h-8 object-contain mix-blend-multiply" />
              <span className="font-semibold text-[16px] tracking-tight text-[#111827]">TrustLens Technologies</span>
            </Link>
            <nav className="hidden md:flex space-x-6 text-[14px] font-medium text-[#6B7280]">
              <Link href="/dashboard" className="hover:text-[#111827] transition-colors">Overview</Link>
              <Link href="/dashboard" className="hover:text-[#111827] transition-colors">Dashboard</Link>
              <Link href="/dashboard/claims" className="hover:text-[#111827] transition-colors">Claims</Link>
              <Link href="#" className="hover:text-[#111827] transition-colors">Documentation</Link>
            </nav>
          </div>
          <Link 
            href="/dashboard"
            className="hidden sm:flex items-center px-4 py-2 bg-[#2563EB] text-white text-[14px] font-medium rounded-md hover:bg-[#1D4ED8] transition-colors"
          >
            Open Dashboard
          </Link>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 space-y-24">
        
        {/* 3. HERO SECTION */}
        <section className="flex flex-col items-center text-center space-y-6 max-w-4xl mx-auto">
          <div className="inline-flex items-center px-3 py-1 bg-[#EFF6FF] text-[#2563EB] text-[12px] font-semibold rounded-full border border-[#BFDBFE] uppercase tracking-wide">
            <ShieldCheck className="w-3.5 h-3.5 mr-1.5" />
            AI-POWERED EVIDENCE VERIFICATION
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#111827] leading-[1.1]">
            Verify <span className="text-[#2563EB]">Digital Evidence</span>. <br className="hidden md:block"/>Make Better Decisions.
          </h1>
          
          <p className="text-[16px] md:text-[18px] text-[#6B7280] max-w-3xl leading-relaxed">
            Analyze uploaded evidence using provenance checks, image forensics, duplicate detection, OCR, and explainable risk signals — all in one verification workflow.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 w-full sm:w-auto">
            <Link 
              href="/dashboard"
              className="w-full sm:w-auto flex items-center justify-center px-6 py-3 min-h-[48px] bg-[#2563EB] text-white text-[15px] font-medium rounded-md hover:bg-[#1D4ED8] shadow-sm transition-all focus:ring-2 focus:ring-[#2563EB] focus:ring-offset-2"
            >
              Open Dashboard <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
            <Link 
              href="#how-it-works"
              className="w-full sm:w-auto flex items-center justify-center px-6 py-3 min-h-[48px] bg-white text-[#374151] border border-[#D1D5DB] text-[15px] font-medium rounded-md hover:bg-[#F9FAFB] transition-all focus:ring-2 focus:ring-[#E5E7EB] focus:ring-offset-2"
            >
              Explore Verification
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 pt-8 text-[#6B7280] text-[13px] font-medium">
            <div className="flex items-center"><Search className="w-4 h-4 mr-2" /> Evidence Provenance</div>
            <div className="flex items-center"><Camera className="w-4 h-4 mr-2" /> Image Forensics</div>
            <div className="flex items-center"><Activity className="w-4 h-4 mr-2" /> Explainable Risk Analysis</div>
          </div>
        </section>

        {/* 4. PRODUCT PREVIEW */}
        <section className="relative w-full max-w-5xl mx-auto">
          <div className="absolute inset-0 bg-gradient-to-b from-[#2563EB]/5 to-transparent rounded-2xl -z-10 blur-xl"></div>
          <div className="border border-[#E5E7EB] bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
            <div className="border-b border-[#E5E7EB] bg-[#F9FAFB] px-4 py-3 flex items-center justify-between">
              <span className="text-[13px] font-semibold text-[#374151] flex items-center">
                <Cpu className="w-4 h-4 mr-2 text-[#2563EB]" /> Demo Preview: Claim Verification
              </span>
              <span className="px-2 py-0.5 bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA] rounded text-[11px] font-semibold uppercase">
                High Risk
              </span>
            </div>
            <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1 space-y-6">
                <div className="p-4 border border-[#E5E7EB] rounded-lg bg-[#F9FAFB]">
                  <div className="text-[12px] font-semibold text-[#6B7280] uppercase mb-1">Risk Assessment</div>
                  <div className="text-3xl font-bold text-[#111827]">72<span className="text-lg text-[#9CA3AF]">/100</span></div>
                  <div className="mt-2 text-[13px] text-[#6B7280]">Confidence: Medium</div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[13px]">
                    <span className="text-[#374151] flex items-center"><CheckCircle2 className="w-4 h-4 mr-2 text-[#10B981]"/> Order Match</span>
                    <span className="font-mono text-[#6B7280]">Pass</span>
                  </div>
                  <div className="flex items-center justify-between text-[13px]">
                    <span className="text-[#374151] flex items-center"><AlertTriangle className="w-4 h-4 mr-2 text-[#F59E0B]"/> Provenance</span>
                    <span className="font-mono text-[#6B7280]">Missing</span>
                  </div>
                  <div className="flex items-center justify-between text-[13px]">
                    <span className="text-[#374151] flex items-center"><AlertTriangle className="w-4 h-4 mr-2 text-[#DC2626]"/> Duplicate</span>
                    <span className="font-mono text-[#6B7280]">Flagged</span>
                  </div>
                </div>
              </div>
              <div className="md:col-span-2">
                <div className="border border-[#E5E7EB] rounded-lg overflow-hidden">
                  <table className="w-full text-left text-[13px]">
                    <thead className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                      <tr>
                        <th className="px-4 py-3 font-medium text-[#6B7280]">Evidence Type</th>
                        <th className="px-4 py-3 font-medium text-[#6B7280]">Signal</th>
                        <th className="px-4 py-3 font-medium text-[#6B7280]">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E7EB]">
                      <tr>
                        <td className="px-4 py-3 font-medium text-[#111827]">Image Forensics</td>
                        <td className="px-4 py-3 text-[#6B7280]">Compression Anomaly</td>
                        <td className="px-4 py-3"><span className="text-[#DC2626] font-medium">Detected</span></td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-medium text-[#111827]">Visual Similarity</td>
                        <td className="px-4 py-3 text-[#6B7280]">Perceptual Hash</td>
                        <td className="px-4 py-3"><span className="text-[#DC2626] font-medium">94% Match</span></td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-medium text-[#111827]">OCR Extraction</td>
                        <td className="px-4 py-3 text-[#6B7280]">Label Text vs Order</td>
                        <td className="px-4 py-3"><span className="text-[#10B981] font-medium">Verified</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. HOW IT WORKS */}
        <section id="how-it-works" className="max-w-4xl mx-auto pt-10">
          <h2 className="text-2xl font-bold text-[#111827] text-center mb-12">How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-6 left-[16%] right-[16%] h-[1px] bg-[#E5E7EB] -z-10"></div>
            
            <div className="flex flex-col items-center text-center space-y-4 bg-white">
              <div className="w-12 h-12 rounded-full bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center font-bold text-lg border border-[#BFDBFE]">1</div>
              <h3 className="font-semibold text-[#111827] text-[16px]">Submit Evidence</h3>
              <p className="text-[14px] text-[#6B7280] leading-relaxed">
                Upload a picture or capture it using the camera securely.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center space-y-4 bg-white">
              <div className="w-12 h-12 rounded-full bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center font-bold text-lg border border-[#BFDBFE]">2</div>
              <h3 className="font-semibold text-[#111827] text-[16px]">Analyze Signals</h3>
              <p className="text-[14px] text-[#6B7280] leading-relaxed">
                Examine provenance, file metadata, image patterns, OCR, and similarities.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center space-y-4 bg-white">
              <div className="w-12 h-12 rounded-full bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center font-bold text-lg border border-[#BFDBFE]">3</div>
              <h3 className="font-semibold text-[#111827] text-[16px]">Review Results</h3>
              <p className="text-[14px] text-[#6B7280] leading-relaxed">
                View an explainable risk assessment and route uncertain claims for human review.
              </p>
            </div>
          </div>
        </section>

      </main>

      {/* 7. FOOTER */}
      <footer className="w-full border-t border-[#E5E7EB] bg-[#F9FAFB] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-[14px] text-[#111827]">TrustLens Technologies</span>
            <span className="text-[#D1D5DB]">|</span>
            <span className="text-[13px] text-[#6B7280]">Evidence Verification Platform</span>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6 text-[13px] text-[#6B7280]">
            <span>See the Evidence. Verify the Claim.</span>
            <span>© {currentYear}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
