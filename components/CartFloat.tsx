
"use client";

export default function CartFloat({ count, onOpen }: { count: number; onOpen: () => void }) {
  const label = `Abrir carrito, ${count} ${count === 1 ? "producto" : "productos"}`;

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-haspopup="dialog"
      aria-label={label}
      className="fixed bottom-24 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-brand-800 text-white shadow-lg shadow-brand-900/25 transition-transform hover:scale-110 active:scale-95"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true" className="h-7 w-7"><path d="M3 3h2l3 12h11l2-8H6" /><circle cx="9" cy="20" r="1" /><circle cx="18" cy="20" r="1" /></svg>
      {count > 0 && <span className="absolute -right-1 -top-1 flex h-6 min-w-6 items-center justify-center rounded-full bg-accent-600 px-1 text-xs font-black text-white ring-2 ring-white">{count}</span>}
    </button>
  );
}

