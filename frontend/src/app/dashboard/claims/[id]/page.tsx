"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { 
  ArrowLeft, 
  Download, 
  ExternalLink, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  FileText, 
  User, 
  ShoppingBag, 
  Layers, 
  ChevronRight, 
  X, 
  FileQuestion,
  Camera,
  Upload
} from "lucide-react";
import { useTrustLens } from "@/lib/store";
import { ExportMenu } from "@/components/ui/export-menu";

function ClaimDetailContent() {
  const router = useRouter();
  const params = useParams();
  const claimId = (params?.id as string) || "CLM-1001";
  const { claims, updateClaimDecision } = useTrustLens();

  // Find claim or fallback to CLM-1001 template
  const claim = claims.find((c) => c.id === claimId) || claims[0];

  const sourceType = (claim as any).sourceType || (claim.id === "CLM-1001" || claim.type.includes("Package") ? "demo" : "real_upload");
  const isDemo = sourceType === "demo";
  const isCamera = sourceType === "camera_capture";

  const imageSrc = claim.evidenceFile?.startsWith("http")
    ? claim.evidenceFile
    : claim.evidenceFile?.startsWith("/")
      ? claim.evidenceFile
      : claim.evidenceFile?.includes("damaged-") || claim.evidenceFile?.includes("missing-") || claim.evidenceFile?.includes("delivery-") || claim.evidenceFile?.includes("wrong-") || claim.evidenceFile?.includes("receipt-")
        ? `/demo-evidence/${claim.evidenceFile}`
        : "/damage.jpg";

  // Review Modal state
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedDecision, setSelectedDecision] = useState<"Approved" | "Rejected" | "Escalated" | "Awaiting Evidence">("Approved");
  const [decisionReason, setDecisionReason] = useState("Evidence does not sufficiently support damage occurred during delivery.");
  const [actionDoneMsg, setActionDoneMsg] = useState<string | null>(null);

  const handleDecisionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateClaimDecision(claim.id, selectedDecision, decisionReason);
    setActionDoneMsg(`Claim ${claim.id} updated to ${selectedDecision}. Audit log recorded.`);
    setTimeout(() => {
      setIsReviewModalOpen(false);
      setActionDoneMsg(null);
    }, 1200);
  };

  return (
    <div className="space-y-6 pb-14">
      {/* Back Link */}
      <div>
        <Link 
          href="/dashboard/claims"
          className="inline-flex items-center text-[13px] font-bold text-[#111] hover-underline"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" strokeWidth={2.5} /> Claims
        </Link>
      </div>

      {/* Header Banner */}
      <div className="bg-white border-2 border-[#111] rounded-[16px] p-6 neo-shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-3 flex-wrap">
              <span className="font-mono text-[14px] font-bold bg-[#ffd23f] border-2 border-[#111] px-2.5 py-0.5 rounded-md neo-shadow-sm">
                {claim.id}
              </span>
              {isDemo && (
                <span className="px-2 py-0.5 bg-[#ff3d81] text-[#111] border-2 border-[#111] rounded text-[11px] font-black uppercase tracking-wider neo-shadow-xs">
                  DEMO CLAIM
                </span>
              )}
              <h1 className="font-display text-[24px] uppercase text-[#111] leading-none">
                {claim.type}
              </h1>
              <span className="font-mono font-bold text-[20px] text-[#111]">
                ₹{claim.amount.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center gap-4 text-[13px] font-medium text-[#111]/70 flex-wrap">
              <span className="flex items-center"><User className="w-3.5 h-3.5 mr-1" /> {claim.customer}</span>
              <span>•</span>
              <span className="flex items-center"><ShoppingBag className="w-3.5 h-3.5 mr-1" /> Order: <strong className="text-[#111] ml-1">{claim.orderId}</strong></span>
              <span>•</span>
              <span>Platform: <strong className="text-[#111]">{claim.platform}</strong></span>
              <span>•</span>
              <span className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1" /> {claim.createdAt}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full lg:w-auto">
            <ExportMenu type="claim_detail" claimId={claim.id} buttonLabel="Export Dossier PDF" />

            <button 
              onClick={() => {
                setSelectedDecision("Awaiting Evidence");
                setDecisionReason("Please provide an unedited photo showing the package label alongside the affected item.");
                setIsReviewModalOpen(true);
              }}
              className="px-4 py-2.5 min-h-[44px] bg-white border-2 border-[#111] rounded-[10px] neo-shadow-sm font-bold text-[12px] text-[#111] hover-neo-sm transition-transform text-center"
            >
              Request More Evidence
            </button>
            <button 
              onClick={() => setIsReviewModalOpen(true)}
              className="px-5 py-2.5 min-h-[44px] bg-[#ff3d81] border-2 border-[#111] rounded-[10px] neo-shadow-sm font-bold text-[12px] text-[#111] hover-neo-sm transition-transform text-center"
            >
              Open Review
            </button>
          </div>
        </div>

        {/* Risk Banner Badge */}
        <div className="mt-5 pt-4 border-t-2 border-[#111]/10 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center space-x-2">
            <span className={`inline-flex items-center px-3 py-1 rounded-full border-2 border-[#111] font-display text-[12px] tracking-wide ${
              claim.riskLevel === 'CRITICAL' ? 'bg-[#c8a2ff]' :
              claim.riskLevel === 'HIGH' ? 'bg-[#ff3d81]' : 
              claim.riskLevel === 'MEDIUM' ? 'bg-[#ffd23f]' : 'bg-[#3ddc97]'
            }`}>
              <AlertTriangle className="w-3.5 h-3.5 mr-1.5" strokeWidth={3} />
              {claim.riskLevel} VERIFICATION RISK ({claim.riskScore}/100)
            </span>
            <span className="text-[12px] font-mono font-bold text-[#111]/70">
              STATUS: {claim.status.toUpperCase()}
            </span>
          </div>

          {claim.duplicateMatch && (
            <div className="flex items-center px-3 py-1 bg-[#ffd23f] border-2 border-[#111] rounded-md text-[11px] font-bold">
              <span>⚠ {claim.duplicateMatch.similarity}% visual similarity to {claim.duplicateMatch.claimId}</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Grid: Evidence on Left (5/12), Verification & Risk on Right (7/12) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Uploaded Evidence (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border-2 border-[#111] rounded-[16px] p-5 neo-shadow-md">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-[16px] text-[#111] flex items-center">
                <Layers className="w-4 h-4 mr-2" strokeWidth={2.5} />
                Evidence
              </h2>
              <span className="text-[11px] font-mono font-bold text-[#111]/60">1 FILE ATTACHED</span>
            </div>

            {/* Actual Uploaded Image */}
            <div className="relative w-full aspect-[4/3] bg-[#fdf9f0] border-2 border-[#111] rounded-[12px] overflow-hidden neo-shadow-sm group flex items-center justify-center">
              <img 
                src={imageSrc} 
                alt="Uploaded Evidence" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (!target.src.includes("/damage.jpg")) {
                    target.src = "/damage.jpg";
                  }
                }}
              />
              <div className="absolute top-2 right-2 px-2 py-0.5 bg-[#111] text-white font-mono text-[10px] font-bold rounded">
                JPG • 1280×960
              </div>
              {isDemo && (
                <div className="absolute top-2 left-2 px-2 py-0.5 bg-[#ffd23f] text-[#111] border border-[#111] font-mono text-[10px] font-black rounded uppercase">
                  DEMO EVIDENCE
                </div>
              )}
            </div>

            {/* File Metadata Details */}
            <div className="mt-4 p-3 bg-[#fdf9f0] border-2 border-[#111] rounded-[10px] space-y-1.5 text-[12px]">
              <div className="flex justify-between items-center">
                <span className="text-[#111]/70 font-medium">Evidence Source:</span>
                <span className={`px-2 py-0.5 border border-[#111] rounded font-bold text-[11px] ${
                  isDemo ? "bg-[#ffd23f] text-[#111]" : isCamera ? "bg-[#a0e7e5] text-[#111]" : "bg-[#3ddc97] text-[#111]"
                }`}>
                  {isDemo ? "Demo Evidence" : isCamera ? "Camera Capture" : "User Uploaded"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#111]/70 font-medium">Claim Source:</span>
                <span className="font-bold text-[#111]">{isDemo ? "Demo" : "Real"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#111]/70 font-medium">Filename:</span>
                <span className="font-mono font-bold text-[#111]">{claim.evidenceFile || "damage.jpg"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#111]/70 font-medium">File Size:</span>
                <span className="font-mono font-bold text-[#111]">{claim.evidenceSize || "2.4 MB"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#111]/70 font-medium">SHA-256:</span>
                <span className="font-mono font-bold text-[#111] truncate max-w-[200px]" title={claim.evidenceHash}>
                  {claim.evidenceHash || "a9f43b77e810..."}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#111]/70 font-medium">Capture Device:</span>
                <span className="font-medium text-[#111]">{isCamera ? "Web Camera (Browser)" : "Apple iPhone 13 (iOS 17.4)"}</span>
              </div>
            </div>

            {/* View / Download Actions */}
            <div className="mt-4 flex items-center gap-2">
              <a 
                href={imageSrc} 
                target="_blank" 
                rel="noreferrer"
                className="flex-1 py-2 text-center bg-white border-2 border-[#111] rounded-[8px] neo-shadow-sm font-bold text-[12px] hover-neo-sm transition-transform"
              >
                View Full Resolution
              </a>
              <a 
                href={imageSrc} 
                download={claim.evidenceFile || "damage.jpg"}
                className="flex items-center justify-center px-4 py-2 bg-white border-2 border-[#111] rounded-[8px] neo-shadow-sm font-bold text-[12px] hover-neo-sm transition-transform"
              >
                <Download className="w-4 h-4 mr-1.5" /> Download
              </a>
            </div>
          </div>

          {/* Description Box */}
          <div className="bg-white border-2 border-[#111] rounded-[16px] p-5 neo-shadow-md">
            <h3 className="font-bold text-[14px] text-[#111] mb-2">Customer Statement</h3>
            <p className="text-[13px] text-[#111]/80 leading-relaxed bg-[#fdf9f0] p-3 border-2 border-[#111] rounded-[10px]">
              &quot;{claim.description}&quot;
            </p>
          </div>
        </div>

        {/* Right Column: Verification Engine & Risk Signals (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Verification Pipeline Card */}
          <div className="bg-white border-2 border-[#111] rounded-[16px] p-6 neo-shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-bold text-[18px] text-[#111]">Verification Pipeline</h2>
                <p className="text-[12px] text-[#111]/60 font-medium">Automated multi-signal forensic checks</p>
              </div>
              <span className="px-2.5 py-1 bg-[#3ddc97] border-2 border-[#111] rounded-full font-mono text-[11px] font-bold">
                9/9 ENGINES EVALUATED
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {[
                { name: "File Security", status: "✓ Passed", ok: true, detail: "Clean structure, no payloads" },
                { name: "Provenance", status: "✓ Checked", ok: true, detail: "EXIF device metadata intact" },
                { name: "C2PA", status: "Not detected", ok: true, detail: "No cryptographic signature" },
                { name: "SynthID", status: "Not detected", ok: true, detail: "No generative watermark" },
                { name: "Image Forensics", status: "⚠ Indicators found", ok: false, detail: "Compression edge anomaly detected" },
                { name: "OCR", status: "✓ Completed", ok: true, detail: "Waybill order ID matches ORD-98231" },
                { name: "Duplicate Search", status: "⚠ Similar evidence", ok: false, detail: "94% perceptual hash match in DB" },
                { name: "Order Verification", status: "✓ Matched", ok: true, detail: "Timestamp matches delivery window" },
                { name: "Behaviour", status: "✓ Completed", ok: true, detail: "Account anomaly index evaluated" },
              ].map((item, idx) => (
                <div 
                  key={idx}
                  className={`p-3 rounded-[10px] border-2 border-[#111] flex items-center justify-between ${
                    !item.ok ? "bg-[#ff6b5e]/15 border-[#111]" : "bg-[#fdf9f0]"
                  }`}
                >
                  <div>
                    <span className="font-bold text-[13px] text-[#111] block leading-tight">{item.name}</span>
                    <span className="text-[10px] text-[#111]/70 font-mono">{item.detail}</span>
                  </div>
                  <span className={`font-mono text-[11px] font-bold px-2 py-0.5 rounded border border-[#111] ${
                    !item.ok ? "bg-[#ff6b5e] text-white" : "bg-white text-[#111]"
                  }`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Risk Assessment & Signals Breakdown Card */}
          <div className="bg-white border-2 border-[#111] rounded-[16px] p-6 neo-shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-bold text-[18px] text-[#111]">Verification Risk Breakdown</h2>
                <p className="text-[12px] text-[#111]/60 font-medium">Explainable risk composition model</p>
              </div>
              <div className="text-right">
                <span className="font-display text-[26px] text-[#111]">{claim.riskScore}</span>
                <span className="text-[14px] text-[#111]/60 font-bold"> / 100</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-[13px] font-bold uppercase tracking-wider text-[#111]/70">
                Risk Signals Contribution
              </div>

              <div className="space-y-2">
                {[
                  { signal: "Manipulation indicators", score: "+20", level: "high", desc: "Cloning stamps and altered box fold contours" },
                  { signal: "Similar evidence", score: "+15", level: "high", desc: "Matched prior claim image hash EV-81090" },
                  { signal: "Order mismatch", score: "+0", level: "neutral", desc: "Order details match merchant payload" },
                  { signal: "Behaviour anomaly", score: "+12", level: "med", desc: "Repeat claims pattern from device fingerprint" },
                  { signal: "Provenance signal", score: "+0", level: "neutral", desc: "Camera metadata consistent" },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 bg-[#fdf9f0] border-2 border-[#111] rounded-[10px]">
                    <div>
                      <span className="font-bold text-[13px] text-[#111]">{item.signal}</span>
                      <p className="text-[11px] text-[#111]/60">{item.desc}</p>
                    </div>
                    <span className={`font-mono font-bold text-[13px] px-2.5 py-0.5 rounded border-2 border-[#111] ${
                      item.score === '+0' ? 'bg-white text-[#111]' : 'bg-[#ff3d81] text-[#111]'
                    }`}>
                      {item.score}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom summary note */}
            <div className="mt-5 p-3.5 bg-[#ffd23f]/30 border-2 border-[#111] rounded-[10px] text-[12px] font-medium text-[#111]">
              <strong>AI Recommendation:</strong> Due to duplicate image detection (94%) and manipulation artifacts, request a live re-capture of the package with the delivery receipt or reject according to policy.
            </div>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#111]/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-xl max-w-[calc(100vw-24px)] max-h-[90vh] bg-white border-2 border-[#111] rounded-[16px] sm:rounded-[20px] neo-shadow-lg flex flex-col overflow-hidden">
            <div className="flex items-center justify-between p-4 sm:p-5 border-b-2 border-[#111] bg-[#fdf9f0]">
              <div>
                <h3 className="font-display text-[17px] sm:text-[20px] uppercase text-[#111]">Claim Review: {claim.id}</h3>
                <p className="text-[11px] sm:text-[12px] text-[#111]/70 font-medium">Record human reviewer determination and audit reason.</p>
              </div>
              <button 
                onClick={() => setIsReviewModalOpen(false)}
                className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center bg-[#ff3d81] border-2 border-[#111] rounded-[8px] neo-shadow-sm hover-neo-sm transition-transform shrink-0"
              >
                <X className="w-4 h-4 text-[#111]" strokeWidth={3} />
              </button>
            </div>

            <form onSubmit={handleDecisionSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto">
              {actionDoneMsg && (
                <div className="p-3 bg-[#3ddc97] border-2 border-[#111] rounded-[10px] flex items-center text-[13px] font-bold">
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  {actionDoneMsg}
                </div>
              )}

              <div>
                <label className="font-bold text-[12px] uppercase tracking-wide block mb-2">Review Decision</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    { label: "Approve Refund", value: "Approved", color: "hover:bg-[#3ddc97]" },
                    { label: "Partial Refund", value: "Approved", color: "hover:bg-[#ffd23f]" },
                    { label: "Request More Evidence", value: "Awaiting Evidence", color: "hover:bg-[#c8a2ff]" },
                    { label: "Escalate to Fraud Team", value: "Escalated", color: "hover:bg-[#ff3d81]" },
                    { label: "Reject (Policy)", value: "Rejected", color: "hover:bg-[#ff6b5e]" },
                  ].map((btn, i) => (
                    <button
                      type="button"
                      key={i}
                      onClick={() => setSelectedDecision(btn.value as any)}
                      className={`p-3 min-h-[44px] border-2 border-[#111] rounded-[10px] font-bold text-[13px] text-left transition-all ${
                        selectedDecision === btn.value ? "bg-[#111] text-white neo-shadow-sm" : `bg-white text-[#111] ${btn.color}`
                      }`}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-[12px] uppercase tracking-wide block">Reason / Auditor Note</label>
                <textarea 
                  rows={3} 
                  required
                  value={decisionReason}
                  onChange={(e) => setDecisionReason(e.target.value)}
                  placeholder="State the justification for this decision (required for audit compliance)..."
                  className="w-full p-3 bg-[#fdf9f0] border-2 border-[#111] rounded-[10px] text-[13px] font-medium focus:outline-none focus:bg-white resize-none" 
                />
              </div>

              <div className="flex flex-col-reverse sm:flex-row gap-2 sm:space-x-3 pt-3 border-t-2 border-[#111] items-stretch sm:items-center justify-end">
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="w-full sm:w-auto px-4 py-2.5 min-h-[44px] bg-white border-2 border-[#111] rounded-[8px] neo-shadow-sm font-bold text-[12px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-5 py-2.5 min-h-[44px] bg-[#ff3d81] border-2 border-[#111] rounded-[8px] neo-shadow-sm font-bold text-[12px] text-[#111] hover-neo-sm transition-transform"
                >
                  Confirm Decision
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ClaimDetailPage() {
  return (
    <Suspense fallback={
      <div className="p-8 flex items-center justify-center font-mono text-[13px] font-bold">
        Loading Claim Verification Dossier...
      </div>
    }>
      <ClaimDetailContent />
    </Suspense>
  );
}
