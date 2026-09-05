"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function RecoveryPage() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/admin/resetear",
    });
    setLoading(false);
    setMessage(error ? "No pudimos enviar el correo. Revisa la dirección e inténtalo otra vez." : "Si ese correo está registrado, recibirás un enlace para crear una contraseña nueva.");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-brand-50 px-4">
      <form onSubmit={submit} className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-card">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent-600">JBCELL</p>
        <h1 className="mt-2 text-2xl font-black text-brand-900">Restablecer contraseña</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">Te enviaremos un enlace seguro para crear una nueva contraseña.</p>
        <label className="mt-6 block text-sm font-medium text-slate-700">Correo de administrador</label>
        <input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100" placeholder="bidojbcell@gmail.com" />
        {message && <p className="mt-4 text-sm text-brand-700">{message}</p>}
        <button disabled={loading} className="mt-6 w-full rounded-xl bg-accent-600 px-4 py-3 font-bold text-white hover:bg-accent-700 disabled:opacity-60">{loading ? "Enviando..." : "Enviar enlace"}</button>
        <a className="mt-5 block text-center text-xs font-bold text-brand-700" href="/admin/login">← Volver a ingresar</a>
      </form>
    </main>
  );
}