import Image from "next/image";
import CatalogoMayoreo from "@/components/CatalogoMayoreo";
import { Producto } from "@/lib/types";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 0;

export default async function CatalogoAlPorMayorPage() {
  const supabase = createClient();
  const { data } = await supabase
    .from("productos")
    .select("*")
    .eq("disponible", true)
    .eq("visible_mayoreo", true)
    .not("precio_mayoreo", "is", null)
    .order("orden", { ascending: true })
    .order("created_at", { ascending: false });

  const productos = (data ?? []).filter((producto) => producto.stock > 0) as Producto[];

  return <main className="min-h-screen bg-slate-50 text-slate-900"><header className="border-b border-slate-200 bg-white"><div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4"><a href="/"><Image src="/jbcell-logo-clean.png" alt="JBCELL" width={2073} height={758} className="h-10 w-auto" /></a><a href="/" className="text-sm font-bold text-brand-700">Ver tienda detal →</a></div></header><section className="bg-brand-900 px-5 py-14 text-white"><div className="mx-auto max-w-7xl"><p className="text-xs font-bold uppercase tracking-[0.16em] text-accent-300">JBCELL para negocios</p><h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">Catálogo al por mayor</h1><p className="mt-4 max-w-2xl text-brand-100">Precios especiales para compras por cantidad. Elige el producto, indica las unidades y recibe tu cotización por WhatsApp.</p></div></section><section className="mx-auto max-w-7xl px-5 py-12"><CatalogoMayoreo productos={productos} /></section></main>;
}

