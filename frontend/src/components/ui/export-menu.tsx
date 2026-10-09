"use client";

import { useState } from "react";
import { Download, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { apiUrl } from "@/lib/api";

interface ExportMenuProps {
  type: "overview" | "claims" | "claim_detail" | "review_queue" | "evidence" | "risk_analytics" | "audit_logs";
  claimId?: string;
  queryParams?: Record<string, string>;
  className?: string;
  buttonLabel?: string;
}

export function ExportMenu({
  type,
  claimId,
  queryParams = {},
  className = "",
  buttonLabel = "Export PDF"
}: ExportMenuProps) {
  const [status, setStatus] = useState<"idle" | "exporting" | "ready" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const getEndpoint = () => {
    let path = "";

    switch (type) {
      case "overview": path = "overview.pdf"; break;
      case "claims": path = "claims.pdf"; break;
      case "claim_detail": path = `claims/${claimId || "CLM-1001"}.pdf`; break;
      case "review_queue": path = "review-queue.pdf"; break;
      case "evidence": path = "evidence.pdf"; break;
      case "risk_analytics": path = "risk-analytics.pdf"; break;
      case "audit_logs": path = "audit-logs.pdf"; break;
      default: path = "overview.pdf";
    }

    const resolvedUrl = apiUrl(`api/v1/exports/${path}`);
    const origin = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
    const url = new URL(resolvedUrl, origin);

    Object.entries(queryParams).forEach(([key, val]) => {
      if (val && val !== "ALL") {
        url.searchParams.append(key, val);
      }
    });

    return url.toString();
  };

  const handleExport = async () => {
    setStatus("exporting");
    setErrorMessage(null);

    try {
      const url = getEndpoint();
      const res = await fetch(url, { method: "GET" });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      let filename = `trustlens-${type}-${new Date().toISOString().split("T")[0]}.pdf`;
      const disposition = res.headers.get("Content-Disposition");
      if (disposition && disposition.includes("filename=")) {
        const matches = disposition.match(/filename="?([^"]+)"?/);
        if (matches && matches[1]) {
          filename = matches[1];
        }
      }

      const blob = await res.blob();
      if (blob.size === 0) {
        throw new Error("Received empty file from server");
      }

      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);

      setStatus("ready");
      setTimeout(() => setStatus("idle"), 2500);
    } catch (err: any) {
      console.error("Export error:", err);
      setStatus("error");
      setErrorMessage("Unable to generate PDF. Please try again.");
      setTimeout(() => {
        setStatus("idle");
        setErrorMessage(null);
      }, 3500);
    }
  };

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        disabled={status === "exporting"}
        onClick={handleExport}
        className={`flex items-center px-4 py-2 bg-white border border-[#E5E7EB] rounded-md shadow-sm font-medium text-sm text-[#374151] hover:bg-[#F9FAFB] transition-colors disabled:opacity-60 ${className}`}
      >
        {status === "exporting" ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin text-[#2563EB]" />
            Generating PDF...
          </>
        ) : status === "ready" ? (
          <>
            <CheckCircle2 className="w-4 h-4 mr-2 text-[#059669]" />
            PDF Ready
          </>
        ) : status === "error" ? (
          <>
            <AlertCircle className="w-4 h-4 mr-2 text-[#DC2626]" />
            Export Failed
          </>
        ) : (
          <>
            <Download className="w-4 h-4 mr-2 text-[#6B7280]" />
            {buttonLabel}
          </>
        )}
      </button>

      {errorMessage && (
        <div className="absolute right-0 top-12 z-50 w-64 p-3 bg-[#FEF2F2] border border-[#FCA5A5] rounded-md shadow-sm text-sm font-medium text-[#991B1B] animate-in fade-in">
          <div className="flex items-start">
            <AlertCircle className="w-4 h-4 mr-2 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
}
