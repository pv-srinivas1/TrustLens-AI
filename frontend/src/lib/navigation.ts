import { 
  Grid,
  FileText,
  CheckSquare,
  Layers,
  ShieldAlert,
  Settings,
  Users,
  Key,
  Webhook,
  History,
  Building,
  Copy
} from "lucide-react";

export interface NavItem {
  name: string;
  href: string;
  icon: typeof Grid;
  badge?: string;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export const navigationSections: NavSection[] = [
  {
    title: "WORKSPACE",
    items: [
      { name: "Overview", href: "/dashboard", icon: Grid },
      { name: "Claims", href: "/dashboard/claims", icon: FileText },
      { name: "Review Queue", href: "/dashboard/review-queue", icon: CheckSquare },
      { name: "Evidence", href: "/dashboard/evidence", icon: Layers },
    ],
  },
  {
    title: "ANALYTICS",
    items: [
      { name: "Risk Analytics", href: "/dashboard/analytics", icon: ShieldAlert },
      { name: "Duplicate Evidence", href: "/dashboard/evidence?tab=duplicates", icon: Copy },
      { name: "Customers", href: "/dashboard/settings?tab=customers", icon: Users },
    ],
  },
  {
    title: "ADMINISTRATION",
    items: [
      { name: "Organizations", href: "/dashboard/settings?tab=organizations", icon: Building },
      { name: "API Keys", href: "/dashboard/settings?tab=api_keys", icon: Key },
      { name: "Webhooks", href: "/dashboard/settings?tab=webhooks", icon: Webhook },
      { name: "Audit Logs", href: "/dashboard/settings?tab=audit_logs", icon: History },
      { name: "Settings", href: "/dashboard/settings", icon: Settings },
    ],
  },
];
