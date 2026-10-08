"use client";

import { useState, useRef, useEffect } from "react";
import { ArrowUpRight, FileDown, FileSpreadsheet, Loader2, X, AlertCircle, CheckCircle2 } from "lucide-react";
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
  buttonLabel = "Export"
}: ExportMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "exporting" | "generating" | "ready" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getEndpoint = (format: "pdf" | "csv") => {
    let path = "";

    switch (type) {
      case "overview":
        path = `overview.${format}`;
        break;
      case "claims":
        path = `claims.${format}`;
        break;
      case "claim_detail":
        path = `claims/${claimId || "CLM-1001"}.pdf`;
        break;
      case "review_queue":
        path = `review-queue.${format}`;
        break;
      case "evidence":
        path = `evidence.${format}`;
        break;
      case "risk_analytics":
        path = `risk-analytics.${format}`;
        break;
      case "audit_logs":
        path = `audit-logs.${format}`;
        break;
      default:
        path = `overview.${format}`;
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

  const handleExport = async (format: "pdf" | "csv") => {
    setIsOpen(false);
    setStatus("exporting");
    setErrorMessage(null);

    // Progression state
    setTimeout(() => {
      setStatus("generating");
    }, 300);

    try {
      const url = getEndpoint(format);
      const res = await fetch(url, {
        method: "GET",
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      // Extract filename from Content-Disposition header if available
      let filename = `trustlens-${type}-${new Date().toISOString().split("T")[0]}.${format}`;
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

      // Real browser download
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
      console.error("PDF Export Error:", err);
      setStatus("error");
      setErrorMessage("Unable to generate PDF. Please try again.");
      setTimeout(() => {
        setStatus("idle");
        setErrorMessage(null);
      }, 3500);
    }
  };

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      {/* Trigger Button */}
      <button
        type="button"
        disabled={status === "exporting" || status === "generating"}
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center px-3.5 py-2 bg-white border-2 border-[#111] rounded-[10px] neo-shadow-sm font-bold text-[13px] text-[#111] hover-neo-sm transition-transform disabled:opacity-60 ${className}`}
      >
        {status === "exporting" || status === "generating" ? (
          <>
            <Loader2 className="w-4 h-4 mr-1.5 animate-spin text-[#ff3d81]" />
            Generating PDF...
          </>
        ) : status === "ready" ? (
          <>
            <CheckCircle2 className="w-4 h-4 mr-1.5 text-green-600" />
            PDF Ready
          </>
        ) : status === "error" ? (
          <>
            <AlertCircle className="w-4 h-4 mr-1.5 text-red-600" />
            Export Failed
          </>
        ) : (
          <>
            {buttonLabel} <ArrowUpRight className="w-4 h-4 ml-1.5" strokeWidth={2.5} />
          </>
        )}
      </button>

      {/* Error message popup */}
      {errorMessage && (
        <div className="absolute right-0 top-12 z-50 w-64 p-2.5 bg-red-50 border-2 border-red-600 rounded-[10px] neo-shadow-sm text-[12px] font-bold text-red-700 animate-in fade-in">
          <div className="flex items-start">
            <AlertCircle className="w-4 h-4 mr-1.5 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        </div>
      )}

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border-2 border-[#111] rounded-[12px] neo-shadow-md z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
          <div className="p-1.5 space-y-1">
            <button
              onClick={() => handleExport("pdf")}
              className="w-full flex items-center px-3 py-2 text-[12px] font-bold text-[#111] rounded-[8px] hover:bg-[#ff3d81] transition-colors"
            >
              <FileDown className="w-4 h-4 mr-2" strokeWidth={2.5} />
              Export as PDF
            </button>
            <button
              onClick={() => handleExport("csv")}
              className="w-full flex items-center px-3 py-2 text-[12px] font-bold text-[#111] rounded-[8px] hover:bg-[#ffd23f] transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4 mr-2" strokeWidth={2.5} />
              Export as CSV
            </button>
            <div className="border-t border-[#111]/15 my-1" />
            <button
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center px-3 py-1.5 text-[11px] font-bold text-[#111]/70 rounded-[8px] hover:bg-gray-100 transition-colors"
            >
              <X className="w-3.5 h-3.5 mr-1.5" />
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
