"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ChevronDown, 
  ArrowUpRight, 
  Plus, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight,
  TrendingUp,
  FileCheck
} from "lucide-react";
import { useTrustLens } from "@/lib/store";
import { ExportMenu } from "@/components/ui/export-menu";

export default function DashboardOverview() {
  const router = useRouter();
  const { claims } = useTrustLens();
  const [dateRange, setDateRange] = useState("Last 7 days");

  // Live calculated metrics
  const totalClaims = 1284 + (claims.length - 6);
  const highRiskCount = claims.filter(c => c.riskLevel === "HIGH" || c.riskLevel === "CRITICAL").length + 82;
  const underReviewCount = claims.filter(c => c.status === "Under Review").length + 28;
  const verifiedCount = 1156;
  const potentialLoss = "₹2.84L";

  // Filter top priority reviews (high or critical risk)
  const priorityClaims = claims.filter(c => c.riskLevel === "HIGH" || c.riskLevel === "CRITICAL").slice(0, 4);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-2">
        <div>
          <h1 className="text-[24px] sm:text-[28px] font-display uppercase tracking-tight text-[#111]">
            Overview
          </h1>
          <p className="text-[13px] sm:text-[14px] text-[#111]/70 font-medium">
            Monitor claim verification, evidence signals, risk activity and review workload.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button className="flex items-center px-3.5 py-2 min-h-[44px] bg-white border-2 border-[#111] rounded-[10px] neo-shadow-sm font-semibold text-[13px] hover-neo-sm transition-transform">
            {dateRange} <ChevronDown className="w-4 h-4 ml-2" strokeWidth={2.5} />
          </button>
          
          <ExportMenu type="overview" />

          <Link
            href="/dashboard/claims"
            className="flex items-center px-4 py-2 min-h-[44px] bg-[#ff3d81] border-2 border-[#111] rounded-[10px] neo-shadow-sm font-bold text-[13px] text-[#111] hover-neo-sm transition-transform"
          >
            <Plus className="w-4 h-4 mr-1.5" strokeWidth={3} /> Create Claim
          </Link>
        </div>
      </div>

      {/* Main Metrics Strip - Responsive grid for 320px+ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-3.5">
        {[
          { label: "Total Claims", value: totalClaims.toLocaleString(), change: "+12.4%", changeType: "up", color: "bg-[#ff3d81]" },
          { label: "High Risk", value: highRiskCount.toString(), change: "-3.2%", changeType: "down", color: "bg-[#ffd23f]" },
          { label: "Under Review", value: underReviewCount.toString(), change: "+5.1%", changeType: "up", color: "bg-[#c8a2ff]" },
          { label: "Evidence Verified", value: verifiedCount.toLocaleString(), change: "+8.6%", changeType: "up", color: "bg-[#3ddc97]" },
          { label: "Potential Loss", value: potentialLoss, change: "-1.8%", changeType: "down", color: "bg-white" },
        ].map((item, idx) => (
          <div 
            key={idx}
            className="bg-white border-2 border-[#111] rounded-[14px] p-4 neo-shadow-sm flex flex-col justify-between hover-neo-sm transition-transform"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[12px] font-bold uppercase tracking-wider text-[#111]/70">
                {item.label}
              </span>
              <div className={`w-3 h-3 rounded-full border-2 border-[#111] ${item.color}`} />
            </div>
            
            <div className="font-display text-[26px] text-[#111] leading-none mb-2">
              {item.value}
            </div>

            <div className="flex items-center text-[11px] font-mono font-bold">
              <span className={item.changeType === "up" ? "text-[#0d9488]" : "text-[#e11d48]"}>
                {item.changeType === "up" ? "▲" : "▼"} {item.change}
              </span>
              <span className="text-[#111]/50 ml-1.5 font-sans">vs prior 7d</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Claim Activity Chart (2 cols) */}
        <div className="lg:col-span-2 bg-white border-2 border-[#111] rounded-[16px] p-4 sm:p-6 neo-shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 mb-5">
            <div>
              <h2 className="font-bold text-[15px] sm:text-[16px] text-[#111] flex items-center">
                <TrendingUp className="w-4 h-4 mr-2 shrink-0" strokeWidth={2.5} />
                Claim Activity &amp; Risk Volume
              </h2>
              <span className="text-[12px] text-[#111]/60 font-medium">Daily ingest across platforms</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center px-2 py-0.5 border-2 border-[#111] rounded-full text-[10px] sm:text-[11px] font-mono font-bold bg-[#ff3d81]/20">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff3d81] border border-[#111] mr-1.5" /> Total Claims
              </span>
              <span className="inline-flex items-center px-2 py-0.5 border-2 border-[#111] rounded-full text-[10px] sm:text-[11px] font-mono font-bold bg-[#c8a2ff]/20">
                <span className="w-2.5 h-2.5 rounded-full bg-[#c8a2ff] border border-[#111] mr-1.5" /> High Risk
              </span>
            </div>
          </div>

          <div className="w-full h-[220px]">
            <svg width="100%" height="100%" viewBox="0 0 700 200" preserveAspectRatio="none">
              {/* Gridlines */}
              {[0, 1, 2, 3].map((i) => (
                <g key={i}>
                  <line x1="40" y1={170 - (i * 45)} x2="680" y2={170 - (i * 45)} stroke="#111" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.15" />
                  <text x="30" y={170 - (i * 45) + 4} textAnchor="end" className="font-mono text-[10px] font-bold" fill="#111">{i * 60}</text>
                </g>
              ))}

              {/* Day Bars */}
              {[
                { day: "Mon", total: 110, risk: 28 },
                { day: "Tue", total: 145, risk: 42 },
                { day: "Wed", total: 95, risk: 22 },
                { day: "Thu", total: 160, risk: 52 },
                { day: "Fri", total: 130, risk: 36 },
                { day: "Sat", total: 85, risk: 18 },
                { day: "Sun", total: 70, risk: 14 },
              ].map((item, idx) => {
                const x = 75 + (idx * 85);
                const hTotal = item.total * 0.9;
                const hRisk = item.risk * 0.9;
                return (
                  <g key={item.day}>
                    <rect x={x} y={170 - hRisk} width="16" height={hRisk} fill="#c8a2ff" stroke="#111" strokeWidth="2" rx="2" />
                    <rect x={x + 18} y={170 - hTotal} width="24" height={hTotal} fill="#ff3d81" stroke="#111" strokeWidth="2" rx="2" />
                    <text x={x + 20} y={190} textAnchor="middle" className="font-mono text-[11px] font-bold" fill="#111">{item.day}</text>
                  </g>
                );
              })}
              <line x1="40" y1={170} x2="680" y2={170} stroke="#111" strokeWidth="2" />
            </svg>
          </div>
        </div>

        {/* Risk Distribution Breakdown (1 col) */}
        <div className="bg-white border-2 border-[#111] rounded-[16px] p-6 neo-shadow-md flex flex-col justify-between">
          <div>
            <h2 className="font-bold text-[16px] text-[#111] mb-1">Risk Distribution</h2>
            <p className="text-[12px] text-[#111]/60 font-medium mb-6">Aggregate risk bands across all evidence</p>

            <div className="space-y-4">
              {[
                { band: "LOW", count: 924, pct: 72, color: "bg-[#3ddc97]" },
                { band: "MEDIUM", count: 205, pct: 16, color: "bg-[#ffd23f]" },
                { band: "HIGH", count: 103, pct: 8, color: "bg-[#ff3d81]" },
                { band: "CRITICAL", count: 52, pct: 4, color: "bg-[#c8a2ff]" },
              ].map((row) => (
                <div key={row.band} className="space-y-1">
                  <div className="flex justify-between items-center text-[12px] font-mono font-bold">
                    <span>{row.band}</span>
                    <span className="text-[#111]/70">{row.count} ({row.pct}%)</span>
                  </div>
                  <div className="h-4 w-full bg-[#fdf9f0] border-2 border-[#111] rounded-full overflow-hidden p-0.5">
                    <div 
                      className={`h-full ${row.color} border-r-2 border-[#111] rounded-full transition-all`}
                      style={{ width: `${row.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t-2 border-[#111]/10 flex items-center justify-between text-[11px] font-mono font-bold text-[#111]/70">
            <span>TOTAL ANALYZED: 1,284</span>
            <span className="text-[#0d9488]">AUTO-TRIAGED: 88%</span>
          </div>
        </div>
      </div>

      {/* Priority Review Table */}
      <div className="bg-white border-2 border-[#111] rounded-[16px] p-6 neo-shadow-md">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-bold text-[18px] text-[#111] flex items-center">
              <ShieldAlert className="w-5 h-5 mr-2 text-[#ff3d81]" strokeWidth={2.5} />
              Priority Review
            </h2>
            <p className="text-[12px] text-[#111]/60 font-medium">Claims requiring urgent human verification</p>
          </div>
          <Link 
            href="/dashboard/review-queue"
            className="flex items-center text-[13px] font-bold text-[#111] hover:underline"
          >
            Open Queue <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        {priorityClaims.length === 0 ? (
          <div className="py-12 text-center border-2 border-dashed border-[#111]/20 rounded-[12px]">
            <p className="font-bold text-[15px] text-[#111]">No claims yet</p>
            <p className="text-[13px] text-[#111]/60 mt-1">Create your first claim to start verification.</p>
            <Link 
              href="/dashboard/claims" 
              className="mt-3 inline-flex items-center px-4 py-2 bg-[#ff3d81] border-2 border-[#111] rounded-[10px] neo-shadow-sm font-bold text-[12px]"
            >
              <Plus className="w-4 h-4 mr-1.5" /> Create Claim
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b-2 border-[#111]">
                  <th className="py-3 px-3 font-mono font-bold text-[11px] uppercase tracking-wider text-[#111]">Claim ID</th>
                  <th className="py-3 px-3 font-mono font-bold text-[11px] uppercase tracking-wider text-[#111]">Type</th>
                  <th className="py-3 px-3 font-mono font-bold text-[11px] uppercase tracking-wider text-[#111] text-right">Amount</th>
                  <th className="py-3 px-3 font-mono font-bold text-[11px] uppercase tracking-wider text-[#111]">Risk</th>
                  <th className="py-3 px-3 font-mono font-bold text-[11px] uppercase tracking-wider text-[#111]">Primary Signal</th>
                  <th className="py-3 px-3 font-mono font-bold text-[11px] uppercase tracking-wider text-[#111] text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {priorityClaims.map((claim) => (
                  <tr key={claim.id} className="border-b-2 border-[#111]/10 hover:bg-[#fdf9f0] transition-colors">
                    <td className="py-3.5 px-3 font-mono font-bold text-[13px] text-[#111]">
                      <Link href={`/dashboard/claims/${claim.id}`} className="hover:underline">
                        {claim.id}
                      </Link>
                    </td>
                    <td className="py-3.5 px-3 font-medium text-[13px] text-[#111]">
                      {claim.type}
                    </td>
                    <td className="py-3.5 px-3 font-mono font-bold text-[13px] text-right text-[#111]">
                      ₹{claim.amount.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full border-2 border-[#111] font-mono text-[11px] font-bold ${
                        claim.riskLevel === 'CRITICAL' ? 'bg-[#c8a2ff]' : 'bg-[#ff3d81]'
                      }`}>
                        {claim.riskLevel} ({claim.riskScore})
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-[12px] font-medium text-[#111]/80">
                      {claim.reviewReason || "Forensics indicators"}
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <Link
                        href={`/dashboard/review-queue?claimId=${claim.id}`}
                        className="inline-flex items-center px-3 py-1 bg-[#ffd23f] border-2 border-[#111] rounded-[8px] neo-shadow-sm font-bold text-[12px] hover-neo-sm transition-transform"
                      >
                        Review
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Bottom Quick Action Strip */}
      <div className="flex flex-wrap items-center gap-3 pt-2">
        <Link
          href="/dashboard/claims"
          className="flex items-center px-4 py-2.5 bg-[#3ddc97] border-2 border-[#111] rounded-[10px] neo-shadow-sm font-bold text-[13px] text-[#111] hover-neo-sm transition-transform"
        >
          <Plus className="w-4 h-4 mr-2" strokeWidth={3} /> Create Claim
        </Link>
        <Link
          href="/dashboard/claims"
          className="flex items-center px-4 py-2.5 bg-white border-2 border-[#111] rounded-[10px] neo-shadow-sm font-bold text-[13px] text-[#111] hover-neo-sm transition-transform"
        >
          View All Claims
        </Link>
        <Link
          href="/dashboard/review-queue"
          className="flex items-center px-4 py-2.5 bg-white border-2 border-[#111] rounded-[10px] neo-shadow-sm font-bold text-[13px] text-[#111] hover-neo-sm transition-transform"
        >
          View Review Queue
        </Link>
      </div>
    </div>
  );
}
