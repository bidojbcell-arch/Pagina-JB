"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import CartFloat from "@/components/CartFloat";
import { cantidadInicialMayoreo, cantidadTotalCarritoMayoreo, ItemCarritoMayoreo, mensajeCarritoMayoreo, productosMayoreoPorPagina, totalCarritoMayoreo, totalMayoreo, whatsappLinkMayoreo } from "@/lib/mayoreo";
import { Producto } from "@/lib/types";
import { whatsappLink } from "@/lib/whatsapp";

type ItemMayoreo = ItemCarritoMayoreo & { producto: Producto };
const precio = (valor: number) => `RD$${valor.toLocaleString("es-DO")}`;

function TarjetaMayoreo({ producto, onAgregar }: { producto: Producto; onAgregar: (producto: Producto, cantidad: number) => void }) {
  const minimo = cantidadInicialMayoreo(producto);
  const [cantidad, setCantidad] = useState(minimo);
  const cambiarCantidad = (valor: string) => {
    const siguiente = Number(valor);
    setCantidad(Number.isFinite(siguiente) ? Math.max(minimo, siguiente) : minimo);
  };

  return <article className="overflow-hidden rounded-2xl border border-brand-100 bg-white shadow-card">
    <div className="relative aspect-square bg-slate-100">{producto.imagenes?.[0] ? <Image src={producto.imagenes[0]} alt={producto.nombre} fill className="object-cover" sizes="(max-width: 640px) 50vw, 25vw" /> : <div className="flex h-full items-center justify-center text-sm text-slate-400">Sin imagen</div>}</div>
    <div className="space-y-3 p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-brand-600">{producto.categoria}</p>
      <h2 className="min-h-12 font-bold text-brand-900">{producto.nombre}</h2>
      {producto.descripcion && <p className="line-clamp-2 text-sm text-slate-500">{producto.descripcion}</p>}
      <div className="rounded-xl bg-brand-50 p-3"><p className="text-xs font-semibold text-brand-700">Precio por unidad</p><p className="text-xl font-black text-brand-900">{precio(producto.precio_mayoreo ?? 0)}</p><p className="mt-1 text-xs text-slate-600">Mínimo: {minimo} unidades</p></div>
      <label className="block text-sm font-semibold text-slate-700">Cantidad<input aria-label={`Cantidad para ${producto.nombre}`} type="number" min={minimo} step="1" value={cantidad} onChange={(event) => cambiarCantidad(event.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-brand-500" /></label>
      <p className="text-sm font-bold text-slate-700">Total: {precio(totalMayoreo(producto, cantidad))}</p>
      <button type="button" onClick={() => onAgregar(producto, cantidad)} className="flex min-h-11 w-full items-center justify-center rounded-xl bg-brand-800 px-3 py-3 text-sm font-bold text-white transition hover:bg-brand-900">Agregar al carrito</button>
      <a href={whatsappLinkMayoreo(producto, cantidad)} target="_blank" rel="noopener noreferrer" className="flex min-h-10 items-center justify-center text-sm font-bold text-[#128C4B] underline underline-offset-4">Pedir solo este producto</a>
    </div>
  </article>;
}

function CarritoMayoreo({ items, onClose, onCantidad }: { items: ItemMayoreo[]; onClose: () => void; onCantidad: (id: string, cantidad: number) => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const anterior = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    dialog.current?.showModal(); document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = overflow; anterior?.focus(); };
  }, []);
  const total = totalCarritoMayoreo(items);

  return <dialog ref={dialog} aria-labelledby="wholesale-cart-title" onCancel={onClose} onClick={(event) => { if (event.target === event.currentTarget) onClose(); }} className="fixed inset-0 m-0 ml-auto h-[100dvh] max-h-none w-full max-w-md bg-white p-0 text-slate-900 shadow-2xl backdrop:bg-slate-900/60">
    <div className="flex h-full flex-col"><div className="flex items-center justify-between border-b border-slate-200 p-5"><h2 id="wholesale-cart-title" className="text-xl font-black text-brand-900">Tu carrito</h2><button autoFocus type="button" onClick={onClose} aria-label="Cerrar carrito" className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-xl hover:bg-slate-200">×</button></div>
      <div className="flex-1 overflow-y-auto p-5">{items.length === 0 ? <div className="py-16 text-center"><p className="text-lg font-semibold">Tu carrito está vacío</p><p className="mt-2 text-sm text-slate-500">Agrega tus favoritos para pedirlos juntos por WhatsApp.</p><button type="button" onClick={onClose} className="mt-6 rounded-xl bg-brand-700 px-5 py-3 font-bold text-white">Explorar productos</button></div> : <ul className="space-y-5">{items.map(({ producto, cantidad }) => { const minimo = cantidadInicialMayoreo(producto); return <li key={producto.id} className="rounded-2xl border border-slate-200 p-4"><h3 className="break-words font-bold">{producto.nombre}</h3><p className="mt-1 text-sm text-slate-500">{precio(producto.precio_mayoreo ?? 0)} c/u · mínimo {minimo}</p><div className="mt-4 flex flex-wrap items-center justify-between gap-3"><div className="flex items-center rounded-lg border border-slate-200"><button type="button" onClick={() => onCantidad(producto.id, cantidad - 1)} disabled={cantidad <= minimo} aria-label={`Reducir cantidad de ${producto.nombre}`} className="h-10 w-10 rounded-l-lg hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30">−</button><span className="min-w-8 text-center text-sm font-bold" aria-label={`Cantidad de ${producto.nombre}: ${cantidad}`}>{cantidad}</span><button type="button" onClick={() => onCantidad(producto.id, cantidad + 1)} disabled={cantidad >= producto.stock} aria-label={`Aumentar cantidad de ${producto.nombre}`} className="h-10 w-10 rounded-r-lg hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30">+</button></div><p className="font-bold text-brand-800">{precio(totalMayoreo(producto, cantidad))}</p></div><button type="button" onClick={() => onCantidad(producto.id, 0)} aria-label={`Eliminar ${producto.nombre} del carrito`} className="mt-3 min-h-10 text-sm font-medium text-red-700 underline underline-offset-4">Eliminar</button></li>; })}</ul>}</div>
      {items.length > 0 && <div className="border-t border-slate-200 bg-slate-50 p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]"><div className="flex justify-between gap-4 text-xl font-black"><span>Total</span><span aria-live="polite">{precio(total)}</span></div><p className="mb-4 mt-2 text-xs leading-5 text-slate-500">Disponibilidad y costo de envío se confirman por WhatsApp.</p><a href={whatsappLink(mensajeCarritoMayoreo(items))} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center rounded-xl bg-[#128C4B] px-4 py-3 font-bold text-white hover:brightness-110">Enviar pedido por WhatsApp</a></div>}
    </div>
  </dialog>;
}

export default function CatalogoMayoreo({ productos }: { productos: Producto[] }) {
  const [items, setItems] = useState<ItemMayoreo[]>([]);
  const [carritoAbierto, setCarritoAbierto] = useState(false);
  const [pagina, setPagina] = useState(1);
  const agregar = (producto: Producto, cantidad: number) => {
    const cantidadFinal = Math.max(cantidadInicialMayoreo(producto), cantidad);
    setItems((actuales) => { const encontrado = actuales.find((item) => item.producto.id === producto.id); return encontrado ? actuales.map((item) => item.producto.id === producto.id ? { ...item, cantidad: item.cantidad + cantidadFinal } : item) : [...actuales, { producto, cantidad: cantidadFinal }]; });
    setCarritoAbierto(true);
  };
  const actualizarCantidad = (id: string, cantidad: number) => setItems((actuales) => cantidad <= 0 ? actuales.filter((item) => item.producto.id !== id) : actuales.map((item) => item.producto.id === id ? { ...item, cantidad: Math.max(cantidadInicialMayoreo(item.producto), cantidad) } : item));
  if (productos.length === 0) return <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">Pronto publicaremos productos disponibles al por mayor.</p>;
  const paginaActual = productosMayoreoPorPagina(productos, pagina);
  const cambiarPagina = (siguiente: number) => { setPagina(siguiente); document.getElementById("productos-mayoreo")?.scrollIntoView({ behavior: "smooth", block: "start" }); };
  return <><div id="productos-mayoreo" className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">{paginaActual.productos.map((producto) => <TarjetaMayoreo key={producto.id} producto={producto} onAgregar={agregar} />)}</div>{paginaActual.totalPaginas > 1 && <nav aria-label="Paginación del catálogo al por mayor" className="mt-10 flex flex-wrap justify-center gap-2"><button type="button" onClick={() => cambiarPagina(paginaActual.paginaActual - 1)} disabled={paginaActual.paginaActual === 1} className="min-h-10 rounded-lg border border-slate-200 px-3 text-sm font-bold text-brand-800 disabled:cursor-not-allowed disabled:opacity-40">Anterior</button>{Array.from({ length: paginaActual.totalPaginas }, (_, index) => index + 1).map((numero) => <button type="button" key={numero} onClick={() => cambiarPagina(numero)} aria-current={numero === paginaActual.paginaActual ? "page" : undefined} className={`min-h-10 min-w-10 rounded-lg border px-3 text-sm font-bold ${numero === paginaActual.paginaActual ? "border-brand-800 bg-brand-800 text-white" : "border-slate-200 text-brand-800 hover:bg-brand-50"}`}>{numero}</button>)}<button type="button" onClick={() => cambiarPagina(paginaActual.paginaActual + 1)} disabled={paginaActual.paginaActual === paginaActual.totalPaginas} className="min-h-10 rounded-lg border border-slate-200 px-3 text-sm font-bold text-brand-800 disabled:cursor-not-allowed disabled:opacity-40">Siguiente</button></nav>}<CartFloat count={cantidadTotalCarritoMayoreo(items)} onOpen={() => setCarritoAbierto(true)} />{carritoAbierto && <CarritoMayoreo items={items} onClose={() => setCarritoAbierto(false)} onCantidad={actualizarCantidad} />}</>;
}
