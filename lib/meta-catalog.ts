import { Producto } from "@/lib/types";

export type MetaCatalogItem = {
  id: string;
  title: string;
  description: string;
  availability: "in stock";
  condition: "new";
  price: string;
  link: string;
  image_link: string;
  brand: "JBCELL";
  product_type: string;
  custom_label_0: string;
};

const DEFAULT_BASE_URL = "https://paginajb.vercel.app";

function resolvedBaseUrl(baseUrl: string): string {
  return (baseUrl || process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_BASE_URL).replace(/\/$/, "");
}

export type CatalogEligibility = {
  image: string;
  price: number;
};

export function catalogPrice(producto: Producto): number | null {
  const price = producto.tipo === "oferta" && (producto.precio_oferta ?? 0) > 0
    ? producto.precio_oferta
    : producto.precio;
  return price && price > 0 ? price : null;
}

export function catalogEligibility(producto: Producto): CatalogEligibility | null {
  const image = producto.imagenes?.[0]?.trim();
  const price = catalogPrice(producto);
  if (!producto.disponible || producto.stock <= 0 || !image || !price) return null;
  try {
    const imageUrl = new URL(image);
    if (imageUrl.protocol !== "http:" && imageUrl.protocol !== "https:") return null;
  } catch {
    return null;
  }
  return { image, price };
}

export function catalogItem(producto: Producto, baseUrl: string): MetaCatalogItem | null {
  const eligibility = catalogEligibility(producto);
  if (!eligibility) return null;

  const name = producto.nombre.trim();
  return {
    id: producto.id,
    title: name,
    description: producto.descripcion?.trim() || `Producto disponible en JBCELL: ${name}`,
    availability: "in stock",
    condition: "new",
    price: `${Number(eligibility.price).toFixed(2)} DOP`,
    link: `${resolvedBaseUrl(baseUrl)}/meta/whatsapp/${encodeURIComponent(producto.id)}`,
    image_link: eligibility.image,
    brand: "JBCELL",
    product_type: producto.categoria,
    custom_label_0: producto.tipo,
  };
}

// RFC 4180: quote every field and double embedded quotes.
export function escapeCsv(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

const CATALOG_HEADERS: Array<keyof MetaCatalogItem> = [
  "id",
  "title",
  "description",
  "availability",
  "condition",
  "price",
  "link",
  "image_link",
  "brand",
  "product_type",
  "custom_label_0",
];

export function catalogCsv(productos: Producto[], baseUrl: string): string {
  const rows = productos
    .map((producto) => catalogItem(producto, baseUrl))
    .filter((item): item is MetaCatalogItem => item !== null)
    .map((item) => CATALOG_HEADERS.map((header) => escapeCsv(item[header])).join(","));
  return [CATALOG_HEADERS.map(escapeCsv).join(","), ...rows].join("\r\n");
}

