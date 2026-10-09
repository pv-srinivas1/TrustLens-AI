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
    <header className="md:hidden h-14 sm:h-16 w-full border-b border-[#E5E7EB] bg-white/95 backdrop-blur-md flex items-center justify-between px-3 sm:px-4 shrink-0 z-30 select-none">
      <div className="flex items-center space-x-2.5">
        <button
          onClick={onMenuOpen}
          className="w-10 h-10 flex items-center justify-center border border-[#E5E7EB] rounded-md bg-white text-[#4B5563] hover:bg-[#F3F4F6] transition-colors focus:outline-none"
          aria-label="Open navigation menu"
          aria-expanded={isOpen}
        >
          <Menu className="w-5 h-5" strokeWidth={2} />
        </button>

        <Link href="/dashboard" className="flex items-center space-x-2">
          <img 
            src="/logo.png" 
            alt="TRUSTLENS AI Logo" 
            className="w-7 h-7 sm:w-8 sm:h-8 object-contain"
          />
          <div className="flex flex-col">
            <span className="font-sans text-[15px] font-semibold text-[#111827] tracking-tight leading-none">
              TrustLens AI
            </span>
            {pageTitle && (
              <span className="font-sans text-[10px] text-[#6B7280] font-medium mt-0.5">
                {pageTitle}
              </span>
            )}
          </div>
        </Link>
      </div>

      <div className="flex items-center space-x-2">
        <span className="inline-flex items-center px-2 py-1 bg-[#ECFDF5] border border-[#A7F3D0] rounded-full text-[10px] font-semibold text-[#065F46]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] mr-1.5 animate-pulse" />
          ONLINE
        </span>
      </div>
    </header>
  );
}
