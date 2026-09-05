import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { Producto } from "@/lib/types";
import CatalogoClient from "@/components/CatalogoClient";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { whatsappLink } from "@/lib/whatsapp";

export const revalidate = 0;

const categories = [
  ["Celulares", "iPhone, Samsung y más", "01"],
  ["Accesorios", "Cargadores, forros y cables", "02"],
  ["Audio", "Audífonos y parlantes", "03"],
  ["Smartwatch", "Conecta tu día", "04"],
  ["Tablets", "Trabajo y entretenimiento", "05"],
  ["Ofertas", "Equipos destacados", "06"],
];

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
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="bg-brand-900 px-4 py-2 text-center text-[11px] font-bold uppercase tracking-[0.16em] text-white">
        Envíos rápidos · Atención personalizada · Equipos con garantía
      </div>

      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4">
          <a href="/" className="shrink-0" aria-label="Inicio JBCELL">
            <Image src="/jbcell-logo.svg" alt="JBCELL" width={205} height={61} priority className="h-12 w-auto sm:h-14" />
          </a>
          <nav className="hidden items-center gap-6 text-sm font-semibold text-slate-600 md:flex">
            <a className="transition hover:text-brand-700" href="#categorias">Categorías</a>
            <a className="transition hover:text-brand-700" href="#productos">Productos</a>
            <a className="transition hover:text-brand-700" href="#beneficios">Nosotros</a>
          </nav>
          <a href="/admin/login" className="rounded-full border border-brand-700 px-4 py-2 text-xs font-bold text-brand-700 transition hover:bg-brand-700 hover:text-white">
            Administración
          </a>
        </div>
      </header>

      <section className="relative overflow-hidden bg-gradient-to-br from-white via-slate-50 to-brand-50">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:py-20 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:py-24">
          <div className="relative z-10">
            <p className="mb-4 inline-flex rounded-full bg-brand-100 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-brand-800">
              Tecnología que se adapta a ti
            </p>
            <h1 className="max-w-3xl text-4xl font-black leading-[0.98] tracking-tight text-brand-900 sm:text-6xl">
              Tecnología a tu <span className="text-accent-600">alcance.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
              Celulares, accesorios y equipos para conectar tu mundo. Compra con atención cercana, productos seleccionados y precios claros.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#productos" className="rounded-xl bg-accent-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-accent-600/20 transition hover:-translate-y-0.5 hover:bg-accent-700">
                Ver productos
              </a>
              <a href={whatsappLink("Hola, quiero información sobre los productos de JBCELL.")} target="_blank" rel="noopener noreferrer" className="rounded-xl border border-brand-200 bg-white px-6 py-3.5 text-sm font-bold text-brand-800 transition hover:border-brand-700">
                Escríbenos por WhatsApp
              </a>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-7 gap-y-4 border-t border-slate-200 pt-6 text-sm">
              <p><strong className="block text-xl text-brand-800">100%</strong><span className="text-slate-500">Atención cercana</span></p>
              <p><strong className="block text-xl text-brand-800">✓</strong><span className="text-slate-500">Calidad garantizada</span></p>
              <p><strong className="block text-xl text-brand-800">↗</strong><span className="text-slate-500">Entrega rápida</span></p>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-lg">
            <div className="absolute inset-0 -rotate-6 rounded-[2rem] bg-accent-100" />
            <div className="relative overflow-hidden rounded-[2rem] bg-brand-900 p-7 shadow-2xl shadow-brand-900/20 sm:p-10">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-200">JBCELL · Selección destacada</p>
              <div className="mt-8 rounded-3xl bg-gradient-to-br from-brand-500 to-brand-800 p-6 sm:p-8">
                <div className="mx-auto flex h-52 w-32 rotate-[12deg] flex-col rounded-[1.7rem] border-8 border-slate-900 bg-slate-100 p-2 shadow-2xl">
                  <div className="mx-auto h-4 w-14 rounded-full bg-slate-900" />
                  <div className="mt-3 flex flex-1 flex-col justify-end rounded-[1.05rem] bg-gradient-to-br from-accent-300 via-white to-accent-500 p-3">
                    <span className="text-xs font-black text-brand-900">JBCELL</span>
                    <span className="text-[9px] font-semibold text-brand-700">Siempre conectado</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex items-end justify-between">
                <div><p className="text-sm font-bold text-white">Encuentra tu próximo equipo</p><p className="mt-1 text-xs text-brand-200">Nuevos ingresos cada semana</p></div>
                <span className="rounded-full bg-white px-3 py-2 text-xs font-black text-accent-700">OFERTAS</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="categorias" className="mx-auto max-w-7xl px-5 py-16">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-accent-600">Explora por categoría</p><h2 className="mt-2 text-3xl font-black tracking-tight text-brand-900">Lo que necesitas, en un solo lugar.</h2></div>
          <a href="#productos" className="text-sm font-bold text-brand-700 hover:text-accent-600">Ver catálogo completo →</a>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map(([title, subtitle, number]) => (
            <a key={title} href="#productos" className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:border-brand-200 hover:shadow-card">
              <div className="flex items-start justify-between"><span className="text-xs font-black text-accent-600">{number}</span><span className="text-brand-300 transition group-hover:translate-x-1 group-hover:text-accent-600">→</span></div>
              <h3 className="mt-8 text-xl font-extrabold text-brand-900">{title}</h3><p className="mt-1 text-sm text-slate-500">{subtitle}</p>
            </a>
          ))}
        </div>
      </section>

      <section id="productos" className="border-y border-brand-100 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-16">
          <div className="mb-8"><p className="text-xs font-bold uppercase tracking-[0.16em] text-accent-600">Catálogo JBCELL</p><h2 className="mt-2 text-3xl font-black tracking-tight text-brand-900">Novedades y productos disponibles</h2><p className="mt-2 text-slate-500">Elige tu favorito y escríbenos para confirmar disponibilidad.</p></div>
          <CatalogoClient productos={productos} />
        </div>
      </section>

      <section id="beneficios" className="bg-brand-900 py-16 text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 md:grid-cols-3">
          <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-accent-300">Compra con tranquilidad</p><h2 className="mt-3 text-3xl font-black leading-tight">JBCELL, tecnología que te acompaña.</h2></div>
          <div className="rounded-2xl border border-white/15 bg-white/5 p-6"><h3 className="font-bold">Atención personalizada</h3><p className="mt-2 text-sm leading-6 text-brand-100">Te orientamos para que elijas el equipo y accesorio que realmente necesitas.</p></div>
          <div className="rounded-2xl border border-white/15 bg-white/5 p-6"><h3 className="font-bold">Calidad y respaldo</h3><p className="mt-2 text-sm leading-6 text-brand-100">Productos seleccionados y una experiencia clara de principio a fin.</p></div>
        </div>
      </section>

      <footer className="bg-white">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 px-5 py-8 text-sm text-slate-500 sm:flex-row sm:items-center">
          <Image src="/jbcell-logo.svg" alt="JBCELL" width={150} height={45} className="h-10 w-auto" />
          <p>© {new Date().getFullYear()} JBCELL · Tecnología a tu alcance.</p>
          <a href="/admin/login" className="font-bold text-brand-700 hover:text-accent-600">Acceso administrador</a>
        </div>
      </footer>
      <WhatsAppFloat />
    </main>
  );
}