import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Producto } from "@/lib/types";
import { whatsappLinkProducto } from "@/lib/whatsapp";
import { catalogEligibility } from "@/lib/meta-catalog";

export const dynamic = "force-dynamic";

export default async function MetaWhatsAppBridge({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data } = await supabase.from("productos").select("*").eq("id", params.id).maybeSingle();
  const producto = data as Producto | null;
  if (!producto) notFound();
  const eligibility = catalogEligibility(producto);
  if (!eligibility) {
    console.warn("Meta WhatsApp bridge excluded product", { productId: producto.id });
    notFound();
  }
  redirect(whatsappLinkProducto(producto.nombre, eligibility.price));
}

