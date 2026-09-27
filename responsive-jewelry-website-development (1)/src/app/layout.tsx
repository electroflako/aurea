import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Fraunces, Manrope } from "next/font/google";
import { CartProvider } from "@/components/cart-provider";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CartDrawer } from "@/components/cart-drawer";
import { MobileNav } from "@/components/mobile-nav";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "AUREA — Joyería artesanal hecha a mano en Madrid",
    template: "%s · AUREA",
  },
  description:
    "Joyería artesanal en oro vermeil de 18 k y plata 925 reciclada. Anillos, collares, pendientes y pulseras hechos a mano en nuestro taller de Madrid. Envío gratuito a partir de 150 €.",
  keywords: ["joyería artesanal", "oro vermeil", "plata 925", "anillos", "collares", "pendientes", "pulseras", "Madrid"],
  openGraph: {
    type: "website",
    locale: "es_ES",
    siteName: "AUREA Joyería",
    title: "AUREA — Joyería artesanal hecha a mano en Madrid",
    description:
      "Piezas de oro vermeil de 18 k y plata reciclada, forjadas a mano. Descubre la colección.",
    images: [
      {
        url: "/images/hero.jpg",
        width: 1200,
        height: 1600,
        alt: "Collar de oro con perla barroca y anillo de oro sobre travertino — AUREA",
      },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#17130d",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" className={`${fraunces.variable} ${manrope.variable}`}>
      <body className="bg-ivory font-sans text-ink antialiased">
        <CartProvider>
          <SiteHeader />
          <main className="pb-[76px] md:pb-0">{children}</main>
          <SiteFooter />
          <CartDrawer />
          <MobileNav />
        </CartProvider>
      </body>
    </html>
  );
}
