export interface VerificationSignal {
  name: string;
  category: "Security" | "Provenance" | "Forensics" | "OCR" | "Duplicate" | "Order" | "Behaviour";
  status: "Passed" | "Checked" | "Warning" | "Detected" | "Not detected" | "Completed" | "Matched";
  impactScore?: number;
  detail: string;
}

export interface ClaimItem {
  id: string;
  customer: string;
  orderId: string;
  platform: string;
  type: string;
  amount: number;
  currency: string;
  evidenceCount: number;
  evidenceFile: string;
  evidenceSize: string;
  evidenceHash: string;
  evidenceDimensions: string;
  riskScore: number;
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  status: "Verified" | "Under Review" | "Processing" | "Approved" | "Rejected" | "Escalated" | "Awaiting Evidence";
  createdAt: string;
  description: string;
  reviewReason?: string;
  assignedTo?: string;
  signals: VerificationSignal[];
  duplicateMatch?: {
    claimId: string;
    similarity: number;
    evidenceId: string;
  };
}

export interface EvidenceItem {
  id: string;
  claimId: string;
  filename: string;
  fileType: string;
  fileSize: string;
  dimensions: string;
  hash: string;
  analysisStatus: "Completed" | "Processing" | "Failed";
  uploadedAt: string;
  imageSrc: string;
  c2pa: string;
  synthId: string;
  forensics: {
    metadata: string;
    compressionAnomaly: boolean;
    manipulationIndicators: boolean;
  };
  ocr: {
    orderId: string;
    product: string;
    rawText: string;
  };
  duplicateMatch?: {
    similarity: number;
    matchedEvidenceId: string;
    matchedClaimId: string;
  };
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  resource: string;
  result: "Success" | "Blocked" | "Warning";
  ip: string;
}

