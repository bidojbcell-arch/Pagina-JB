import type { Producto } from "./types";

export interface CartItem {
  product: Producto;
  quantity: number;
}

export const productPrice = (product: Producto) =>
  product.tipo === "oferta" && product.precio_oferta !== null
    ? product.precio_oferta
    : product.precio;

export const formatPrice = (price: number) =>
  `RD$${price.toLocaleString("es-DO", { maximumFractionDigits: 2 })}`;

export function canAddToCart(product: Producto) {
  const price = productPrice(product);
  return product.disponible && product.stock > 0 && price !== null && Number.isFinite(price) && price >= 0;
}

export function canOrderViaWhatsApp(product: Producto) {
  return product.disponible && product.stock > 0;
}

export function addToCart(items: CartItem[], product: Producto): CartItem[] {
  if (!canAddToCart(product)) return items;
  const existing = items.find((item) => item.product.id === product.id);
  if (existing) return setCartQuantity(items, product.id, existing.quantity + 1);
  return [...items, { product, quantity: 1 }];
}

export function setCartQuantity(items: CartItem[], id: string, quantity: number): CartItem[] {
  if (!Number.isFinite(quantity)) return items;
  if (quantity <= 0) return items.filter((item) => item.product.id !== id);
  return items.map((item) => item.product.id === id
    ? { ...item, quantity: Math.min(Math.floor(quantity), item.product.stock) }
    : item);
}

export function cartTotal(items: CartItem[]) {
  return items.reduce((sum, item) => sum + Math.round((productPrice(item.product) ?? 0) * 100) * item.quantity, 0) / 100;
}

export function cartMessage(items: CartItem[]) {
  return [
    "Hola, quiero hacer este pedido en JBCELL:",
    "",
    ...items.map(({ product, quantity }) => {
      const price = productPrice(product) ?? 0;
      return `${quantity} × ${product.nombre} — ${formatPrice(price)} c/u — Subtotal: ${formatPrice(price * quantity)}`;
    }),
    "",
    `Total: ${formatPrice(cartTotal(items))}`,
    "¿Me confirman disponibilidad y costo de envío?",
  ].join("\n");
}
