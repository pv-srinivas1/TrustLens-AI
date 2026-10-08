"use client";

import { useState } from "react";
import { 
  ShieldAlert, 
  ChevronDown, 
  ArrowUpRight, 
  Activity, 
  TrendingUp, 
  BarChart3, 
  AlertOctagon,
  Percent,
  CheckCircle2
} from "lucide-react";
import { ExportMenu } from "@/components/ui/export-menu";

export default function RiskAnalyticsPage() {
  const [timeRange, setTimeRange] = useState("Last 30 days");

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-2">
        <div>
          <h1 className="font-display text-[28px] text-[#111] uppercase tracking-tight flex items-center">
            <ShieldAlert className="w-7 h-7 mr-2.5 text-[#ff3d81]" strokeWidth={2.5} />
            Risk Analytics
          </h1>
          <p className="text-[14px] text-[#111]/70 font-medium">Understand verification risk and signal trends.</p>
        </div>

        <div className="flex items-center space-x-3">
          <button className="flex items-center px-3.5 py-2 bg-white border-2 border-[#111] rounded-[10px] neo-shadow-sm font-semibold text-[13px] hover-neo-sm transition-transform">
            {timeRange} <ChevronDown className="w-4 h-4 ml-2" strokeWidth={2.5} />
          </button>
          <ExportMenu type="risk_analytics" />
        </div>
      </div>

      {/* Top 5 Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
        {[
          { label: "Average Risk", value: "41.2", sub: "/ 100 benchmark", color: "bg-[#ffd23f]" },
          { label: "High Risk Rate", value: "6.7%", sub: "86 claims flagged", color: "bg-[#ff3d81]" },
          { label: "Critical Rate", value: "2.5%", sub: "32 blocked", color: "bg-[#c8a2ff]" },
          { label: "Review Rate", value: "12.4%", sub: "Routed to human", color: "bg-[#3ddc97]" },
          { label: "Resolved Reviews", value: "94.2%", sub: "Within 2h SLA", color: "bg-white" },
        ].map((stat, i) => (
          <div key={i} className="bg-white border-2 border-[#111] rounded-[14px] p-4 neo-shadow-sm hover-neo-sm transition-transform">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#111]/70">{stat.label}</span>
              <div className={`w-2.5 h-2.5 rounded-full border border-[#111] ${stat.color}`} />
            </div>
            <div className="font-display text-[26px] text-[#111] leading-none mb-1">
              {stat.value}
            </div>
            <div className="font-mono text-[10px] font-bold text-[#111]/50">{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Risk Score Trend (7 cols) */}
        <div className="lg:col-span-7 bg-white border-2 border-[#111] rounded-[16px] p-6 neo-shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-bold text-[16px] text-[#111] flex items-center">
                <TrendingUp className="w-4 h-4 mr-2" strokeWidth={2.5} />
                Risk Score Trend
              </h2>
              <span className="text-[12px] text-[#111]/60 font-medium">Weekly 30-day moving average</span>
            </div>
            <span className="px-2 py-0.5 bg-[#3ddc97] border border-[#111] rounded font-mono text-[11px] font-bold">
              -4.8% RISK DECREASE
            </span>
          </div>

          <div className="w-full h-[220px]">
            <svg width="100%" height="100%" viewBox="0 0 600 200" preserveAspectRatio="none">
              {/* Gridlines */}
              {[20, 40, 60, 80].map((v) => (
                <g key={v}>
                  <line x1="30" y1={180 - v * 1.8} x2="580" y2={180 - v * 1.8} stroke="#111" strokeWidth="1" strokeDasharray="3 3" opacity="0.15" />
                  <text x="25" y={180 - v * 1.8 + 4} textAnchor="end" className="font-mono text-[9px] font-bold" fill="#111">{v}</text>
                </g>
              ))}

              {/* Area gradient / path */}
              <defs>
                <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ff3d81" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#ff3d81" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              <path 
                d="M 50 140 Q 120 110, 180 120 T 300 70 T 420 90 T 540 60 L 540 180 L 50 180 Z" 
                fill="url(#riskGrad)" 
              />
              <path 
                d="M 50 140 Q 120 110, 180 120 T 300 70 T 420 90 T 540 60" 
                fill="none" 
                stroke="#ff3d81" 
                strokeWidth="3.5" 
              />

              {/* Key points */}
              {[
                { x: 50, y: 140, label: "W1" },
                { x: 180, y: 120, label: "W2" },
                { x: 300, y: 70, label: "W3" },
                { x: 420, y: 90, label: "W4" },
                { x: 540, y: 60, label: "Now" },
              ].map((pt, idx) => (
                <g key={idx}>
                  <circle cx={pt.x} cy={pt.y} r="5" fill="#ffd23f" stroke="#111" strokeWidth="2" />
                  <text x={pt.x} y="195" textAnchor="middle" className="font-mono text-[10px] font-bold" fill="#111">{pt.label}</text>
                </g>
              ))}

              <line x1="30" y1="180" x2="580" y2="180" stroke="#111" strokeWidth="2" />
            </svg>
          </div>
        </div>

        {/* Risk Distribution Breakdown (5 cols) */}
        <div className="lg:col-span-5 bg-white border-2 border-[#111] rounded-[16px] p-6 neo-shadow-md flex flex-col justify-between">
          <div>
            <h2 className="font-bold text-[16px] text-[#111] mb-1">Risk Distribution</h2>
            <p className="text-[12px] text-[#111]/60 font-medium mb-5">Categorization across all claims</p>

            <div className="space-y-3.5">
              {[
                { label: "LOW RISK (0-39)", count: 924, pct: 72, color: "bg-[#3ddc97]" },
                { label: "MEDIUM RISK (40-69)", count: 205, pct: 16, color: "bg-[#ffd23f]" },
                { label: "HIGH RISK (70-84)", count: 103, pct: 8, color: "bg-[#ff3d81]" },
                { label: "CRITICAL (85-100)", count: 52, pct: 4, color: "bg-[#c8a2ff]" },
              ].map((b) => (
                <div key={b.label}>
                  <div className="flex justify-between text-[11px] font-mono font-bold mb-1">
                    <span>{b.label}</span>
                    <span>{b.pct}%</span>
                  </div>
                  <div className="h-4 w-full bg-[#fdf9f0] border-2 border-[#111] rounded-full overflow-hidden p-0.5">
                    <div 
                      className={`h-full ${b.color} border-r-2 border-[#111] rounded-full`}
                      style={{ width: `${b.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t-2 border-[#111]/10 text-[11px] font-mono font-bold text-[#111]/70 flex justify-between">
            <span>AUTOMATION EFFICIENCY: 88.6%</span>
            <span>HUMAN ESCALATION: 11.4%</span>
          </div>
        </div>
      </div>

      {/* Signal Analysis & Claim Categories Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Verification Signals (Specified in prompt) */}
        <div className="bg-white border-2 border-[#111] rounded-[16px] p-6 neo-shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-bold text-[18px] text-[#111]">Verification Signals Triggered</h2>
              <p className="text-[12px] text-[#111]/60 font-medium">Total anomalous signal detections across pipeline</p>
            </div>
            <span className="font-mono text-[12px] font-bold px-2 py-1 bg-[#ffd23f] border border-[#111] rounded">
              140 TOTAL
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { signal: "Duplicate Evidence", count: 42, color: "bg-[#c8a2ff]" },
              { signal: "Manipulation Indicators", count: 31, color: "bg-[#ff3d81]" },
              { signal: "Order Mismatch", count: 18, color: "bg-[#ffd23f]" },
              { signal: "Behaviour Anomaly", count: 27, color: "bg-[#ff6b5e]" },
              { signal: "Provenance Signals", count: 9, color: "bg-[#3ddc97]" },
              { signal: "OCR Mismatch", count: 13, color: "bg-white" },
            ].map((sig) => (
              <div 
                key={sig.signal} 
                className="p-3 bg-[#fdf9f0] border-2 border-[#111] rounded-[12px] flex items-center justify-between neo-shadow-sm"
              >
                <div>
                  <span className="font-bold text-[13px] text-[#111] block leading-tight">{sig.signal}</span>
                  <span className="text-[10px] text-[#111]/60 font-mono">Engine trigger</span>
                </div>
                <div className={`w-8 h-8 rounded-[8px] ${sig.color} border-2 border-[#111] flex items-center justify-center font-display text-[14px] text-[#111]`}>
                  {sig.count}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Claim Categories (Specified in prompt) */}
        <div className="bg-white border-2 border-[#111] rounded-[16px] p-6 neo-shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-bold text-[18px] text-[#111]">Claim Categories</h2>
                <p className="text-[12px] text-[#111]/60 font-medium">Risk distribution categorized by incident claim type</p>
              </div>
            </div>

            <div className="space-y-3">
              {[
                { category: "Damaged Product", count: 578, pct: 45, riskAvg: "High (74)" },
                { category: "Missing Item", count: 308, pct: 24, riskAvg: "Critical (86)" },
                { category: "Wrong Item", count: 231, pct: 18, riskAvg: "Low (22)" },
                { category: "Delivery Issue", count: 115, pct: 9, riskAvg: "Medium (41)" },
                { category: "Refund Request", count: 52, pct: 4, riskAvg: "High (68)" },
              ].map((cat) => (
                <div key={cat.category} className="p-2.5 bg-[#fdf9f0] border-2 border-[#111] rounded-[10px] flex items-center justify-between text-[13px]">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-[#111]">{cat.category}</span>
                    <span className="text-[11px] font-mono text-[#111]/60">({cat.count})</span>
                  </div>
                  <div className="flex items-center space-x-3 font-mono text-[12px]">
                    <span className="font-bold text-[#111]">{cat.pct}%</span>
                    <span className="px-2 py-0.5 bg-white border border-[#111] rounded text-[11px] font-bold">
                      {cat.riskAvg}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t-2 border-[#111]/10 text-[11px] font-mono font-bold text-[#111]/70">
            HIGHEST VULNERABILITY TYPE: MISSING ITEM (86/100 RISK)
          </div>
        </div>
      </div>
    </div>
  );
}
