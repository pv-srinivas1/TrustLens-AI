"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { 
  Grid,
  FileText,
  CheckSquare,
  Layers,
  ShieldAlert,
  Settings
} from "lucide-react";

const navSections = [
  {
    title: "WORKSPACE",
    items: [
      { name: "Overview", href: "/dashboard", icon: Grid },
      { name: "Claims", href: "/dashboard/claims", icon: FileText },
      { name: "Review Queue", href: "/dashboard/review-queue", icon: CheckSquare },
      { name: "Evidence", href: "/dashboard/evidence", icon: Layers },
    ],
  },
  {
    title: "ANALYTICS",
    items: [
      { name: "Risk Analytics", href: "/dashboard/analytics", icon: ShieldAlert },
    ],
  },
  {
    title: "ADMINISTRATION",
    items: [
      { name: "Settings", href: "/dashboard/settings", icon: Settings },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-[240px] h-screen bg-white border-r-2 border-[#111] flex flex-col shrink-0 select-none">
      {/* Brand Header */}
      <div className="pt-6 pb-4 px-4 flex flex-col items-center justify-center border-b-2 border-[#111]/10">
        <Link href="/dashboard" className="flex flex-col items-center text-center group">
          <Image 
            src="/logo.png" 
            alt="TrustLens AI" 
            width={64} 
            height={64} 
            className="object-contain transition-transform group-hover:scale-105"
            priority
          />
          <h1 className="font-display text-[17px] text-[#111] tracking-tight mt-2.5">
            TRUSTLENS AI
          </h1>
        </Link>
      </div>
      
      <nav className="flex-1 py-4 px-3 space-y-4 overflow-y-auto">
        {navSections.map((section) => (
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
                    className="flex items-center px-3 py-2 bg-[#ff3d81] border-2 border-[#111] rounded-[10px] text-[#111] neo-shadow-sm font-bold text-[13px] transition-transform hover-neo-sm"
                  >
                    <item.icon className="w-4 h-4 mr-2.5 shrink-0" strokeWidth={2.5} />
                    <span>{item.name}</span>
                  </Link>
                );
              }
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center px-3 py-2 rounded-[10px] border-2 border-transparent text-[#111] font-semibold text-[13px] transition-all hover:bg-[#fdf9f0] hover:border-[#111] hover:neo-shadow-sm"
                >
                  <item.icon className="w-4 h-4 mr-2.5 text-[#111]/70 shrink-0" strokeWidth={2.5} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Workspace Card */}
      <div className="p-4">
        <div className="bg-white border-2 border-[#111] rounded-[14px] p-3 flex items-center neo-shadow-sm">
          <div className="w-8 h-8 rounded-[8px] bg-[#c8a2ff] border-2 border-[#111] flex items-center justify-center font-display text-[12px] text-[#111]">
            AR
          </div>
          <div className="ml-3 flex flex-col">
            <span className="font-bold text-[13px] leading-tight">Alex R.</span>
            <div className="mt-1">
              <span className="inline-flex items-center px-2 py-[1px] bg-[#ffd23f] border-2 border-[#111] rounded-full text-[9px] font-bold tracking-wide uppercase">
                Admin
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
