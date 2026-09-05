export type Categoria =
  | "Relojes"
  | "Audífonos"
  | "Celulares"
  | "Cargadores"
  | "Powerbanks"
  | "Soportes"
  | "Tablets"
  | "Palos Selfie"
  | "Otros";

export const CATEGORIAS: Categoria[] = [
  "Relojes",
  "Audífonos",
  "Celulares",
  "Cargadores",
  "Powerbanks",
  "Soportes",
  "Tablets",
  "Palos Selfie",
  "Otros",
];

export interface Producto {
  id: string;
  nombre: string;
  descripcion: string | null;
  precio: number | null;
  categoria: Categoria;
  imagenes: string[];
  disponible: boolean;
  destacado: boolean;
  created_at: string;
}

export type ProductoInput = Omit<Producto, "id" | "created_at">;
