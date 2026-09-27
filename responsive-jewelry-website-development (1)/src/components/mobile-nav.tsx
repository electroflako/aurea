"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, ShoppingBag } from "lucide-react";
import clsx from "clsx";
import { useCart } from "@/components/cart-provider";

const HIDDEN_PREFIXES = ["/checkout", "/pedido", "/producto"];

export function MobileNav() {
  const pathname = usePathname();
  const { openCart, totalItems, hydrated } = useCart();

  if (HIDDEN_PREFIXES.some((p) => pathname.startsWith(p))) return null;

  const items = [
    { href: "/", label: "Inicio", icon: Home, active: pathname === "/" },
    { href: "/tienda", label: "Tienda", icon: LayoutGrid, active: pathname.startsWith("/tienda") },
  ];

  return (
    <nav
      aria-label="Navegación inferior"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line/80 bg-ivory/92 backdrop-blur-xl md:hidden"
    >
      <div className="grid grid-cols-3 pb-safe">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              "flex flex-col items-center gap-1 py-2.5 text-[10px] font-semibold tracking-[0.14em] uppercase transition-colors",
              item.active ? "text-gold-strong" : "text-ink/60",
            )}
          >
            <item.icon className="h-5 w-5" strokeWidth={item.active ? 2 : 1.5} />
            {item.label}
          </Link>
        ))}
        <button
          type="button"
          onClick={openCart}
          className="relative flex flex-col items-center gap-1 py-2.5 text-[10px] font-semibold tracking-[0.14em] text-ink/60 uppercase"
        >
          <span className="relative">
            <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
            {hydrated && totalItems > 0 && (
              <span className="absolute -top-1.5 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[9px] font-bold text-ivory">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </span>
          Bolsa
        </button>
      </div>
    </nav>
  );
}
