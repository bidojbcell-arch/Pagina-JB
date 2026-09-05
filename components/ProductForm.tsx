"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { CATEGORIAS, Categoria, Producto } from "@/lib/types";

const BUCKET = "productos-imagenes";

export default function ProductForm({ producto }: { producto?: Producto }) {
  const router = useRouter();
  const supabase = createClient();
  const esEdicion = Boolean(producto);

  const [nombre, setNombre] = useState(producto?.nombre ?? "");
  const [descripcion, setDescripcion] = useState(producto?.descripcion ?? "");
  const [precio, setPrecio] = useState(producto?.precio?.toString() ?? "");
  const [categoria, setCategoria] = useState<Categoria>(
    producto?.categoria ?? CATEGORIAS[0]
  );
  const [disponible, setDisponible] = useState(producto?.disponible ?? true);
  const [destacado, setDestacado] = useState(producto?.destacado ?? false);
  const [imagenesExistentes, setImagenesExistentes] = useState<string[]>(
    producto?.imagenes ?? []
  );
  const [archivosNuevos, setArchivosNuevos] = useState<File[]>([]);
  const [previews, setPrevios] = useState<string[]>([]);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleFiles(files: FileList | null) {
    if (!files) return;
    const nuevos = Array.from(files);
    setArchivosNuevos((prev) => [...prev, ...nuevos]);
    setPrevios((prev) => [...prev, ...nuevos.map((f) => URL.createObjectURL(f))]);
  }

  function quitarExistente(url: string) {
    setImagenesExistentes((prev) => prev.filter((u) => u !== url));
  }

  function quitarNueva(index: number) {
    setArchivosNuevos((prev) => prev.filter((_, i) => i !== index));
    setPrevios((prev) => prev.filter((_, i) => i !== index));
  }

  async function subirImagenesNuevas(idProducto: string): Promise<string[]> {
    const urls: string[] = [];
    for (const archivo of archivosNuevos) {
      const extension = archivo.name.split(".").pop() || "jpg";
      const rutaArchivo = idProducto + "/" + crypto.randomUUID() + "." + extension;
      const { error: errorSubida } = await supabase.storage
        .from(BUCKET)
        .upload(rutaArchivo, archivo, { cacheControl: "3600", upsert: false });

      if (errorSubida) {
        if (errorSubida.message === "Bucket not found") {
          throw new Error(
            'Falta configurar el almacenamiento de imágenes. Crea el bucket "' +
              BUCKET +
              '" en Supabase y ejecuta supabase/storage_productos.sql.'
          );
        }
        throw new Error("Error subiendo imagen: " + errorSubida.message);
      }

      const { data } = supabase.storage.from(BUCKET).getPublicUrl(rutaArchivo);
      urls.push(data.publicUrl);
    }
    return urls;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!nombre.trim()) {
      setError("El nombre es obligatorio.");
      return;
    }
    if (imagenesExistentes.length + archivosNuevos.length === 0) {
      setError("Agrega al menos una foto del producto.");
      return;
    }

    setGuardando(true);
    try {
      const idProducto = producto?.id ?? crypto.randomUUID();
      const urlsNuevas = await subirImagenesNuevas(idProducto);
      const imagenesFinal = [...imagenesExistentes, ...urlsNuevas];
      const payload = {
        nombre: nombre.trim(),
        descripcion: descripcion.trim() || null,
        precio: precio ? Number(precio) : null,
        categoria,
        disponible,
        destacado,
        imagenes: imagenesFinal,
      };

      if (esEdicion && producto) {
        const { error: errorUpdate } = await supabase
          .from("productos")
          .update(payload)
          .eq("id", producto.id);
        if (errorUpdate) throw new Error(errorUpdate.message);
      } else {
        const { error: errorInsert } = await supabase
          .from("productos")
          .insert({ id: idProducto, ...payload });
        if (errorInsert) throw new Error(errorInsert.message);
      }

      router.push("/admin");
      router.refresh();
    } catch (err: any) {
      setError(err.message ?? "Ocurrió un error al guardar.");
    } finally {
      setGuardando(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Nombre del producto *</label>
        <input value={nombre} onChange={(e) => setNombre(e.target.value)} required className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100" placeholder="Ej. Reloj inteligente Serie 8" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Descripción</label>
        <textarea value={descripcion ?? ""} onChange={(e) => setDescripcion(e.target.value)} rows={4} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100" placeholder="Características, colores disponibles, garantía, etc." />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Precio (RD$)</label>
          <input type="number" min={0} step="0.01" value={precio} onChange={(e) => setPrecio(e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100" placeholder="Dejar vacío = Consultar precio" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Categoría</label>
          <select value={categoria} onChange={(e) => setCategoria(e.target.value as Categoria)} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100">
            {CATEGORIAS.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
      </div>
      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" checked={disponible} onChange={(e) => setDisponible(e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-brand-600" />Visible en el catálogo</label>
        <label className="flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" checked={destacado} onChange={(e) => setDestacado(e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-brand-600" />Marcar como destacado</label>
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Fotos del producto *</label>
        <div className="flex flex-wrap gap-3">
          {imagenesExistentes.map((url) => (
            <div key={url} className="relative h-24 w-24 overflow-hidden rounded-lg border border-slate-200">
              <Image src={url} alt="" fill className="object-cover" />
              <button type="button" onClick={() => quitarExistente(url)} className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-xs text-white">✕</button>
            </div>
          ))}
          {previews.map((url, i) => (
            <div key={url} className="relative h-24 w-24 overflow-hidden rounded-lg border border-slate-200">
              <Image src={url} alt="" fill className="object-cover" />
              <button type="button" onClick={() => quitarNueva(i)} className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-xs text-white">✕</button>
            </div>
          ))}
          <label className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-slate-300 text-slate-400 hover:border-brand-400 hover:text-brand-500">
            <span className="text-2xl leading-none">+</span><span className="text-[10px]">Agregar</span>
            <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />
          </label>
        </div>
        <p className="mt-1 text-xs text-slate-400">Puedes subir varias fotos. La primera será la portada en el catálogo.</p>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex gap-3">
        <button type="submit" disabled={guardando} className="rounded-xl bg-brand-600 px-6 py-2.5 font-semibold text-white shadow hover:bg-brand-700 disabled:opacity-60">{guardando ? "Guardando..." : esEdicion ? "Guardar cambios" : "Publicar producto"}</button>
        <button type="button" onClick={() => router.push("/admin")} className="rounded-xl border border-slate-200 px-6 py-2.5 font-medium text-slate-600 hover:bg-slate-50">Cancelar</button>
      </div>
    </form>
  );
}
