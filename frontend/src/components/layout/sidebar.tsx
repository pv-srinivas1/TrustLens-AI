"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { navigationSections } from "@/lib/navigation";

interface SidebarProps {
  onNavigate?: () => void;
  onClose?: () => void;
  isMobile?: boolean;
}

export function Sidebar({ onNavigate, onClose, isMobile = false }: SidebarProps) {
  const pathname = usePathname();

  const handleLinkClick = () => {
    if (onNavigate) onNavigate();
    if (onClose) onClose();
  };

  return (
    <div className={`w-[260px] md:w-[240px] h-full bg-white flex flex-col shrink-0 select-none ${isMobile ? "border-r-0" : "border-r-2 border-[#111]"}`}>
      {/* Brand Header */}
      <div className="pt-5 pb-4 px-4 flex items-center justify-between border-b-2 border-[#111]/10">
        <Link 
          href="/dashboard" 
          onClick={handleLinkClick}
          className="flex items-center space-x-3 text-left group"
        >
          <img 
            src="/logo.png" 
            alt="TrustLens AI" 
            className="w-10 h-10 object-contain transition-transform group-hover:scale-105"
          />
          <div className="flex flex-col">
            <h1 className="font-display text-[16px] text-[#111] tracking-tight leading-tight">
              TRUSTLENS AI
            </h1>
            <span className="font-mono text-[9px] font-bold text-[#111]/60">
              CONSOLE
            </span>
          </div>
        </Link>

        {isMobile && onClose && (
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-[8px] border-2 border-[#111] bg-[#ffd23f] text-[#111] hover:bg-[#ffd23f]/80 transition-colors focus:outline-none"
            aria-label="Close navigation menu"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
      
      {/* Navigation Links with >= 44px touch targets */}
      <nav className="flex-1 py-4 px-3 space-y-4 overflow-y-auto">
        {navigationSections.map((section) => (
          <div key={section.title} className="space-y-1">
            <div className="px-3 py-1 font-mono text-[10px] font-bold tracking-widest text-[#111]/50 uppercase">
              {section.title}
            </div>
            {section.items.map((item) => {
              const isActive = item.href === "/dashboard" 
                ? pathname === "/dashboard" 
                : pathname.startsWith(item.href);
              
              if (isActive) {
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={handleLinkClick}
                    className="flex items-center px-3 py-2.5 min-h-[44px] bg-[#ff3d81] border-2 border-[#111] rounded-[10px] text-[#111] neo-shadow-sm font-bold text-[13px] transition-transform hover-neo-sm"
                  >
                    <item.icon className="w-4 h-4 mr-2.5 shrink-0" strokeWidth={2.5} />
                    <span className="truncate">{item.name}</span>
                  </Link>
                );
              }
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={handleLinkClick}
                  className="flex items-center px-3 py-2.5 min-h-[44px] rounded-[10px] border-2 border-transparent text-[#111] font-semibold text-[13px] transition-all hover:bg-[#fdf9f0] hover:border-[#111] hover:neo-shadow-sm"
                >
                  <item.icon className="w-4 h-4 mr-2.5 text-[#111]/70 shrink-0" strokeWidth={2.5} />
                  <span className="truncate">{item.name}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Workspace Footer Profile */}
      <div className="p-4 border-t border-[#111]/10">
        <div className="bg-white border-2 border-[#111] rounded-[14px] p-3 flex items-center neo-shadow-sm">
          <div className="w-8 h-8 rounded-[8px] bg-[#c8a2ff] border-2 border-[#111] flex items-center justify-center font-display text-[12px] text-[#111] shrink-0">
            AR
          </div>
          <div className="ml-3 flex flex-col min-w-0">
            <span className="font-bold text-[13px] leading-tight truncate">Alex R.</span>
            <div className="mt-1">
              <span className="inline-flex items-center px-2 py-[1px] bg-[#ffd23f] border-2 border-[#111] rounded-full text-[9px] font-bold tracking-wide uppercase">
                Reviewer
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
