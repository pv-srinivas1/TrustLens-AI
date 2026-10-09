"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Search, 
  Filter, 
  ArrowDownUp, 
  Plus, 
  X,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  Camera,
  Upload
} from "lucide-react";
import { useTrustLens } from "@/lib/store";
import { ExportMenu } from "@/components/ui/export-menu";
import { EvidencePicker, SelectedEvidence } from "@/components/evidence/evidence-picker";
import { apiUrl } from "@/lib/api";

export default function ClaimsPage() {
  const router = useRouter();
  const { claims, createClaim } = useTrustLens();

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPlatform, setFilterPlatform] = useState("ALL");
  const [filterRisk, setFilterRisk] = useState("ALL");
  const [filterSource, setFilterSource] = useState<"ALL" | "real" | "demo">("ALL");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  // Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdNotice, setCreatedNotice] = useState<string | null>(null);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  // Form State
  const [customer, setCustomer] = useState("Customer #821");
  const [orderId, setOrderId] = useState("ORD-98231");
  const [platform, setPlatform] = useState("Food Delivery");
  const [claimType, setClaimType] = useState("Damaged Product");
  const [amount, setAmount] = useState("749");
  const [currency, setCurrency] = useState("INR");
  const [description, setDescription] = useState("Package arrived severely smashed and wet.");
  const [selectedEvidence, setSelectedEvidence] = useState<SelectedEvidence | null>(null);

  // Filtering
  const filteredClaims = claims.filter((c) => {
    const matchesSearch = 
      c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.type.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPlatform = filterPlatform === "ALL" || c.platform === filterPlatform;
    const matchesRisk = filterRisk === "ALL" || c.riskLevel === filterRisk;

    const source = (c as any).sourceType || (c.type.includes("Package") ? "demo" : "real_upload");
    const matchesSource = 
      filterSource === "ALL" || 
      (filterSource === "demo" && source === "demo") || 
      (filterSource === "real" && source !== "demo");

    return matchesSearch && matchesPlatform && matchesRisk && matchesSource;
  });

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorNotice(null);
    setCreatedNotice(null);

    const parsedAmount = parseFloat(amount) || 500;
    const sourceType = selectedEvidence?.sourceType || "real_upload";
    const filename = selectedEvidence?.filename || "damage.jpg";

    try {
      // 1. Post to FastAPI backend if running
      const formData = new FormData();
      formData.append("customer_id", customer);
      formData.append("order_id", orderId);
      formData.append("claim_type", claimType);
      formData.append("amount", parsedAmount.toString());
      formData.append("currency", currency);
      formData.append("description", description);
      formData.append("source_type", sourceType);

      if (selectedEvidence?.file) {
        formData.append("file", selectedEvidence.file);
      } else if (sourceType === "demo") {
        formData.append("demo_filename", filename);
      }

      let backendData: any = null;
      try {
        const res = await fetch(apiUrl("api/v1/claims/"), {
          method: "POST",
          body: formData,
        });
        if (res.ok) {
          backendData = await res.json();
        } else {
          throw new Error("No connection to TrustLens API. Claim was not submitted.");
        }
      } catch (err) {
        console.error("Backend sync failed:", err);
        setErrorNotice("No connection to TrustLens API. Claim was not submitted.");
        setIsSubmitting(false);
        return; // Stop here, do not use localStorage fallback
      }

      // 2. Add to frontend store (using real backend results if available)
      const created = createClaim({
        customer,
        orderId,
        platform,
        type: claimType,
        amount: parsedAmount,
        currency,
        description,
        evidenceCount: 1,
        evidenceFile: selectedEvidence?.previewUrl || filename,
        evidenceSize: selectedEvidence?.fileSize || "2.4 MB",
        evidenceHash: backendData?.evidence_id ? `sha256-${backendData.evidence_id}` : "a9f43b77e81029da483cf29188e0182c402198be9031",
        evidenceDimensions: "1280 × 960",
      });

      // Synchronize with real backend verification outcomes
      if (backendData) {
        created.id = backendData.id || created.id;
        created.riskScore = backendData.risk_score ?? created.riskScore;
        created.riskLevel = backendData.risk_level ?? created.riskLevel;
        created.status = backendData.status === "UNDER_REVIEW" ? "Under Review" : (backendData.status === "PROCESSING" ? "Processing" : created.status);
        if (backendData.signals && Array.isArray(backendData.signals)) {
          created.signals = backendData.signals.map((s: any) => ({
            name: s.name,
            category: s.category || "Security",
            status: s.impact === "CRITICAL" ? "Warning" : (s.impact === "HIGH" ? "Warning" : "Checked"),
            impactScore: parseInt(s.weight?.replace("+", "") || "0"),
            detail: s.name
          }));
        }
      }

      // Attach source metadata
      (created as any).sourceType = sourceType;

      setCreatedNotice(backendData?.message || `Claim ${created.id} created successfully. Starting evidence verification...`);
      
      setTimeout(() => {
        setIsSubmitting(false);
        setIsCreateModalOpen(false);
        router.push(`/dashboard/claims/${created.id}`);
      }, 800);
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-2">
        <div>
          <h1 className="font-display text-[24px] sm:text-[28px] text-[#111] uppercase tracking-tight">Claims</h1>
          <p className="text-[13px] sm:text-[14px] text-[#111]/70 font-medium">Review and investigate customer claims.</p>
        </div>

        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center justify-center px-4 py-2.5 min-h-[44px] bg-[#3ddc97] border-2 border-[#111] rounded-[10px] neo-shadow-sm font-bold text-[13px] text-[#111] hover-neo-sm transition-transform shrink-0 w-full sm:w-auto"
        >
          <Plus className="w-4 h-4 mr-1.5" strokeWidth={3} /> + Create Claim
        </button>
      </div>

      {/* Control Bar: Search, Source Filter [All] [Real] [Demo], Sort, Export */}
      <div className="bg-white border-2 border-[#111] rounded-[14px] p-3 sm:p-4 neo-shadow-sm flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-[#111]" strokeWidth={2.5} />
          <input 
            type="text" 
            placeholder="Search claims, order IDs, customers..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 min-h-[44px] bg-[#fdf9f0] border-2 border-[#111] rounded-[10px] font-medium text-[13px] text-[#111] placeholder:text-[#111]/50 focus:outline-none focus:bg-white"
          />
        </div>

        <div className="flex items-center space-x-2 flex-wrap gap-y-2">
          {/* Source Tabs: [All] [Real] [Demo] */}
          <div className="flex items-center space-x-1 bg-[#fdf9f0] p-1 border-2 border-[#111] rounded-[10px]">
            {(["ALL", "real", "demo"] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setFilterSource(s)}
                className={`px-3 py-1.5 min-h-[36px] rounded-[6px] font-bold text-[11px] uppercase transition-all ${
                  filterSource === s
                    ? "bg-[#111] text-white"
                    : "text-[#111] hover:bg-white"
                }`}
              >
                {s === "ALL" ? "All Sources" : s === "real" ? "Real" : "Demo"}
              </button>
            ))}
          </div>

          {/* Filter Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className={`flex items-center px-3 py-2 min-h-[44px] border-2 border-[#111] rounded-[10px] neo-shadow-sm font-bold text-[12px] text-[#111] hover-neo-sm transition-transform ${
                filterPlatform !== "ALL" || filterRisk !== "ALL" ? "bg-[#ffd23f]" : "bg-white"
              }`}
            >
              <Filter className="w-3.5 h-3.5 mr-1.5" strokeWidth={2.5} />
              Filter
            </button>

            {showFilterDropdown && (
              <div className="absolute right-0 top-12 z-30 w-56 max-w-[calc(100vw-32px)] bg-white border-2 border-[#111] rounded-[12px] neo-shadow-md p-3 space-y-3">
                <div>
                  <label className="font-mono text-[10px] font-bold uppercase text-[#111]/70 block mb-1">Platform</label>
                  <select 
                    value={filterPlatform} 
                    onChange={(e) => setFilterPlatform(e.target.value)}
                    className="w-full p-2 bg-[#fdf9f0] border-2 border-[#111] rounded-[8px] text-[12px] font-medium"
                  >
                    <option value="ALL">All Platforms</option>
                    <option value="Food Delivery">Food Delivery</option>
                    <option value="E-Commerce">E-Commerce</option>
                    <option value="Quick Commerce">Quick Commerce</option>
                    <option value="Logistics">Logistics</option>
                  </select>
                </div>

                <div>
                  <label className="font-mono text-[10px] font-bold uppercase text-[#111]/70 block mb-1">Risk Band</label>
                  <select 
                    value={filterRisk} 
                    onChange={(e) => setFilterRisk(e.target.value)}
                    className="w-full p-2 bg-[#fdf9f0] border-2 border-[#111] rounded-[8px] text-[12px] font-medium"
                  >
                    <option value="ALL">All Risk Bands</option>
                    <option value="CRITICAL">Critical</option>
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                  </select>
                </div>

                <button 
                  onClick={() => { setFilterPlatform("ALL"); setFilterRisk("ALL"); setShowFilterDropdown(false); }}
                  className="w-full py-1 text-[11px] font-bold text-[#ff3d81] hover:underline"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>

          <button 
            onClick={() => setFilterRisk(filterRisk === "ALL" ? "HIGH" : "ALL")}
            className="flex items-center px-3 py-2 min-h-[44px] bg-white border-2 border-[#111] rounded-[10px] neo-shadow-sm font-bold text-[12px] text-[#111] hover-neo-sm transition-transform"
          >
            <ArrowDownUp className="w-3.5 h-3.5 mr-1.5" strokeWidth={2.5} /> Sort
          </button>

          {/* REAL EXPORT MENU WITH PDF & CSV */}
          <ExportMenu 
            type="claims" 
            queryParams={{ 
              search: searchTerm, 
              platform: filterPlatform, 
              risk: filterRisk, 
              source_type: filterSource === "ALL" ? "" : filterSource 
            }} 
          />
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white border-2 border-[#111] rounded-[14px] sm:rounded-[16px] p-3 sm:p-6 neo-shadow-md w-full overflow-x-auto">
        {filteredClaims.length === 0 ? (
          <div className="py-16 text-center">
            <p className="font-bold text-[16px] text-[#111]">No claims found.</p>
            <p className="text-[13px] text-[#111]/60 mt-1 mb-4">No records match your search or filter criteria.</p>
            <button 
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center px-4 py-2 bg-[#ff3d81] border-2 border-[#111] rounded-[10px] neo-shadow-sm font-bold text-[12px] text-[#111]"
            >
              <Plus className="w-4 h-4 mr-1.5" /> + Create Claim
            </button>
          </div>
        ) : (
          <table className="w-full min-w-[950px] text-left">
            <thead>
              <tr className="border-b-2 border-[#111]">
                <th className="py-3 px-3 font-mono font-bold text-[11px] tracking-wider uppercase text-[#111]">Claim ID</th>
                <th className="py-3 px-3 font-mono font-bold text-[11px] tracking-wider uppercase text-[#111]">Customer</th>
                <th className="py-3 px-3 font-mono font-bold text-[11px] tracking-wider uppercase text-[#111]">Source</th>
                <th className="py-3 px-3 font-mono font-bold text-[11px] tracking-wider uppercase text-[#111]">Claim Type</th>
                <th className="py-3 px-3 font-mono font-bold text-[11px] tracking-wider uppercase text-[#111] text-right">Amount</th>
                <th className="py-3 px-3 font-mono font-bold text-[11px] tracking-wider uppercase text-[#111]">Risk</th>
                <th className="py-3 px-3 font-mono font-bold text-[11px] tracking-wider uppercase text-[#111]">Status</th>
                <th className="py-3 px-3 font-mono font-bold text-[11px] tracking-wider uppercase text-[#111]">Created</th>
                <th className="py-3 px-3 font-mono font-bold text-[11px] tracking-wider uppercase text-[#111] text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredClaims.map((claim) => {
                const isDemo = (claim as any).sourceType === "demo" || claim.type.includes("Package");
                return (
                  <tr key={claim.id} className="border-b-2 border-[#111]/10 hover:bg-[#fdf9f0] transition-colors group">
                    <td className="py-3.5 px-3 font-mono font-bold text-[13px] text-[#111]">
                      <Link href={`/dashboard/claims/${claim.id}`} className="hover:underline flex items-center">
                        {claim.id}
                        <ExternalLink className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    </td>
                    <td className="py-3.5 px-3 font-medium text-[13px] text-[#111]">{claim.customer}</td>
                    <td className="py-3.5 px-3">
                      {isDemo ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full border border-[#111] text-[10px] font-display uppercase tracking-wider bg-[#c8a2ff] text-[#111]">
                          DEMO
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full border border-[#111] text-[10px] font-display uppercase tracking-wider bg-[#3ddc97] text-[#111]">
                          REAL
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-3 font-semibold text-[13px] text-[#111]">{claim.type}</td>
                    <td className="py-3.5 px-3 font-mono font-bold text-[13px] text-right text-[#111]">
                      ₹{claim.amount.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full border-2 border-[#111] font-mono font-bold text-[11px] ${
                        claim.riskLevel === 'CRITICAL' ? 'bg-[#c8a2ff]' :
                        claim.riskLevel === 'HIGH' ? 'bg-[#ff3d81]' : 
                        claim.riskLevel === 'MEDIUM' ? 'bg-[#ffd23f]' : 'bg-[#3ddc97]'
                      }`}>
                        {claim.riskLevel} {claim.riskScore}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="font-bold text-[11px] uppercase tracking-wider text-[#111] px-2 py-0.5 bg-white border border-[#111] rounded-md">
                        {claim.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 font-mono text-[12px] text-[#111]/70">{claim.createdAt}</td>
                    <td className="py-3.5 px-3 text-right">
                      <Link
                        href={`/dashboard/claims/${claim.id}`}
                        className="inline-flex items-center px-3 py-1 bg-white border-2 border-[#111] rounded-[8px] neo-shadow-sm font-bold text-[11px] uppercase tracking-wider hover-neo-sm transition-transform"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* CREATE CLAIM MODAL WITH REAL UPLOAD / CAMERA / DEMO SCENARIOS */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-[#111]/50 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-[calc(100vw-20px)] sm:max-w-2xl bg-white border-2 border-[#111] rounded-[16px] sm:rounded-[20px] neo-shadow-lg flex flex-col max-h-[90vh] overflow-hidden">
            
            <div className="flex items-center justify-between p-4 sm:p-6 border-b-2 border-[#111] bg-[#fdf9f0]">
              <div className="pr-2">
                <h2 className="font-display text-[18px] sm:text-[22px] uppercase text-[#111] leading-tight">Create Claim</h2>
                <p className="text-[11px] sm:text-[12px] text-[#111]/70 font-medium">Enter claim metadata and provide supporting customer evidence.</p>
              </div>
              <button 
                onClick={() => setIsCreateModalOpen(false)}
                className="w-10 h-10 min-w-[40px] flex items-center justify-center bg-[#ff3d81] border-2 border-[#111] rounded-[8px] neo-shadow-sm hover-neo-sm transition-transform shrink-0"
                aria-label="Close Create Claim Modal"
              >
                <X className="w-5 h-5 text-[#111]" strokeWidth={3} />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-4 sm:space-y-5">
              {createdNotice && (
                <div className="p-3 bg-[#3ddc97] border-2 border-[#111] rounded-[10px] flex items-center text-[13px] font-bold">
                  <CheckCircle2 className="w-5 h-5 mr-2 shrink-0" />
                  <span>{createdNotice}</span>
                </div>
              )}

              {errorNotice && (
                <div className="p-3 bg-[#ff3d81] text-white border-2 border-[#111] rounded-[10px] flex items-center text-[13px] font-bold">
                  <X className="w-5 h-5 mr-2 shrink-0" />
                  <span>{errorNotice}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-[12px] uppercase tracking-wide text-[#111]">Customer</label>
                  <input 
                    type="text" 
                    value={customer}
                    onChange={(e) => setCustomer(e.target.value)}
                    required
                    placeholder="e.g. Customer #821" 
                    className="w-full px-3.5 py-2.5 min-h-[44px] bg-[#fdf9f0] border-2 border-[#111] rounded-[10px] font-medium text-[13px] focus:outline-none focus:bg-white neo-shadow-sm" 
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-[12px] uppercase tracking-wide text-[#111]">Order ID</label>
                  <input 
                    type="text" 
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    required
                    placeholder="e.g. ORD-98231" 
                    className="w-full px-3.5 py-2.5 min-h-[44px] bg-[#fdf9f0] border-2 border-[#111] rounded-[10px] font-medium text-[13px] focus:outline-none focus:bg-white neo-shadow-sm" 
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-[12px] uppercase tracking-wide text-[#111]">Platform</label>
                  <select 
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    className="w-full px-3.5 py-2.5 min-h-[44px] bg-[#fdf9f0] border-2 border-[#111] rounded-[10px] font-medium text-[13px] focus:outline-none focus:bg-white neo-shadow-sm"
                  >
                    <option value="Food Delivery">Food Delivery</option>
                    <option value="E-Commerce">E-Commerce</option>
                    <option value="Quick Commerce">Quick Commerce</option>
                    <option value="Logistics">Logistics</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-[12px] uppercase tracking-wide text-[#111]">Claim Type</label>
                  <select 
                    value={claimType}
                    onChange={(e) => setClaimType(e.target.value)}
                    className="w-full px-3.5 py-2.5 min-h-[44px] bg-[#fdf9f0] border-2 border-[#111] rounded-[10px] font-medium text-[13px] focus:outline-none focus:bg-white neo-shadow-sm"
                  >
                    <option value="Damaged Product">Damaged Product</option>
                    <option value="Missing Item">Missing Item</option>
                    <option value="Wrong Item">Wrong Item</option>
                    <option value="Delivery Issue">Delivery Issue</option>
                    <option value="Food Quality">Food Quality</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-[12px] uppercase tracking-wide text-[#111]">Claim Amount</label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 font-bold text-[13px]">₹</span>
                    <input 
                      type="number" 
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                      placeholder="749" 
                      className="w-full pl-8 pr-3 py-2.5 min-h-[44px] bg-[#fdf9f0] border-2 border-[#111] rounded-[10px] font-mono font-bold text-[13px] focus:outline-none focus:bg-white neo-shadow-sm" 
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-[12px] uppercase tracking-wide text-[#111]">Currency</label>
                  <select 
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full px-3.5 py-2.5 min-h-[44px] bg-[#fdf9f0] border-2 border-[#111] rounded-[10px] font-medium text-[13px] focus:outline-none focus:bg-white neo-shadow-sm"
                  >
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-[12px] uppercase tracking-wide text-[#111]">Description</label>
                <textarea 
                  rows={2} 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the claim incident in detail..." 
                  className="w-full px-3.5 py-2.5 bg-[#fdf9f0] border-2 border-[#111] rounded-[10px] font-medium text-[13px] focus:outline-none focus:bg-white neo-shadow-sm resize-none" 
                />
              </div>

              {/* THREE-OPTION EVIDENCE PICKER (REAL UPLOAD, REAL CAMERA, DEMO SCENARIO) */}
              <EvidencePicker 
                claimType={claimType} 
                onEvidenceSelected={(ev) => setSelectedEvidence(ev)} 
              />

              {/* Actions */}
              <div className="flex flex-col-reverse sm:flex-row gap-2.5 sm:space-x-3 pt-3 border-t-2 border-[#111] items-stretch sm:items-center justify-end">
                <button 
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="w-full sm:w-auto px-5 py-2.5 min-h-[44px] bg-white border-2 border-[#111] rounded-[10px] neo-shadow-sm font-bold text-[13px] text-[#111] hover-neo-sm transition-transform"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-6 py-2.5 min-h-[44px] bg-[#3ddc97] border-2 border-[#111] rounded-[10px] neo-shadow-sm font-bold text-[13px] text-[#111] hover-neo-sm transition-transform disabled:opacity-50"
                >
                  {isSubmitting ? "Creating & Triaging..." : "Create Claim & Verify"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
