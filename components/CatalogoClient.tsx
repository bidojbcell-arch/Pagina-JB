
"use client";

import { useMemo, useState } from "react";
import { Producto, CATEGORIAS } from "@/lib/types";
import ProductCard from "@/components/ProductCard";
import ProductModal from "@/components/ProductModal";
import CategoryFilter from "@/components/CategoryFilter";
import CartDrawer from "@/components/CartDrawer";
import CartFloat from "@/components/CartFloat";
import { CartItem, addToCart, setCartQuantity } from "@/lib/cart";

export default function CatalogoClient({ productos }: { productos: Producto[] }) {
  const [categoria, setCategoria] = useState("Todos");
  const [busqueda, setBusqueda] = useState("");
  const [pagina, setPagina] = useState(1);
  const [seleccionado, setSeleccionado] = useState<Producto | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  function handleAdd(product: Producto) {
    setCart((items) => addToCart(items, product));
    setAnnouncement(`${product.nombre} agregado al carrito.`);
  }

  const filtrados = useMemo(() => {
    return productos.filter((p) => {
      const coincideCategoria =
        categoria === "Todos" ||
        (categoria === "Ofertas" ? p.tipo === "oferta" : p.categoria === categoria);
      const coincideBusqueda = p.nombre
        .toLowerCase()
        .includes(busqueda.trim().toLowerCase());
      return coincideCategoria && coincideBusqueda;
    });
  }, [productos, categoria, busqueda]);
  const porPagina = 12;
  const totalPaginas = Math.ceil(filtrados.length / porPagina);
  const visibles = filtrados.slice((pagina - 1) * porPagina, pagina * porPagina);
  const cambiarCategoria = (valor: string) => { setCategoria(valor); setPagina(1); };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-slate-500">Agrega productos y envía tu pedido por WhatsApp.</p>
        </div>
        <p role="status" className="sr-only">{announcement}</p>
        <label className="sr-only" htmlFor="buscar-producto">
          Buscar productos
        </label>
        <input
          id="buscar-producto"
          type="search"
          placeholder="Buscar producto..."
          value={busqueda}
          onChange={(e) => { setBusqueda(e.target.value); setPagina(1); }}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
        />
        <CategoryFilter
          categorias={[...CATEGORIAS, "Ofertas"]}
          activa={categoria}
          onChange={cambiarCategoria}
        />
      </div>

      {filtrados.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl bg-white py-20 text-center shadow-card">
          <p className="text-lg font-medium text-slate-700">
            No encontramos productos con esos filtros.
          </p>
          <p className="text-sm text-slate-400">Prueba con otra categoría o búsqueda.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {visibles.map((p) => (
            <ProductCard key={p.id} producto={p} onClick={() => setSeleccionado(p)} onAddToCart={() => handleAdd(p)} inCart={cart.find((item) => item.product.id === p.id)?.quantity ?? 0} />
          ))}
        </div>
      )}

      {seleccionado && (
        <ProductModal producto={seleccionado} onClose={() => setSeleccionado(null)} onAddToCart={() => { handleAdd(seleccionado); setSeleccionado(null); setCartOpen(true); }} inCart={cart.find((item) => item.product.id === seleccionado.id)?.quantity ?? 0} />
      )}
      {totalPaginas > 1 && <nav aria-label="Paginación de productos" className="mt-8 flex flex-wrap justify-center gap-2">{Array.from({ length: totalPaginas }, (_, index) => index + 1).map((numero) => <button key={numero} type="button" onClick={() => setPagina(numero)} aria-current={pagina === numero ? "page" : undefined} className={pagina === numero ? "h-10 min-w-10 rounded-lg bg-brand-700 px-3 font-bold text-white" : "h-10 min-w-10 rounded-lg border border-slate-200 bg-white px-3 font-bold text-brand-700 hover:border-brand-400"}>{numero}</button>)}</nav>}
      {cartOpen && <CartDrawer items={cart} onClose={() => setCartOpen(false)} onQuantityChange={(id, quantity) => setCart((items) => setCartQuantity(items, id, quantity))} />}
      <CartFloat count={cartCount} onOpen={() => setCartOpen(true)} />
    </div>
  );
}

