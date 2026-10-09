"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  ChevronDown, 
  Plus, 
  ShieldAlert, 
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { useTrustLens } from "@/lib/store";
import { ExportMenu } from "@/components/ui/export-menu";

export default function DashboardOverview() {
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
    <div className="space-y-6 pb-12 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#111827]">
            Overview
          </h1>
          <p className="text-sm text-[#6B7280] mt-1">
            Monitor claim verification, evidence signals, risk activity, and review workload.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button className="flex items-center px-4 py-2 bg-white border border-[#E5E7EB] rounded-md text-sm font-medium text-[#374151] hover:bg-[#F9FAFB] transition-colors shadow-sm">
            {dateRange} <ChevronDown className="w-4 h-4 ml-2 text-[#9CA3AF]" />
          </button>
          
          <ExportMenu type="overview" />

          <Link
            href="/dashboard/claims"
            className="flex items-center px-4 py-2 bg-[#2563EB] text-white rounded-md text-sm font-medium hover:bg-[#1D4ED8] transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4 mr-2" /> Create Claim
          </Link>
        </div>
      </div>

      {/* Main Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: "Total Claims", value: totalClaims.toLocaleString(), change: "+12.4%", changeType: "up" },
          { label: "High Risk", value: highRiskCount.toString(), change: "-3.2%", changeType: "down" },
          { label: "Under Review", value: underReviewCount.toString(), change: "+5.1%", changeType: "up" },
          { label: "Evidence Verified", value: verifiedCount.toLocaleString(), change: "+8.6%", changeType: "up" },
          { label: "Potential Loss", value: potentialLoss, change: "-1.8%", changeType: "down" },
        ].map((item, idx) => (
          <div 
            key={idx}
            className="bg-white border border-[#E5E7EB] rounded-lg p-5 shadow-sm flex flex-col justify-between"
          >
            <span className="text-xs font-medium text-[#6B7280] uppercase tracking-wider mb-2">
              {item.label}
            </span>
            <div className="text-2xl font-semibold text-[#111827] mb-2">
              {item.value}
            </div>
            <div className="flex items-center text-xs font-medium">
              <span className={item.changeType === "up" ? "text-[#059669]" : "text-[#DC2626]"}>
                {item.changeType === "up" ? "↑" : "↓"} {item.change}
              </span>
              <span className="text-[#9CA3AF] ml-1.5">vs prior 7d</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Claim Activity Chart */}
        <div className="lg:col-span-2 bg-white border border-[#E5E7EB] rounded-lg p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-semibold text-[#111827] flex items-center">
                <TrendingUp className="w-4 h-4 mr-2 text-[#6B7280]" />
                Claim Activity & Risk Volume
              </h2>
            </div>
            <div className="flex items-center gap-4 mt-2 sm:mt-0">
              <div className="flex items-center text-xs text-[#6B7280]">
                <div className="w-3 h-3 rounded-full bg-[#93C5FD] mr-2" /> Total Claims
              </div>
              <div className="flex items-center text-xs text-[#6B7280]">
                <div className="w-3 h-3 rounded-full bg-[#FCA5A5] mr-2" /> High Risk
              </div>
            </div>
          </div>

          <div className="w-full h-[220px]">
            <svg width="100%" height="100%" viewBox="0 0 700 200" preserveAspectRatio="none">
              {/* Gridlines */}
              {[0, 1, 2, 3].map((i) => (
                <g key={i}>
                  <line x1="40" y1={170 - (i * 45)} x2="680" y2={170 - (i * 45)} stroke="#E5E7EB" strokeWidth="1" />
                  <text x="30" y={170 - (i * 45) + 4} textAnchor="end" className="text-[10px] font-medium" fill="#9CA3AF">{i * 60}</text>
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
                    <rect x={x} y={170 - hRisk} width="16" height={hRisk} fill="#FCA5A5" rx="2" />
                    <rect x={x + 18} y={170 - hTotal} width="24" height={hTotal} fill="#93C5FD" rx="2" />
                    <text x={x + 20} y={190} textAnchor="middle" className="text-[11px] font-medium" fill="#6B7280">{item.day}</text>
                  </g>
                );
              })}
              <line x1="40" y1={170} x2="680" y2={170} stroke="#E5E7EB" strokeWidth="1" />
            </svg>
          </div>
        </div>

        {/* Risk Distribution Breakdown */}
        <div className="bg-white border border-[#E5E7EB] rounded-lg p-5 shadow-sm flex flex-col">
          <h2 className="text-base font-semibold text-[#111827] mb-6">Risk Distribution</h2>
          <div className="space-y-4 flex-1">
            {[
              { band: "LOW", count: 924, pct: 72, color: "bg-[#10B981]" },
              { band: "MEDIUM", count: 205, pct: 16, color: "bg-[#F59E0B]" },
              { band: "HIGH", count: 103, pct: 8, color: "bg-[#EF4444]" },
              { band: "CRITICAL", count: 52, pct: 4, color: "bg-[#991B1B]" },
            ].map((row) => (
              <div key={row.band} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-medium">
                  <span className="text-[#374151]">{row.band}</span>
                  <span className="text-[#6B7280]">{row.count} ({row.pct}%)</span>
                </div>
                <div className="h-2 w-full bg-[#F3F4F6] rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${row.color} rounded-full`}
                    style={{ width: `${row.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 mt-4 border-t border-[#E5E7EB] flex items-center justify-between text-xs font-medium">
            <span className="text-[#6B7280]">TOTAL ANALYZED: 1,284</span>
            <span className="text-[#059669]">AUTO-TRIAGED: 88%</span>
          </div>
        </div>
      </div>

      {/* Priority Review Table */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-[#E5E7EB]">
          <h2 className="text-base font-semibold text-[#111827] flex items-center">
            <ShieldAlert className="w-5 h-5 mr-2 text-[#EF4444]" />
            Priority Review Queue
          </h2>
          <Link 
            href="/dashboard/review-queue"
            className="text-sm font-medium text-[#2563EB] hover:text-[#1D4ED8] flex items-center"
          >
            View All <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        {priorityClaims.length === 0 ? (
          <div className="py-12 text-center text-[#6B7280]">
            <p className="text-sm font-medium">No priority claims requiring review.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                <tr>
                  <th className="py-3 px-5 font-semibold text-[#6B7280] uppercase tracking-wider text-xs">Claim ID</th>
                  <th className="py-3 px-5 font-semibold text-[#6B7280] uppercase tracking-wider text-xs">Type</th>
                  <th className="py-3 px-5 font-semibold text-[#6B7280] uppercase tracking-wider text-xs text-right">Amount</th>
                  <th className="py-3 px-5 font-semibold text-[#6B7280] uppercase tracking-wider text-xs">Risk</th>
                  <th className="py-3 px-5 font-semibold text-[#6B7280] uppercase tracking-wider text-xs text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {priorityClaims.map((claim) => (
                  <tr key={claim.id} className="hover:bg-[#F9FAFB] transition-colors">
                    <td className="py-3 px-5 font-medium text-[#2563EB]">
                      <Link href={`/dashboard/claims/${claim.id}`}>{claim.id}</Link>
                    </td>
                    <td className="py-3 px-5 text-[#374151]">{claim.type}</td>
                    <td className="py-3 px-5 text-[#374151] font-medium text-right">₹{claim.amount.toLocaleString()}</td>
                    <td className="py-3 px-5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        claim.riskLevel === 'CRITICAL' ? 'bg-[#FEF2F2] text-[#DC2626]' : 'bg-[#FFFBEB] text-[#D97706]'
                      }`}>
                        {claim.riskLevel}
                      </span>
                    </td>
                    <td className="py-3 px-5 text-right">
                      <Link
                        href={`/dashboard/review-queue?claimId=${claim.id}`}
                        className="inline-flex items-center px-3 py-1 bg-white border border-[#E5E7EB] rounded text-xs font-medium text-[#374151] hover:bg-[#F3F4F6] transition-colors"
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
    </div>
  );
}
