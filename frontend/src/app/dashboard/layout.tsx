"use client";

import { useState, useEffect, Suspense } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileHeader } from "@/components/layout/mobile-header";
import { TrustLensProvider } from "@/lib/store";
import { Search, ShieldCheck } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Lock body scrolling when mobile drawer is open and listen for ESC key
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
    <TrustLensProvider>
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Space+Grotesk:wght@400;500;600;700&family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap');
        
        .font-display { font-family: 'Archivo Black', sans-serif; }
        .font-body { font-family: 'Space Grotesk', sans-serif; }
        .font-mono { font-family: 'Space Mono', monospace; }
        
        .neo-shadow-sm { box-shadow: 3px 3px 0px #111111; }
        .neo-shadow-md { box-shadow: 4px 4px 0px #111111; }
        .neo-shadow-lg { box-shadow: 6px 6px 0px #111111; }
        
        .hover-neo-sm:hover { transform: translate(-1px, -1px); box-shadow: 4px 4px 0px #111111; }
        .hover-neo-md:hover { transform: translate(-2px, -2px); box-shadow: 6px 6px 0px #111111; }
        
        .bg-grid {
          background-image: linear-gradient(rgba(17,17,17,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(17,17,17,0.05) 1px, transparent 1px);
          background-size: 24px 24px;
        }
      `}} />
      <div className="flex h-screen w-full bg-[#fdf9f0] bg-grid text-[#111] font-body overflow-hidden relative">
        
        {/* DESKTOP SIDEBAR (Untouched, visible on md: and above) */}
        <aside className="hidden md:flex w-[240px] h-screen bg-white border-r-2 border-[#111] shrink-0">
          <Suspense fallback={<div className="w-[240px] h-screen bg-white border-r-2 border-[#111]" />}>
            <Sidebar />
          </Suspense>
        </aside>

        {/* MOBILE SLIDE-IN SIDEBAR DRAWER (Subtle 200ms slide-in animation, backdrop, ESC lock) */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50 flex" role="dialog" aria-modal="true">
            {/* Translucent Backdrop (click to close) */}
            <div 
              className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-200" 
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden="true"
            />
            
            {/* Slide-in Drawer Container */}
            <div className="relative w-[280px] max-w-[85vw] h-full bg-white z-10 flex flex-col shadow-2xl transition-transform duration-200 ease-out transform translate-x-0 border-r-2 border-[#111]">
              <Suspense fallback={<div className="w-[280px] h-full bg-white" />}>
                <Sidebar 
                  isMobile={true} 
                  onClose={() => setMobileMenuOpen(false)} 
                  onNavigate={() => setMobileMenuOpen(false)} 
                />
              </Suspense>
            </div>
          </div>
        )}
        
        {/* MAIN APPLICATION COLUMN */}
        <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
          
          {/* Mobile Top Header (Visible only on mobile < md) */}
          <MobileHeader 
            onMenuOpen={() => setMobileMenuOpen(true)} 
            isOpen={mobileMenuOpen}
          />

          {/* Desktop Topbar (Hidden on mobile < md, visible on md: and above) */}
          <header className="hidden md:flex h-[68px] border-b-2 border-[#111]/10 bg-white/70 backdrop-blur-sm items-center justify-between px-6 md:px-8 shrink-0">
            <div className="flex items-center space-x-3">
              <span className="inline-flex items-center px-2.5 py-1 bg-[#3ddc97] border-2 border-[#111] rounded-full text-[11px] font-bold text-[#111] neo-shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#111] mr-1.5 animate-pulse" />
                SYSTEM ONLINE
              </span>
              <span className="font-mono text-[11px] font-bold text-[#111]/60">
                FASTAPI v2.4 • POSTGRESQL CONNECTED
              </span>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Desktop Search */}
              <div className="relative flex items-center">
                <Search className="absolute left-3 w-3.5 h-3.5 text-[#111]" strokeWidth={2.5} />
                <input 
                  type="text" 
                  placeholder="Quick search claims, IDs..." 
                  className="w-[200px] md:w-[260px] pl-8 pr-3 py-1.5 bg-[#fdf9f0] border-2 border-[#111] rounded-[10px] text-[12px] font-medium text-[#111] placeholder:text-[#111]/50 focus:outline-none focus:bg-white neo-shadow-sm transition-transform"
                />
              </div>

              {/* Engine Status badge */}
              <div className="flex items-center px-3 py-1.5 bg-[#ffd23f] border-2 border-[#111] rounded-[10px] neo-shadow-sm text-[11px] font-mono font-bold text-[#111]">
                <ShieldCheck className="w-3.5 h-3.5 mr-1.5" strokeWidth={2.5} />
                ENGINE: ACTIVE
              </div>
              
              {/* Avatar */}
              <div className="w-8 h-8 rounded-full bg-[#c8a2ff] border-2 border-[#111] flex items-center justify-center font-display text-[12px] text-[#111] neo-shadow-sm cursor-pointer hover-neo-sm transition-transform">
                AR
              </div>
            </div>
          </header>
          
          {/* Main Page Scrollable Viewport */}
          <main className="flex-1 overflow-y-auto px-3 sm:px-6 md:px-8 pb-12 pt-3 sm:pt-4 w-full min-w-0">
            <div className="max-w-[1400px] mx-auto w-full min-w-0">
              {children}
            </div>
          </main>
        </div>
      </div>
    </TrustLensProvider>
  );
}
