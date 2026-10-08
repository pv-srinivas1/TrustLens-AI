import Link from "next/link";

const navItems = [
  { name: "Overview", href: "/dashboard" },
  { name: "Claims", href: "/dashboard/claims" },
  { name: "Review Queue", href: "/dashboard/review-queue" },
  { name: "Evidence", href: "/dashboard/evidence" },
  { name: "Risk Analytics", href: "/dashboard/analytics" },
  { name: "Duplicate Evidence", href: "/dashboard/duplicates" },
  { name: "Customers", href: "/dashboard/customers" },
  { name: "Organizations", href: "/dashboard/organizations" },
  { name: "API Keys", href: "/dashboard/api-keys" },
  { name: "Audit Logs", href: "/dashboard/audit-logs" },
];

export function Sidebar() {
  return (
    <div className="w-56 h-screen border-r border-slate-200 bg-white flex flex-col">
      <div className="p-4 border-b border-slate-200">
        <h1 className="font-semibold text-sm text-slate-900 tracking-tight">TrustLens AI</h1>
      </div>
      <nav className="flex-1 overflow-y-auto py-2">
        <ul className="space-y-0.5">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className="block px-4 py-1.5 text-xs text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium transition-colors"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
