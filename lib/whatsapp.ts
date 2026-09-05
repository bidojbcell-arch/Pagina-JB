const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "18496368091";

export function whatsappLink(mensaje: string) {
  const texto = encodeURIComponent(mensaje);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${texto}`;
}

export function whatsappLinkProducto(nombre: string, precio?: number | null) {
  const precioTexto =
    precio !== null && precio !== undefined
      ? ` (RD$${precio.toLocaleString("es-DO")})`
      : "";
  return whatsappLink(
    `Hola, estoy interesado/a en: ${nombre}${precioTexto}. ¿Está disponible?`
  );
}