export const INITIAL_CLAIMS: ClaimItem[] = [
  {
    id: "CLM-1001",
    customer: "Customer #821",
    orderId: "ORD-98231",
    platform: "Food Delivery",
    type: "Damaged Product",
    amount: 749,
    currency: "INR",
    evidenceCount: 2,
    evidenceFile: "damaged-food-01.jpg",
    evidenceSize: "2.4 MB",
    evidenceHash: "a9f43b77e81029da483cf29188e0182c402198be9031",
    evidenceDimensions: "1280 × 960",
    riskScore: 87,
    riskLevel: "HIGH",
    status: "Under Review",
    createdAt: "08 Oct 2026",
    description: "Meal box arrived severely damaged and open, food was spilled across the bag.",
    reviewReason: "Similar evidence & manipulation indicators",
    assignedTo: "Alex R.",
    signals: [
      { name: "File Security", category: "Security", status: "Passed", detail: "No executable payloads or steganography" },
      { name: "Provenance", category: "Provenance", status: "Checked", detail: "EXIF intact, capture device: iPhone 13" },
      { name: "C2PA Manifest", category: "Provenance", status: "Not detected", impactScore: 0, detail: "No cryptographic C2PA signature found" },
      { name: "SynthID Watermark", category: "Provenance", status: "Not detected", impactScore: 0, detail: "No Google SynthID generative watermark" },
      { name: "Image Forensics", category: "Forensics", status: "Warning", impactScore: 20, detail: "Inconsistent noise profile on box tear edge" },
      { name: "OCR Extraction", category: "OCR", status: "Completed", detail: "Matched receipt order number ORD-98231" },
      { name: "Duplicate Search", category: "Duplicate", status: "Warning", impactScore: 15, detail: "94% visual similarity with claim CLM-8921" },
      { name: "Order Verification", category: "Order", status: "Matched", impactScore: 0, detail: "Delivery timestamp within 35 mins" },
      { name: "Behaviour Analytics", category: "Behaviour", status: "Completed", impactScore: 12, detail: "3 refund requests in 14 days" },
    ],
    duplicateMatch: {
      claimId: "CLM-8921",
      similarity: 94,
      evidenceId: "EV-81090"
    }
  },
  {
    id: "CLM-1029",
    customer: "Customer #412",
    orderId: "ORD-77192",
    platform: "Quick Commerce",
    type: "Damaged Item",
    amount: 849,
    currency: "INR",
    evidenceCount: 1,
    evidenceFile: "damaged-package-01.jpg",
    evidenceSize: "1.8 MB",
    evidenceHash: "bf82910c4109827aaeec0981726a411",
    evidenceDimensions: "1920 × 1080",
    riskScore: 82,
    riskLevel: "HIGH",
    status: "Under Review",
    createdAt: "08 Oct 2026",
    description: "Package crushed on doorstep during heavy rain.",
    reviewReason: "High claim frequency from IP subnet",
    assignedTo: "Unassigned",
    signals: [
      { name: "File Security", category: "Security", status: "Passed", detail: "Clean file structure" },
      { name: "Provenance", category: "Provenance", status: "Checked", detail: "Android capture headers verified" },
      { name: "C2PA Manifest", category: "Provenance", status: "Not detected", detail: "No manifest" },
      { name: "SynthID Watermark", category: "Provenance", status: "Not detected", detail: "None" },
      { name: "Image Forensics", category: "Forensics", status: "Warning", impactScore: 18, detail: "Compression artifacts along border" },
      { name: "OCR Extraction", category: "OCR", status: "Completed", detail: "Matches merchant invoice" },
      { name: "Duplicate Search", category: "Duplicate", status: "Passed", detail: "No matching perceptual hash" },
      { name: "Order Verification", category: "Order", status: "Matched", detail: "Driver confirmed delivered" },
      { name: "Behaviour Analytics", category: "Behaviour", status: "Warning", impactScore: 22, detail: "High dispute frequency" },
    ]
  },
  {
    id: "CLM-1031",
    customer: "Customer #903",
    orderId: "ORD-66291",
    platform: "E-Commerce",
    type: "Missing Item",
    amount: 1240,
    currency: "INR",
    evidenceCount: 1,
    evidenceFile: "missing-item-01.jpg",
    evidenceSize: "3.1 MB",
    evidenceHash: "ca198032aa0198e3b4829102",
    evidenceDimensions: "1280 × 960",
    riskScore: 92,
    riskLevel: "CRITICAL",
    status: "Under Review",
    createdAt: "08 Oct 2026",
    description: "Outer cardboard was received empty with resealed tape.",
    reviewReason: "Perceptual duplicate detected (98%)",
    assignedTo: "Unassigned",
    signals: [
      { name: "File Security", category: "Security", status: "Passed", detail: "Clean" },
      { name: "Provenance", category: "Provenance", status: "Checked", detail: "Web download metadata discovered" },
      { name: "C2PA Manifest", category: "Provenance", status: "Not detected", detail: "None" },
      { name: "SynthID Watermark", category: "Provenance", status: "Not detected", detail: "None" },
      { name: "Image Forensics", category: "Forensics", status: "Warning", impactScore: 25, detail: "Repeated clone tool stamps found" },
      { name: "OCR Extraction", category: "OCR", status: "Warning", impactScore: 15, detail: "Order ID mismatch on label" },
      { name: "Duplicate Search", category: "Duplicate", status: "Warning", impactScore: 30, detail: "Exact hash match in external fraud DB" },
      { name: "Order Verification", category: "Order", status: "Matched", detail: "Delivered to pin code" },
      { name: "Behaviour Analytics", category: "Behaviour", status: "Warning", impactScore: 18, detail: "Device ID linked to 5 refunded accounts" },
    ],
    duplicateMatch: {
      claimId: "CLM-6102",
      similarity: 98,
      evidenceId: "EV-77210"
    }
  },
  {
    id: "CLM-1032",
    customer: "Customer #821",
    orderId: "ORD-98244",
    platform: "Food Delivery",
    type: "Food Quality",
    amount: 1299,
    currency: "INR",
    evidenceCount: 2,
    evidenceFile: "damaged-food-02.jpg",
    evidenceSize: "2.4 MB",
    evidenceHash: "ea9108422aa980174092b3",
    evidenceDimensions: "1280 × 960",
    riskScore: 94,
    riskLevel: "CRITICAL",
    status: "Under Review",
    createdAt: "08 Oct 2026",
    description: "Repeated complaint within 3 hours claiming contaminated meal.",
    reviewReason: "Duplicate evidence from prior claim",
    assignedTo: "Unassigned",
    signals: [
      { name: "File Security", category: "Security", status: "Passed", detail: "Clean" },
      { name: "Provenance", category: "Provenance", status: "Checked", detail: "Recycled image from previous claim" },
      { name: "C2PA Manifest", category: "Provenance", status: "Not detected", detail: "None" },
      { name: "SynthID Watermark", category: "Provenance", status: "Not detected", detail: "None" },
      { name: "Image Forensics", category: "Forensics", status: "Warning", impactScore: 24, detail: "Metadata timestamps predate order time" },
      { name: "OCR Extraction", category: "OCR", status: "Warning", impactScore: 20, detail: "Receipt date is 2 weeks prior" },
      { name: "Duplicate Search", category: "Duplicate", status: "Warning", impactScore: 35, detail: "100% byte match to EV-82921" },
      { name: "Order Verification", category: "Order", status: "Matched", detail: "Order status delivered" },
      { name: "Behaviour Analytics", category: "Behaviour", status: "Warning", impactScore: 15, detail: "Rapid re-submission pattern" },
    ],
    duplicateMatch: {
      claimId: "CLM-1001",
      similarity: 100,
      evidenceId: "EV-82921"
    }
  },
  {
    id: "CLM-1002",
    customer: "Customer #304",
    orderId: "ORD-51920",
    platform: "Food Delivery",
    type: "Wrong Item",
    amount: 540,
    currency: "INR",
    evidenceCount: 1,
    evidenceFile: "wrong-product-01.jpg",
    evidenceSize: "1.4 MB",
    evidenceHash: "198402bcde01",
    evidenceDimensions: "1024 × 768",
    riskScore: 14,
    riskLevel: "LOW",
    status: "Verified",
    createdAt: "07 Oct 2026",
    description: "Received vegetarian combo instead of chicken biryani.",
    signals: [
      { name: "File Security", category: "Security", status: "Passed", detail: "Passed" },
      { name: "Provenance", category: "Provenance", status: "Checked", detail: "Camera capture authentic" },
      { name: "C2PA Manifest", category: "Provenance", status: "Not detected", detail: "None" },
      { name: "SynthID Watermark", category: "Provenance", status: "Not detected", detail: "None" },
      { name: "Image Forensics", category: "Forensics", status: "Passed", detail: "Natural lighting, no tampering" },
      { name: "OCR Extraction", category: "OCR", status: "Completed", detail: "Item tag confirmed wrong" },
      { name: "Duplicate Search", category: "Duplicate", status: "Passed", detail: "Original capture" },
      { name: "Order Verification", category: "Order", status: "Matched", detail: "Restaurant packing slip confirms" },
      { name: "Behaviour Analytics", category: "Behaviour", status: "Completed", detail: "First claim in 18 months" },
    ]
  },
  {
    id: "CLM-1003",
    customer: "Customer #611",
    orderId: "ORD-44910",
    platform: "E-Commerce",
    type: "Damaged Package",
    amount: 3200,
    currency: "INR",
    evidenceCount: 3,
    evidenceFile: "delivery-damage-01.jpg",
    evidenceSize: "2.1 MB",
    evidenceHash: "8899aabbccddeeff",
    evidenceDimensions: "1280 × 960",
    riskScore: 48,
    riskLevel: "MEDIUM",
    status: "Processing",
    createdAt: "07 Oct 2026",
    description: "External carton ripped open in transit, inner electronics package punctured.",
    signals: [
      { name: "File Security", category: "Security", status: "Passed", detail: "Clean" },
      { name: "Provenance", category: "Provenance", status: "Checked", detail: "Timestamp aligns with courier dropoff" },
      { name: "C2PA Manifest", category: "Provenance", status: "Not detected", detail: "None" },
      { name: "SynthID Watermark", category: "Provenance", status: "Not detected", detail: "None" },
      { name: "Image Forensics", category: "Forensics", status: "Passed", detail: "Punctures match cardboard tear" },
      { name: "OCR Extraction", category: "OCR", status: "Completed", detail: "Waybill barcode matches courier tracking" },
      { name: "Duplicate Search", category: "Duplicate", status: "Passed", detail: "No visual matches" },
      { name: "Order Verification", category: "Order", status: "Matched", detail: "Courier flagged rough transit" },
      { name: "Behaviour Analytics", category: "Behaviour", status: "Warning", impactScore: 10, detail: "Account registered 3 days ago" },
    ]
  }
];

