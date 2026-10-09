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
  CheckCircle2,
  Cpu,
  Layers,
  Sparkles,
  Zap,
  Clock,
  ShieldCheck,
  Search,
  Eye
} from "lucide-react";
import { ExportMenu } from "@/components/ui/export-menu";

interface TrendPoint {
  id: string;
  label: string;
  date: string;
  x: number;
  y: number;
  riskScore: number;
  claimsCount: number;
  flaggedCount: number;
  primarySignal: string;
}

const TREND_DATA_30D: TrendPoint[] = [
  { id: "w1", label: "W1", date: "Sep 08 - Sep 14", x: 50, y: 150, riskScore: 24, claimsCount: 220, flaggedCount: 14, primarySignal: "Baseline normal activity" },
  { id: "w2", label: "W2", date: "Sep 15 - Sep 21", x: 170, y: 135, riskScore: 36, claimsCount: 284, flaggedCount: 28, primarySignal: "Minor OCR waybill mismatches" },
  { id: "w3", label: "W3", date: "Sep 22 - Sep 28", x: 290, y: 75, riskScore: 68, claimsCount: 390, flaggedCount: 82, primarySignal: "Syndicate duplicate image attack flagged" },
  { id: "w4", label: "W4", date: "Sep 29 - Oct 05", x: 410, y: 115, riskScore: 48, claimsCount: 310, flaggedCount: 42, primarySignal: "Packaging compression anomalies" },
  { id: "now", label: "Now", date: "Oct 06 - Oct 08", x: 530, y: 88, riskScore: 56, claimsCount: 184, flaggedCount: 32, primarySignal: "C2PA signature validation active" },
];

