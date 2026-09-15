import { NextResponse } from "next/server";
import { catalogCsv } from "@/lib/meta-catalog";
import { createClient } from "@/lib/supabase/server";
import { Producto } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("productos")
    .select("*")
    .eq("disponible", true)
    .gt("stock", 0)
    .order("orden", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) return new NextResponse("Catalog unavailable", { status: 503 });
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://paginajb.vercel.app").replace(/\/$/, "");
  return new NextResponse(catalogCsv((data ?? []) as Producto[], baseUrl), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Cache-Control": "no-store, max-age=0",
    },
  });
}

