import { whatsappLink } from "./whatsapp";

export type ProductoMayoreo = {
  nombre: string;
  precio_mayoreo: number | null;
  minimo_mayoreo: number | null;
};

export function cantidadInicialMayoreo(producto: ProductoMayoreo) {
  return Math.max(1, producto.minimo_mayoreo ?? 1);
}

export function totalMayoreo(producto: ProductoMayoreo, cantidad: number) {
  return (producto.precio_mayoreo ?? 0) * Math.max(cantidadInicialMayoreo(producto), cantidad);
}

export function whatsappLinkMayoreo(producto: ProductoMayoreo, cantidad: number) {
  const minimo = cantidadInicialMayoreo(producto);
  const cantidadFinal = Math.max(minimo, cantidad);
  const total = totalMayoreo(producto, cantidadFinal).toLocaleString("es-DO");
  const precio = (producto.precio_mayoreo ?? 0).toLocaleString("es-DO");

  return whatsappLink(
    `Hola, quiero pedir al por mayor: ${producto.nombre}. Cantidad: ${cantidadFinal}. Mínimo mayorista: ${minimo}. Precio por unidad: RD$${precio}. Total: RD$${total}.`,
  );
}

