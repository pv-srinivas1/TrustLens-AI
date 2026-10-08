import { Sidebar } from "@/components/layout/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full bg-white text-slate-900 font-sans">
      <Sidebar />
      <main className="flex-1 overflow-y-auto border-l border-slate-100 p-6">
        <div className="max-w-6xl">
          {children}
        </div>
      </main>
    </div>
  );
}
