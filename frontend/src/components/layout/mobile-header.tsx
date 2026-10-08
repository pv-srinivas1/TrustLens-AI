"use client";

import Link from "next/link";
import { Menu } from "lucide-react";

interface MobileHeaderProps {
  onMenuOpen: () => void;
  isOpen?: boolean;
  pageTitle?: string;
}

export function MobileHeader({ onMenuOpen, isOpen = false, pageTitle }: MobileHeaderProps) {
  return (
    <header className="md:hidden h-14 sm:h-16 w-full border-b-2 border-[#111]/10 bg-white/95 backdrop-blur-md flex items-center justify-between px-3 sm:px-4 shrink-0 z-30 select-none">
      <div className="flex items-center space-x-2.5">
        {/* Hamburger with >= 44x44px touch target */}
        <button
          onClick={onMenuOpen}
          className="w-11 h-11 flex items-center justify-center border-2 border-[#111] rounded-[10px] bg-white text-[#111] hover:bg-[#ffd23f] active:bg-[#ffd23f] transition-colors focus:outline-none focus:ring-2 focus:ring-[#111]"
          aria-label="Open navigation menu"
          aria-expanded={isOpen}
        >
          <Menu className="w-5 h-5" strokeWidth={2.5} />
        </button>

        {/* Brand Link */}
        <Link href="/dashboard" className="flex items-center space-x-2">
          <img 
            src="/logo.png" 
            alt="TrustLens AI Logo" 
            className="w-7 h-7 sm:w-8 sm:h-8 object-contain"
          />
          <div className="flex flex-col">
            <span className="font-display text-[15px] sm:text-[16px] text-[#111] tracking-tight leading-none">
              TrustLens AI
            </span>
            {pageTitle && (
              <span className="font-mono text-[9px] text-[#737373] uppercase tracking-wider font-semibold">
                {pageTitle}
              </span>
            )}
          </div>
        </Link>
      </div>

      <div className="flex items-center space-x-2">
        <span className="inline-flex items-center px-2 py-1 bg-[#3ddc97] border-2 border-[#111] rounded-full text-[10px] font-bold text-[#111] neo-shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-[#111] mr-1.5 animate-pulse" />
          ONLINE
        </span>
      </div>
    </header>
  );
}
