"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { FREE_SHIPPING_THRESHOLD_CENTS, formatPrice } from "@/lib/format";

export function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, subtotalCents, hydrated } = useCart();

  if (!isOpen) return null;

  const remaining = FREE_SHIPPING_THRESHOLD_CENTS - subtotalCents;
  const progress = Math.min(100, Math.round((subtotalCents / FREE_SHIPPING_THRESHOLD_CENTS) * 100));

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Bolsa de compra">
      <button
        type="button"
        aria-label="Cerrar bolsa"
        onClick={closeCart}
        className="animate-fade-in absolute inset-0 bg-ink/55 backdrop-blur-sm"
      />
      <aside className="animate-drawer-in absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-ivory shadow-lift">
        <header className="flex items-center justify-between border-b border-line px-6 py-5">
          <h2 className="flex items-center gap-3 font-display text-2xl font-medium">
            Tu bolsa
            <span className="rounded-full bg-sand px-3 py-1 text-xs font-semibold tracking-wide">
              {items.reduce((a, i) => a + i.quantity, 0)}
            </span>
          </h2>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Cerrar"
            className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-sand/60"
          >
            <X className="h-5 w-5" strokeWidth={1.5} />
          </button>
        </header>

        {!hydrated || items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-5 px-8 text-center">
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-cream">
              <ShoppingBag className="h-8 w-8 text-taupe" strokeWidth={1.2} />
            </span>
            <p className="font-display text-2xl font-light italic">Tu bolsa está vacía</p>
            <p className="max-w-[26ch] text-sm text-taupe">
              Descubre piezas hechas a mano que cuentan historias.
            </p>
            <Link
              href="/tienda"
              onClick={closeCart}
              className="mt-2 inline-flex h-12 items-center justify-center rounded-full bg-ink px-8 text-sm font-semibold tracking-[0.14em] text-ivory uppercase transition-transform active:scale-95"
            >
              Explorar la tienda
            </Link>
          </div>
        ) : (
          <>
            {/* Progreso envío gratuito */}
            <div className="border-b border-line bg-cream/60 px-6 py-4">
              {remaining > 0 ? (
                <p className="text-xs text-espresso/80">
                  Te faltan <strong className="text-gold-strong">{formatPrice(remaining)}</strong> para
                  el <strong>envío gratuito</strong>
                </p>
              ) : (
                <p className="text-xs font-semibold text-gold-strong">
                  ¡Enhorabuena! Tu pedido tiene envío gratuito
                </p>
              )}
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-sand">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-gold to-gold-light transition-all duration-700"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <ul className="flex-1 divide-y divide-line overflow-y-auto px-6">
              {items.map((item) => (
                <li key={item.productId} className="flex gap-4 py-5">
                  <Link
                    href={`/producto/${item.slug}`}
                    onClick={closeCart}
                    className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-cream"
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </Link>
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <Link
                          href={`/producto/${item.slug}`}
                          onClick={closeCart}
                          className="font-display text-lg leading-tight font-medium hover:text-gold-strong"
                        >
                          {item.name}
                        </Link>
                        <p className="mt-0.5 text-xs text-taupe">{item.material}</p>
                      </div>
                      <p className="text-sm font-semibold whitespace-nowrap">
                        {formatPrice(item.priceCents * item.quantity)}
                      </p>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <div className="flex items-center rounded-full border border-line">
                        <button
                          type="button"
                          aria-label="Reducir cantidad"
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-sand/60 active:scale-90"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                        <button
                          type="button"
                          aria-label="Aumentar cantidad"
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-sand/60 active:scale-90"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <button
                        type="button"
                        aria-label={`Eliminar ${item.name}`}
                        onClick={() => removeItem(item.productId)}
                        className="flex h-9 w-9 items-center justify-center rounded-full text-taupe hover:bg-red-50 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <footer className="border-t border-line bg-white/60 px-6 py-5 pb-safe">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm text-taupe">Subtotal</span>
                <span className="font-display text-2xl font-semibold">{formatPrice(subtotalCents)}</span>
              </div>
              <Link
                href="/checkout"
                onClick={closeCart}
                className="flex h-14 w-full items-center justify-center rounded-full bg-ink text-sm font-semibold tracking-[0.16em] text-ivory uppercase transition-all hover:bg-espresso active:scale-[0.98]"
              >
                Finalizar compra
              </Link>
              <p className="mt-3 text-center text-[11px] text-taupe">
                Impuestos incluidos. Envío calculado en el checkout.
              </p>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
