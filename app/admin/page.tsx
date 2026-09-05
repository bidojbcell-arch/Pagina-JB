import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Producto } from "@/lib/types";
import AdminProductList from "@/components/AdminProductList";

export const revalidate = 0;

export default async function AdminDashboard() {
  const supabase = createClient();
  const { data } = await supabase
    .from("productos")
    .select("*")
    .order("created_at", { ascending: false });

  const productos = (data ?? []) as Producto[];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Mis productos</h1>
          <p className="text-sm text-slate-500">
            {productos.length} producto{productos.length !== 1 && "s"} en total
          </p>
        </div>
        <Link
          href="/admin/productos/nuevo"
          className="rounded-xl bg-brand-600 px-5 py-2.5 font-semibold text-white shadow hover:bg-brand-700"
        >
          + Nuevo producto
        </Link>
      </div>

      <AdminProductList productosIniciales={productos} />
    </div>
  );
}
