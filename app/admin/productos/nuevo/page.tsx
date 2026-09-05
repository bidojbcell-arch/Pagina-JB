import ProductForm from "@/components/ProductForm";

export default function NuevoProductoPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Nuevo producto</h1>
      <div className="rounded-2xl bg-white p-6 shadow-card">
        <ProductForm />
      </div>
    </div>
  );
}
