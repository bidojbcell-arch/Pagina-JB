"use client";

import Image from "next/image";
import { useState } from "react";
import { Producto } from "@/lib/types";
import { cantidadInicialMayoreo, totalMayoreo, whatsappLinkMayoreo } from "@/lib/mayoreo";

function TarjetaMayoreo({ producto }: { producto: Producto }) {
  const minimo = cantidadInicialMayoreo(producto);
  const [cantidad, setCantidad] = useState(minimo);
  const precio = producto.precio_mayoreo ?? 0;

  function cambiarCantidad(valor: string) {
    const siguiente = Number(valor);
    setCantidad(Number.isFinite(siguiente) ? Math.max(minimo, siguiente) : minimo);
  }

  return (
    <article className="overflow-hidden rounded-2xl border border-brand-100 bg-white shadow-card">
      <div className="relative aspect-square bg-slate-100">
        {producto.imagenes?.[0] ? (
          <Image src={producto.imagenes[0]} alt={producto.nombre} fill className="object-cover" sizes="(max-width: 640px) 50vw, 25vw" />
        ) : <div className="flex h-full items-center justify-center text-sm text-slate-400">Sin imagen</div>}
      </div>
      <div className="space-y-3 p-4">
        <p className="text-xs font-bold uppercase tracking-wide text-brand-600">{producto.categoria}</p>
        <h2 className="min-h-12 font-bold text-brand-900">{producto.nombre}</h2>
        {producto.descripcion && <p className="line-clamp-2 text-sm text-slate-500">{producto.descripcion}</p>}
        <div className="rounded-xl bg-brand-50 p-3">
          <p className="text-xs font-semibold text-brand-700">Precio por unidad</p>
          <p className="text-xl font-black text-brand-900">RD${precio.toLocaleString("es-DO")}</p>
          <p className="mt-1 text-xs text-slate-600">Mínimo: {minimo} unidades</p>
        </div>
        <label className="block text-sm font-semibold text-slate-700">
          Cantidad
          <input aria-label={`Cantidad para ${producto.nombre}`} type="number" min={minimo} step="1" value={cantidad} onChange={(event) => cambiarCantidad(event.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-brand-500" />
        </label>
        <p className="text-sm font-bold text-slate-700">Total: RD${totalMayoreo(producto, cantidad).toLocaleString("es-DO")}</p>
        <a href={whatsappLinkMayoreo(producto, cantidad)} target="_blank" rel="noopener noreferrer" className="flex min-h-11 items-center justify-center rounded-xl bg-[#25D366] px-3 py-3 text-sm font-bold text-white transition hover:bg-[#128C4B]">Pedir al por mayor</a>
      </div>
    </article>
  );
}

export default function CatalogoMayoreo({ productos }: { productos: Producto[] }) {
  if (productos.length === 0) return <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">Pronto publicaremos productos disponibles al por mayor.</p>;
  return <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">{productos.map((producto) => <TarjetaMayoreo key={producto.id} producto={producto} />)}</div>;
}

