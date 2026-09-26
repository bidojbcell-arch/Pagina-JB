import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { Producto, Resena } from "@/lib/types";
import CatalogoClient from "@/components/CatalogoClient";
import ResenasPublicas from "@/components/ResenasPublicas";
import StorefrontTrust from "@/components/StorefrontTrust";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { whatsappLink } from "@/lib/whatsapp";

export const revalidate = 0;

const storeSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "JBCELL",
  url: "https://paginajb.vercel.app/",
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
          </nav>
        </div>
      </header>

      <section id="productos" className="border-b border-brand-100 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-16">
          <div className="mb-8"><p className="text-xs font-bold uppercase tracking-[0.16em] text-accent-600">Catálogo JBCELL</p><h2 className="mt-2 text-3xl font-black tracking-tight text-brand-900">Novedades y productos disponibles</h2><p className="mt-2 text-slate-500">Elige tu favorito y escríbenos para confirmar disponibilidad.</p></div>
          <CatalogoClient productos={productos} />
        </div>
      </section>

      <section className="relative overflow-hidden bg-gradient-to-br from-white via-slate-50 to-brand-50">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:py-20 lg:py-24">
          <div className="relative z-10">
            <p className="mb-4 inline-flex rounded-full bg-brand-100 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-brand-800">
              JBCELL · Conecta tu mundo
            </p>
            <h1 className="max-w-3xl text-4xl font-black leading-[0.98] tracking-tight text-brand-900 sm:text-6xl">
              Celulares y accesorios que te <span className="text-accent-600">acompañan.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
              Tu tienda de celulares y accesorios en Santo Domingo. Compra por WhatsApp con entrega local y envíos a toda República Dominicana.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#productos" className="rounded-xl bg-accent-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-accent-600/20 transition hover:-translate-y-0.5 hover:bg-accent-700">
                Ver productos
              </a>
              <a href={whatsappLink("Hola, quiero información sobre los productos de JBCELL.")} target="_blank" rel="noopener noreferrer" className="rounded-xl border border-brand-200 bg-white px-6 py-3.5 text-sm font-bold text-brand-800 transition hover:border-brand-700">
                Escríbenos por WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="ofertas" className="border-y border-accent-100 bg-accent-50">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent-700">Ofertas JBCELL</p>
            <h2 className="mt-1 text-2xl font-black tracking-tight text-brand-900">Equipos destacados para ti</h2>
          </div>
          <a href="#productos" className="w-fit rounded-xl bg-accent-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-accent-700">
            Ver productos disponibles
          </a>
        </div>
      </section>

      <StorefrontTrust />

      <ResenasPublicas resenas={resenas} />

      <footer className="bg-white">
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
