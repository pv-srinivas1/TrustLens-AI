"use client";

import { useState, useRef, useEffect } from "react";
import { 
  Upload, 
  Camera, 
  Sparkles, 
  X, 
  RefreshCw, 
  Check, 
  AlertTriangle, 
  FileCheck,
  RotateCcw
} from "lucide-react";

export type EvidenceSourceType = "real_upload" | "camera_capture" | "demo";

export interface SelectedEvidence {
  file: File | null;
  previewUrl: string;
  filename: string;
  fileSize: string;
  sourceType: EvidenceSourceType;
  demoScenario?: string;
}

interface EvidencePickerProps {
  claimType?: string;
  onEvidenceSelected: (evidence: SelectedEvidence | null) => void;
}

const DEMO_SCENARIOS = [
  {
    id: "damaged-food",
    name: "Damaged Food",
    category: "Food Delivery",
    images: [
      { id: "damaged-food-01.jpg", title: "Spilled Pasta Takeaway", desc: "Leaked container & torn paper bag" },
      { id: "damaged-food-02.jpg", title: "Smashed Pizza Box", desc: "Lid crushed into melted cheese" },
    ]
  },
  {
    id: "damaged-package",
    name: "Damaged Package",
    category: "Logistics & E-Commerce",
    images: [
      { id: "damaged-package-01.jpg", title: "Crushed Shipping Carton", desc: "Torn sealing tape & smashed corner" },
    ]
  },
  {
    id: "missing-item",
    name: "Missing Item",
    category: "E-Commerce",
    images: [
      { id: "missing-item-01.jpg", title: "Empty Shipping Box", desc: "Kraft paper stuffing with missing goods" },
    ]
  },
  {
    id: "wrong-product",
    name: "Wrong Product",
    category: "Retail Delivery",
    images: [
      { id: "wrong-product-01.jpg", title: "Incorrect Merchandise", desc: "Gardening gloves received instead of order" },
    ]
  },
  {
    id: "delivery-damage",
    name: "Delivery Damage",
    category: "Quick Commerce",
    images: [
      { id: "delivery-damage-01.jpg", title: "Rainwater Soaked Parcel", desc: "Carton softened by water damage on steps" },
    ]
  },
  {
    id: "receipt-order",
    name: "Receipt / Order Evidence",
    category: "Proof of Purchase",
    images: [
      { id: "receipt-01.jpg", title: "Itemized Restaurant Bill", desc: "Thermal receipt with barcode on counter" },
    ]
  }
];

