"use client";

export default function CategoryFilter({
  categorias,
  activa,
  onChange,
}: {
  categorias: string[];
  activa: string;
  onChange: (categoria: string) => void;
}) {
  const opciones = ["Todos", ...categorias];

  return (
    <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-1">
      {opciones.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition ${
            activa === cat
              ? "border-brand-600 bg-brand-600 text-white shadow"
              : "border-slate-200 bg-white text-slate-600 hover:border-brand-300 hover:text-brand-700"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
