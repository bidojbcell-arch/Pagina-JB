"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Producto, TipoProducto } from "@/lib/types";

export default function AdminProductList({ productosIniciales }: { productosIniciales: Producto[] }) {
  const supabase = createClient();
  const [productos, setProductos] = useState(productosIniciales);
  const [errorOrden, setErrorOrden] = useState("");

  async function save(producto: Producto, patch: Partial<Producto>) {
    const { error } = await supabase.from("productos").update(patch).eq("id", producto.id);
    if (!error) setProductos((actuales) => actuales.map((actual) => actual.id === producto.id ? { ...actual, ...patch } : actual));
  }

  async function move(index: number, direction: number) {
    const destination = index + direction;
    if (destination < 0 || destination >= productos.length) return;
    setErrorOrden("");
    const anterior = productos;
    const reordenados = [...productos];
    [reordenados[index], reordenados[destination]] = [reordenados[destination], reordenados[index]];
    const conOrden = reordenados.map((producto, position) => ({ ...producto, orden: position + 1 }));
    setProductos(conOrden);
    const resultados = await Promise.all(conOrden.map((producto) => supabase.from("productos").update({ orden: producto.orden }).eq("id", producto.id)));
    if (resultados.some(({ error }) => error)) {
      setProductos(anterior);
      setErrorOrden("No se pudo guardar el orden. Inténtalo de nuevo.");
    }
  }

  return <section className="space-y-3"><div className="flex items-center justify-between"><p className="text-sm text-slate-500">Usa las flechas para elegir el orden del catálogo.</p>{errorOrden && <p className="text-sm text-red-600">{errorOrden}</p>}</div><div className="overflow-x-auto rounded-2xl border bg-white shadow-card"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="p-3">Orden</th><th className="p-3">Producto</th><th className="p-3">Tipo</th><th className="p-3">Precio</th><th className="p-3">Stock</th><th className="p-3">Estado</th><th className="p-3"/></tr></thead><tbody>{productos.map((producto, index) => <tr key={producto.id} className="border-t"><td className="p-3"><div className="flex items-center gap-1"><button type="button" aria-label={`Subir ${producto.nombre}`} disabled={index === 0} onClick={() => move(index, -1)} className="rounded border px-2 py-1 disabled:cursor-not-allowed disabled:opacity-35">↑</button><button type="button" aria-label={`Bajar ${producto.nombre}`} disabled={index === productos.length - 1} onClick={() => move(index, 1)} className="rounded border px-2 py-1 disabled:cursor-not-allowed disabled:opacity-35">↓</button></div></td><td className="flex min-w-48 items-center gap-3 p-3"><div className="relative h-10 w-10 overflow-hidden rounded bg-slate-100">{producto.imagenes?.[0] && <Image src={producto.imagenes[0]} alt="" fill className="object-cover"/>}</div><span className="font-bold text-slate-800">{producto.nombre}</span></td><td className="p-3"><select value={producto.tipo || "normal"} onChange={(event) => save(producto, { tipo: event.target.value as TipoProducto })} className="rounded border p-1.5"><option value="normal">Normal</option><option value="oferta">Oferta</option><option value="combo">Combo</option></select></td><td className="p-3">{producto.tipo === "oferta" && producto.precio_oferta != null ? <><span className="line-through text-slate-400">{"RD$" + producto.precio}</span><br/><b className="text-accent-700">{"RD$" + producto.precio_oferta}</b></> : producto.precio ? "RD$" + producto.precio : "—"}</td><td className="p-3"><input aria-label="Stock" type="number" min="0" value={producto.stock ?? 0} onChange={(event) => setProductos((actuales) => actuales.map((actual) => actual.id === producto.id ? { ...actual, stock: Number(event.target.value) } : actual))} onBlur={(event) => save(producto, { stock: Math.max(0, Number(event.target.value)) })} className="w-20 rounded border p-1.5"/></td><td className="p-3"><button onClick={() => save(producto, { disponible: !producto.disponible })} className={producto.disponible ? "rounded-full bg-emerald-100 px-3 py-1 text-xs text-emerald-700" : "rounded-full bg-slate-200 px-3 py-1 text-xs"}>{producto.disponible ? "Visible" : "Oculto"}</button></td><td className="p-3"><Link href={`/admin/productos/${producto.id}/editar`} className="text-xs font-bold text-brand-700">Editar</Link></td></tr>)}</tbody></table></div></section>;
}

