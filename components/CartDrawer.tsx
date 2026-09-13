"use client";

import { useEffect, useRef } from "react";
import { CartItem, cartMessage, cartTotal, formatPrice, productPrice } from "@/lib/cart";
import { whatsappLink } from "@/lib/whatsapp";

export default function CartDrawer({ items, onClose, onQuantityChange }: {
  items: CartItem[];
  onClose: () => void;
  onQuantityChange: (id: string, quantity: number) => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    dialog.current?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
  }, []);

  return (
    <dialog
      ref={dialog}
      aria-labelledby="cart-title"
      onCancel={onClose}
      onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}
      className="fixed inset-0 m-0 ml-auto h-[100dvh] max-h-none w-full max-w-md bg-white p-0 text-slate-900 shadow-2xl backdrop:bg-slate-900/60"
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b border-slate-200 p-5">
          <h2 id="cart-title" className="text-xl font-black text-brand-900">Tu carrito</h2>
          <button autoFocus onClick={onClose} aria-label="Cerrar carrito" className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-xl hover:bg-slate-200">×</button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          {items.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-lg font-semibold">Tu carrito está vacío</p>
              <p className="mt-2 text-sm text-slate-500">Agrega tus favoritos para pedirlos juntos por WhatsApp.</p>
              <button onClick={onClose} className="mt-6 rounded-xl bg-brand-700 px-5 py-3 font-bold text-white">Explorar productos</button>
            </div>
          ) : (
            <ul className="space-y-5">
              {items.map(({ product, quantity }) => (
                <li key={product.id} className="rounded-2xl border border-slate-200 p-4">
                  <h3 className="break-words font-bold">{product.nombre}</h3>
                  <p className="mt-1 text-sm text-slate-500">{formatPrice(productPrice(product) ?? 0)} c/u</p>
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center rounded-lg border border-slate-200">
                      <button onClick={() => onQuantityChange(product.id, quantity - 1)} aria-label={`Reducir cantidad de ${product.nombre}`} className="h-10 w-10 rounded-l-lg hover:bg-slate-100">−</button>
                      <span className="min-w-8 text-center text-sm font-bold" aria-label={`Cantidad de ${product.nombre}: ${quantity}`}>{quantity}</span>
                      <button onClick={() => onQuantityChange(product.id, quantity + 1)} disabled={quantity >= product.stock} aria-label={`Aumentar cantidad de ${product.nombre}`} className="h-10 w-10 rounded-r-lg hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30">+</button>
                    </div>
                    <p className="font-bold text-brand-800">{formatPrice((productPrice(product) ?? 0) * quantity)}</p>
                  </div>
                  <button onClick={() => onQuantityChange(product.id, 0)} aria-label={`Eliminar ${product.nombre} del carrito`} className="mt-3 min-h-10 text-sm font-medium text-red-700 underline underline-offset-4">Eliminar</button>
                </li>
              ))}
            </ul>
          )}
        </div>
        {items.length > 0 && (
          <div className="border-t border-slate-200 bg-slate-50 p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
            <div className="flex justify-between gap-4 text-xl font-black"><span>Total</span><span aria-live="polite">{formatPrice(cartTotal(items))}</span></div>
            <p className="mb-4 mt-2 text-xs leading-5 text-slate-500">Disponibilidad y costo de envío se confirman por WhatsApp.</p>
            <a href={whatsappLink(cartMessage(items))} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center rounded-xl bg-[#128C4B] px-4 py-3 font-bold text-white hover:brightness-110">Enviar pedido por WhatsApp</a>
          </div>
        )}
      </div>
    </dialog>
  );
}
