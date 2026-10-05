import { whatsappLink } from "./whatsapp";

export type ProductoMayoreo = {
  nombre: string;
  precio_mayoreo: number | null;
  minimo_mayoreo: number | null;
};

export type ItemCarritoMayoreo = {
  producto: ProductoMayoreo;
  cantidad: number;
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

export function totalCarritoMayoreo(items: ItemCarritoMayoreo[]) {
  return items.reduce((total, { producto, cantidad }) => total + totalMayoreo(producto, cantidad), 0);
}

export function mensajeCarritoMayoreo(items: ItemCarritoMayoreo[]) {
  const lineas = items.map(({ producto, cantidad }) => {
    const cantidadFinal = Math.max(cantidadInicialMayoreo(producto), cantidad);
    const total = totalMayoreo(producto, cantidadFinal).toLocaleString("es-DO");
    return `• ${producto.nombre} × ${cantidadFinal} — RD$${total}`;
  });
  const total = totalCarritoMayoreo(items).toLocaleString("es-DO");

  return `Hola, quiero hacer este pedido al por mayor:\n${lineas.join("\n")}\n\nTotal general: RD$${total}.`;
}

export function productosMayoreoPorPagina<T>(productos: T[], pagina: number, limite = 10) {
  const totalPaginas = Math.max(1, Math.ceil(productos.length / limite));
  const paginaActual = Math.min(Math.max(1, pagina), totalPaginas);
  const inicio = (paginaActual - 1) * limite;
  return { productos: productos.slice(inicio, inicio + limite), paginaActual, totalPaginas };
}

