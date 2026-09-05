import LogoutButton from "@/components/LogoutButton";
import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-3 shadow-sm">
        <Link href="/admin" className="font-bold text-brand-700">
          JB · Panel Admin
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/" className="text-slate-500 hover:text-slate-700">
            Ver catálogo
          </Link>
          <LogoutButton />
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-5 py-8">{children}</main>
    </div>
  );
}
