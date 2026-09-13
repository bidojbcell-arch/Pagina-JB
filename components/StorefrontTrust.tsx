const trustCards = [
  {
    title: "Envíos rápidos",
    description:
      "Coordinamos tu entrega con agilidad para que disfrutes tu compra cuanto antes.",
  },
  {
    title: "Pago seguro",
    description:
      "Te orientamos en cada paso para que compres con información clara y tranquilidad.",
  },
  {
    title: "Garantía JBCELL",
    description:
      "Seleccionamos equipos y accesorios con el respaldo que necesitas al comprar.",
  },
  {
    title: "Atención personalizada",
    description:
      "Conversamos contigo para encontrar la tecnología que mejor acompaña tu día.",
  },
];

export default function StorefrontTrust() {
  return (
    <section aria-labelledby="confianza-title" className="bg-brand-900 py-16 text-white sm:py-20">
      <div className="mx-auto max-w-7xl px-5">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent-300">Respaldo JBCELL</p>
          <h2 id="confianza-title" className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
            Compra con confianza
          </h2>
          <p className="mt-3 leading-7 text-brand-100">
            Una experiencia cercana desde que eliges hasta que recibes tu compra.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {trustCards.map((card, index) => (
            <article key={card.title} className="rounded-2xl border border-white/15 bg-white/5 p-6">
              <span className="block h-1 w-10 rounded-full bg-accent-400" aria-hidden="true" />
              <span className="mt-5 block text-xs font-black tracking-[0.18em] text-accent-200" aria-hidden="true">
                0{index + 1}
              </span>
              <h3 className="mt-3 text-lg font-extrabold">{card.title}</h3>
              <p className="mt-2 text-sm leading-6 text-brand-100">{card.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

