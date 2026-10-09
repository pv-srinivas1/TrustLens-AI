"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { 
  Layers, 
  Search, 
  Upload, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  ExternalLink, 
  X,
  Eye,
  Camera,
  Copy
} from "lucide-react";
import { useTrustLens } from "@/lib/store";
import { EvidenceItem } from "@/lib/data";
import { ExportMenu } from "@/components/ui/export-menu";

function EvidenceContent() {
  const { evidence, addEvidence } = useTrustLens();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState("");
  const [sourceFilter, setSourceFilter] = useState<"ALL" | "real" | "demo">("ALL");
  const [activeFilter, setActiveFilter] = useState<"All" | "Duplicates" | "Images" | "Videos" | "Processing" | "Completed" | "Failed">("All");

  // Automatically activate Duplicates filter if query parameter is ?tab=duplicates
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "duplicates") {
      setActiveFilter("Duplicates");
    }
  }, [searchParams]);

  // Inspector Modal
  const [inspectedItem, setInspectedItem] = useState<EvidenceItem | null>(null);

  // Upload Modal
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadClaimId, setUploadClaimId] = useState("CLM-1001");
  const [uploadFilename, setUploadFilename] = useState("damage_extra.jpg");
  const [copiedHash, setCopiedHash] = useState(false);

  // Filter
  const filteredEvidence = evidence.filter((item) => {
    const matchesSearch = 
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.claimId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.filename.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    const itemSource = (item as any).sourceType || (item.claimId === "CLM-1001" || item.filename.includes("package") || item.filename.includes("crush") ? "demo" : "real_upload");
    const matchesSource = 
      sourceFilter === "ALL" || 
      (sourceFilter === "demo" && itemSource === "demo") || 
      (sourceFilter === "real" && itemSource !== "demo");

    if (!matchesSource) return false;

    if (activeFilter === "Duplicates") return (item as any).duplicateMatch !== undefined;
    if (activeFilter === "Images") return item.fileType === "JPG" || item.fileType === "PNG";
    if (activeFilter === "Videos") return item.fileType === "MP4";
    if (activeFilter === "Processing") return item.analysisStatus === "Processing";
    if (activeFilter === "Completed") return item.analysisStatus === "Completed";
    if (activeFilter === "Failed") return item.analysisStatus === "Failed";

    return true;
  });

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addEvidence({
      claimId: uploadClaimId,
      filename: uploadFilename,
      fileType: "JPG",
      fileSize: "2.8 MB",
      dimensions: "1920 × 1440",
      hash: "7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069",
      imageSrc: "/damage.jpg",
      c2pa: "Not detected",
      synthId: "Not detected",
      forensics: {
        metadata: "Samsung SM-S918B",
        compressionAnomaly: false,
        manipulationIndicators: false,
      },
      ocr: {
        orderId: uploadClaimId,
        product: "Direct Photo Ingest",
        rawText: "RAW CAPTURE",
      }
    });

    setIsUploadModalOpen(false);
  };

  const copyHashToClipboard = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 1500);
  };

  return (
    <div className="space-y-2 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pt-2">
        <div>
          <h1 className="font-display text-[16px] sm:text-[28px] text-[#111] uppercase tracking-tight flex items-center">
            <Layers className="w-6 h-6 sm:w-7 sm:h-7 mr-2 sm:mr-2.5 text-[#ff3d81]" strokeWidth={2.5} />
            Evidence Explorer
          </h1>
          <p className="text-[13px] sm:text-[14px] text-[#111]/70 font-medium">Inspect uploaded claim evidence, duplicate matches, and forensic signals.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:space-x-3 w-full sm:w-auto">
          <ExportMenu 
            type="evidence" 
            queryParams={{ source_type: sourceFilter === "ALL" ? "" : sourceFilter }} 
          />
          <button 
            onClick={() => setIsUploadModalOpen(true)}
            className="flex-1 sm:flex-none flex items-center justify-center px-4 py-2.5 min-h-[32px] bg-[#3ddc97] border-2 border-[#111] rounded-[10px] neo-shadow-sm font-bold text-[13px] text-[#111] hover-neo-sm transition-transform"
          >
            <Upload className="w-4 h-4 mr-1.5" strokeWidth={2.5} /> Upload Evidence
          </button>
        </div>
      </div>

      {/* Search & Filter Pills */}
      <div className="bg-white border-2 border-[#111] rounded-[14px] p-3 sm:p-2 neo-shadow-sm flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-[#111]" strokeWidth={2.5} />
          <input 
            type="text" 
            placeholder="Search evidence ID, Claim ID, filename..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 min-h-[32px] bg-[#fdf9f0] border-2 border-[#111] rounded-[10px] font-medium text-[13px] text-[#111] placeholder:text-[#111]/50 focus:outline-none focus:bg-white"
          />
        </div>

        <div className="flex items-center space-x-2 flex-wrap gap-y-2">
          {/* Source Tabs: [All] [Real] [Demo] */}
          <div className="flex items-center space-x-1 bg-[#fdf9f0] p-1 border-2 border-[#111] rounded-[10px]">
            {(["ALL", "real", "demo"] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSourceFilter(s)}
                className={`px-3 py-1.5 min-h-[36px] rounded-[6px] font-bold text-[11px] uppercase transition-all ${
                  sourceFilter === s
                    ? "bg-[#111] text-white"
                    : "text-[#111] hover:bg-white"
                }`}
              >
                {s === "ALL" ? "All Sources" : s === "real" ? "Real" : "Demo"}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {(["All", "Duplicates", "Images", "Videos", "Processing", "Completed", "Failed"] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-3 py-1.5 min-h-[38px] border-2 border-[#111] rounded-[8px] font-bold text-[12px] whitespace-nowrap transition-transform ${
                  activeFilter === filter
                    ? "bg-[#ffd23f] text-[#111] neo-shadow-sm"
                    : "bg-white text-[#111] hover:bg-[#fdf9f0]"
                }`}
              >
                {filter === "Duplicates" ? "⚠ Duplicates" : filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* MOBILE EVIDENCE GALLERY: 1 column on small phones, 2 columns on larger phones */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:hidden gap-3.5">
        {filteredEvidence.length === 0 ? (
          <div className="col-span-full py-12 text-center bg-white border-2 border-[#111] rounded-[14px] p-2">
            <p className="font-bold text-[15px] text-[#111]">No evidence found</p>
            <p className="text-[12px] text-[#111]/60 mt-1">Try resetting search or filter criteria.</p>
          </div>
        ) : (
          filteredEvidence.map((ev) => {
            const evSource = (ev as any).sourceType || (ev.claimId === "CLM-1001" || ev.filename.includes("package") || ev.filename.includes("crush") ? "demo" : "real_upload");
            const isDemo = evSource === "demo";
            const isCamera = evSource === "camera_capture";

            return (
              <div 
                key={ev.id} 
                className="bg-white border-2 border-[#111] rounded-[14px] p-3 neo-shadow-sm flex flex-col justify-between space-y-3"
              >
                {/* Full-width responsive thumbnail */}
                <div className="relative w-full aspect-[4/3] bg-[#fdf9f0] border-2 border-[#111] rounded-[10px] overflow-hidden flex items-center justify-center">
                  <img 
                    src={ev.imageSrc || "/damage.jpg"} 
                    alt={ev.filename} 
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      if (!target.src.includes("/damage.jpg")) {
                        target.src = "/damage.jpg";
                      }
                    }}
                  />
                  <div className="absolute top-2 left-2">
                    <span className={`px-2 py-0.5 rounded border border-[#111] font-bold text-[9px] uppercase font-mono neo-shadow-xs ${
                      isDemo ? 'bg-[#ffd23f] text-[#111]' : isCamera ? 'bg-[#a0e7e5] text-[#111]' : 'bg-[#3ddc97] text-[#111]'
                    }`}>
                      {isDemo ? 'Demo' : isCamera ? 'Camera' : 'Real Upload'}
                    </span>
                  </div>
                  <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-[#111] text-white font-mono text-[9px] font-bold rounded">
                    {ev.fileType} • {ev.fileSize}
                  </div>
                </div>

                {/* Card Info */}
                <div className="space-y-1 text-[12px]">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-[#111]">{ev.id}</span>
                    <span className={`px-2 py-0.5 rounded-full border border-[#111] font-mono text-[10px] font-bold ${
                      ev.analysisStatus === 'Completed' ? 'bg-[#3ddc97]' :
                      ev.analysisStatus === 'Processing' ? 'bg-[#ffd23f]' : 'bg-[#ff6b5e]'
                    }`}>
                      {ev.analysisStatus}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[#111]/70 font-mono text-[11px]">
                    <span>Claim: <Link href={`/dashboard/claims/${ev.claimId}`} className="font-bold text-[#111] underline">{ev.claimId}</Link></span>
                    <span>{ev.uploadedAt}</span>
                  </div>
                  <div className="font-mono text-[11px] text-[#111]/80 truncate">{ev.filename}</div>

                  {ev.duplicateMatch && (
                    <div className="mt-1 px-2 py-1 bg-[#ffd23f]/30 border border-[#111] rounded text-[10px] font-bold text-amber-900 flex items-center">
                      <AlertTriangle className="w-3 h-3 mr-1 shrink-0" />
                      <span>{ev.duplicateMatch.similarity}% match to {ev.duplicateMatch.matchedEvidenceId}</span>
                    </div>
                  )}
                </div>

                {/* Inspect Action */}
                <button
                  onClick={() => setInspectedItem(ev)}
                  className="w-full py-2.5 min-h-[32px] bg-white border-2 border-[#111] rounded-[8px] neo-shadow-sm font-bold text-[12px] uppercase tracking-wider flex items-center justify-center hover-neo-sm transition-transform"
                >
                  <Eye className="w-4 h-4 mr-1.5" /> Inspect Analysis
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* DESKTOP TABLE: Visible on md: and above */}
      <div className="hidden md:block bg-white border-2 border-[#111] rounded-[16px] p-2 neo-shadow-md overflow-x-auto">
        <table className="w-full min-w-[950px] text-left">
          <thead>
            <tr className="border-b-2 border-[#111]">
              <th className="py-3 px-3 font-mono font-bold text-[11px] uppercase tracking-wider text-[#111]">Preview</th>
              <th className="py-3 px-3 font-mono font-bold text-[11px] uppercase tracking-wider text-[#111]">Evidence ID</th>
              <th className="py-3 px-3 font-mono font-bold text-[11px] uppercase tracking-wider text-[#111]">Claim</th>
              <th className="py-3 px-3 font-mono font-bold text-[11px] uppercase tracking-wider text-[#111]">Source</th>
              <th className="py-3 px-3 font-mono font-bold text-[11px] uppercase tracking-wider text-[#111]">File</th>
              <th className="py-3 px-3 font-mono font-bold text-[11px] uppercase tracking-wider text-[#111]">Type</th>
              <th className="py-3 px-3 font-mono font-bold text-[11px] uppercase tracking-wider text-[#111]">Size</th>
              <th className="py-3 px-3 font-mono font-bold text-[11px] uppercase tracking-wider text-[#111]">Analysis</th>
              <th className="py-3 px-3 font-mono font-bold text-[11px] uppercase tracking-wider text-[#111]">Uploaded</th>
              <th className="py-3 px-3 font-mono font-bold text-[11px] uppercase tracking-wider text-[#111] text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvidence.map((ev) => {
              const evSource = (ev as any).sourceType || (ev.claimId === "CLM-1001" || ev.filename.includes("package") || ev.filename.includes("crush") ? "demo" : "real_upload");
              const isDemo = evSource === "demo";
              const isCamera = evSource === "camera_capture";

              return (
                <tr key={ev.id} className="border-b-2 border-[#111]/10 hover:bg-[#fdf9f0] transition-colors">
                  <td className="py-3 px-3">
                    <div className="relative w-12 h-10 bg-[#fdf9f0] border-2 border-[#111] rounded-[6px] overflow-hidden flex items-center justify-center">
                      <img 
                        src={ev.imageSrc || "/damage.jpg"} 
                        alt={ev.filename} 
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          if (!target.src.includes("/damage.jpg")) {
                            target.src = "/damage.jpg";
                          }
                        }}
                      />
                      {isDemo && (
                        <div className="absolute top-0 right-0 bg-[#ffd23f] text-[#111] font-mono text-[8px] font-black px-1 border-l border-b border-[#111]">
                          DEMO
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-3.5 px-3 font-mono font-bold text-[13px] text-[#111]">
                    <button 
                      onClick={() => setInspectedItem(ev)} 
                      className="hover:underline font-bold text-left"
                    >
                      {ev.id}
                    </button>
                  </td>
                  <td className="py-3.5 px-3 font-mono text-[13px]">
                    <Link href={`/dashboard/claims/${ev.claimId}`} className="hover:underline font-bold text-[#111]">
                      {ev.claimId}
                    </Link>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className={`px-2 py-0.5 rounded border border-[#111] font-bold text-[10px] uppercase font-mono ${
                      isDemo ? 'bg-[#ffd23f] text-[#111]' : isCamera ? 'bg-[#a0e7e5] text-[#111]' : 'bg-[#3ddc97] text-[#111]'
                    }`}>
                      {isDemo ? 'Demo' : isCamera ? 'Camera' : 'User Upload'}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 font-mono text-[13px] text-[#111]/80">{ev.filename}</td>
                  <td className="py-3.5 px-3 font-mono text-[12px] font-bold">{ev.fileType}</td>
                  <td className="py-3.5 px-3 font-mono text-[12px] text-[#111]/70">{ev.fileSize}</td>
                  <td className="py-3.5 px-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full border border-[#111] font-mono text-[11px] font-bold ${
                      ev.analysisStatus === 'Completed' ? 'bg-[#3ddc97]' :
                      ev.analysisStatus === 'Processing' ? 'bg-[#ffd23f]' : 'bg-[#ff6b5e]'
                    }`}>
                      {ev.analysisStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 font-mono text-[12px] text-[#111]/70">{ev.uploadedAt}</td>
                  <td className="py-3.5 px-3 text-right">
                    <button
                      onClick={() => setInspectedItem(ev)}
                      className="inline-flex items-center px-3 py-1 bg-white border-2 border-[#111] rounded-[8px] neo-shadow-sm font-bold text-[11px] uppercase tracking-wider hover-neo-sm transition-transform"
                    >
                      <Eye className="w-3.5 h-3.5 mr-1" /> View
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Evidence Detail Inspector Modal */}
      {inspectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-2 bg-[#111]/50 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-[calc(100vw-20px)] sm:max-w-4xl bg-white border-2 border-[#111] rounded-[16px] sm:rounded-[20px] neo-shadow-lg flex flex-col max-h-[90vh] overflow-hidden">
            
            {/* Modal Top */}
            <div className="flex items-center justify-between p-2 sm:p-2 border-b-2 border-[#111] bg-[#fdf9f0]">
              <div className="flex items-center space-x-2 sm:space-x-3 flex-wrap pr-2">
                <span className="font-display text-[17px] sm:text-[22px] text-[#111] uppercase">
                  Evidence {inspectedItem.id}
                </span>
                <span className="font-mono text-[11px] sm:text-[12px] bg-white border border-[#111] px-2 py-0.5 rounded font-bold">
                  Claim: {inspectedItem.claimId}
                </span>
              </div>
              <button 
                onClick={() => setInspectedItem(null)}
                className="w-10 h-10 min-w-[40px] flex items-center justify-center bg-[#ff3d81] border-2 border-[#111] rounded-[8px] neo-shadow-sm hover-neo-sm transition-transform shrink-0"
                aria-label="Close Inspector Modal"
              >
                <X className="w-5 h-5 text-[#111]" strokeWidth={3} />
              </button>
            </div>

            <div className="p-2 sm:p-2 overflow-y-auto space-y-5 sm:space-y-2">
              
              {/* Image & Primary Metadata (Stacked on mobile, side-by-side on desktop) */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-2 sm:gap-2">
                
                {/* 1. Evidence Viewer (Appears FIRST) */}
                <div className="md:col-span-7">
                  <div className="relative aspect-[4/3] bg-[#fdf9f0] border-2 border-[#111] rounded-[12px] sm:rounded-[14px] overflow-hidden neo-shadow-sm flex items-center justify-center">
                    <img 
                      src={inspectedItem.imageSrc || "/damage.jpg"} 
                      alt={inspectedItem.filename} 
                      className="w-full h-full object-cover" 
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (!target.src.includes("/damage.jpg")) {
                          target.src = "/damage.jpg";
                        }
                      }}
                    />
                    <div className="absolute top-2 right-2 px-2.5 py-1 bg-[#111] text-white font-mono text-[10px] font-bold rounded">
                      ACTUAL IMAGE
                    </div>
                  </div>
                </div>

                {/* 2. Evidence Information Specs */}
                <div className="md:col-span-5 space-y-3">
                  <div className="bg-[#fdf9f0] border-2 border-[#111] rounded-[12px] sm:rounded-[14px] p-2 space-y-2 text-[12px]">
                    <div className="flex justify-between items-center">
                      <span className="text-[#111]/70 font-medium">Source:</span>
                      <span className={`font-bold text-[11px] px-2 py-0.5 rounded border border-[#111] ${
                        (inspectedItem as any).sourceType === 'demo' || inspectedItem.claimId === 'CLM-1001' ? 'bg-[#ffd23f]' : 'bg-[#3ddc97]'
                      }`}>
                        {(inspectedItem as any).sourceType === 'demo' || inspectedItem.claimId === 'CLM-1001' ? 'Demo Evidence' : 'User Upload'}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-[#111]/70 font-medium">File:</span>
                      <span className="font-mono font-bold text-[#111]">{inspectedItem.filename}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-[#111]/70 font-medium">Size:</span>
                      <span className="font-mono font-bold text-[#111]">{inspectedItem.fileSize}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-[#111]/70 font-medium">Dimensions:</span>
                      <span className="font-mono font-bold text-[#111]">{inspectedItem.dimensions}</span>
                    </div>

                    <div className="pt-2 border-t border-[#111]/10">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[#111]/70 font-medium">SHA-256:</span>
                        <button 
                          onClick={() => copyHashToClipboard(inspectedItem.hash)}
                          className="text-[11px] font-mono font-bold text-[#ff3d81] hover:underline flex items-center"
                        >
                          <Copy className="w-3 h-3 mr-1" /> {copiedHash ? "Copied!" : "Copy"}
                        </button>
                      </div>
                      <div className="font-mono text-[10px] sm:text-[11px] p-1.5 bg-white border border-[#111] rounded break-all">
                        {inspectedItem.hash}
                      </div>
                    </div>
                  </div>

                  <Link
                    href={`/dashboard/claims/${inspectedItem.claimId}`}
                    className="w-full py-2.5 min-h-[32px] text-center bg-[#ff3d81] border-2 border-[#111] rounded-[10px] neo-shadow-sm font-bold text-[13px] text-[#111] flex items-center justify-center hover-neo-sm transition-transform"
                  >
                    Open Associated Claim ({inspectedItem.claimId})
                  </Link>
                </div>
              </div>

              {/* 3. Analysis Modules: Provenance, Forensics, OCR */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-2">
                
                {/* Provenance */}
                <div className="bg-white border-2 border-[#111] rounded-[14px] p-2 neo-shadow-sm space-y-2">
                  <h4 className="font-display text-[13px] uppercase text-[#111] border-b-2 border-[#111] pb-1">
                    Provenance
                  </h4>
                  <div className="text-[12px] space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-[#111]/70">C2PA Manifest:</span>
                      <span className="font-mono font-bold text-[#111]">{inspectedItem.c2pa}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#111]/70">SynthID:</span>
                      <span className="font-mono font-bold text-[#111]">{inspectedItem.synthId}</span>
                    </div>
                  </div>
                </div>

                {/* Forensics */}
                <div className="bg-white border-2 border-[#111] rounded-[14px] p-2 neo-shadow-sm space-y-2">
                  <h4 className="font-display text-[13px] uppercase text-[#111] border-b-2 border-[#111] pb-1">
                    Forensics
                  </h4>
                  <div className="text-[12px] space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-[#111]/70">Metadata:</span>
                      <span className="font-mono font-bold text-[#111]">{inspectedItem.forensics.metadata}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#111]/70">Compression:</span>
                      <span className={`font-mono font-bold ${inspectedItem.forensics.compressionAnomaly ? "text-amber-700" : "text-green-700"}`}>
                        {inspectedItem.forensics.compressionAnomaly ? "Detected" : "Normal"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#111]/70">Manipulation:</span>
                      <span className={`font-mono font-bold ${inspectedItem.forensics.manipulationIndicators ? "text-[#ff3d81]" : "text-green-700"}`}>
                        {inspectedItem.forensics.manipulationIndicators ? "Detected" : "Clean"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* OCR */}
                <div className="bg-white border-2 border-[#111] rounded-[14px] p-2 neo-shadow-sm space-y-2">
                  <h4 className="font-display text-[13px] uppercase text-[#111] border-b-2 border-[#111] pb-1">
                    OCR Extraction
                  </h4>
                  <div className="text-[12px] space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-[#111]/70">Order ID:</span>
                      <span className="font-mono font-bold text-[#111]">{inspectedItem.ocr.orderId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#111]/70">Product:</span>
                      <span className="font-medium text-[#111]">{inspectedItem.ocr.product}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. Duplicate Detection */}
              {inspectedItem.duplicateMatch && (
                <div className="bg-[#ffd23f]/30 border-2 border-[#111] rounded-[14px] p-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="font-bold text-[14px] text-[#111] flex items-center">
                      <AlertTriangle className="w-4 h-4 mr-1.5 shrink-0" />
                      Similar Evidence Detected ({inspectedItem.duplicateMatch.similarity}% visual match)
                    </h4>
                    <p className="text-[12px] text-[#111]/70 mt-0.5">
                      Matches previously submitted image {inspectedItem.duplicateMatch.matchedEvidenceId} from claim {inspectedItem.duplicateMatch.matchedClaimId}.
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 w-full sm:w-auto">
                    <Link
                      href={`/dashboard/claims/${inspectedItem.duplicateMatch.matchedClaimId}`}
                      className="w-full sm:w-auto px-4 py-2 min-h-[32px] bg-white border-2 border-[#111] rounded-[8px] neo-shadow-sm font-bold text-[12px] flex items-center justify-center hover-neo-sm transition-transform"
                    >
                      Open Claim
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Upload Evidence Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-2 bg-[#111]/50 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-[calc(100vw-20px)] sm:max-w-lg bg-white border-2 border-[#111] rounded-[16px] sm:rounded-[20px] neo-shadow-lg flex flex-col max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-2 sm:p-2 border-b-2 border-[#111] bg-[#fdf9f0]">
              <h3 className="font-display text-[18px] sm:text-[20px] uppercase text-[#111]">Upload Evidence</h3>
              <button 
                onClick={() => setIsUploadModalOpen(false)}
                className="w-10 h-10 min-w-[40px] flex items-center justify-center bg-[#ff3d81] border-2 border-[#111] rounded-[8px] neo-shadow-sm hover-neo-sm transition-transform shrink-0"
                aria-label="Close Upload Modal"
              >
                <X className="w-5 h-5 text-[#111]" strokeWidth={3} />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="p-2 sm:p-2 space-y-1 overflow-y-auto">
              <div className="space-y-1.5">
                <label className="font-bold text-[12px] uppercase tracking-wide">Attach to Claim</label>
                <input 
                  type="text" 
                  value={uploadClaimId}
                  onChange={(e) => setUploadClaimId(e.target.value)}
                  placeholder="CLM-1001"
                  required
                  className="w-full p-2.5 min-h-[32px] bg-[#fdf9f0] border-2 border-[#111] rounded-[10px] font-mono text-[13px] font-bold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-[12px] uppercase tracking-wide">Filename</label>
                <input 
                  type="text" 
                  value={uploadFilename}
                  onChange={(e) => setUploadFilename(e.target.value)}
                  placeholder="damage.jpg"
                  required
                  className="w-full p-2.5 min-h-[32px] bg-[#fdf9f0] border-2 border-[#111] rounded-[10px] font-mono text-[13px]"
                />
              </div>

              <div className="border-2 border-dashed border-[#111] rounded-[12px] p-2 sm:p-2 text-center bg-[#fdf9f0]">
                <Camera className="w-8 h-8 text-[#111] mx-auto mb-2" strokeWidth={2.5} />
                <p className="text-[13px] font-bold">Select image from device</p>
                <p className="text-[11px] text-[#111]/60 mt-1">Simulated evidence ingest with C2PA analysis</p>
              </div>

              <div className="flex flex-col-reverse sm:flex-row gap-2.5 sm:space-x-3 pt-3 border-t-2 border-[#111] items-stretch sm:items-center justify-end">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="w-full sm:w-auto px-4 py-2.5 min-h-[32px] bg-white border-2 border-[#111] rounded-[8px] neo-shadow-sm font-bold text-[12px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-5 py-2.5 min-h-[32px] bg-[#3ddc97] border-2 border-[#111] rounded-[8px] neo-shadow-sm font-bold text-[12px] text-[#111] hover-neo-sm transition-transform"
                >
                  Start Analysis
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function EvidencePage() {
  return (
    <Suspense fallback={
      <div className="p-8 flex items-center justify-center font-mono text-[13px] font-bold">
        Loading Evidence Explorer...
      </div>
    }>
      <EvidenceContent />
    </Suspense>
  );
}
