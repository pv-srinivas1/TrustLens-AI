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
    <div className={`w-[260px] md:w-[240px] h-full bg-[#F9FAFB] flex flex-col shrink-0 select-none ${isMobile ? "border-r-0" : "border-r border-[#E5E7EB]"}`}>
      {/* Brand Header */}
      <div className="pt-5 pb-4 px-4 flex items-center justify-between border-b border-[#E5E7EB]">
        <Link 
          href="/dashboard" 
          onClick={handleLinkClick}
          className="flex items-center space-x-3 text-left group"
        >
          <img 
            src="/logo.png" 
            alt="TRUSTLENS AI" 
            className="w-8 h-8 object-contain transition-transform group-hover:scale-105"
          />
          <div className="flex flex-col">
            <h1 className="font-sans text-[15px] font-semibold text-[#111827] tracking-tight leading-tight">
              TrustLens AI
            </h1>
            <span className="font-sans text-[10px] font-medium text-[#6B7280]">
              WORKSPACE
            </span>
          </div>
        </Link>

        {isMobile && onClose && (
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-md border border-[#E5E7EB] bg-white text-[#6B7280] hover:bg-[#F3F4F6] transition-colors focus:outline-none"
            aria-label="Close navigation menu"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      
      {/* Navigation Links */}
      <nav className="flex-1 py-4 px-3 space-y-5 overflow-y-auto">
        {navigationSections.map((section) => (
          <div key={section.title} className="space-y-1">
            <div className="px-3 py-1 font-sans text-[11px] font-semibold tracking-wider text-[#9CA3AF] uppercase">
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
                    className="flex items-center px-3 py-2 min-h-[36px] bg-[#EFF6FF] text-[#2563EB] font-medium text-[13px] rounded-md transition-colors"
                  >
                    <item.icon className="w-4 h-4 mr-3 shrink-0" strokeWidth={2} />
                    <span className="truncate">{item.name}</span>
                  </Link>
                );
              }
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={handleLinkClick}
                  className="flex items-center px-3 py-2 min-h-[36px] text-[#4B5563] font-medium text-[13px] rounded-md transition-colors hover:bg-[#F3F4F6] hover:text-[#111827]"
                >
                  <item.icon className="w-4 h-4 mr-3 text-[#9CA3AF] shrink-0" strokeWidth={2} />
                  <span className="truncate">{item.name}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Workspace Footer Profile */}
      <div className="p-4 border-t border-[#E5E7EB]">
        <div className="flex items-center space-x-3 px-2 py-2 rounded-md hover:bg-[#F3F4F6] transition-colors cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-[#2563EB] text-white flex items-center justify-center font-semibold text-[13px]">
            AL
          </div>
          <div className="flex flex-col">
            <span className="text-[13px] font-semibold text-[#111827]">Alice L.</span>
            <span className="text-[11px] text-[#6B7280]">alice@trustlens.ai</span>
          </div>
        </div>
      </div>
    </div>
  );
}
