"use client";

import Image from "next/image";
import { useState } from "react";
import { Producto } from "@/lib/types";
import { whatsappLinkProducto } from "@/lib/whatsapp";

export default function ProductModal({
  producto,
  onClose,
}: {
  producto: Producto;
  onClose: () => void;
}) {
  const [activa, setActiva] = useState(0);
  const imagenes = producto.imagenes?.length ? producto.imagenes : [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/60 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-3xl bg-white sm:rounded-3xl md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow hover:bg-white"
        >
          ✕
        </button>

        <div className="w-full bg-slate-100 md:w-1/2">
          <div className="relative aspect-square w-full">
            {imagenes.length > 0 ? (
              <Image
                src={imagenes[activa]}
                alt={producto.nombre}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-slate-400">
                Sin imagen
              </div>
            )}
          </div>
          {imagenes.length > 1 && (
            <div className="flex gap-2 overflow-x-auto p-3">
              {imagenes.map((img, i) => (
                <button
                  key={img + i}
                  onClick={() => setActiva(i)}
                  className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border-2 ${
                    i === activa ? "border-brand-600" : "border-transparent"
                  }`}
                >
                  <Image src={img} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex w-full flex-col gap-3 overflow-y-auto p-6 md:w-1/2">
          <span className="text-xs font-medium uppercase tracking-wide text-brand-600">
            {producto.categoria}
          </span>
          <h2 className="text-2xl font-bold text-slate-900">{producto.nombre}</h2>
          {producto.precio ? (
            <span className="text-2xl font-bold text-brand-700">
              RD${producto.precio.toLocaleString("es-DO")}
            </span>
          ) : (
            <span className="text-base font-medium text-slate-400">
              Consultar precio
            </span>
          )}
          {producto.descripcion && (
            <p className="whitespace-pre-line text-sm leading-relaxed text-slate-600">
              {producto.descripcion}
            </p>
          )}

          <a
            href={whatsappLinkProducto(producto.nombre, producto.precio)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 py-3 font-semibold text-white shadow-md transition hover:brightness-95"
          >
            <svg viewBox="0 0 32 32" className="h-5 w-5" fill="currentColor">
              <path d="M16.001 3C9.373 3 4 8.373 4 15c0 2.35.687 4.54 1.872 6.383L4 29l7.805-1.837A11.94 11.94 0 0 0 16 27c6.627 0 12-5.373 12-12S22.628 3 16.001 3zm0 21.7a9.66 9.66 0 0 1-4.936-1.352l-.354-.21-4.63 1.09 1.114-4.512-.23-.365A9.67 9.67 0 0 1 6.3 15c0-5.348 4.352-9.7 9.701-9.7 5.348 0 9.699 4.352 9.699 9.7 0 5.349-4.351 9.7-9.699 9.7z" />
            </svg>
            Pedir por WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
