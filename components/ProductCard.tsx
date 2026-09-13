"use client";

import Image from "next/image";
import { Producto } from "@/lib/types";
import { canAddToCart } from "@/lib/cart";

export default function ProductCard({
  producto,
  onClick,
  onAddToCart,
  inCart,
}: {
  producto: Producto;
  onClick: () => void;
  onAddToCart: () => void;
  inCart: number;
}) {
  const portada = producto.imagenes?.[0];
  const esOferta = producto.tipo === "oferta" && producto.precio_oferta !== null;
  const precioVisible = esOferta ? producto.precio_oferta : producto.precio;
  const precioFormateado = (precio: number) =>
    `RD$${precio.toLocaleString("es-DO")}`;

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl bg-white text-left shadow-card transition-all hover:-translate-y-1 hover:shadow-card-hover">
    <button onClick={onClick} aria-label={`Ver detalles de ${producto.nombre}`} className="flex flex-1 flex-col text-left">
      <div className="relative aspect-square w-full overflow-hidden bg-slate-100">
        {portada ? (
          <Image
            src={portada}
            alt={producto.nombre}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-300">
            Sin imagen
          </div>
        )}
        <div className="absolute left-2 top-2 flex flex-col items-start gap-1">
          {esOferta && (
            <span className="rounded-full bg-red-600 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white shadow">
              Oferta
            </span>
          )}
          {producto.tipo === "combo" && (
            <span className="rounded-full bg-slate-900 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white shadow">
              Combo
            </span>
          )}
          {producto.destacado && (
            <span className="rounded-full bg-brand-600 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white shadow">
              Destacado
            </span>
          )}
          {producto.stock === 0 && (
            <span className="rounded-full bg-slate-600 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white shadow">
              Agotado
            </span>
          )}
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <span className="text-xs font-medium uppercase tracking-wide text-brand-600">
          {producto.categoria}
        </span>
        <h3 className="font-semibold text-slate-900 line-clamp-2">
          {producto.nombre}
        </h3>
        {producto.descripcion && (
          <p className="text-sm text-slate-500 line-clamp-2">
            {producto.descripcion}
          </p>
        )}
        <div className="mt-auto pt-2">
          {precioVisible !== null ? (
            <div className="flex flex-col items-start gap-0.5 sm:flex-row sm:flex-wrap sm:items-baseline sm:gap-2">
              <span className="max-w-full break-words text-base font-bold text-slate-900 sm:text-lg">
                {precioFormateado(precioVisible)}
              </span>
              {esOferta && producto.precio !== null && (
                <span className="max-w-full break-words text-sm text-slate-400 line-through">
                  {precioFormateado(producto.precio)}
                </span>
              )}
            </div>
          ) : (
            <span className="text-sm font-medium text-slate-400">
              Consultar precio
            </span>
          )}
        </div>
      </div>
    </button>
    <div className="px-3 pb-4 sm:px-4">
      <button onClick={onAddToCart} disabled={!canAddToCart(producto) || inCart >= producto.stock} className="min-h-11 w-full rounded-xl bg-brand-700 px-2 py-3 text-xs font-bold text-white hover:bg-brand-800 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500 sm:text-sm">
        {producto.stock === 0 ? "Agotado" : precioVisible === null ? "Consultar precio" : inCart >= producto.stock ? "Máximo disponible" : inCart > 0 ? `Agregar otro (${inCart})` : "Agregar al carrito"}
      </button>
    </div>
    </article>
  );
}
