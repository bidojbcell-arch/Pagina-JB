import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Producto } from "@/lib/types";
import ProductForm from "@/components/ProductForm";

export default async function EditarProductoPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();
  const { data } = await supabase
    .from("productos")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!data) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Editar producto</h1>
      <div className="rounded-2xl bg-white p-6 shadow-card">
        <ProductForm producto={data as Producto} />
      </div>
    </div>
  );
}