export function EvidencePicker({ claimType, onEvidenceSelected }: EvidencePickerProps) {
  const [mode, setMode] = useState<"none" | "upload" | "camera" | "demo">("none");
  const [currentEvidence, setCurrentEvidence] = useState<SelectedEvidence | null>(null);

  // File Upload Ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Camera State
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedSnapshot, setCapturedSnapshot] = useState<string | null>(null);

  // Demo State
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>("damaged-package");
  const [selectedDemoImage, setSelectedDemoImage] = useState<string>("damaged-package-01.jpg");

  // Suggest demo scenario based on Claim Type
  useEffect(() => {
    if (claimType) {
      if (claimType.toLowerCase().includes("food")) {
        setSelectedScenarioId("damaged-food");
        setSelectedDemoImage("damaged-food-01.jpg");
      } else if (claimType.toLowerCase().includes("missing")) {
        setSelectedScenarioId("missing-item");
        setSelectedDemoImage("missing-item-01.jpg");
      } else if (claimType.toLowerCase().includes("wrong")) {
        setSelectedScenarioId("wrong-product");
        setSelectedDemoImage("wrong-product-01.jpg");
      } else {
        setSelectedScenarioId("damaged-package");
        setSelectedDemoImage("damaged-package-01.jpg");
      }
    }
  }, [claimType]);

  // Clean up camera stream
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // 1. FILE UPLOAD HANDLERS
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate MIME
    if (!file.type.match(/^image\/(jpeg|png|webp|jpg)$/)) {
      alert("Invalid file format. Please upload a JPEG, PNG, or WebP image.");
      return;
    }
    // Validate size (max 25MB)
    if (file.size > 25 * 1024 * 1024) {
      alert("File exceeds maximum allowed size of 25MB.");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    const sizeMB = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;

    const evidence: SelectedEvidence = {
      file,
      previewUrl,
      filename: file.name,
      fileSize: sizeMB,
      sourceType: "real_upload"
    };

    setCurrentEvidence(evidence);
    onEvidenceSelected(evidence);
    setMode("none");
  };

  // 2. CAMERA CAPTURE HANDLERS
  const startCamera = async () => {
    setCameraError(null);
    setCapturedSnapshot(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera API is not supported in this browser environment.");
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 960 } }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraActive(true);
    } catch (err: any) {
      console.warn("Camera access failed:", err);
      setCameraError("Camera access is unavailable. You can upload an image instead.");
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 960;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
      setCapturedSnapshot(dataUrl);
    }
  };

  const confirmCapturedPhoto = () => {
    if (!capturedSnapshot) return;

    // Convert data URL to Blob
    fetch(capturedSnapshot)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], `camera_capture_${Date.now()}.jpg`, { type: "image/jpeg" });
        const sizeMB = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;

        const evidence: SelectedEvidence = {
          file,
          previewUrl: capturedSnapshot,
          filename: file.name,
          fileSize: sizeMB,
          sourceType: "camera_capture"
        };

        setCurrentEvidence(evidence);
        onEvidenceSelected(evidence);
        stopCamera();
        setMode("none");
      });
  };

  // 3. DEMO EVIDENCE HANDLER
  const confirmDemoEvidence = () => {
    const scenario = DEMO_SCENARIOS.find((s) => s.id === selectedScenarioId);
    const imgInfo = scenario?.images.find((i) => i.id === selectedDemoImage) || scenario?.images[0];
    const imageFilename = imgInfo?.id || "damaged-package-01.jpg";

    const evidence: SelectedEvidence = {
      file: null,
      previewUrl: `/demo-evidence/${imageFilename}`,
      filename: imageFilename,
      fileSize: "2.4 MB",
      sourceType: "demo",
      demoScenario: scenario?.name || "Demo Scenario"
    };

    setCurrentEvidence(evidence);
    onEvidenceSelected(evidence);
    setMode("none");
  };

  const removeEvidence = () => {
    setCurrentEvidence(null);
    onEvidenceSelected(null);
    setMode("none");
  };

  return (
    <div className="space-y-4">
      {/* Three distinct option buttons */}
      {!currentEvidence && (
        <div className="space-y-3">
          <label className="font-bold text-[13px] uppercase tracking-wide text-[#111] block">
            Evidence • Choose How to Provide Evidence
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* 1. Real Upload */}
            <button
              type="button"
              onClick={() => {
                setMode("upload");
                fileInputRef.current?.click();
              }}
              className="p-3.5 bg-white border-2 border-[#111] rounded-[12px] neo-shadow-sm font-bold text-[13px] flex flex-col items-center justify-center gap-1.5 hover-neo-sm transition-transform text-[#111]"
            >
              <div className="w-8 h-8 rounded-full bg-[#3ddc97] border-2 border-[#111] flex items-center justify-center">
                <Upload className="w-4 h-4 text-[#111]" strokeWidth={2.5} />
              </div>
              <span>Upload Image</span>
              <span className="text-[10px] font-mono text-[#111]/60">JPG, PNG, WebP</span>
            </button>

            {/* 2. Real Camera */}
            <button
              type="button"
              onClick={() => {
                setMode("camera");
                startCamera();
              }}
              className="p-3.5 bg-white border-2 border-[#111] rounded-[12px] neo-shadow-sm font-bold text-[13px] flex flex-col items-center justify-center gap-1.5 hover-neo-sm transition-transform text-[#111]"
            >
              <div className="w-8 h-8 rounded-full bg-[#ffd23f] border-2 border-[#111] flex items-center justify-center">
                <Camera className="w-4 h-4 text-[#111]" strokeWidth={2.5} />
              </div>
              <span>Capture Photo</span>
              <span className="text-[10px] font-mono text-[#111]/60">Live Camera</span>
            </button>

            {/* 3. Demo Evidence */}
            <button
              type="button"
              onClick={() => setMode("demo")}
              className="p-3.5 bg-white border-2 border-[#111] rounded-[12px] neo-shadow-sm font-bold text-[13px] flex flex-col items-center justify-center gap-1.5 hover-neo-sm transition-transform text-[#111]"
            >
              <div className="w-8 h-8 rounded-full bg-[#c8a2ff] border-2 border-[#111] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-[#111]" strokeWidth={2.5} />
              </div>
              <span>Use Demo Evidence</span>
              <span className="text-[10px] font-mono text-[#111]/60">Select Scenario</span>
            </button>
          </div>

          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/jpeg,image/png,image/webp" 
            className="hidden" 
          />
        </div>
      )}

      {/* Selected Evidence Preview Display */}
      {currentEvidence && (
        <div className="bg-[#fdf9f0] border-2 border-[#111] rounded-[14px] p-4 neo-shadow-sm space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-[13px] uppercase text-[#111]">Evidence Preview</span>
              {/* Distinct Badge based on source */}
              {currentEvidence.sourceType === "demo" ? (
                <span className="px-2 py-0.5 bg-[#c8a2ff] border-2 border-[#111] rounded-full text-[10px] font-display uppercase tracking-wider">
                  DEMO
                </span>
              ) : currentEvidence.sourceType === "camera_capture" ? (
                <span className="px-2 py-0.5 bg-[#ffd23f] border-2 border-[#111] rounded-full text-[10px] font-display uppercase tracking-wider">
                  CAMERA CAPTURE
                </span>
              ) : (
                <span className="px-2 py-0.5 bg-[#3ddc97] border-2 border-[#111] rounded-full text-[10px] font-display uppercase tracking-wider">
                  USER UPLOADED
                </span>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => {
                  if (currentEvidence.sourceType === "demo") setMode("demo");
                  else if (currentEvidence.sourceType === "camera_capture") {
                    setMode("camera");
                    startCamera();
                  } else {
                    fileInputRef.current?.click();
                  }
                }}
                className="px-2.5 py-1 bg-white border border-[#111] rounded text-[11px] font-bold hover:bg-gray-100"
              >
                Replace
              </button>
              <button
                type="button"
                onClick={removeEvidence}
                className="px-2.5 py-1 bg-[#ff3d81] border border-[#111] rounded text-[11px] font-bold text-white hover:bg-rose-700"
              >
                Remove
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="relative w-36 h-28 bg-white border-2 border-[#111] rounded-[10px] overflow-hidden shrink-0 neo-shadow-sm flex items-center justify-center">
              <img 
                src={currentEvidence.previewUrl || "/damage.jpg"} 
                alt={currentEvidence.filename} 
                className="w-full h-full object-cover" 
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (!target.src.includes("/damage.jpg")) {
                    target.src = "/damage.jpg";
                  }
                }}
              />
            </div>
            <div className="space-y-1 text-[12px]">
              <div className="font-mono font-bold text-[#111] break-all">{currentEvidence.filename}</div>
              <div className="text-[#111]/70 font-mono">Size: {currentEvidence.fileSize}</div>
              <div className="text-[11px] text-[#111]/80">
                Source: <strong>{currentEvidence.sourceType.replace("_", " ").toUpperCase()}</strong>
                {currentEvidence.demoScenario ? ` • Scenario: ${currentEvidence.demoScenario}` : ""}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CAMERA CAPTURE MODAL / PREVIEW */}
      {mode === "camera" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111]/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-white border-2 border-[#111] rounded-[20px] neo-shadow-lg p-5 space-y-4">
            <div className="flex justify-between items-center border-b-2 border-[#111] pb-2">
              <h3 className="font-display text-[18px] uppercase flex items-center">
                <Camera className="w-5 h-5 mr-2 text-[#ffd23f]" strokeWidth={2.5} />
                Live Camera Capture
              </h3>
              <button 
                type="button"
                onClick={() => {
                  stopCamera();
                  setMode("none");
                }}
                className="w-7 h-7 flex items-center justify-center bg-[#ff3d81] border border-[#111] rounded text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {cameraError ? (
              <div className="p-4 bg-amber-50 border-2 border-amber-600 rounded-[12px] space-y-3 text-[13px]">
                <div className="flex items-center text-amber-800 font-bold">
                  <AlertTriangle className="w-5 h-5 mr-2 text-amber-600" />
                  {cameraError}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    stopCamera();
                    setMode("upload");
                    fileInputRef.current?.click();
                  }}
                  className="px-4 py-2 bg-[#3ddc97] border-2 border-[#111] rounded-[8px] neo-shadow-sm font-bold text-[12px]"
                >
                  <Upload className="w-4 h-4 inline mr-1" /> Upload Image Instead
                </button>
              </div>
            ) : !capturedSnapshot ? (
              <div className="space-y-4">
                <div className="relative aspect-[4/3] bg-[#111] rounded-[12px] overflow-hidden border-2 border-[#111]">
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    muted 
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute top-2 right-2 px-2 py-0.5 bg-[#3ddc97] text-[#111] font-mono text-[10px] font-bold rounded">
                    LIVE STREAM
                  </div>
                </div>

                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={capturePhoto}
                    className="px-6 py-2.5 bg-[#ffd23f] border-2 border-[#111] rounded-[12px] neo-shadow-sm font-bold text-[13px] hover-neo-sm transition-transform flex items-center"
                  >
                    <Camera className="w-4 h-4 mr-2" /> Take Snapshot
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative aspect-[4/3] bg-[#111] rounded-[12px] overflow-hidden border-2 border-[#111]">
                  <img src={capturedSnapshot} alt="Snapshot" className="w-full h-full object-cover" />
                  <div className="absolute top-2 right-2 px-2 py-0.5 bg-[#ffd23f] text-[#111] font-mono text-[10px] font-bold rounded">
                    CAPTURED
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setCapturedSnapshot(null);
                      startCamera();
                    }}
                    className="px-4 py-2 bg-white border-2 border-[#111] rounded-[8px] font-bold text-[12px] flex items-center"
                  >
                    <RotateCcw className="w-4 h-4 mr-1.5" /> Retake
                  </button>
                  <button
                    type="button"
                    onClick={confirmCapturedPhoto}
                    className="px-5 py-2 bg-[#3ddc97] border-2 border-[#111] rounded-[8px] neo-shadow-sm font-bold text-[12px] flex items-center"
                  >
                    <Check className="w-4 h-4 mr-1.5" /> Use Photo
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* DEMO EVIDENCE PICKER MODAL */}
      {mode === "demo" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111]/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-2xl bg-white border-2 border-[#111] rounded-[20px] neo-shadow-lg p-5 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b-2 border-[#111] pb-2">
              <div>
                <h3 className="font-display text-[18px] uppercase flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-[#c8a2ff]" strokeWidth={2.5} />
                  Select Demo Scenario Evidence
                </h3>
                <p className="text-[12px] text-[#111]/70 font-medium">
                  Test the TrustLens verification pipeline using distinct categorized demo evidence.
                </p>
              </div>
              <button 
                type="button"
                onClick={() => setMode("none")}
                className="w-7 h-7 flex items-center justify-center bg-[#ff3d81] border border-[#111] rounded text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scenario Categories */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {DEMO_SCENARIOS.map((sc) => (
                <button
                  key={sc.id}
                  type="button"
                  onClick={() => {
                    setSelectedScenarioId(sc.id);
                    setSelectedDemoImage(sc.images[0].id);
                  }}
                  className={`p-2.5 border-2 border-[#111] rounded-[10px] text-left transition-transform ${
                    selectedScenarioId === sc.id
                      ? "bg-[#c8a2ff] neo-shadow-sm font-bold"
                      : "bg-[#fdf9f0] hover:bg-white"
                  }`}
                >
                  <div className="font-bold text-[12px] text-[#111]">{sc.name}</div>
                  <div className="text-[10px] text-[#111]/60 font-mono">{sc.category}</div>
                </button>
              ))}
            </div>

            {/* Selected Scenario Images */}
            {(() => {
              const currentSc = DEMO_SCENARIOS.find((s) => s.id === selectedScenarioId);
              return (
                <div className="space-y-3 pt-2">
                  <div className="font-bold text-[12px] uppercase text-[#111]">
                    Available Evidence Images for: <u>{currentSc?.name}</u>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {currentSc?.images.map((img) => (
                      <div
                        key={img.id}
                        onClick={() => setSelectedDemoImage(img.id)}
                        className={`p-2.5 border-2 border-[#111] rounded-[12px] cursor-pointer transition-all ${
                          selectedDemoImage === img.id ? "bg-[#ffd23f]/30 border-[#111] neo-shadow-sm" : "bg-white hover:bg-[#fdf9f0]"
                        }`}
                      >
                        <div className="relative aspect-[4/3] bg-gray-100 rounded-[8px] overflow-hidden border border-[#111] mb-2 flex items-center justify-center">
                          <img 
                            src={`/demo-evidence/${img.id}`} 
                            alt={img.title} 
                            className="w-full h-full object-cover" 
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              if (!target.src.includes("/damage.jpg")) {
                                target.src = "/damage.jpg";
                              }
                            }}
                          />
                          <div className="absolute top-1.5 left-1.5 px-2 py-0.5 bg-[#111] text-white text-[9px] font-mono font-bold rounded">
                            DEMO
                          </div>
                        </div>
                        <div className="font-bold text-[12px] text-[#111]">{img.title}</div>
                        <div className="text-[10px] text-[#111]/70">{img.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            <div className="flex justify-end space-x-3 pt-3 border-t-2 border-[#111]">
              <button
                type="button"
                onClick={() => setMode("none")}
                className="px-4 py-2 bg-white border-2 border-[#111] rounded-[8px] font-bold text-[12px]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDemoEvidence}
                className="px-5 py-2 bg-[#c8a2ff] border-2 border-[#111] rounded-[8px] neo-shadow-sm font-bold text-[12px] text-[#111] hover-neo-sm transition-transform"
              >
                Use This Demo Evidence
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
