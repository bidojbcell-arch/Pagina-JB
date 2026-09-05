import { createClient } from "@/lib/supabase/server";
import { Producto } from "@/lib/types";
import CatalogoClient from "@/components/CatalogoClient";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { whatsappLink } from "@/lib/whatsapp";

export const revalidate = 0;

export default async function HomePage() {
  const supabase = createClient();
  const { data } = await supabase
    .from("productos")
    .select("*")
    .eq("disponible", true)
    .order("destacado", { ascending: false })
    .order("created_at", { ascending: false });

  const productos = (data ?? []) as Producto[];

  return (
    <main className="min-h-screen">
      <header className="relative overflow-hidden bg-gradient-to-br from-brand-700 via-brand-600 to-indigo-500 text-white">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-4 px-5 py-14 sm:py-20">
          <span className="rounded-full bg-white/15 px-4 py-1 text-xs font-semibold uppercase tracking-widest">
            Catálogo oficial
          </span>
          <h1 className="text-3xl font-extrabold leading-tight sm:text-5xl">
            JB Tecnología &amp; Accesorios
          </h1>
          <p className="max-w-xl text-white/85 sm:text-lg">
            Relojes, audífonos, celulares, cargadores, powerbanks, soportes, tablets
            y palos selfie. Calidad garantizada y entrega rápida.
          </p>
          <a
            href={whatsappLink(
              "Hola, vi su catálogo y quisiera más información sobre sus productos."
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-brand-700 shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
          >
            Ordenar por WhatsApp
          </a>
        </div>
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 left-10 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
      </header>

      <section className="mx-auto max-w-6xl px-5 py-10">
        <CatalogoClient productos={productos} />
      </section>

      <footer className="border-t border-slate-200 bg-white py-8 text-center text-sm text-slate-500">
        <p>© {new Date().getFullYear()} JB Tecnología &amp; Accesorios. Todos los derechos reservados.</p>
        <a href="/admin" className="mt-1 inline-block text-xs text-slate-300 hover:text-slate-400">
          Acceso administrador
        </a>
      </footer>

      <WhatsAppFloat />
    </main>
  );
}