export default function RiskAnalyticsPage() {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("30d");
  const [activePoint, setActivePoint] = useState<TrendPoint>(TREND_DATA_30D[4]);
  const [isTimeDropdownOpen, setIsTimeDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"signals" | "matrix">("signals");

  return (
    <div className="space-y-2 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pt-2">
        <div>
          <h1 className="font-display text-[16px] sm:text-[28px] text-[#111] uppercase tracking-tight flex items-center">
            <ShieldAlert className="w-6 h-6 sm:w-7 sm:h-7 mr-2 sm:mr-2.5 text-[#ff3d81]" strokeWidth={2.5} />
            Risk Analytics &amp; Intelligence
          </h1>
          <p className="text-[13px] sm:text-[14px] text-[#111]/70 font-medium">
            Deep forensic risk trends, multimodal signal distribution, and automated fraud prevention metrics.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:space-x-3 w-full sm:w-auto">
          {/* Time range selector */}
          <div className="relative">
            <button 
              onClick={() => setIsTimeDropdownOpen(!isTimeDropdownOpen)}
              className="flex items-center px-3.5 py-2 min-h-[32px] bg-white border-2 border-[#111] rounded-[10px] neo-shadow-sm font-semibold text-[13px] hover-neo-sm transition-transform"
            >
              {timeRange === "7d" ? "Last 7 days" : timeRange === "30d" ? "Last 30 days" : "Last 90 days"}
              <ChevronDown className="w-4 h-4 ml-2" strokeWidth={2.5} />
            </button>
            {isTimeDropdownOpen && (
              <div className="absolute right-0 mt-1 w-40 max-w-[calc(100vw-32px)] bg-white border-2 border-[#111] rounded-[10px] neo-shadow-md z-30 py-1 font-bold text-[12px]">
                <button 
                  onClick={() => { setTimeRange("7d"); setIsTimeDropdownOpen(false); }}
                  className="w-full text-left px-3 py-2 min-h-[36px] hover:bg-[#fdf9f0]"
                >
                  Last 7 days
                </button>
                <button 
                  onClick={() => { setTimeRange("30d"); setIsTimeDropdownOpen(false); }}
                  className="w-full text-left px-3 py-2 min-h-[36px] hover:bg-[#fdf9f0]"
                >
                  Last 30 days
                </button>
                <button 
                  onClick={() => { setTimeRange("90d"); setIsTimeDropdownOpen(false); }}
                  className="w-full text-left px-3 py-2 min-h-[36px] hover:bg-[#fdf9f0]"
                >
                  Last 90 days
                </button>
              </div>
            )}
          </div>

          <ExportMenu type="risk_analytics" />
        </div>
      </div>

      {/* Top 5 High-Impact Metric Cards (1 col on small phones, 2 cols on medium, 5 on desktop) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-3.5">
        {[
          { label: "Average Risk", value: "41.2", sub: "/ 100 benchmark", color: "bg-[#ffd23f]", badge: "-4.8% trend" },
          { label: "High Risk Rate", value: "6.7%", sub: "86 claims flagged", color: "bg-[#ff3d81]", badge: "Needs triage" },
          { label: "Critical Block Rate", value: "2.5%", sub: "32 auto-blocked", color: "bg-[#c8a2ff]", badge: "100% precision" },
          { label: "Auto-Triage Rate", value: "88.6%", sub: "Zero human friction", color: "bg-[#3ddc97]", badge: "⚡ 420ms avg" },
          { label: "Prevented Loss", value: "₹18.4L", sub: "Saved this month", color: "bg-white", badge: "ROI 14.2x" },
        ].map((stat, i) => (
          <div key={i} className="bg-white border-2 border-[#111] rounded-[14px] p-2 neo-shadow-sm hover-neo-sm transition-transform">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#111]/70">{stat.label}</span>
              <div className={`w-2.5 h-2.5 rounded-full border border-[#111] ${stat.color}`} />
            </div>
            <div className="font-display text-[26px] text-[#111] leading-none mb-1">
              {stat.value}
            </div>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#111]/10 text-[10px] font-mono">
              <span className="text-[#111]/60 font-bold">{stat.sub}</span>
              <span className="font-bold text-[#111] px-1.5 py-0.2 bg-[#fdf9f0] border border-[#111]/30 rounded">
                {stat.badge}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Charts & Deep Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-2">
        
        {/* Interactive Risk Score Trend (7 cols) */}
        <div className="lg:col-span-7 bg-white border-2 border-[#111] rounded-[16px] p-2 neo-shadow-md flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h2 className="font-bold text-[17px] text-[#111] flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2 text-[#ff3d81]" strokeWidth={2.5} />
                  Risk Score Trend &amp; Anomaly Detection
                </h2>
                <span className="text-[12px] text-[#111]/60 font-medium">
                  Hover points to inspect weekly anomaly incidents &amp; signal spikes
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-1 bg-[#3ddc97] border border-[#111] rounded font-mono text-[11px] font-bold flex items-center">
                  <span className="w-2 h-2 rounded-full bg-[#111] mr-1.5 animate-ping" />
                  LIVE SCANNER ACTIVE
                </span>
              </div>
            </div>

            {/* SVG Interactive Chart */}
            <div className="w-full h-[220px] relative select-none">
              <svg width="100%" height="100%" viewBox="0 0 600 200" preserveAspectRatio="none">
                {/* Horizontal Gridlines */}
                {[20, 40, 60, 80].map((v) => (
                  <g key={v}>
                    <line 
                      x1="30" 
                      y1={180 - v * 1.8} 
                      x2="570" 
                      y2={180 - v * 1.8} 
                      stroke="#111" 
                      strokeWidth="1" 
                      strokeDasharray="4 4" 
                      opacity="0.15" 
                    />
                    <text x="25" y={180 - v * 1.8 + 4} textAnchor="end" className="font-mono text-[10px] font-bold" fill="#111">
                      {v}
                    </text>
                  </g>
                ))}

                {/* Shaded Area Gradient */}
                <defs>
                  <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ff3d81" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#ff3d81" stopOpacity="0.02" />
                  </linearGradient>
                </defs>

                {/* Fill Area */}
                <path 
                  d="M 50 150 Q 110 142, 170 135 T 290 75 T 410 115 T 530 88 L 530 180 L 50 180 Z" 
                  fill="url(#riskGrad)" 
                />

                {/* Curved Line */}
                <path 
                  d="M 50 150 Q 110 142, 170 135 T 290 75 T 410 115 T 530 88" 
                  fill="none" 
                  stroke="#ff3d81" 
                  strokeWidth="3.5" 
                  strokeLinecap="round"
                />

                {/* Active Point Vertical Guideline */}
                {activePoint && (
                  <line 
                    x1={activePoint.x} 
                    y1={activePoint.y} 
                    x2={activePoint.x} 
                    y2="180" 
                    stroke="#111" 
                    strokeWidth="1.5" 
                    strokeDasharray="3 3" 
                  />
                )}

                {/* Interactive Points */}
                {TREND_DATA_30D.map((pt) => {
                  const isSelected = activePoint?.id === pt.id;
                  return (
                    <g 
                      key={pt.id} 
                      className="cursor-pointer transition-transform"
                      onClick={() => setActivePoint(pt)}
                      onMouseEnter={() => setActivePoint(pt)}
                    >
                      {/* Pulse halo for active point */}
                      {isSelected && (
                        <circle cx={pt.x} cy={pt.y} r="11" fill="#ffd23f" opacity="0.4" className="animate-ping" />
                      )}
                      <circle 
                        cx={pt.x} 
                        cy={pt.y} 
                        r={isSelected ? "7" : "5"} 
                        fill={isSelected ? "#ffd23f" : "#ffffff"} 
                        stroke="#111" 
                        strokeWidth={isSelected ? "3" : "2"} 
                      />
                      <text 
                        x={pt.x} 
                        y="195" 
                        textAnchor="middle" 
                        className={`font-mono text-[11px] ${isSelected ? "font-black fill-[#111]" : "font-bold fill-[#111]/70"}`}
                      >
                        {pt.label}
                      </text>
                    </g>
                  );
                })}

                <line x1="30" y1="180" x2="570" y2="180" stroke="#111" strokeWidth="2" />
              </svg>
            </div>
          </div>

          {/* Interactive Inspection Detail Card (Changes smoothly on point hover) */}
          <div className="mt-4 p-3.5 bg-[#fdf9f0] border-2 border-[#111] rounded-[12px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 neo-shadow-sm animate-in fade-in duration-200">
            <div className="space-y-0.5">
              <div className="flex items-center space-x-2">
                <span className="font-mono text-[11px] font-bold px-2 py-0.5 bg-[#111] text-white rounded">
                  {activePoint.label}: {activePoint.date}
                </span>
                <span className="text-[12px] font-bold text-[#111]">
                  Risk Score: <strong className="text-[#ff3d81] font-mono text-[14px]">{activePoint.riskScore}/100</strong>
                </span>
              </div>
              <p className="text-[12px] text-[#111]/80 font-medium">
                Primary Signal: <strong>{activePoint.primarySignal}</strong>
              </p>
            </div>

            <div className="flex items-center space-x-3 text-[11px] font-mono shrink-0">
              <div className="px-2.5 py-1 bg-white border border-[#111] rounded font-bold">
                {activePoint.claimsCount} Claims
              </div>
              <div className="px-2.5 py-1 bg-[#ff3d81]/20 border border-[#111] rounded font-bold text-[#111]">
                {activePoint.flaggedCount} Flagged
              </div>
            </div>
          </div>
        </div>

        {/* Risk Distribution Breakdown (5 cols) */}
        <div className="lg:col-span-5 bg-white border-2 border-[#111] rounded-[16px] p-2 neo-shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h2 className="font-bold text-[17px] text-[#111]">Risk Distribution Bands</h2>
              <span className="text-[11px] font-mono font-bold px-2 py-0.5 bg-[#fdf9f0] border border-[#111] rounded">
                1,284 CLAIMS
              </span>
            </div>
            <p className="text-[12px] text-[#111]/60 font-medium mb-1">
              Automated categorization across all evidence ingested
            </p>

            <div className="space-y-3.5">
              {[
                { label: "LOW RISK (0-39)", count: 924, pct: 72, color: "bg-[#3ddc97]", status: "Auto-Cleared (Instant Refund)" },
                { label: "MEDIUM RISK (40-69)", count: 205, pct: 16, color: "bg-[#ffd23f]", status: "Signal Verification Prompt" },
                { label: "HIGH RISK (70-84)", count: 103, pct: 8, color: "bg-[#ff3d81]", status: "Priority Review Queue" },
                { label: "CRITICAL (85-100)", count: 52, pct: 4, color: "bg-[#c8a2ff]", status: "Hard Fraud Block / Escalated" },
              ].map((b) => (
                <div key={b.label} className="group">
                  <div className="flex justify-between items-center text-[11px] font-mono font-bold mb-1">
                    <span className="flex items-center">
                      <span className={`w-2 h-2 rounded-full border border-[#111] ${b.color} mr-1.5`} />
                      {b.label}
                    </span>
                    <span className="text-[#111]/80">{b.count} ({b.pct}%)</span>
                  </div>
                  <div className="h-4 w-full bg-[#fdf9f0] border-2 border-[#111] rounded-full overflow-hidden p-0.5">
                    <div 
                      className={`h-full ${b.color} border-r-2 border-[#111] rounded-full transition-all duration-500`}
                      style={{ width: `${b.pct}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-[#111]/60 font-mono mt-0.5 pl-3.5">
                    Action: {b.status}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t-2 border-[#111]/10 text-[11px] font-mono font-bold text-[#111]/70 flex justify-between items-center">
            <span>AUTOMATION EFFICIENCY: 88.6%</span>
            <span className="text-[#0d9488]">HUMAN ESCALATION: 11.4%</span>
          </div>
        </div>
      </div>

      {/* Forensic Verification Signals & Claim Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-2">
        
        {/* Left Column: Verification Signals Breakdown (7 cols) */}
        <div className="lg:col-span-7 bg-white border-2 border-[#111] rounded-[16px] p-2 neo-shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-bold text-[18px] text-[#111] flex items-center">
                <Layers className="w-5 h-5 mr-2 text-[#ff3d81]" strokeWidth={2.5} />
                Verification Signals Triggered
              </h2>
              <p className="text-[12px] text-[#111]/60 font-medium">
                Anomalies flagged across 7 automated forensic detection layers
              </p>
            </div>
            <span className="font-mono text-[12px] font-bold px-2.5 py-1 bg-[#ffd23f] border-2 border-[#111] rounded-[8px] neo-shadow-sm">
              140 TOTAL SIGNALS
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { signal: "Duplicate Evidence", count: 42, color: "bg-[#c8a2ff]", desc: "Perceptual hash match in fraud archive", rate: "94% similarity" },
              { signal: "Manipulation Indicators", count: 31, color: "bg-[#ff3d81]", desc: "Noise & compression splice anomalies", rate: "Photoshop/AI stamp" },
              { signal: "Order ID Mismatch", count: 18, color: "bg-[#ffd23f]", desc: "OCR detected waybill mismatch", rate: "Invoice discrepancy" },
              { signal: "Behaviour Anomaly", count: 27, color: "bg-[#ff6b5e]", desc: "Repeated refund pattern from IP subnet", rate: "High recidivism" },
              { signal: "Hardware Provenance", count: 9, color: "bg-[#3ddc97]", desc: "Stripped metadata / web download EXIF", rate: "Non-camera source" },
              { signal: "OCR Barcode Fault", count: 13, color: "bg-white", desc: "Waybill tracking barcode unreadable", rate: "Courier verification" },
            ].map((sig) => (
              <div 
                key={sig.signal} 
                className="p-3 bg-[#fdf9f0] border-2 border-[#111] rounded-[12px] flex items-start justify-between neo-shadow-sm hover-neo-sm transition-transform"
              >
                <div className="space-y-0.5 pr-2">
                  <span className="font-bold text-[13px] text-[#111] block leading-tight">{sig.signal}</span>
                  <span className="text-[10px] text-[#111]/70 block">{sig.desc}</span>
                  <span className="text-[9px] font-mono font-bold text-[#111]/50 uppercase">{sig.rate}</span>
                </div>
                <div className={`w-9 h-9 rounded-[8px] ${sig.color} border-2 border-[#111] flex items-center justify-center font-display text-[15px] text-[#111] shrink-0 neo-shadow-sm`}>
                  {sig.count}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Claim Categories by Vulnerability (5 cols) */}
        <div className="lg:col-span-5 bg-white border-2 border-[#111] rounded-[16px] p-2 neo-shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-bold text-[18px] text-[#111]">Claim Categories &amp; Exposure</h2>
                <p className="text-[12px] text-[#111]/60 font-medium">Risk distribution categorized by incident claim type</p>
              </div>
            </div>

            <div className="space-y-2.5">
              {[
                { category: "Damaged Product", count: 578, pct: 45, riskAvg: "High (74)", color: "bg-[#ff3d81]" },
                { category: "Missing Item", count: 308, pct: 24, riskAvg: "Critical (86)", color: "bg-[#c8a2ff]" },
                { category: "Wrong Item", count: 231, pct: 18, riskAvg: "Low (22)", color: "bg-[#3ddc97]" },
                { category: "Delivery Issue", count: 115, pct: 9, riskAvg: "Medium (41)", color: "bg-[#ffd23f]" },
                { category: "Refund Request", count: 52, pct: 4, riskAvg: "High (68)", color: "bg-[#ff6b5e]" },
              ].map((cat) => (
                <div key={cat.category} className="p-2.5 bg-[#fdf9f0] border-2 border-[#111] rounded-[10px] flex items-center justify-between text-[13px]">
                  <div className="flex items-center space-x-2">
                    <span className={`w-2.5 h-2.5 rounded-full border border-[#111] ${cat.color}`} />
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

          <div className="pt-4 border-t-2 border-[#111]/10 text-[11px] font-mono font-bold text-[#111]/70 flex items-center justify-between">
            <span>HIGHEST VULNERABILITY: MISSING ITEM</span>
            <span className="text-[#ff3d81] font-bold">86/100 AVG RISK</span>
          </div>
        </div>
      </div>

      {/* Forensic Detection Layers Performance Matrix (New Informative Table) */}
      <div className="bg-white border-2 border-[#111] rounded-[14px] sm:rounded-[16px] p-3 sm:p-2 neo-shadow-md space-y-1">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="font-bold text-[16px] sm:text-[18px] text-[#111] flex items-center">
              <Cpu className="w-5 h-5 mr-2 text-[#3ddc97]" strokeWidth={2.5} />
              7-Layer Forensic Architecture Performance
            </h2>
            <p className="text-[12px] text-[#111]/70 font-medium">
              Real-time benchmark and precision metrics across all multimodal verification models
            </p>
          </div>
          <span className="font-mono text-[11px] font-bold px-2.5 py-1 bg-[#3ddc97] border border-[#111] rounded self-start sm:self-auto">
            ALL ENGINES ONLINE
          </span>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full min-w-[650px] text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-[#111] bg-[#fdf9f0]">
                <th className="py-2.5 px-3 font-mono font-bold text-[11px] uppercase text-[#111]">Layer</th>
                <th className="py-2.5 px-3 font-mono font-bold text-[11px] uppercase text-[#111]">Detection Target</th>
                <th className="py-2.5 px-3 font-mono font-bold text-[11px] uppercase text-[#111]">Precision</th>
                <th className="py-2.5 px-3 font-mono font-bold text-[11px] uppercase text-[#111]">Avg Latency</th>
                <th className="py-2.5 px-3 font-mono font-bold text-[11px] uppercase text-[#111]">Status</th>
              </tr>
            </thead>
            <tbody className="text-[12px] font-mono">
              {[
                { layer: "01. C2PA Hardware Manifest", target: "Camera sensor hardware cryptosign", precision: "100.0%", latency: "24ms", status: "Active" },
                { layer: "02. Google SynthID Watermark", target: "Generative AI diffusion signatures", precision: "99.4%", latency: "85ms", status: "Active" },
                { layer: "03. Image Forensics (ELA)", target: "JPEG quantization, cloning, noise mismatch", precision: "92.8%", latency: "140ms", status: "Active" },
                { layer: "04. Perceptual Hash Duplicate", target: "Visual deduplication across past claims", precision: "98.7%", latency: "38ms", status: "Active" },
                { layer: "05. OCR Label Extractor", target: "Tracking ID & invoice cross-matching", precision: "97.6%", latency: "110ms", status: "Active" },
                { layer: "06. Telemetry & Geolocation", target: "Driver dropoff GPS vs photo EXIF time", precision: "99.1%", latency: "18ms", status: "Active" },
                { layer: "07. Behavioral Recidivism", target: "Device fingerprint & multi-account rings", precision: "95.3%", latency: "32ms", status: "Active" },
              ].map((row, i) => (
                <tr key={i} className="border-b border-[#111]/10 hover:bg-[#fdf9f0] transition-colors">
                  <td className="py-2.5 px-3 font-bold text-[#111]">{row.layer}</td>
                  <td className="py-2.5 px-3 text-[#111]/80">{row.target}</td>
                  <td className="py-2.5 px-3 font-bold text-[#0d9488]">{row.precision}</td>
                  <td className="py-2.5 px-3 text-[#111]/70">{row.latency}</td>
                  <td className="py-2.5 px-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#3ddc97] text-[#111] text-[10px] font-bold border border-[#111]">
                      ● {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
