"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  CheckSquare, 
  AlertTriangle, 
  CheckCircle2, 
  X, 
  ExternalLink,
  ShieldAlert,
  ArrowRight
} from "lucide-react";
import { useTrustLens } from "@/lib/store";
import { ClaimItem } from "@/lib/data";
import { ExportMenu } from "@/components/ui/export-menu";

export default function ReviewQueuePage() {
  const { claims, updateClaimDecision } = useTrustLens();

  const [activeTab, setActiveTab] = useState<"All" | "Critical" | "High" | "Medium" | "Assigned to Me">("All");
  const [selectedClaim, setSelectedClaim] = useState<ClaimItem | null>(null);
  const [decision, setDecision] = useState<"Approved" | "Rejected" | "Escalated" | "Awaiting Evidence">("Rejected");
  const [reason, setReason] = useState("Evidence does not sufficiently support claim; duplicate image detected.");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filter claims needing review
  const reviewClaims = claims.filter((c) => {
    // Only pending / under review claims
    const isUnderReview = c.status === "Under Review" || c.status === "Processing" || c.riskScore > 60;
    if (!isUnderReview) return false;

    if (activeTab === "Critical") return c.riskLevel === "CRITICAL";
    if (activeTab === "High") return c.riskLevel === "HIGH";
    if (activeTab === "Medium") return c.riskLevel === "MEDIUM";
    if (activeTab === "Assigned to Me") return c.assignedTo === "Alex R.";
    return true;
  });

  const handleConfirmDecision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClaim) return;

    updateClaimDecision(selectedClaim.id, decision, reason);
    setToastMessage(`Claim ${selectedClaim.id} marked as ${decision}. Action written to database and audit log.`);

    setTimeout(() => {
      setSelectedClaim(null);
      setToastMessage(null);
    }, 1200);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-2">
        <div>
          <h1 className="font-display text-[28px] text-[#111] uppercase tracking-tight flex items-center">
            <CheckSquare className="w-7 h-7 mr-2.5 text-[#ff3d81]" strokeWidth={2.5} />
            Review Queue
          </h1>
          <p className="text-[14px] text-[#111]/70 font-medium">Claims requiring human verification.</p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="px-3.5 py-1.5 bg-[#ffd23f] border-2 border-[#111] rounded-[10px] neo-shadow-sm font-mono text-[12px] font-bold text-[#111]">
            {reviewClaims.length} CLAIMS PENDING REVIEW
          </div>
          <ExportMenu type="review_queue" />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1">
        {(["All", "Critical", "High", "Medium", "Assigned to Me"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 border-2 border-[#111] rounded-[10px] font-bold text-[13px] transition-transform ${
              activeTab === tab
                ? "bg-[#ff3d81] text-[#111] neo-shadow-sm hover-neo-sm"
                : "bg-white text-[#111] hover:bg-[#fdf9f0]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white border-2 border-[#111] rounded-[16px] p-6 neo-shadow-md overflow-x-auto">
        {reviewClaims.length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-12 h-12 rounded-full bg-[#3ddc97] border-2 border-[#111] flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-6 h-6 text-[#111]" strokeWidth={2.5} />
            </div>
            <h3 className="font-bold text-[16px] text-[#111]">Queue Cleared!</h3>
            <p className="text-[13px] text-[#111]/60 mt-1">No claims in this category currently require human review.</p>
          </div>
        ) : (
          <table className="w-full min-w-[900px] text-left">
            <thead>
              <tr className="border-b-2 border-[#111]">
                <th className="py-3 px-3 font-mono font-bold text-[11px] uppercase tracking-wider text-[#111]">Claim</th>
                <th className="py-3 px-3 font-mono font-bold text-[11px] uppercase tracking-wider text-[#111]">Customer</th>
                <th className="py-3 px-3 font-mono font-bold text-[11px] uppercase tracking-wider text-[#111] text-right">Amount</th>
                <th className="py-3 px-3 font-mono font-bold text-[11px] uppercase tracking-wider text-[#111]">Risk</th>
                <th className="py-3 px-3 font-mono font-bold text-[11px] uppercase tracking-wider text-[#111]">Reason</th>
                <th className="py-3 px-3 font-mono font-bold text-[11px] uppercase tracking-wider text-[#111]">Assigned</th>
                <th className="py-3 px-3 font-mono font-bold text-[11px] uppercase tracking-wider text-[#111]">Status</th>
                <th className="py-3 px-3 font-mono font-bold text-[11px] uppercase tracking-wider text-[#111] text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {reviewClaims.map((claim) => (
                <tr key={claim.id} className="border-b-2 border-[#111]/10 hover:bg-[#fdf9f0] transition-colors">
                  <td className="py-3.5 px-3 font-mono font-bold text-[13px] text-[#111]">
                    <Link href={`/dashboard/claims/${claim.id}`} className="hover:underline flex items-center">
                      {claim.id}
                      <ExternalLink className="w-3 h-3 ml-1 text-[#111]/50" />
                    </Link>
                  </td>
                  <td className="py-3.5 px-3 font-medium text-[13px] text-[#111]">{claim.customer}</td>
                  <td className="py-3.5 px-3 font-mono font-bold text-[13px] text-right text-[#111]">
                    ₹{claim.amount.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full border-2 border-[#111] font-mono font-bold text-[11px] ${
                      claim.riskLevel === 'CRITICAL' ? 'bg-[#c8a2ff]' :
                      claim.riskLevel === 'HIGH' ? 'bg-[#ff3d81]' : 'bg-[#ffd23f]'
                    }`}>
                      {claim.riskLevel}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-[13px] font-semibold text-[#111]">
                    {claim.reviewReason || "Forensics indicators"}
                  </td>
                  <td className="py-3.5 px-3 font-medium text-[12px] text-[#111]/70">
                    {claim.assignedTo || "Unassigned"}
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="inline-block px-2 py-0.5 bg-white border border-[#111] rounded text-[11px] font-bold uppercase">
                      {claim.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <button
                      onClick={() => {
                        setSelectedClaim(claim);
                        setReason(claim.reviewReason ? `Action determined based on: ${claim.reviewReason}` : "Evidence does not sufficiently support claim.");
                      }}
                      className="px-3.5 py-1.5 bg-[#ffd23f] border-2 border-[#111] rounded-[8px] neo-shadow-sm font-bold text-[12px] text-[#111] hover-neo-sm transition-transform"
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Review Screen Modal */}
      {selectedClaim && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111]/50 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-3xl bg-white border-2 border-[#111] rounded-[20px] neo-shadow-lg flex flex-col max-h-[92vh] overflow-hidden">
            
            {/* Modal Top */}
            <div className="flex items-center justify-between p-5 border-b-2 border-[#111] bg-[#fdf9f0]">
              <div className="flex items-center space-x-3">
                <span className="font-display text-[20px] text-[#111] uppercase">
                  Claim Review • {selectedClaim.id}
                </span>
                <span className={`px-2 py-0.5 rounded-full border border-[#111] font-mono text-[11px] font-bold ${
                  selectedClaim.riskLevel === 'CRITICAL' ? 'bg-[#c8a2ff]' : 'bg-[#ff3d81]'
                }`}>
                  {selectedClaim.riskLevel} RISK ({selectedClaim.riskScore})
                </span>
              </div>
              <button 
                onClick={() => setSelectedClaim(null)}
                className="w-8 h-8 flex items-center justify-center bg-[#ff3d81] border-2 border-[#111] rounded-[8px] neo-shadow-sm hover-neo-sm transition-transform"
              >
                <X className="w-5 h-5 text-[#111]" strokeWidth={3} />
              </button>
            </div>

            <form onSubmit={handleConfirmDecision} className="p-6 overflow-y-auto space-y-6">
              {toastMessage && (
                <div className="p-3 bg-[#3ddc97] border-2 border-[#111] rounded-[10px] flex items-center text-[13px] font-bold">
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  {toastMessage}
                </div>
              )}

              {/* Top Details & Evidence Preview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Evidence Image */}
                <div className="space-y-1.5">
                  <label className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#111]/70">Evidence Preview</label>
                  <div className="relative aspect-[4/3] bg-[#fdf9f0] border-2 border-[#111] rounded-[12px] overflow-hidden neo-shadow-sm flex items-center justify-center">
                    <img 
                      src={
                        selectedClaim.evidenceFile?.startsWith("/") 
                          ? selectedClaim.evidenceFile 
                          : `/demo-evidence/${selectedClaim.evidenceFile || "damaged-food-01.jpg"}`
                      } 
                      alt="Review Evidence" 
                      className="w-full h-full object-cover" 
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (!target.src.includes("/damage.jpg")) {
                          target.src = "/damage.jpg";
                        }
                      }}
                    />
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-[#111] text-white font-mono text-[10px] font-bold rounded">
                      {selectedClaim.evidenceFile || "damage.jpg"} • {selectedClaim.evidenceSize || "2.4 MB"}
                    </div>
                  </div>
                </div>

                {/* Verification Signals Checklist */}
                <div className="space-y-1.5">
                  <label className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#111]/70">Verification Signals</label>
                  <div className="bg-[#fdf9f0] border-2 border-[#111] rounded-[12px] p-3 space-y-2 text-[12px]">
                    <div className="flex justify-between items-center pb-1 border-b border-[#111]/10">
                      <span className="font-bold">Provenance:</span>
                      <span className="font-mono text-green-700 font-bold">✓ Camera EXIF Intact</span>
                    </div>
                    <div className="flex justify-between items-center pb-1 border-b border-[#111]/10">
                      <span className="font-bold">Forensics:</span>
                      <span className="font-mono text-red-600 font-bold">⚠ Compression Anomaly</span>
                    </div>
                    <div className="flex justify-between items-center pb-1 border-b border-[#111]/10">
                      <span className="font-bold">OCR:</span>
                      <span className="font-mono text-green-700 font-bold">✓ Matched Waybill</span>
                    </div>
                    <div className="flex justify-between items-center pb-1 border-b border-[#111]/10">
                      <span className="font-bold">Duplicate:</span>
                      <span className="font-mono text-amber-700 font-bold">⚠ 94% Hash Match</span>
                    </div>
                    <div className="flex justify-between items-center pb-1 border-b border-[#111]/10">
                      <span className="font-bold">Order Match:</span>
                      <span className="font-mono text-green-700 font-bold">✓ Delivered via App</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-bold">Behaviour:</span>
                      <span className="font-mono text-amber-700 font-bold">⚠ Elevated Claims</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Review Decision Buttons */}
              <div className="space-y-2">
                <label className="font-bold text-[13px] uppercase tracking-wide block">Review Decision</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { label: "Approve Refund", value: "Approved", bg: "bg-[#3ddc97]" },
                    { label: "Partial Refund", value: "Approved", bg: "bg-[#ffd23f]" },
                    { label: "Request More Evidence", value: "Awaiting Evidence", bg: "bg-[#c8a2ff]" },
                    { label: "Escalate", value: "Escalated", bg: "bg-[#ff3d81]" },
                    { label: "Reject (Policy)", value: "Rejected", bg: "bg-[#ff6b5e]" },
                  ].map((btn, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setDecision(btn.value as any)}
                      className={`p-3 border-2 border-[#111] rounded-[10px] font-bold text-[12px] text-center transition-all ${
                        decision === btn.value ? `${btn.bg} neo-shadow-sm` : "bg-white hover:bg-[#fdf9f0]"
                      }`}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reason Input */}
              <div className="space-y-1.5">
                <label className="font-bold text-[13px] uppercase tracking-wide block">
                  Auditor Reason <span className="text-[#ff3d81]">*</span>
                </label>
                <textarea 
                  rows={2} 
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Evidence does not sufficiently support claim..."
                  className="w-full p-3 bg-[#fdf9f0] border-2 border-[#111] rounded-[10px] text-[13px] font-medium focus:outline-none focus:bg-white resize-none"
                />
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end space-x-3 pt-3 border-t-2 border-[#111]">
                <button
                  type="button"
                  onClick={() => setSelectedClaim(null)}
                  className="px-4 py-2 bg-white border-2 border-[#111] rounded-[8px] neo-shadow-sm font-bold text-[12px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#ff3d81] border-2 border-[#111] rounded-[8px] neo-shadow-sm font-bold text-[12px] text-[#111] hover-neo-sm transition-transform"
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
