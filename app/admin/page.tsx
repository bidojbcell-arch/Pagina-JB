import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Producto, Resena } from "@/lib/types";
import AdminProductList from "@/components/AdminProductList";
import SalesModule from "@/components/SalesModule";
import BulkImporter from "@/components/BulkImporter";
import AdminResenas from "@/components/AdminResenas";

export const revalidate = 0;

export default async function AdminDashboard() {
  const supabase = createClient();
  const [{ data: productosData }, { data: resenasData, error: resenasError }] = await Promise.all([
    supabase.from("productos").select("*").order("orden", { ascending: true }).order("created_at", { ascending: false }),
    supabase.from("resenas").select("*").order("created_at", { ascending: false }),
  ]);
  const productos = (productosData ?? []) as Producto[];
  const resenas = (resenasData ?? []) as Resena[];
  const mayoristas = productos.filter((producto) => producto.visible_mayoreo).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-accent-600">JBCELL Admin</p>
          <h1 className="text-2xl font-black text-brand-900">Inventario y ventas</h1>
          <p className="text-sm text-slate-500">{productos.length} productos · {productos.reduce((n, x) => n + x.stock, 0)} unidades en stock · {mayoristas} al por mayor</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/alpormayor" target="_blank" className="rounded-xl border border-brand-200 bg-white px-4 py-2.5 text-sm font-bold text-brand-700">Ver catálogo mayorista</Link>
          <Link href="/admin/productos/nuevo" className="rounded-xl bg-brand-700 px-5 py-2.5 font-bold text-white">+ Nuevo producto</Link>
        </div>
      </div>
      <BulkImporter />
      <SalesModule productos={productos} />
      <AdminProductList productosIniciales={productos} />
      {resenasError ? <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">No se pudieron cargar las reseñas. Recarga la página para intentarlo de nuevo.</p> : <AdminResenas resenasIniciales={resenas} />}
    </div>
  );
}
