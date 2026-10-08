"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  ClaimItem, 
  EvidenceItem, 
  AuditLogItem, 
  INITIAL_CLAIMS, 
  INITIAL_EVIDENCE, 
  INITIAL_AUDIT_LOGS 
} from "./data";

interface TrustLensContextType {
  claims: ClaimItem[];
  evidence: EvidenceItem[];
  auditLogs: AuditLogItem[];
  createClaim: (newClaim: Omit<ClaimItem, "id" | "createdAt" | "signals" | "riskScore" | "riskLevel" | "status">) => ClaimItem;
  updateClaimDecision: (claimId: string, decision: "Approved" | "Rejected" | "Escalated" | "Awaiting Evidence", reason: string) => void;
  addEvidence: (newEvidence: Omit<EvidenceItem, "id" | "uploadedAt" | "analysisStatus">) => EvidenceItem;
  addAuditLog: (log: Omit<AuditLogItem, "id" | "timestamp">) => void;
}

const TrustLensContext = createContext<TrustLensContextType | undefined>(undefined);

export function TrustLensProvider({ children }: { children: React.ReactNode }) {
  const [claims, setClaims] = useState<ClaimItem[]>(INITIAL_CLAIMS);
  const [evidence, setEvidence] = useState<EvidenceItem[]>(INITIAL_EVIDENCE);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(INITIAL_AUDIT_LOGS);

  // Initialize from localStorage if available
  useEffect(() => {
    try {
      const storedClaims = localStorage.getItem("tl_claims");
      const storedEvidence = localStorage.getItem("tl_evidence");
      const storedLogs = localStorage.getItem("tl_audit_logs");
      if (storedClaims) setClaims(JSON.parse(storedClaims));
      if (storedEvidence) setEvidence(JSON.parse(storedEvidence));
      if (storedLogs) setAuditLogs(JSON.parse(storedLogs));
    } catch {
      // ignore
    }
  }, []);

  const saveToStorage = (updatedClaims: ClaimItem[], updatedEvidence: EvidenceItem[], updatedLogs: AuditLogItem[]) => {
    try {
      localStorage.setItem("tl_claims", JSON.stringify(updatedClaims));
      localStorage.setItem("tl_evidence", JSON.stringify(updatedEvidence));
      localStorage.setItem("tl_audit_logs", JSON.stringify(updatedLogs));
    } catch {
      // ignore
    }
  };

  const createClaim = (claimData: Omit<ClaimItem, "id" | "createdAt" | "signals" | "riskScore" | "riskLevel" | "status">) => {
    const nextNum = claims.length + 1004;
    const newId = `CLM-${nextNum}`;
    
    // Determine risk score based on amount / platform for realistic demo
    const calculatedRisk = claimData.amount > 1000 ? 84 : 45;
    const riskLevel: ClaimItem["riskLevel"] = calculatedRisk > 80 ? "HIGH" : calculatedRisk > 50 ? "MEDIUM" : "LOW";

    const newClaim: ClaimItem = {
      ...claimData,
      id: newId,
      createdAt: "Today, just now",
      riskScore: calculatedRisk,
      riskLevel,
      status: calculatedRisk > 70 ? "Under Review" : "Processing",
      signals: [
        { name: "File Security", category: "Security", status: "Passed", detail: "Payload scan clean" },
        { name: "Provenance", category: "Provenance", status: "Checked", detail: "Metadata verified" },
        { name: "C2PA Manifest", category: "Provenance", status: "Not detected", detail: "No C2PA credentials" },
        { name: "SynthID Watermark", category: "Provenance", status: "Not detected", detail: "No AI watermark detected" },
        { name: "Image Forensics", category: "Forensics", status: calculatedRisk > 80 ? "Warning" : "Passed", impactScore: calculatedRisk > 80 ? 20 : 0, detail: calculatedRisk > 80 ? "Elevated compression anomalies" : "Natural noise curve" },
        { name: "OCR Extraction", category: "OCR", status: "Completed", detail: `Extracted Order ${claimData.orderId}` },
        { name: "Duplicate Search", category: "Duplicate", status: "Passed", detail: "Unique perceptual hash" },
        { name: "Order Verification", category: "Order", status: "Matched", detail: `Matched order in database` },
        { name: "Behaviour Analytics", category: "Behaviour", status: "Completed", detail: "Account in normal standing" },
      ]
    };

    const updatedClaims = [newClaim, ...claims];
    setClaims(updatedClaims);

    // Also register evidence item
    const newEvId = `EV-${Math.floor(80000 + Math.random() * 9000)}`;
    const newEv: EvidenceItem = {
      id: newEvId,
      claimId: newId,
      filename: claimData.evidenceFile || "evidence_upload.jpg",
      fileType: "JPG",
      fileSize: claimData.evidenceSize || "2.1 MB",
      dimensions: "1280 × 960",
      hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      analysisStatus: "Completed",
      uploadedAt: "Just now",
      imageSrc: "/damage.jpg",
      c2pa: "Not detected",
      synthId: "Not detected",
      forensics: {
        metadata: "Intact",
        compressionAnomaly: calculatedRisk > 80,
        manipulationIndicators: calculatedRisk > 80,
      },
      ocr: {
        orderId: claimData.orderId,
        product: claimData.type,
        rawText: `VERIFIED RECEIPT • ${claimData.orderId}`,
      }
    };
    const updatedEvidence = [newEv, ...evidence];
    setEvidence(updatedEvidence);

    // Audit log
    const newLog: AuditLogItem = {
      id: `AUD-${Date.now()}`,
      timestamp: "Just now",
      user: "Admin (Alex R.)",
      action: "claim.created",
      resource: `${newId} (${claimData.type})`,
      result: "Success",
      ip: "103.24.110.12"
    };
    const updatedLogs = [newLog, ...auditLogs];
    setAuditLogs(updatedLogs);

    saveToStorage(updatedClaims, updatedEvidence, updatedLogs);
    return newClaim;
  };

  const updateClaimDecision = (claimId: string, decision: "Approved" | "Rejected" | "Escalated" | "Awaiting Evidence", reason: string) => {
    const updatedClaims = claims.map((c) => {
      if (c.id === claimId) {
        return {
          ...c,
          status: decision === "Approved" ? "Approved" as const : 
                  decision === "Rejected" ? "Rejected" as const : 
                  decision === "Escalated" ? "Escalated" as const : "Awaiting Evidence" as const,
          reviewReason: reason,
        };
      }
      return c;
    });
    setClaims(updatedClaims);

    const log: AuditLogItem = {
      id: `AUD-${Date.now()}`,
      timestamp: "Just now",
      user: "Reviewer (Alex R.)",
      action: `review.${decision.toLowerCase()}`,
      resource: `${claimId} - Reason: ${reason.slice(0, 30)}...`,
      result: "Success",
      ip: "103.24.110.12"
    };
    const updatedLogs = [log, ...auditLogs];
    setAuditLogs(updatedLogs);

    saveToStorage(updatedClaims, evidence, updatedLogs);
  };

  const addEvidence = (newEvidence: Omit<EvidenceItem, "id" | "uploadedAt" | "analysisStatus">) => {
    const newEv: EvidenceItem = {
      ...newEvidence,
      id: `EV-${Math.floor(83000 + Math.random() * 5000)}`,
      analysisStatus: "Completed",
      uploadedAt: "Just now"
    };
    const updatedEvidence = [newEv, ...evidence];
    setEvidence(updatedEvidence);

    const log: AuditLogItem = {
      id: `AUD-${Date.now()}`,
      timestamp: "Just now",
      user: "System",
      action: "evidence.uploaded",
      resource: newEv.id,
      result: "Success",
      ip: "10.0.4.88"
    };
    const updatedLogs = [log, ...auditLogs];
    setAuditLogs(updatedLogs);

    saveToStorage(claims, updatedEvidence, updatedLogs);
    return newEv;
  };

  const addAuditLog = (log: Omit<AuditLogItem, "id" | "timestamp">) => {
    const newLog: AuditLogItem = {
      ...log,
      id: `AUD-${Date.now()}`,
      timestamp: "Just now"
    };
    const updatedLogs = [newLog, ...auditLogs];
    setAuditLogs(updatedLogs);
    saveToStorage(claims, evidence, updatedLogs);
  };

  return (
    <TrustLensContext.Provider value={{
      claims,
      evidence,
      auditLogs,
      createClaim,
      updateClaimDecision,
      addEvidence,
      addAuditLog
    }}>
      {children}
    </TrustLensContext.Provider>
  );
}

export function useTrustLens() {
  const context = useContext(TrustLensContext);
  if (!context) {
    throw new Error("useTrustLens must be used within a TrustLensProvider");
  }
  return context;
}
