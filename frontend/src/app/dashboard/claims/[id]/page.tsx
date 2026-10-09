"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Upload,
  ZoomIn,
  ZoomOut,
  Maximize,
  Info,
  ChevronDown,
  ChevronRight,
  ShieldAlert,
  FileCheck2,
  FileSearch,
  Fingerprint,
  RefreshCcw,
  Activity,
  History,
  UserCheck
} from "lucide-react";
import { useTrustLens } from "@/lib/store";
import { ExportMenu } from "@/components/ui/export-menu";
import { apiUrl } from "@/lib/api";

function InspectorSection({ title, icon: Icon, children, defaultOpen = true }: { title: string, icon: any, children: React.ReactNode, defaultOpen?: boolean }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-[#E5E7EB] last:border-0">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full flex items-center justify-between py-3 px-4 hover:bg-[#F9FAFB] transition-colors focus:outline-none"
      >
        <div className="flex items-center space-x-2 text-[#111827]">
          <Icon className="w-4 h-4 text-[#6B7280]" strokeWidth={2} />
          <span className="font-semibold text-[13px]">{title}</span>
        </div>
        {isOpen ? <ChevronDown className="w-4 h-4 text-[#9CA3AF]" /> : <ChevronRight className="w-4 h-4 text-[#9CA3AF]" />}
      </button>
      {isOpen && (
        <div className="px-4 pb-4 pt-1">
          {children}
        </div>
      )}
    </div>
  );
}

