"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, ShoppingBag, X } from "lucide-react";
import clsx from "clsx";
import { useCart } from "@/components/cart-provider";

const LINKS = [
  { href: "/tienda", label: "Tienda" },
  { href: "/tienda?categoria=anillos", label: "Anillos" },
  { href: "/tienda?categoria=collares", label: "Collares" },
  { href: "/#taller", label: "El taller" },
  { href: "/#contacto", label: "Contacto" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { openCart, totalItems, hydrated } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const isHome = pathname === "/";
  const solid = scrolled || !isHome || menuOpen;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40">
        {/* Barra de anuncio */}
        <div className="bg-ink px-4 py-2 text-center text-[11px] font-medium tracking-[0.16em] text-ivory/90 uppercase">
          Envío gratuito en pedidos superiores a 150 € · Hecho a mano en Madrid
        </div>

        <div
          className={clsx(
            "transition-all duration-500",
            solid
              ? "border-b border-line/70 bg-ivory/90 shadow-[0_8px_30px_-18px_rgba(23,19,13,0.35)] backdrop-blur-xl"
              : "bg-transparent",
          )}
        >
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-10">
            {/* Menú móvil */}
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Abrir menú"
              className={clsx(
                "flex h-11 w-11 items-center justify-center rounded-full transition-colors text-ink hover:bg-sand/60 md:hidden",
                !solid && "hover:bg-ink/5",
              )}
            >
              <Menu className="h-5 w-5" strokeWidth={1.5} />
            </button>

            {/* Logo */}
            <Link
              href="/"
              className="font-display text-2xl font-semibold tracking-[0.28em] text-ink transition-colors md:text-[26px]"
              aria-label="AUREA — Inicio"
            >
              AUREA
            </Link>

            {/* Navegación escritorio */}
            <nav className="hidden items-center gap-8 md:flex" aria-label="Principal">
              {LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="gold-underline text-[13px] font-medium tracking-[0.12em] text-ink/75 uppercase transition-colors hover:text-ink"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Carrito */}
            <button
              type="button"
              onClick={openCart}
              aria-label={`Abrir bolsa, ${hydrated ? totalItems : 0} artículos`}
              className="relative flex h-11 w-11 items-center justify-center rounded-full text-ink transition-colors hover:bg-sand/60"
            >
              <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
              {hydrated && totalItems > 0 && (
                <span className="absolute top-1 right-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-gold px-1 text-[10px] font-bold text-ivory">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Menú móvil a pantalla completa */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-ink text-ivory md:hidden">
          <div className="flex h-16 items-center justify-between px-4 pt-8">
            <span className="font-display text-2xl font-semibold tracking-[0.28em]">AUREA</span>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label="Cerrar menú"
              className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-ivory/10"
            >
              <X className="h-6 w-6" strokeWidth={1.5} />
            </button>
          </div>
          <nav className="flex flex-1 flex-col justify-center gap-2 px-8" aria-label="Menú móvil">
            {[{ href: "/", label: "Inicio" }, ...LINKS].map((link, i) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="animate-fade-in border-b border-ivory/10 py-4 font-display text-4xl font-light italic transition-colors hover:text-gold-light"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <p className="px-8 pb-10 text-xs tracking-[0.2em] text-ivory/50 uppercase pb-safe">
            Joyería artesanal · Madrid
          </p>
        </div>
      )}
    </>
  );
}
