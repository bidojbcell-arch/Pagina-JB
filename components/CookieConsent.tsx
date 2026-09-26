"use client";

import { useEffect, useState } from "react";
import MetaPixel from "@/components/MetaPixel";

const KEY = "jbcell-cookie-consent";

export default function CookieConsent() {
  const [consent, setConsent] = useState<"accepted" | "rejected" | null>(null);

  useEffect(() => {
    const saved = window.localStorage.getItem(KEY);
    if (saved === "accepted" || saved === "rejected") setConsent(saved);
  }, []);

  const choose = (value: "accepted" | "rejected") => {
    window.localStorage.setItem(KEY, value);
    setConsent(value);
  };

  return <>
    {consent === "accepted" && <MetaPixel />}
    {consent === null && <aside role="dialog" aria-label="Preferencias de cookies" className="fixed inset-x-4 bottom-4 z-[60] mx-auto max-w-xl rounded-2xl bg-brand-900 p-5 text-sm text-white shadow-2xl"><p className="font-bold">Tu privacidad importa</p><p className="mt-2 text-brand-100">Usamos cookies esenciales. Al aceptar, autorizas cookies de medición de Meta y aceptas los <a className="underline" href="https://planear.acentosdeco.lat/terminos" target="_blank" rel="noopener noreferrer">términos de uso</a> y la <a className="underline" href="https://planear.acentosdeco.lat/privacidad" target="_blank" rel="noopener noreferrer">política de privacidad</a>.</p><div className="mt-4 flex flex-wrap gap-3"><button onClick={() => choose("accepted")} className="rounded-lg bg-accent-600 px-4 py-2 font-bold">Aceptar cookies</button><button onClick={() => choose("rejected")} className="rounded-lg border border-white/40 px-4 py-2 font-bold">Solo esenciales</button></div></aside>}
  </>;
}
