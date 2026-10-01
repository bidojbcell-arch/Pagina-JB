import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { Producto, Resena } from "@/lib/types";
import CatalogoClient from "@/components/CatalogoClient";
import ResenasPublicas from "@/components/ResenasPublicas";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { whatsappLink } from "@/lib/whatsapp";

export const revalidate = 0;

const storeSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "JBCELL",
  url: "https://www.jbcell.com/",
  description:
    "Tienda de celulares, accesorios y tecnología con entrega en Santo Domingo y envíos a toda República Dominicana.",
  areaServed: [
    { "@type": "City", name: "Santo Domingo" },
    { "@type": "Country", name: "República Dominicana" },
  ],
  potentialAction: {
    "@type": "ContactAction",
    target: whatsappLink("Hola, quiero información sobre los productos de JBCELL."),
    name: "Comprar por WhatsApp",
  },
};

export default async function HomePage() {
  const supabase = createClient();
  const { data } = await supabase
    .from("productos")
    .select("*")
    .eq("disponible", true)
    .order("orden", {ascending: true})
    .order("created_at", { ascending: false });

  const productos = (data ?? []) as Producto[];
  const { data: resenasData } = await supabase
    .from("resenas")
    .select("*")
    .eq("estado", "aprobada")
    .order("created_at", { ascending: false })
    .limit(6);
  const resenas = (resenasData ?? []) as Resena[];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(storeSchema).replace(/</g, "\u003c"),
        }}
      />
      <div className="bg-brand-900 px-4 py-2 text-center text-[11px] font-bold uppercase tracking-[0.16em] text-white">
        Entrega en Santo Domingo · Envíos a toda República Dominicana · Atención personalizada
      </div>

      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-3 px-3 py-3 sm:flex-nowrap sm:gap-4 sm:px-5 sm:py-4">
          <a href="/" className="shrink-0" aria-label="Inicio JBCELL">
            <Image src="/jbcell-logo-clean.png" alt="JBCELL" width={2073} height={758} priority className="h-8 w-auto sm:h-14" />
          </a>
          <nav aria-label="Navegación principal" className="order-3 mt-3 flex basis-full justify-center gap-6 border-t border-slate-100 pt-3 text-xs font-bold text-slate-600 sm:order-none sm:mt-0 sm:basis-auto sm:flex-1 sm:justify-center sm:border-0 sm:pt-0 sm:text-sm">
            <a className="transition hover:text-brand-700" href="#productos">Productos</a>
            <a className="transition hover:text-brand-700" href="#ofertas">Ofertas</a>
            <a aria-label="Instagram JBCELL" href="https://www.instagram.com/bidosmart1/" target="_blank" rel="noopener noreferrer" className="transition hover:text-accent-600"><svg viewBox="0 0 24 24" aria-hidden="true" className="inline h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg></a>
            <a aria-label="Facebook JBCELL" href="https://www.facebook.com/profile.php?id=61591822580824" target="_blank" rel="noopener noreferrer" className="transition hover:text-accent-600"><svg viewBox="0 0 24 24" aria-hidden="true" className="inline h-4 w-4" fill="currentColor"><path d="M13.5 21v-8h2.7l.4-3h-3.1V8.1c0-.9.2-1.5 1.5-1.5H16.7V4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4V10H8v3h2.5v8h3z"/></svg></a>
            <a aria-label="Ubicación JBCELL" href="https://www.google.com/maps/place/JBCELL/@18.4784719,-69.9721019,16z/data=!4m6!3m5!1s0x8eaf8b5410336c79:0xb03ff606be46cd48!8m2!3d18.4784716!4d-69.969499!16s%2Fg%2F11wpp554tk?entry=ttu" target="_blank" rel="noopener noreferrer" className="transition hover:text-accent-600"><svg viewBox="0 0 24 24" aria-hidden="true" className="inline h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 21s7-5.1 7-12a7 7 0 1 0-14 0c0 6.9 7 12 7 12Z"/><circle cx="12" cy="9" r="2.5"/></svg></a>
          </nav>
        </div>
      </header>

      <section id="productos" className="border-b border-brand-100 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-16">
          <div className="mb-8"><div className="mb-6 flex flex-wrap gap-3"><a href="#productos" className="rounded-xl bg-accent-600 px-6 py-3.5 text-sm font-black text-white shadow-lg shadow-accent-600/30 transition hover:-translate-y-0.5 hover:bg-accent-700">Ver productos</a><a href={whatsappLink("Hola, quiero información sobre los productos de JBCELL.")} target="_blank" rel="noopener noreferrer" className="rounded-xl bg-[#25D366] px-6 py-3.5 text-sm font-black text-white shadow-lg shadow-green-600/25 transition hover:-translate-y-0.5 hover:brightness-95">Escríbenos por WhatsApp</a></div><p className="text-xs font-bold uppercase tracking-[0.16em] text-accent-600">Catálogo JBCELL</p><h2 className="mt-2 text-3xl font-black tracking-tight text-brand-900">Novedades y productos disponibles</h2><p className="mt-2 text-slate-500">Elige tu favorito y escríbenos para confirmar disponibilidad.</p></div>
          <CatalogoClient productos={productos} />
        </div>
      </section>

      <ResenasPublicas resenas={resenas} />

      <footer className="bg-white">
        <section aria-label="Ubicación JBCELL" className="mx-auto max-w-7xl px-5 pt-10"><div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50"><iframe title="Mapa de JBCELL" src="https://www.google.com/maps?q=JBCELL%2C%20Plaza%20Fermin%2C%20Santo%20Domingo%20Oeste&output=embed" className="h-64 w-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade"/><div className="p-4"><p className="font-bold text-brand-900">Plaza Fermín, Santo Domingo Oeste KM9 de la Autop. Juan Pablo Duarte, Santo Domingo 10110</p><a href="https://www.google.com/maps/place/JBCELL/@18.4784719,-69.9721019,16z/data=!4m6!3m5!1s0x8eaf8b5410336c79:0xb03ff606be46cd48!8m2!3d18.4784716!4d-69.969499!16s%2Fg%2F11wpp554tk?entry=ttu" target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-sm font-bold text-brand-700 hover:text-accent-600">Abrir en Google Maps</a></div></div></section>
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 px-5 py-8 text-sm text-slate-500 sm:flex-row sm:items-center">
          <div>
            <Image src="/jbcell-logo-clean.png" alt="JBCELL" width={2073} height={758} className="h-10 w-auto" />
            <p className="mt-2">© {new Date().getFullYear()} JBCELL · Tecnología a tu alcance.</p>
            <p className="mt-2 max-w-md">Plaza Fermín, Santo Domingo Oeste KM9 de la Autop. Juan Pablo Duarte, Santo Domingo 10110</p>
          </div>
          <nav aria-label="Redes sociales y ubicación" className="flex flex-wrap gap-x-5 gap-y-3 font-semibold text-brand-700">
            <a href="https://www.instagram.com/bidosmart1/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="inline-flex items-center gap-2 hover:text-accent-600">
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
              Instagram
            </a>
            <a href="https://www.facebook.com/profile.php?id=61591822580824" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="inline-flex items-center gap-2 hover:text-accent-600">
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M13.5 21v-8h2.7l.4-3.2h-3.1V7.7c0-.9.3-1.5 1.6-1.5h1.7V3.3a22 22 0 0 0-2.5-.1c-2.5 0-4.2 1.5-4.2 4.3v2.3H7.3V13h2.8v8h3.4Z"/></svg>
              Facebook
            </a>
            <a href="https://www.google.com/maps/place/JBCELL/@18.4784719,-69.9721019,16z/data=!4m6!3m5!1s0x8eaf8b5410336c79:0xb03ff606be46cd48!8m2!3d18.4784716!4d-69.969499!16s%2Fg%2F11wpp554tk?entry=ttu" target="_blank" rel="noopener noreferrer" aria-label="Cómo llegar" className="inline-flex items-center gap-2 hover:text-accent-600">
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></svg>
              Cómo llegar
            </a>
          </nav>
        </div>
      </footer>
      <WhatsAppFloat />
    </main>
  );
}
