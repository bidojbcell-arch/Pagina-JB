"use client";

import Image from "next/image";
import { Producto } from "@/lib/types";

export default function ProductCard({
  producto,
  onClick,
}: {
  producto: Producto;
  onClick: () => void;
}) {
  const portada = producto.imagenes?.[0];

  return (
    <button
      onClick={onClick}
      className="group flex flex-col overflow-hidden rounded-2xl bg-white text-left shadow-card transition-all hover:-translate-y-1 hover:shadow-card-hover"
    >
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
        {producto.destacado && (
          <span className="absolute left-2 top-2 rounded-full bg-brand-600 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white shadow">
            Destacado
          </span>
        )}
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
          {producto.precio ? (
            <span className="text-lg font-bold text-slate-900">
              RD${producto.precio.toLocaleString("es-DO")}
            </span>
          ) : (
            <span className="text-sm font-medium text-slate-400">
              Consultar precio
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
