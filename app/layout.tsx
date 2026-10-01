import type { Metadata, Viewport } from "next";
import "./globals.css";
import CookieConsent from "@/components/CookieConsent";
import PwaRegister from "@/components/PwaRegister";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.jbcell.com"),
  title: "Tienda de celulares y accesorios en Santo Domingo | JBCELL",
  description:
    "Compra celulares, accesorios, audífonos, cargadores, relojes inteligentes y más en JBCELL. Entrega en Santo Domingo y envíos a toda República Dominicana por WhatsApp.",
  alternates: {
    canonical: "/",
  },
  verification: {
    google: "3F8feaj8TWiQDWPaFr-WfK-QrkwZjG2VIPLvTVcBiL8",
  },
  openGraph: {
    title: "JBCELL | Celulares y accesorios en Santo Domingo",
    description:
      "Tecnología, celulares y accesorios con entrega en Santo Domingo y envíos a toda República Dominicana.",
    url: "/",
    siteName: "JBCELL",
    locale: "es_DO",
    type: "website",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "JBCELL",
  },
  icons: {
    icon: [
      { url: "/icons/jbcell-app-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/jbcell-app-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/jbcell-app-192.png", sizes: "192x192", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#4f46e5",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased">
        <PwaRegister />
        <CookieConsent />
        {children}
      </body>
    </html>
  );
}
