"use client";

import { useState, Suspense } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { TrustLensProvider } from "@/lib/store";
import { Search, ShieldCheck, Menu, X } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

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
        
        {/* Desktop Fixed Sidebar */}
        <aside className="hidden md:flex w-[240px] h-screen bg-white border-r-2 border-[#111] shrink-0">
          <Suspense fallback={<div className="w-[240px] h-screen bg-white border-r-2 border-[#111]" />}>
            <Sidebar />
          </Suspense>
        </aside>

        {/* Mobile Slide-Out Drawer Overlay */}
        {mobileSidebarOpen && (
          <div className="md:hidden fixed inset-0 z-50 flex">
            {/* Dark Backdrop */}
            <div 
              className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity" 
              onClick={() => setMobileSidebarOpen(false)}
            />
            {/* Drawer */}
            <div className="relative w-[260px] max-w-[80vw] h-full bg-white z-10 flex flex-col shadow-2xl animate-in slide-in-from-left duration-200">
              <div className="absolute top-3 right-3 z-20">
                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-1.5 border-2 border-[#111] rounded-[8px] bg-[#ffd23f] text-[#111] hover:bg-[#ffd23f]/80"
                  aria-label="Close sidebar"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <Suspense fallback={<div className="w-[260px] h-full bg-white" />}>
                <Sidebar onNavigate={() => setMobileSidebarOpen(false)} />
              </Suspense>
            </div>
          </div>
        )}
        
        <div className="flex-1 flex flex-col min-w-0">
          {/* Topbar */}
          <header className="h-[68px] border-b-2 border-[#111]/10 bg-white/70 backdrop-blur-sm flex items-center justify-between px-3 sm:px-6 md:px-8 shrink-0">
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Mobile Hamburger Button */}
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="md:hidden p-2 border-2 border-[#111] rounded-[8px] bg-white text-[#111] hover:bg-[#fdf9f0] transition-colors"
                aria-label="Open navigation menu"
              >
                <Menu className="w-4 h-4" />
              </button>

              <span className="inline-flex items-center px-2 py-0.5 sm:px-2.5 sm:py-1 bg-[#3ddc97] border-2 border-[#111] rounded-full text-[10px] sm:text-[11px] font-bold text-[#111] neo-shadow-sm">
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#111] mr-1.5 animate-pulse" />
                ONLINE
              </span>
              <span className="hidden lg:inline font-mono text-[11px] font-bold text-[#111]/60">
                FASTAPI v2.4 • POSTGRESQL CONNECTED
              </span>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Search */}
              <div className="relative flex items-center">
                <Search className="absolute left-2.5 w-3.5 h-3.5 text-[#111]" strokeWidth={2.5} />
                <input 
                  type="text" 
                  placeholder="Search claims..." 
                  className="w-[120px] sm:w-[180px] md:w-[240px] pl-7 pr-2.5 py-1.5 bg-[#fdf9f0] border-2 border-[#111] rounded-[10px] text-[11px] sm:text-[12px] font-medium text-[#111] placeholder:text-[#111]/50 focus:outline-none focus:bg-white neo-shadow-sm transition-transform"
                />
              </div>

              {/* Engine Status badge */}
              <div className="hidden sm:flex items-center px-2.5 py-1 bg-[#ffd23f] border-2 border-[#111] rounded-[10px] neo-shadow-sm text-[10px] sm:text-[11px] font-mono font-bold text-[#111]">
                <ShieldCheck className="w-3.5 h-3.5 mr-1" strokeWidth={2.5} />
                ACTIVE
              </div>
              
              {/* Avatar */}
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#c8a2ff] border-2 border-[#111] flex items-center justify-center font-display text-[11px] sm:text-[12px] text-[#111] neo-shadow-sm cursor-pointer hover-neo-sm transition-transform">
                AR
              </div>
            </div>
          </header>
          
          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto px-3 sm:px-6 md:px-8 pb-10 pt-2">
            <div className="max-w-[1400px] mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </TrustLensProvider>
  );
}
