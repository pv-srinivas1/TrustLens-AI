"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function TrustLensLandingPage() {
  return (
    <div className="min-h-screen bg-white text-black font-sans flex flex-col items-center p-4">
      
      {/* HEADER */}
      <header className="w-full max-w-4xl flex items-center justify-between py-4 border-b border-black">
        <div className="flex items-center space-x-3">
          <img 
            src="/logo.png" 
            alt="TrustLens Technologies Logo" 
            className="w-12 h-12 object-contain mix-blend-multiply grayscale" 
          />
          <span className="text-lg font-normal tracking-tight text-black">TrustLens Technologies</span>
        </div>
        <nav className="flex items-center space-x-6 text-sm">
          <Link href="/dashboard" className="text-black hover:underline transition-all">
            Dashboard
          </Link>
          <Link href="/dashboard/claims" className="text-black hover:underline transition-all">
            Claims
          </Link>
        </nav>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 w-full max-w-4xl flex flex-col items-center justify-center text-center py-20">
        
        <img 
          src="/logo.png" 
          alt="TrustLens Logo Large" 
          className="w-32 h-32 object-contain mix-blend-multiply grayscale mb-6" 
        />

        <h1 className="text-3xl font-normal leading-tight max-w-2xl text-black mb-4">
          Automated multi-modal forensic evaluation for digital claims
        </h1>
        
        <p className="text-base font-normal text-black max-w-xl mb-8">
          TrustLens Technologies uses AI analysis and secure C2PA provenance to instantly verify evidence uploads and detect fraud.
        </p>

        <Link 
          href="/dashboard"
          className="inline-flex items-center justify-center px-6 py-3 bg-black text-white text-sm font-normal rounded-none hover:bg-black transition-colors"
        >
          Open App Dashboard
          <ArrowRight className="w-4 h-4 ml-2" />
        </Link>
      </main>

      {/* FOOTER */}
      <footer className="w-full max-w-4xl py-6 border-t border-black flex items-center justify-between text-xs text-black">
        <span>© 2026 TrustLens Technologies.</span>
        <span>Secure Verification System</span>
      </footer>
    </div>
  );
}
