"use client";

import { useMemo, useState } from "react";
import { Producto, CATEGORIAS } from "@/lib/types";
import ProductCard from "@/components/ProductCard";
import ProductModal from "@/components/ProductModal";
import CategoryFilter from "@/components/CategoryFilter";

export default function CatalogoClient({ productos }: { productos: Producto[] }) {
  const [categoria, setCategoria] = useState("Todos");
  const [busqueda, setBusqueda] = useState("");
  const [seleccionado, setSeleccionado] = useState<Producto | null>(null);

  const filtrados = useMemo(() => {
    return productos.filter((p) => {
      const coincideCategoria = categoria === "Todos" || p.categoria === categoria;
      const coincideBusqueda = p.nombre
        .toLowerCase()
        .includes(busqueda.trim().toLowerCase());
      return coincideCategoria && coincideBusqueda;
    });
  }, [productos, categoria, busqueda]);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4">
        <input
          type="search"
          placeholder="Buscar producto..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
        />
        <CategoryFilter
          categorias={CATEGORIAS}
          activa={categoria}
          onChange={setCategoria}
        />
      </div>

      {filtrados.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl bg-white py-20 text-center shadow-card">
          <p className="text-lg font-medium text-slate-700">
            No encontramos productos con esos filtros.
          </p>
          <p className="text-sm text-slate-400">Prueba con otra categoría o búsqueda.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filtrados.map((p) => (
            <ProductCard key={p.id} producto={p} onClick={() => setSeleccionado(p)} />
          ))}
        </div>
      )}

      {seleccionado && (
        <ProductModal producto={seleccionado} onClose={() => setSeleccionado(null)} />
      )}
    </div>
  );
}