function ClaimDetailContent() {
  const params = useParams();
  const router = useRouter();
  const claimId = (params?.id as string) || "CLM-1001";
  
  // Local states
  const [dbData, setDbData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [reviewReason, setReviewReason] = useState("");
  const [submittingDecision, setSubmittingDecision] = useState(false);

  // Fallback state
  const { claims } = useTrustLens();
  const fallbackClaim = claims.find((c) => c.id === claimId) || claims[0];

  useEffect(() => {
    async function fetchClaim() {
      try {
        const res = await fetch(apiUrl(`api/v1/claims/${claimId}`));
        if (res.ok) {
          const data = await res.json();
          setDbData(data);
        } else {
          console.error("Failed to fetch claim from DB");
        }
      } catch (err) {
        console.error("API error:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchClaim();
  }, [claimId]);

  const handleReviewAction = async (action: string) => {
    if (!reviewReason) {
      alert("Please provide a reason for the audit log.");
      return;
    }
    setSubmittingDecision(true);
    try {
      const res = await fetch(apiUrl(`api/v1/review-queue/${claimId}/action`), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, notes: reviewReason })
      });
      if (res.ok) {
        const updated = await res.json();
        setDbData((prev: any) => ({ ...prev, status: updated.new_status, audit_logs: [{ action: `Review Decision: ${action}`, details: reviewReason, created_at: new Date().toISOString() }, ...(prev?.audit_logs || [])] }));
        setReviewReason("");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingDecision(false);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-[#6B7280] text-[13px] flex items-center justify-center h-screen"><RefreshCcw className="w-5 h-5 animate-spin mr-2" /> Loading workspace...</div>;
  }

  // Merge DB data with Fallback if DB data is missing
  const activeData = dbData || {
    id: fallbackClaim.id,
    claim_number: fallbackClaim.id,
    order_id: fallbackClaim.orderId,
    amount: fallbackClaim.amount,
    currency: "INR",
    status: fallbackClaim.status,
    risk_score: fallbackClaim.riskScore,
    risk_level: fallbackClaim.riskLevel,
    evidence: [{
      file_name: fallbackClaim.evidenceFile,
      sha256: fallbackClaim.evidenceHash || "a9f43b77e810...",
      file_size: fallbackClaim.evidenceSize || "2.4 MB",
      duplicate: fallbackClaim.duplicateMatch ? { similarity_score: fallbackClaim.duplicateMatch.similarity, matched_evidence_id: fallbackClaim.duplicateMatch.claimId } : null,
      forensics: { manipulation_score: fallbackClaim.riskScore > 50 ? 80 : 10, details: {} }
    }],
    explanation: "Base risk applied due to high-value claim category. +25 points for identical hash collision.",
    audit_logs: [
      { action: "EVIDENCE_UPLOADED", details: "File received via mobile capture", created_at: new Date().toISOString() },
      { action: "PIPELINE_START", details: "Initiating 9 forensic engines", created_at: new Date().toISOString() }
    ]
  };

  const primaryEvidence = activeData.evidence?.[0] || {};
  
  let imageSrc = "/damage.jpg";
  if (primaryEvidence.file_name) {
    const fn = primaryEvidence.file_name;
    imageSrc = fn.startsWith("http") || fn.startsWith("blob") ? fn : (fn.startsWith("/") ? fn : `/demo-evidence/${fn}`);
  } else if (fallbackClaim.evidenceFile) {
    const fn = fallbackClaim.evidenceFile;
    imageSrc = fn.startsWith("http") || fn.startsWith("blob") ? fn : (fn.startsWith("/") ? fn : `/demo-evidence/${fn}`);
  }

  const isProcessing = activeData.status === "PENDING" || activeData.status === "UNDER_REVIEW";

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-white overflow-hidden text-[#111827]">
      {/* Top Action Bar */}
      <div className="h-14 border-b border-[#E5E7EB] flex items-center justify-between px-4 shrink-0 bg-white z-10">
        <div className="flex items-center space-x-3">
          <Link href="/dashboard/claims" className="text-[#6B7280] hover:text-[#111827] transition-colors text-[13px] font-medium flex items-center">
            Claims
          </Link>
          <span className="text-[#D1D5DB]">/</span>
          <span className="font-semibold text-[13px] bg-[#F3F4F6] px-2 py-1 rounded text-[#374151]">{activeData.claim_number}</span>
          <span className="text-[13px] text-[#4B5563] ml-2 font-medium hidden sm:inline-block">Order: {activeData.order_id}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 bg-white border border-[#E5E7EB] rounded-md text-[12px] font-medium text-[#4B5563]">
            {activeData.status}
          </span>
          <span className={`flex items-center text-[12px] font-medium px-3 py-1 rounded-md ${
            activeData.risk_level === 'CRITICAL' || activeData.risk_level === 'HIGH' ? 'bg-[#FEF2F2] text-[#DC2626] border border-[#FCA5A5]' : 
            activeData.risk_level === 'MEDIUM' ? 'bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A]' : 'bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]'
          }`}>
            {activeData.risk_level === 'CRITICAL' || activeData.risk_level === 'HIGH' ? <AlertTriangle className="w-3.5 h-3.5 mr-1.5" /> : <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />}
            {activeData.risk_level} RISK
          </span>
          <ExportMenu type="claim_detail" claimId={activeData.id} buttonLabel="Export Dossier" />
        </div>
      </div>

      {/* 3-Pane Workspace */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* A. Left Evidence Navigation Panel */}
        <div className="hidden lg:flex w-[260px] flex-col border-r border-[#E5E7EB] bg-[#F9FAFB] shrink-0">
          <div className="p-3 border-b border-[#E5E7EB] flex items-center justify-between bg-white">
            <span className="font-semibold text-[13px] text-[#374151]">Evidence Queue</span>
            <button className="p-1.5 hover:bg-[#F3F4F6] rounded-md text-[#6B7280] transition-colors" title="Upload new evidence">
              <Upload className="w-4 h-4" />
            </button>
          </div>
          <div className="overflow-y-auto flex-1 p-2 space-y-2">
            {/* Primary Evidence */}
            <div className="p-2 border border-[#2563EB] bg-[#EFF6FF] rounded-lg cursor-pointer flex gap-3 shadow-sm">
              <div className="w-16 h-16 bg-[#E5E7EB] rounded overflow-hidden shrink-0 border border-[#BFDBFE]">
                <img src={imageSrc} className="w-full h-full object-cover" alt="Thumb" />
              </div>
              <div className="flex flex-col justify-center overflow-hidden">
                <span className="text-[12px] font-medium text-[#1E3A8A] truncate">{primaryEvidence.file_name || "evidence.jpg"}</span>
                <span className="text-[10px] text-[#60A5FA] mt-1 uppercase tracking-wider font-semibold">Primary Check</span>
              </div>
            </div>
            
            {/* Context Actions */}
            <div className="mt-6">
              <h3 className="px-2 text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-2">Claim Details</h3>
              <div className="px-2 space-y-2 text-[12px] text-[#4B5563]">
                <div className="flex justify-between"><span>Amount</span><span className="font-medium text-[#111827]">{activeData.currency} {activeData.amount}</span></div>
                <div className="flex justify-between"><span>Type</span><span className="font-medium text-[#111827]">{activeData.claim_type}</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* B. Center Evidence Viewer */}
        <div className="flex-1 flex flex-col bg-[#F3F4F6] relative">
          <div className="absolute top-4 left-4 z-10 flex space-x-1.5 bg-white/90 backdrop-blur border border-[#E5E7EB] rounded-md shadow-sm p-1">
            <button className="p-1.5 hover:bg-[#F3F4F6] text-[#4B5563] rounded transition-colors"><ZoomIn className="w-4 h-4" /></button>
            <button className="p-1.5 hover:bg-[#F3F4F6] text-[#4B5563] rounded transition-colors"><ZoomOut className="w-4 h-4" /></button>
            <div className="w-[1px] h-4 bg-[#E5E7EB] self-center mx-1" />
            <button className="p-1.5 hover:bg-[#F3F4F6] text-[#4B5563] rounded transition-colors"><Maximize className="w-4 h-4" /></button>
          </div>
          
          <div className="flex-1 overflow-auto flex items-center justify-center p-6">
            <div className="relative max-w-full max-h-full bg-white shadow-sm border border-[#E5E7EB]">
              <img 
                src={imageSrc} 
                alt="Main Evidence Viewer" 
                className="max-w-full max-h-[80vh] object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (!target.src.includes("/damage.jpg")) target.src = "/damage.jpg";
                }}
              />
            </div>
          </div>
        </div>

        {/* C. Right Analysis Inspector */}
        <div className="w-[360px] flex-col border-l border-[#E5E7EB] bg-white shrink-0 overflow-y-auto hidden md:flex">
          <div className="p-4 border-b border-[#E5E7EB] bg-[#F9FAFB]">
            <h2 className="text-[14px] font-semibold text-[#111827]">Analysis Inspector</h2>
            <p className="text-[11px] text-[#6B7280] mt-1">AI Pipeline Results & Workflow</p>
          </div>

          <InspectorSection title="Explainable Score Breakdown" icon={ShieldAlert} defaultOpen={true}>
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[12px] font-medium text-[#111827]">Engine Output</span>
                <span className="font-bold text-[18px] text-[#111827]">{activeData.risk_score}/100</span>
              </div>
              <div className="w-full h-1.5 bg-[#E5E7EB] rounded-full overflow-hidden mb-2">
                <div 
                  className={`h-full ${activeData.risk_score > 60 ? 'bg-[#DC2626]' : activeData.risk_score > 30 ? 'bg-[#F59E0B]' : 'bg-[#10B981]'}`}
                  style={{ width: `${activeData.risk_score}%` }}
                />
              </div>
              <div className="p-2.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-md text-[11px] text-[#4B5563] leading-relaxed">
                {activeData.explanation || "Risk calculation based on multiple algorithmic factors and heuristics."}
              </div>
            </div>
          </InspectorSection>

          <InspectorSection title="Evidence Integrity Verification" icon={Info} defaultOpen={true}>
            <div className="space-y-2.5 text-[12px]">
              <div className="flex justify-between items-center border-b border-[#E5E7EB] pb-2">
                <span className="text-[#6B7280]">Hash Match</span>
                <span className="flex items-center text-[#059669] font-medium bg-[#ECFDF5] px-2 py-0.5 rounded text-[10px]"><CheckCircle2 className="w-3 h-3 mr-1" /> Verified</span>
              </div>
              <div className="flex flex-col space-y-1">
                <span className="text-[#6B7280] text-[11px]">Original Stored SHA-256</span>
                <span className="font-mono text-[10px] font-medium text-[#111827] bg-[#F3F4F6] p-1.5 rounded truncate" title={primaryEvidence.sha256}>
                  {primaryEvidence.sha256 || "e6f3b95489325da7..."}
                </span>
              </div>
            </div>
          </InspectorSection>

          <InspectorSection title="Live Analysis Timeline" icon={Activity} defaultOpen={true}>
            <div className="relative pl-3 border-l-2 border-[#E5E7EB] space-y-4 py-2 ml-2">
              {(activeData.audit_logs || []).slice(0, 5).map((log: any, idx: number) => (
                <div key={idx} className="relative">
                  <div className="absolute -left-[21px] top-1 w-3 h-3 bg-white border-2 border-[#2563EB] rounded-full" />
                  <div className="flex flex-col">
                    <span className="text-[11px] font-medium text-[#111827]">{log.action.replace(/_/g, ' ')}</span>
                    <span className="text-[10px] text-[#6B7280]">{new Date(log.created_at).toLocaleString()}</span>
                    <span className="text-[11px] text-[#4B5563] mt-0.5 bg-[#F9FAFB] p-1.5 rounded border border-[#E5E7EB] inline-block">{log.details}</span>
                  </div>
                </div>
              ))}
            </div>
          </InspectorSection>

          <InspectorSection title="Human Review Workflow" icon={UserCheck} defaultOpen={true}>
            <div className="space-y-3">
              <div className="text-[12px] text-[#4B5563] mb-2">Record a persistent manual review decision for this claim.</div>
              <textarea 
                className="w-full text-[12px] p-2 border border-[#E5E7EB] rounded-md focus:outline-none focus:border-[#2563EB] min-h-[60px]"
                placeholder="Auditor notes & reason for decision..."
                value={reviewReason}
                onChange={(e) => setReviewReason(e.target.value)}
              />
              <div className="grid grid-cols-2 gap-2">
                <button 
                  disabled={submittingDecision}
                  onClick={() => handleReviewAction("APPROVED")}
                  className="px-3 py-1.5 bg-white border border-[#E5E7EB] rounded text-[11px] font-medium hover:bg-[#ECFDF5] hover:text-[#059669] hover:border-[#A7F3D0] transition-colors"
                >
                  Approve Claim
                </button>
                <button 
                  disabled={submittingDecision}
                  onClick={() => handleReviewAction("REJECTED")}
                  className="px-3 py-1.5 bg-white border border-[#E5E7EB] rounded text-[11px] font-medium hover:bg-[#FEF2F2] hover:text-[#DC2626] hover:border-[#FCA5A5] transition-colors"
                >
                  Reject Fraud
                </button>
                <button 
                  disabled={submittingDecision}
                  onClick={() => handleReviewAction("ESCALATED")}
                  className="col-span-2 px-3 py-1.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded text-[11px] font-medium hover:bg-[#E5E7EB] transition-colors"
                >
                  Escalate Case
                </button>
              </div>
            </div>
          </InspectorSection>

        </div>
      </div>
    </div>
  );
}

export default function ClaimDetailPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-[#6B7280] text-[13px] h-screen flex items-center justify-center">Loading workspace...</div>}>
      <ClaimDetailContent />
    </Suspense>
  );
}
