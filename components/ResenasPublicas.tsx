"use client";

import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Resena } from "@/lib/types";

const googleReviewUrl =
  "https://www.google.com/maps/place/JBCELL/@18.4784719,-69.9721019,16z/data=!4m6!3m5!1s0x8eaf8b5410336c79:0xb03ff606be46cd48!8m2!3d18.4784716!4d-69.969499!16s%2Fg%2F11wpp554tk?entry=ttu";

export default function ResenasPublicas({ resenas }: { resenas: Resena[] }) {
  const [nombre, setNombre] = useState("");
  const [calificacion, setCalificacion] = useState(5);
  const [comentario, setComentario] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  async function enviarResena(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (enviando) return;

    const nombreLimpio = nombre.trim();
    const comentarioLimpio = comentario.trim();
    setMensaje("");

    if (nombreLimpio.length < 2 || !Number.isInteger(calificacion) || calificacion < 1 || calificacion > 5 || comentarioLimpio.length < 5) {
      setError("Escribe al menos 2 caracteres en tu nombre, elige una calificación de 1 a 5 y deja un comentario de al menos 5 caracteres.");
      return;
    }

    setError("");
    setEnviando(true);
    try {
      const { error: insertError } = await createClient().from("resenas").insert({
        nombre: nombreLimpio,
        calificacion,
        comentario: comentarioLimpio,
        estado: "pendiente",
      });
      if (insertError) throw insertError;
      setNombre("");
      setCalificacion(5);
      setComentario("");
      setMensaje("Tu reseña será publicada después de revisión.");
    } catch {
      setError("No pudimos enviar tu reseña. Inténtalo de nuevo.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <section aria-labelledby="resenas-title" className="bg-brand-50 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent-600">Reseñas de clientes</p>
            <h2 id="resenas-title" className="mt-2 text-3xl font-black tracking-tight text-brand-900">Tu experiencia con JBCELL cuenta.</h2>
          </div>
          <a href={googleReviewUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-brand-700 underline decoration-accent-500 underline-offset-4 hover:text-accent-700">
            Ver o dejar reseña en Google
          </a>
        </div>

        {resenas.length > 0 ? (
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {resenas.map((resena) => (
              <figure key={resena.id} className="rounded-2xl border border-brand-100 bg-white p-6 shadow-card">
                <div aria-label={`${resena.calificacion} de 5 estrellas`} className="text-lg text-accent-600">
                  {"★".repeat(resena.calificacion)}<span className="text-slate-300">{"★".repeat(5 - resena.calificacion)}</span>
                </div>
                <blockquote className="mt-4 whitespace-pre-wrap text-sm leading-6 text-slate-600">“{resena.comentario}”</blockquote>
                <figcaption className="mt-5 text-sm font-bold text-brand-800">{resena.nombre}</figcaption>
              </figure>
            ))}
          </div>
        ) : (
          <p className="mt-8 text-sm text-slate-600">Sé la primera persona en compartir su experiencia.</p>
        )}

        <form onSubmit={enviarResena} className="mt-10 max-w-2xl rounded-2xl border border-brand-100 bg-white p-6 shadow-card">
          <h3 className="text-xl font-black text-brand-900">Comparte tu experiencia</h3>
          <p className="mt-1 text-sm text-slate-600">Revisaremos tu reseña antes de publicarla.</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-semibold text-brand-900">
              Nombre
              <input name="nombre" value={nombre} onChange={(event) => setNombre(event.target.value)} maxLength={80} required className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 font-normal text-slate-900" />
            </label>
            <label className="block text-sm font-semibold text-brand-900">
              Calificación
              <select name="calificacion" value={calificacion} onChange={(event) => setCalificacion(Number(event.target.value))} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 font-normal text-slate-900">
                {[5, 4, 3, 2, 1].map((valor) => <option key={valor} value={valor}>{valor} {valor === 1 ? "estrella" : "estrellas"}</option>)}
              </select>
            </label>
          </div>
          <label className="mt-4 block text-sm font-semibold text-brand-900">
            Comentario
            <textarea name="comentario" value={comentario} onChange={(event) => setComentario(event.target.value)} minLength={5} maxLength={500} required rows={4} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 font-normal text-slate-900" />
          </label>
          {error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}
          {mensaje && <p role="status" className="mt-3 text-sm text-brand-800">{mensaje}</p>}
          <button type="submit" disabled={enviando} className="mt-5 rounded-xl bg-accent-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-accent-700 disabled:cursor-wait disabled:opacity-60">
            {enviando ? "Enviando…" : "Enviar reseña"}
          </button>
        </form>
      </div>
    </section>
  );
}
