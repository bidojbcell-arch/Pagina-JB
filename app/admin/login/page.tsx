"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setCargando(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setCargando(false);
    if (error) {
      setError("No pudimos iniciar sesión. Verifica tu correo y contraseña, o restablécela.");
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-900 via-brand-700 to-accent-700 px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-2xl">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-accent-600">JBCELL</p>
        <h1 className="mb-1 text-2xl font-black text-brand-900">Panel administrador</h1>
        <p className="mb-6 text-sm text-slate-500">Ingresa para gestionar tu catálogo.</p>
        <label className="mb-1 block text-sm font-medium text-slate-700">Correo</label>
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mb-4 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100" placeholder="admin@correo.com" />
        <label className="mb-1 block text-sm font-medium text-slate-700">Contraseña</label>
        <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="mb-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100" placeholder="••••••••" />
        <a href="/admin/recuperar" className="text-xs font-bold text-brand-700 hover:text-accent-600">¿Olvidaste tu contraseña?</a>
        {error && <p className="mt-4 text-sm text-accent-700">{error}</p>}
        <button type="submit" disabled={cargando} className="mt-5 w-full rounded-xl bg-accent-600 px-4 py-3 font-bold text-white transition hover:bg-accent-700 disabled:opacity-60">
          {cargando ? "Ingresando..." : "Ingresar"}
        </button>
        <a href="/" className="mt-5 block text-center text-xs text-slate-400 hover:text-brand-700">← Volver al catálogo</a>
      </form>
    </div>
  );
}