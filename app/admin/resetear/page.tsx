"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const supabase = createClient();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (password !== confirm) { setMessage("Las contraseñas no coinciden."); return; }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) { setMessage("El enlace no es válido o venció. Solicita uno nuevo."); return; }
    router.replace("/admin");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-brand-50 px-4">
      <form onSubmit={submit} className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-card">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent-600">JBCELL</p>
        <h1 className="mt-2 text-2xl font-black text-brand-900">Crea tu nueva contraseña</h1>
        <p className="mt-2 text-sm text-slate-500">Usa al menos 6 caracteres.</p>
        <label className="mt-6 block text-sm font-medium text-slate-700">Nueva contraseña</label>
        <input type="password" minLength={6} required value={password} onChange={(event) => setPassword(event.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100" />
        <label className="mt-4 block text-sm font-medium text-slate-700">Confirmar contraseña</label>
        <input type="password" minLength={6} required value={confirm} onChange={(event) => setConfirm(event.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100" />
        {message && <p className="mt-4 text-sm text-accent-700">{message}</p>}
        <button disabled={loading} className="mt-6 w-full rounded-xl bg-accent-600 px-4 py-3 font-bold text-white hover:bg-accent-700 disabled:opacity-60">{loading ? "Guardando..." : "Guardar contraseña"}</button>
      </form>
    </main>
  );
}