export const INITIAL_EVIDENCE: EvidenceItem[] = [
  {
    id: "EV-82921",
    claimId: "CLM-1001",
    filename: "damaged-food-01.jpg",
    fileType: "JPG",
    fileSize: "2.4 MB",
    dimensions: "1280 × 960",
    hash: "a9f43b77e81029da483cf29188e0182c402198be9031",
    analysisStatus: "Completed",
    uploadedAt: "08 Oct 2026, 18:21",
    imageSrc: "/demo-evidence/damaged-food-01.jpg",
    c2pa: "Not detected",
    synthId: "Not detected",
    forensics: {
      metadata: "Available (iPhone 13, iOS 17.4)",
      compressionAnomaly: true,
      manipulationIndicators: true,
    },
    ocr: {
      orderId: "ORD-98231",
      product: "Deluxe Meal Box, 2x Sides",
      rawText: "DOORSTEP DELIVERIES • FRAGILE • SHIP TO: PARAG J. • ORDER 978203 • FOOD & ESSENTIALS",
    },
    duplicateMatch: {
      similarity: 94,
      matchedEvidenceId: "EV-81090",
      matchedClaimId: "CLM-8921",
    }
  },
  {
    id: "EV-82922",
    claimId: "CLM-1029",
    filename: "damaged-package-01.jpg",
    fileType: "JPG",
    fileSize: "1.8 MB",
    dimensions: "1920 × 1080",
    hash: "bf82910c4109827aaeec0981726a411",
    analysisStatus: "Completed",
    uploadedAt: "08 Oct 2026, 17:45",
    imageSrc: "/demo-evidence/damaged-package-01.jpg",
    c2pa: "Not detected",
    synthId: "Not detected",
    forensics: {
      metadata: "Available (Samsung SM-G998B)",
      compressionAnomaly: true,
      manipulationIndicators: false,
    },
    ocr: {
      orderId: "ORD-77192",
      product: "Fresh Groceries Assorted",
      rawText: "EXPRESS DELIVERY • PARCEL ID 77192 • DO NOT DROP",
    }
  },
  {
    id: "EV-82923",
    claimId: "CLM-1031",
    filename: "missing-item-01.jpg",
    fileType: "JPG",
    fileSize: "3.1 MB",
    dimensions: "1280 × 960",
    hash: "ca198032aa0198e3b4829102",
    analysisStatus: "Completed",
    uploadedAt: "08 Oct 2026, 16:30",
    imageSrc: "/demo-evidence/missing-item-01.jpg",
    c2pa: "Not detected",
    synthId: "Not detected",
    forensics: {
      metadata: "Stripped (Web Download)",
      compressionAnomaly: true,
      manipulationIndicators: true,
    },
    ocr: {
      orderId: "ORD-66291",
      product: "Smart Watch Series 8",
      rawText: "SECURE SHIPMENT • TAPE TEMPERED",
    },
    duplicateMatch: {
      similarity: 98,
      matchedEvidenceId: "EV-77210",
      matchedClaimId: "CLM-6102",
    }
  },
  {
    id: "EV-82924",
    claimId: "CLM-1002",
    filename: "wrong-product-01.jpg",
    fileType: "JPG",
    fileSize: "1.4 MB",
    dimensions: "1024 × 768",
    hash: "198402bcde01",
    analysisStatus: "Completed",
    uploadedAt: "07 Oct 2026, 19:10",
    imageSrc: "/demo-evidence/wrong-product-01.jpg",
    c2pa: "Not detected",
    synthId: "Not detected",
    forensics: {
      metadata: "Available (Pixel 7 Pro)",
      compressionAnomaly: false,
      manipulationIndicators: false,
    },
    ocr: {
      orderId: "ORD-51920",
      product: "Veg Thali Special",
      rawText: "ORDER 51920 • VEG COMBO DELUXE",
    }
  },
  {
    id: "EV-82925",
    claimId: "CLM-1003",
    filename: "delivery-damage-01.jpg",
    fileType: "JPG",
    fileSize: "2.1 MB",
    dimensions: "1280 × 960",
    hash: "8899aabbccddeeff",
    analysisStatus: "Processing",
    uploadedAt: "07 Oct 2026, 14:02",
    imageSrc: "/demo-evidence/delivery-damage-01.jpg",
    c2pa: "Not detected",
    synthId: "Not detected",
    forensics: {
      metadata: "Available (OnePlus 11)",
      compressionAnomaly: false,
      manipulationIndicators: false,
    },
    ocr: {
      orderId: "ORD-44910",
      product: "External Storage Hub",
      rawText: "LOGISTICS WAYBILL • 44910 • HANDLE WITH CARE",
    }
  },
  {
    id: "EV-82926",
    claimId: "CLM-1032",
    filename: "damaged-food-02.jpg",
    fileType: "JPG",
    fileSize: "2.4 MB",
    dimensions: "1280 × 960",
    hash: "ea9108422aa980174092b3",
    analysisStatus: "Completed",
    uploadedAt: "08 Oct 2026, 15:40",
    imageSrc: "/demo-evidence/damaged-food-02.jpg",
    c2pa: "Not detected",
    synthId: "Not detected",
    forensics: {
      metadata: "Stripped Metadata",
      compressionAnomaly: true,
      manipulationIndicators: true,
    },
    ocr: {
      orderId: "ORD-98244",
      product: "Curry Feast Bowl",
      rawText: "RESTAURANT INVOICE • DUPLICATE",
    },
    duplicateMatch: {
      similarity: 100,
      matchedEvidenceId: "EV-82921",
      matchedClaimId: "CLM-1001",
    }
  },
  {
    id: "EV-82927",
    claimId: "CLM-1001",
    filename: "receipt-01.jpg",
    fileType: "JPG",
    fileSize: "1.2 MB",
    dimensions: "1080 × 1440",
    hash: "77aa11223344",
    analysisStatus: "Completed",
    uploadedAt: "08 Oct 2026, 18:22",
    imageSrc: "/demo-evidence/receipt-01.jpg",
    c2pa: "Not detected",
    synthId: "Not detected",
    forensics: {
      metadata: "Available (iPhone 13)",
      compressionAnomaly: false,
      manipulationIndicators: false,
    },
    ocr: {
      orderId: "ORD-98231",
      product: "Customer Order Slip",
      rawText: "DELIVERY SLIP ORD-98231 • ₹749 PAID",
    }
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: "AUD-901",
    timestamp: "08 Oct 2026, 18:24",
    user: "Reviewer (Alex R.)",
    action: "review.completed",
    resource: "CLM-1001",
    result: "Success",
    ip: "103.24.110.12"
  },
  {
    id: "AUD-902",
    timestamp: "08 Oct 2026, 18:21",
    user: "System (Worker #2)",
    action: "evidence.uploaded",
    resource: "EV-82921",
    result: "Success",
    ip: "10.0.4.88"
  },
  {
    id: "AUD-903",
    timestamp: "08 Oct 2026, 18:22",
    user: "Risk Engine v2.4",
    action: "risk.calculated",
    resource: "CLM-1001 (Score: 87)",
    result: "Success",
    ip: "10.0.2.14"
  },
  {
    id: "AUD-904",
    timestamp: "08 Oct 2026, 17:50",
    user: "Admin (Alex R.)",
    action: "api_key.created",
    resource: "tl_live_prod_2026",
    result: "Success",
    ip: "103.24.110.12"
  },
  {
    id: "AUD-905",
    timestamp: "08 Oct 2026, 16:35",
    user: "Fraud Detector",
    action: "duplicate.flagged",
    resource: "CLM-1031 (98% match)",
    result: "Warning",
    ip: "10.0.3.9"
  }
];
