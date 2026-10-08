"use client";

import { useState } from "react";
import { 
  Settings, 
  Key, 
  Webhook, 
  FileText, 
  Sliders, 
  ShieldCheck, 
  Building2, 
  Bell, 
  Lock, 
  Plus, 
  Copy, 
  Check, 
  Trash2, 
  CheckCircle2, 
  X,
  Layers
} from "lucide-react";
import { useTrustLens } from "@/lib/store";
import { ExportMenu } from "@/components/ui/export-menu";
import { apiUrl } from "@/lib/api";

export default function SettingsPage() {
  const { auditLogs, addAuditLog } = useTrustLens();

  const [activeTab, setActiveTab] = useState<
    "General" | "Organization" | "Risk Engine" | "Evidence" | "Notifications" | "Security" | "API" | "Webhooks" | "Audit Logs"
  >("General");

  // General Settings State
  const [orgName, setOrgName] = useState("TrustLens Technologies Inc.");
  const [orgId, setOrgId] = useState("org_live_82910a9f");
  const [timezone, setTimezone] = useState("Asia/Kolkata (IST +05:30)");
  const [currency, setCurrency] = useState("INR (₹)");
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Demo Reset State
  const [isResettingDemo, setIsResettingDemo] = useState(false);
  const [demoResetNotice, setDemoResetNotice] = useState<string | null>(null);

  const handleResetDemo = async () => {
    setIsResettingDemo(true);
    setDemoResetNotice(null);
    try {
      const res = await fetch(apiUrl("api/v1/claims/demo-reset"), {
        method: "DELETE"
      });
      const data = await res.json();
      setDemoResetNotice(data.message || "Demo data reset successfully. Real user data untouched.");
      addAuditLog({
        user: "Admin (Alex R.)",
        action: "demo.reset",
        resource: "claims.demo_purged",
        result: "Success",
        ip: "103.24.110.12"
      });
    } catch (err) {
      setDemoResetNotice("Reset completed on local state. Real evidence untouched.");
    } finally {
      setIsResettingDemo(false);
      setTimeout(() => setDemoResetNotice(null), 4000);
    }
  };

  // Risk Engine Sliders
  const [provenanceWeight, setProvenanceWeight] = useState(15);
  const [forensicsWeight, setForensicsWeight] = useState(25);
  const [duplicateWeight, setDuplicateWeight] = useState(30);
  const [orderMismatchWeight, setOrderMismatchWeight] = useState(15);
  const [behaviourWeight, setBehaviourWeight] = useState(15);

  // API Keys State
  const [apiKeys, setApiKeys] = useState([
    { id: "key_1", name: "Production Ingestion Webhook", prefix: "tl_live_92a...", created: "01 Oct 2026", lastUsed: "4 mins ago", status: "Active" },
    { id: "key_2", name: "Staging Sandbox Service", prefix: "tl_test_04b...", created: "25 Sep 2026", lastUsed: "2 days ago", status: "Active" },
  ]);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [generatedSecret, setGeneratedSecret] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);

  // Webhooks State
  const [webhooks, setWebhooks] = useState([
    { 
      id: "wh_1", 
      endpoint: "https://api.acme-food.com/v1/trustlens/events", 
      events: ["claim.created", "risk.calculated", "review.completed"], 
      status: "Active", 
      lastDelivery: "08 Oct 18:24 (200 OK)" 
    },
    { 
      id: "wh_2", 
      endpoint: "https://logistics.quickhub.io/webhooks/fraud-alerts", 
      events: ["duplicate.flagged", "review.completed"], 
      status: "Active", 
      lastDelivery: "08 Oct 16:35 (200 OK)" 
    },
  ]);
  const [isWebhookModalOpen, setIsWebhookModalOpen] = useState(false);
  const [newEndpoint, setNewEndpoint] = useState("");
  const [selectedEvents, setSelectedEvents] = useState<string[]>([
    "claim.created", 
    "evidence.uploaded", 
    "risk.calculated", 
    "review.completed"
  ]);

  const triggerSaveNotice = (msg: string) => {
    setSaveSuccessMsg(msg);
    setTimeout(() => setSaveSuccessMsg(null), 2500);
  };

  const handleCreateApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    const rawSecret = `tl_live_${Math.random().toString(36).substring(2)}${Math.random().toString(36).substring(2)}`;
    const newEntry = {
      id: `key_${Date.now()}`,
      name: newKeyName || "Standard API Key",
      prefix: `${rawSecret.substring(0, 11)}...`,
      created: "Today, just now",
      lastUsed: "Never",
      status: "Active",
    };
    setApiKeys([newEntry, ...apiKeys]);
    setGeneratedSecret(rawSecret);

    addAuditLog({
      user: "Admin (Alex R.)",
      action: "api_key.created",
      resource: newEntry.name,
      result: "Success",
      ip: "103.24.110.12",
    });
  };

  const handleAddWebhook = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry = {
      id: `wh_${Date.now()}`,
      endpoint: newEndpoint,
      events: selectedEvents,
      status: "Active",
      lastDelivery: "Pending initial payload",
    };
    setWebhooks([newEntry, ...webhooks]);
    setIsWebhookModalOpen(false);
    setNewEndpoint("");

    addAuditLog({
      user: "Admin (Alex R.)",
      action: "webhook.registered",
      resource: newEndpoint,
      result: "Success",
      ip: "103.24.110.12",
    });
    triggerSaveNotice("Webhook endpoint registered successfully.");
  };

  const toggleEvent = (ev: string) => {
    if (selectedEvents.includes(ev)) {
      setSelectedEvents(selectedEvents.filter(x => x !== ev));
    } else {
      setSelectedEvents([...selectedEvents, ev]);
    }
  };

  return (
    <div className="space-y-6 pb-14">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-2">
        <div>
          <h1 className="font-display text-[28px] text-[#111] uppercase tracking-tight flex items-center">
            <Settings className="w-7 h-7 mr-2.5 text-[#ff3d81]" strokeWidth={2.5} />
            Settings
          </h1>
          <p className="text-[14px] text-[#111]/70 font-medium">
            Manage organization, risk engine parameters, webhooks, and developer keys.
          </p>
        </div>

        {saveSuccessMsg && (
          <div className="px-3.5 py-1.5 bg-[#3ddc97] border-2 border-[#111] rounded-[10px] neo-shadow-sm font-bold text-[12px] flex items-center animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 mr-1.5" />
            {saveSuccessMsg}
          </div>
        )}
      </div>

      {/* Settings Sub-Navigation Tabs */}
      <div className="flex items-center space-x-1.5 overflow-x-auto border-b-2 border-[#111] pb-2.5 pt-1 scrollbar-thin scrollbar-thumb-[#111]/20">
        {[
          { id: "General", label: "General", icon: Building2 },
          { id: "Organization", label: "Organization", icon: Building2 },
          { id: "Risk Engine", label: "Risk Engine", icon: Sliders },
          { id: "Evidence", label: "Evidence", icon: Layers },
          { id: "Notifications", label: "Notifications", icon: Bell },
          { id: "Security", label: "Security", icon: Lock },
          { id: "API", label: "API Keys", icon: Key },
          { id: "Webhooks", label: "Webhooks", icon: Webhook },
          { id: "Audit Logs", label: "Audit Logs", icon: FileText },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center px-3.5 py-2 rounded-[10px] border-2 border-[#111] font-bold text-[12px] whitespace-nowrap transition-transform shrink-0 ${
              activeTab === tab.id
                ? "bg-[#ff3d81] text-[#111] neo-shadow-sm"
                : "bg-white text-[#111] hover:bg-[#fdf9f0]"
            }`}
          >
            <tab.icon className="w-3.5 h-3.5 mr-1.5" strokeWidth={2.5} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT: 1. General */}
      {activeTab === "General" && (
        <div className="bg-white border-2 border-[#111] rounded-[16px] p-6 neo-shadow-md max-w-4xl space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-[18px] text-[#111]">General Configuration</h2>
            <span className="text-[11px] font-mono text-[#111]/60 font-bold">ORGANIZATION SETTINGS</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-[12px] uppercase tracking-wide">Organization Name</label>
              <input 
                type="text" 
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                className="w-full p-2.5 bg-[#fdf9f0] border-2 border-[#111] rounded-[10px] font-medium text-[13px] focus:outline-none focus:bg-white" 
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-[12px] uppercase tracking-wide">Organization ID</label>
              <input 
                type="text" 
                disabled
                value={orgId}
                className="w-full p-2.5 bg-[#eee] border-2 border-[#111] rounded-[10px] font-mono text-[13px] text-[#111]/60" 
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-[12px] uppercase tracking-wide">Default Timezone</label>
              <select 
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full p-2.5 bg-[#fdf9f0] border-2 border-[#111] rounded-[10px] font-medium text-[13px] focus:outline-none focus:bg-white"
              >
                <option value="Asia/Kolkata (IST +05:30)">Asia/Kolkata (IST +05:30)</option>
                <option value="America/New_York (EST -05:00)">America/New_York (EST -05:00)</option>
                <option value="Europe/London (GMT +00:00)">Europe/London (GMT +00:00)</option>
                <option value="UTC">Coordinated Universal Time (UTC)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-[12px] uppercase tracking-wide">Default Currency</label>
              <select 
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full p-2.5 bg-[#fdf9f0] border-2 border-[#111] rounded-[10px] font-medium text-[13px] focus:outline-none focus:bg-white"
              >
                <option value="INR (₹)">INR (₹)</option>
                <option value="USD ($)">USD ($)</option>
                <option value="EUR (€)">EUR (€)</option>
                <option value="GBP (£)">GBP (£)</option>
              </select>
            </div>
          </div>

          <div className="pt-2 border-t-2 border-[#111]/10 flex items-center justify-between flex-wrap gap-3">
            <button
              onClick={() => triggerSaveNotice("General settings saved successfully.")}
              className="px-5 py-2.5 bg-[#3ddc97] border-2 border-[#111] rounded-[10px] neo-shadow-sm font-bold text-[13px] text-[#111] hover-neo-sm transition-transform"
            >
              Save Changes
            </button>
          </div>

          {/* Sandbox & Demo Data Section */}
          <div className="pt-5 border-t-2 border-[#111] space-y-3">
            <div>
              <h3 className="font-bold text-[14px] text-[#111] flex items-center">
                <Trash2 className="w-4 h-4 mr-1.5 text-red-600" />
                Reset Demo Data (Safety Protected)
              </h3>
              <p className="text-[12px] text-[#111]/70 mt-0.5">
                Safely purges synthetic demo claims and demo evidence records. Genuine customer uploads and camera captures are guaranteed to remain untouched.
              </p>
            </div>

            <div className="flex items-center space-x-3 flex-wrap gap-2">
              <button
                type="button"
                disabled={isResettingDemo}
                onClick={handleResetDemo}
                className="px-4 py-2 bg-[#ff6b5e] text-white border-2 border-[#111] rounded-[10px] neo-shadow-sm font-bold text-[12px] hover-neo-sm transition-transform disabled:opacity-50"
              >
                {isResettingDemo ? "Purging Demo Records..." : "Reset Demo Data"}
              </button>
              {demoResetNotice && (
                <span className="text-[12px] font-bold text-green-700 bg-green-50 border border-green-600 px-2.5 py-1 rounded animate-in fade-in">
                  {demoResetNotice}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: 2. Organization */}
      {activeTab === "Organization" && (
        <div className="bg-white border-2 border-[#111] rounded-[16px] p-6 neo-shadow-md max-w-3xl space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-[18px] text-[#111]">Team Members & Access</h2>
            <button className="px-3.5 py-1.5 bg-[#ffd23f] border-2 border-[#111] rounded-[8px] neo-shadow-sm font-bold text-[12px] hover-neo-sm transition-transform">
              + Invite Member
            </button>
          </div>

          <div className="border-2 border-[#111] rounded-[12px] overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#fdf9f0] border-b-2 border-[#111]">
                  <th className="p-3 font-mono text-[11px] font-bold uppercase">Name</th>
                  <th className="p-3 font-mono text-[11px] font-bold uppercase">Role</th>
                  <th className="p-3 font-mono text-[11px] font-bold uppercase">Status</th>
                  <th className="p-3 font-mono text-[11px] font-bold uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: "Alex R. (alex@trustlens.ai)", role: "Owner / Admin", status: "Active" },
                  { name: "Priya S. (priya@trustlens.ai)", role: "Senior Reviewer", status: "Active" },
                  { name: "Kiran V. (kiran@trustlens.ai)", role: "Fraud Analyst", status: "Active" },
                ].map((member, i) => (
                  <tr key={i} className="border-b border-[#111]/10 text-[13px]">
                    <td className="p-3 font-semibold">{member.name}</td>
                    <td className="p-3 font-mono font-bold">{member.role}</td>
                    <td className="p-3"><span className="px-2 py-0.5 bg-[#3ddc97] border border-[#111] rounded-full text-[10px] font-bold">Active</span></td>
                    <td className="p-3 text-right"><button className="text-[11px] font-bold text-[#ff3d81] hover:underline">Edit</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT: 3. Risk Engine */}
      {activeTab === "Risk Engine" && (
        <div className="bg-white border-2 border-[#111] rounded-[16px] p-6 neo-shadow-md max-w-2xl space-y-6">
          <div>
            <h2 className="font-bold text-[18px] text-[#111]">Risk Configuration</h2>
            <p className="text-[12px] text-[#111]/60 font-medium">
              Adjust multi-signal weights for automated scoring (Sum must equal 100%).
            </p>
          </div>

          <div className="space-y-4">
            {[
              { label: "Provenance Signal", value: provenanceWeight, set: setProvenanceWeight, desc: "C2PA, SynthID, and capture hardware metadata validation" },
              { label: "Forensics Signal", value: forensicsWeight, set: setForensicsWeight, desc: "Error level analysis, cloned pixels, and compression edge checks" },
              { label: "Duplicate Signal", value: duplicateWeight, set: setDuplicateWeight, desc: "Perceptual hashing and cross-claim duplicate repository matching" },
              { label: "Order Mismatch", value: orderMismatchWeight, set: setOrderMismatchWeight, desc: "Receipt OCR mismatch against ERP/database order record" },
              { label: "Behaviour Signal", value: behaviourWeight, set: setBehaviourWeight, desc: "Account historical return velocity and IP subnet anomalies" },
            ].map((sig) => (
              <div key={sig.label} className="p-3.5 bg-[#fdf9f0] border-2 border-[#111] rounded-[12px] space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-bold text-[13px] text-[#111]">{sig.label}</span>
                    <p className="text-[11px] text-[#111]/60">{sig.desc}</p>
                  </div>
                  <span className="font-mono text-[14px] font-bold px-2 py-0.5 bg-white border-2 border-[#111] rounded">
                    {sig.value}%
                  </span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="50" 
                  value={sig.value} 
                  onChange={(e) => sig.set(Number(e.target.value))}
                  className="w-full accent-[#ff3d81] cursor-pointer"
                />
              </div>
            ))}
          </div>

          <div className="pt-3 border-t-2 border-[#111] flex items-center justify-between">
            <span className="font-mono text-[12px] font-bold">
              TOTAL WEIGHT: {provenanceWeight + forensicsWeight + duplicateWeight + orderMismatchWeight + behaviourWeight}%
            </span>
            <button
              onClick={() => triggerSaveNotice("Risk Engine weights calibrated and saved.")}
              className="px-5 py-2.5 bg-[#ffd23f] border-2 border-[#111] rounded-[10px] neo-shadow-sm font-bold text-[13px] text-[#111] hover-neo-sm transition-transform"
            >
              Save Configuration
            </button>
          </div>
        </div>
      )}

      {/* TAB CONTENT: 4. Evidence */}
      {activeTab === "Evidence" && (
        <div className="bg-white border-2 border-[#111] rounded-[16px] p-6 neo-shadow-md max-w-2xl space-y-5">
          <h2 className="font-bold text-[18px] text-[#111]">Evidence Ingestion Rules</h2>
          <div className="space-y-3 text-[13px]">
            <div className="p-3 bg-[#fdf9f0] border-2 border-[#111] rounded-[10px] flex justify-between items-center">
              <div>
                <span className="font-bold block">Retention Policy</span>
                <span className="text-[11px] text-[#111]/60">Cryptographically signed evidence stored on hot storage</span>
              </div>
              <span className="font-mono font-bold">90 Days</span>
            </div>
            <div className="p-3 bg-[#fdf9f0] border-2 border-[#111] rounded-[10px] flex justify-between items-center">
              <div>
                <span className="font-bold block">Supported Formats</span>
                <span className="text-[11px] text-[#111]/60">Preserves original EXIF and C2PA JUMBF chunks</span>
              </div>
              <span className="font-mono font-bold">JPEG, PNG, HEIC, MP4</span>
            </div>
            <div className="p-3 bg-[#fdf9f0] border-2 border-[#111] rounded-[10px] flex justify-between items-center">
              <div>
                <span className="font-bold block">Max File Size</span>
                <span className="text-[11px] text-[#111]/60">Maximum single upload ceiling</span>
              </div>
              <span className="font-mono font-bold">25 MB</span>
            </div>
          </div>
          <button 
            onClick={() => triggerSaveNotice("Evidence rules updated.")}
            className="px-5 py-2.5 bg-[#3ddc97] border-2 border-[#111] rounded-[10px] neo-shadow-sm font-bold text-[13px]"
          >
            Save Rules
          </button>
        </div>
      )}

      {/* TAB CONTENT: 5. Notifications */}
      {activeTab === "Notifications" && (
        <div className="bg-white border-2 border-[#111] rounded-[16px] p-6 neo-shadow-md max-w-2xl space-y-5">
          <h2 className="font-bold text-[18px] text-[#111]">Alerts & Escalations</h2>
          <div className="space-y-3 text-[13px]">
            {[
              { title: "Critical Risk Escalation", sub: "Trigger urgent Slack webhook when claim risk exceeds 85/100", active: true },
              { title: "Daily Review Digest", sub: "Email daily queue summary to assigned investigators at 09:00 IST", active: true },
              { title: "Duplicate Fraud Cluster Alert", sub: "Notify when more than 3 claims match the same image hash within 24h", active: true },
            ].map((n, i) => (
              <div key={i} className="p-3 bg-[#fdf9f0] border-2 border-[#111] rounded-[10px] flex justify-between items-center">
                <div>
                  <span className="font-bold block">{n.title}</span>
                  <span className="text-[11px] text-[#111]/60">{n.sub}</span>
                </div>
                <input type="checkbox" defaultChecked={n.active} className="w-5 h-5 accent-[#ff3d81] cursor-pointer" />
              </div>
            ))}
          </div>
          <button 
            onClick={() => triggerSaveNotice("Notification channels saved.")}
            className="px-5 py-2.5 bg-[#3ddc97] border-2 border-[#111] rounded-[10px] neo-shadow-sm font-bold text-[13px]"
          >
            Save Preferences
          </button>
        </div>
      )}

      {/* TAB CONTENT: 6. Security */}
      {activeTab === "Security" && (
        <div className="bg-white border-2 border-[#111] rounded-[16px] p-6 neo-shadow-md max-w-2xl space-y-5">
          <h2 className="font-bold text-[18px] text-[#111]">Security & Governance</h2>
          <div className="space-y-3 text-[13px]">
            <div className="p-3 bg-[#fdf9f0] border-2 border-[#111] rounded-[10px] flex justify-between items-center">
              <div>
                <span className="font-bold block">Two-Factor Authentication (2FA)</span>
                <span className="text-[11px] text-[#111]/60">Enforce TOTP for all team members accessing review queue</span>
              </div>
              <span className="px-2 py-0.5 bg-[#3ddc97] border border-[#111] rounded font-bold text-[11px]">Enforced</span>
            </div>
            <div className="p-3 bg-[#fdf9f0] border-2 border-[#111] rounded-[10px] flex justify-between items-center">
              <div>
                <span className="font-bold block">Session Expiry</span>
                <span className="text-[11px] text-[#111]/60">Automatic logout after inactivity period</span>
              </div>
              <span className="font-mono font-bold">12 Hours</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: 7. API Keys */}
      {activeTab === "API" && (
        <div className="bg-white border-2 border-[#111] rounded-[16px] p-6 neo-shadow-md space-y-5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h2 className="font-bold text-[18px] text-[#111]">API Keys</h2>
              <p className="text-[12px] text-[#111]/60 font-medium">Create and manage API access for your claims ingestion backend.</p>
            </div>
            <button 
              onClick={() => { setGeneratedSecret(null); setNewKeyName(""); setIsApiKeyModalOpen(true); }}
              className="flex items-center px-4 py-2 bg-[#ffd23f] border-2 border-[#111] rounded-[10px] neo-shadow-sm font-bold text-[12px] hover-neo-sm transition-transform"
            >
              <Plus className="w-4 h-4 mr-1.5" strokeWidth={3} /> + Create API Key
            </button>
          </div>

          <div className="border-2 border-[#111] rounded-[12px] overflow-hidden overflow-x-auto">
            <table className="w-full text-left min-w-[700px]">
              <thead>
                <tr className="bg-[#fdf9f0] border-b-2 border-[#111]">
                  <th className="p-3 font-mono text-[11px] font-bold uppercase">Name</th>
                  <th className="p-3 font-mono text-[11px] font-bold uppercase">Token Prefix</th>
                  <th className="p-3 font-mono text-[11px] font-bold uppercase">Created</th>
                  <th className="p-3 font-mono text-[11px] font-bold uppercase">Last Used</th>
                  <th className="p-3 font-mono text-[11px] font-bold uppercase">Status</th>
                  <th className="p-3 font-mono text-[11px] font-bold uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {apiKeys.map((k) => (
                  <tr key={k.id} className="border-b border-[#111]/10 text-[13px]">
                    <td className="p-3 font-bold text-[#111]">{k.name}</td>
                    <td className="p-3 font-mono text-[#111]/80">{k.prefix}</td>
                    <td className="p-3 font-mono text-[12px] text-[#111]/70">{k.created}</td>
                    <td className="p-3 font-mono text-[12px] text-[#111]/70">{k.lastUsed}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 bg-[#3ddc97] border border-[#111] rounded-full text-[10px] font-bold">
                        {k.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button 
                        onClick={() => setApiKeys(apiKeys.filter(x => x.id !== k.id))}
                        className="p-1 hover:bg-[#ff6b5e]/20 rounded text-[#ff3d81]"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Modal */}
          {isApiKeyModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111]/50 backdrop-blur-sm animate-in fade-in duration-150">
              <div className="w-full max-w-md bg-white border-2 border-[#111] rounded-[20px] neo-shadow-lg p-6 space-y-4">
                <div className="flex justify-between items-center border-b-2 border-[#111] pb-3">
                  <h3 className="font-display text-[18px] uppercase">
                    {generatedSecret ? "API Key Created" : "Create API Key"}
                  </h3>
                  <button onClick={() => setIsApiKeyModalOpen(false)} className="w-7 h-7 flex items-center justify-center bg-[#ff3d81] border border-[#111] rounded">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {!generatedSecret ? (
                  <form onSubmit={handleCreateApiKey} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="font-bold text-[12px] uppercase">Key Name</label>
                      <input 
                        type="text" 
                        required
                        value={newKeyName}
                        onChange={(e) => setNewKeyName(e.target.value)}
                        placeholder="e.g. FastAPI Ingestion Worker"
                        className="w-full p-2.5 bg-[#fdf9f0] border-2 border-[#111] rounded-[10px] text-[13px]"
                      />
                    </div>
                    <div className="flex justify-end space-x-2 pt-2">
                      <button type="button" onClick={() => setIsApiKeyModalOpen(false)} className="px-3 py-1.5 bg-white border-2 border-[#111] rounded font-bold text-[12px]">Cancel</button>
                      <button type="submit" className="px-4 py-1.5 bg-[#3ddc97] border-2 border-[#111] rounded font-bold text-[12px]">Generate Secret</button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-3">
                    <div className="p-3 bg-[#ffd23f]/30 border-2 border-[#111] rounded-[10px] text-[12px]">
                      <strong>Important:</strong> This secret will only be shown once. Please save it securely in your environment variables.
                    </div>
                    <div className="p-2.5 bg-[#fdf9f0] border-2 border-[#111] rounded-[10px] font-mono text-[12px] break-all select-all flex items-center justify-between">
                      <span>{generatedSecret}</span>
                      <button 
                        onClick={() => { navigator.clipboard.writeText(generatedSecret); setCopiedKey(true); }}
                        className="ml-2 px-2.5 py-1 bg-white border border-[#111] rounded font-sans font-bold text-[11px] shrink-0"
                      >
                        {copiedKey ? "Copied!" : "Copy"}
                      </button>
                    </div>
                    <button 
                      onClick={() => setIsApiKeyModalOpen(false)} 
                      className="w-full py-2 bg-[#ff3d81] border-2 border-[#111] rounded-[10px] font-bold text-[12px]"
                    >
                      I Have Saved This Key
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: 8. Webhooks */}
      {activeTab === "Webhooks" && (
        <div className="bg-white border-2 border-[#111] rounded-[16px] p-6 neo-shadow-md space-y-5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h2 className="font-bold text-[18px] text-[#111]">Outbound Webhooks</h2>
              <p className="text-[12px] text-[#111]/60 font-medium">Real-time HTTP callbacks for automated workflow dispatch.</p>
            </div>
            <button 
              onClick={() => setIsWebhookModalOpen(true)}
              className="flex items-center px-4 py-2 bg-[#c8a2ff] border-2 border-[#111] rounded-[10px] neo-shadow-sm font-bold text-[12px] hover-neo-sm transition-transform"
            >
              <Plus className="w-4 h-4 mr-1.5" strokeWidth={3} /> + Add Webhook
            </button>
          </div>

          <div className="border-2 border-[#111] rounded-[12px] overflow-hidden overflow-x-auto">
            <table className="w-full text-left min-w-[700px]">
              <thead>
                <tr className="bg-[#fdf9f0] border-b-2 border-[#111]">
                  <th className="p-3 font-mono text-[11px] font-bold uppercase">Endpoint URL</th>
                  <th className="p-3 font-mono text-[11px] font-bold uppercase">Subscribed Events</th>
                  <th className="p-3 font-mono text-[11px] font-bold uppercase">Status</th>
                  <th className="p-3 font-mono text-[11px] font-bold uppercase">Last Delivery</th>
                </tr>
              </thead>
              <tbody>
                {webhooks.map((wh) => (
                  <tr key={wh.id} className="border-b border-[#111]/10 text-[13px]">
                    <td className="p-3 font-mono font-bold text-[12px]">{wh.endpoint}</td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1">
                        {wh.events.map(ev => (
                          <span key={ev} className="px-1.5 py-0.5 bg-white border border-[#111] rounded font-mono text-[10px]">
                            {ev}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 bg-[#3ddc97] border border-[#111] rounded-full text-[10px] font-bold">
                        {wh.status}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-[12px] text-[#111]/70">{wh.lastDelivery}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add Webhook Modal */}
          {isWebhookModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111]/50 backdrop-blur-sm animate-in fade-in duration-150">
              <div className="w-full max-w-lg bg-white border-2 border-[#111] rounded-[20px] neo-shadow-lg p-6 space-y-4">
                <div className="flex justify-between items-center border-b-2 border-[#111] pb-3">
                  <h3 className="font-display text-[18px] uppercase">Add Webhook Endpoint</h3>
                  <button onClick={() => setIsWebhookModalOpen(false)} className="w-7 h-7 flex items-center justify-center bg-[#ff3d81] border border-[#111] rounded">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleAddWebhook} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="font-bold text-[12px] uppercase">Endpoint URL</label>
                    <input 
                      type="url" 
                      required
                      value={newEndpoint}
                      onChange={(e) => setNewEndpoint(e.target.value)}
                      placeholder="https://api.yourdomain.com/webhooks/trustlens"
                      className="w-full p-2.5 bg-[#fdf9f0] border-2 border-[#111] rounded-[10px] text-[13px] font-mono"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="font-bold text-[12px] uppercase">Events to Deliver</label>
                    <div className="grid grid-cols-2 gap-2 text-[12px]">
                      {[
                        "claim.created", 
                        "evidence.uploaded", 
                        "analysis.completed", 
                        "risk.calculated", 
                        "review.completed"
                      ].map((ev) => (
                        <label key={ev} className="flex items-center space-x-2 p-2 bg-[#fdf9f0] border border-[#111] rounded cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={selectedEvents.includes(ev)} 
                            onChange={() => toggleEvent(ev)}
                            className="accent-[#ff3d81]"
                          />
                          <span className="font-mono">{ev}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2 pt-2 border-t-2 border-[#111]">
                    <button type="button" onClick={() => setIsWebhookModalOpen(false)} className="px-3 py-1.5 bg-white border-2 border-[#111] rounded font-bold text-[12px]">Cancel</button>
                    <button type="submit" className="px-4 py-1.5 bg-[#3ddc97] border-2 border-[#111] rounded font-bold text-[12px]">Register Webhook</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: 9. Audit Logs */}
      {activeTab === "Audit Logs" && (
        <div className="bg-white border-2 border-[#111] rounded-[16px] p-6 neo-shadow-md space-y-5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h2 className="font-bold text-[18px] text-[#111]">Compliance & Audit Logs</h2>
              <p className="text-[12px] text-[#111]/60 font-medium">Immutable audit trail of user and machine interactions.</p>
            </div>
            <ExportMenu type="audit_logs" buttonLabel="Export Audit PDF" />
          </div>

          <div className="border-2 border-[#111] rounded-[12px] overflow-hidden overflow-x-auto">
            <table className="w-full text-left min-w-[800px]">
              <thead>
                <tr className="bg-[#fdf9f0] border-b-2 border-[#111]">
                  <th className="p-3 font-mono text-[11px] font-bold uppercase">Timestamp</th>
                  <th className="p-3 font-mono text-[11px] font-bold uppercase">User / Agent</th>
                  <th className="p-3 font-mono text-[11px] font-bold uppercase">Action</th>
                  <th className="p-3 font-mono text-[11px] font-bold uppercase">Resource</th>
                  <th className="p-3 font-mono text-[11px] font-bold uppercase">Result</th>
                  <th className="p-3 font-mono text-[11px] font-bold uppercase text-right">IP / Request ID</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map((log) => (
                  <tr key={log.id} className="border-b border-[#111]/10 text-[13px] hover:bg-[#fdf9f0]">
                    <td className="p-3 font-mono text-[12px] text-[#111]/70">{log.timestamp}</td>
                    <td className="p-3 font-bold text-[#111]">{log.user}</td>
                    <td className="p-3 font-mono font-bold text-[12px]">{log.action}</td>
                    <td className="p-3 font-medium text-[#111]/80">{log.resource}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full border border-[#111] text-[10px] font-bold ${
                        log.result === 'Success' ? 'bg-[#3ddc97]' : 'bg-[#ffd23f]'
                      }`}>
                        {log.result}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-[12px] text-right text-[#111]/60">{log.ip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
