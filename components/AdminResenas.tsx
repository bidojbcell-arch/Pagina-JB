"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Resena } from "@/lib/types";

export default function AdminResenas({ resenasIniciales }: { resenasIniciales: Resena[] }) {
  const [resenas, setResenas] = useState(resenasIniciales);
  const [procesando, setProcesando] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function aprobar(resena: Resena) {
    if (procesando) return;
    setProcesando(resena.id);
    setError("");
    try {
      const { error } = await createClient().from("resenas").update({ estado: "aprobada" }).eq("id", resena.id);
      if (error) throw error;
      setResenas((actuales) => actuales.map((actual) => actual.id === resena.id ? { ...actual, estado: "aprobada" } : actual));
    } catch {
      setError(`No se pudo aprobar la reseña de ${resena.nombre}. Inténtalo de nuevo.`);
    } finally {
      setProcesando(null);
    }
  }

  async function eliminar(resena: Resena) {
    if (procesando) return;
    setProcesando(resena.id);
    setError("");
    try {
      const { error } = await createClient().from("resenas").delete().eq("id", resena.id);
      if (error) throw error;
      setResenas((actuales) => actuales.filter((actual) => actual.id !== resena.id));
    } catch {
      setError(`No se pudo eliminar la reseña de ${resena.nombre}. Inténtalo de nuevo.`);
    } finally {
      setProcesando(null);
    }
  }

  return (
    <section aria-labelledby="admin-resenas-title" className="space-y-4">
      <div>
        <h2 id="admin-resenas-title" className="text-xl font-black text-brand-900">Reseñas de clientes</h2>
        <p className="text-sm text-slate-500">Revisa los comentarios antes de publicarlos.</p>
      </div>
      {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      {resenas.length === 0 ? (
        <p className="rounded-2xl border bg-white p-6 text-sm text-slate-600">Todavía no hay reseñas.</p>
      ) : (
        <div className="space-y-3">
          {resenas.map((resena) => (
            <article key={resena.id} className="rounded-2xl border bg-white p-5 shadow-card">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-bold text-brand-900">{resena.nombre}</h3>
                  <p aria-label={`${resena.calificacion} de 5 estrellas`} className="text-sm text-accent-600">{"★".repeat(resena.calificacion)}<span className="text-slate-300">{"★".repeat(5 - resena.calificacion)}</span></p>
                </div>
                <div className="text-right text-xs text-slate-500">
                  <p className={resena.estado === "pendiente" ? "font-bold text-amber-700" : "font-bold text-emerald-700"}>{resena.estado === "pendiente" ? "Pendiente" : "Aprobada"}</p>
                  <time dateTime={resena.created_at}>{new Date(resena.created_at).toLocaleDateString("es-DO")}</time>
                </div>
              </div>
              <p className="mt-3 whitespace-pre-wrap text-sm text-slate-700">{resena.comentario}</p>
              <div className="mt-4 flex gap-2">
                {resena.estado === "pendiente" && <button type="button" disabled={procesando !== null} onClick={() => aprobar(resena)} className="rounded-lg bg-brand-700 px-4 py-2 text-sm font-bold text-white disabled:opacity-50">Aprobar</button>}
                <button type="button" disabled={procesando !== null} onClick={() => eliminar(resena)} className="rounded-lg border border-red-200 px-4 py-2 text-sm font-bold text-red-700 disabled:opacity-50">Eliminar</button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
