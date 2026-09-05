"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Producto } from "@/lib/types";

export default function AdminProductList({
  productosIniciales,
}: {
  productosIniciales: Producto[];
}) {
  const [productos, setProductos] = useState(productosIniciales);
  const [eliminando, setEliminando] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  async function toggleDisponible(producto: Producto) {
    const nuevoValor = !producto.disponible;
    setProductos((prev) =>
      prev.map((p) => (p.id === producto.id ? { ...p, disponible: nuevoValor } : p))
    );
    await supabase
      .from("productos")
      .update({ disponible: nuevoValor })
      .eq("id", producto.id);
  }

  async function eliminarProducto(producto: Producto) {
    const confirmado = window.confirm(
      `¿Eliminar "${producto.nombre}"? Esta acción no se puede deshacer.`
    );
    if (!confirmado) return;

    setEliminando(producto.id);

    // Borrar imágenes del storage.
    const rutas = producto.imagenes
      .map((url) => {
        const marcador = "/productos-imagenes/";
        const idx = url.indexOf(marcador);
        return idx >= 0 ? url.slice(idx + marcador.length) : null;
      })
      .filter((r): r is string => Boolean(r));

    if (rutas.length > 0) {
      await supabase.storage.from("productos-imagenes").remove(rutas);
    }

    await supabase.from("productos").delete().eq("id", producto.id);

    setProductos((prev) => prev.filter((p) => p.id !== producto.id));
    setEliminando(null);
    router.refresh();
  }

  if (productos.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
        Aún no has agregado productos.{" "}
        <Link href="/admin/productos/nuevo" className="font-semibold text-brand-600">
          Agrega el primero
        </Link>
        .
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-4 py-3">Producto</th>
            <th className="px-4 py-3">Categoría</th>
            <th className="px-4 py-3">Precio</th>
            <th className="px-4 py-3">Estado</th>
            <th className="px-4 py-3 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {productos.map((p) => (
            <tr key={p.id} className={eliminando === p.id ? "opacity-40" : ""}>
              <td className="flex items-center gap-3 px-4 py-3">
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                  {p.imagenes?.[0] && (
                    <Image src={p.imagenes[0]} alt={p.nombre} fill className="object-cover" />
                  )}
                </div>
                <span className="font-medium text-slate-800">{p.nombre}</span>
              </td>
              <td className="px-4 py-3 text-slate-500">{p.categoria}</td>
              <td className="px-4 py-3 text-slate-500">
                {p.precio ? `RD$${p.precio.toLocaleString("es-DO")}` : "—"}
              </td>
              <td className="px-4 py-3">
                <button
                  onClick={() => toggleDisponible(p)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    p.disponible
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-200 text-slate-500"
                  }`}
                >
                  {p.disponible ? "Visible" : "Oculto"}
                </button>
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex justify-end gap-2">
                  <Link
                    href={`/admin/productos/${p.id}/editar`}
                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:border-brand-300 hover:text-brand-700"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => eliminarProducto(p)}
                    disabled={eliminando === p.id}
                    className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                  >
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
