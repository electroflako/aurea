"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import clsx from "clsx";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { formatPrice } from "@/lib/format";
import type { ProductCardData } from "@/lib/data";

export function ProductPurchase({ product }: { product: ProductCardData }) {
  const [quantity, setQuantity] = useState(1);
  const disabled = product.stock === 0;

  return (
    <>
      <div className="flex items-stretch gap-3">
        {/* Selector de cantidad */}
        <div
          className={clsx(
            "flex items-center rounded-full border border-line bg-white/60",
            disabled && "opacity-50",
          )}
        >
          <button
            type="button"
            aria-label="Reducir cantidad"
            disabled={disabled || quantity <= 1}
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="flex h-14 w-12 items-center justify-center rounded-full transition-colors hover:bg-sand/60 active:scale-90 disabled:opacity-40"
          >
            <Minus className="h-4 w-4" strokeWidth={1.8} />
          </button>
          <span aria-live="polite" className="w-7 text-center text-base font-semibold">
            {quantity}
          </span>
          <button
            type="button"
            aria-label="Aumentar cantidad"
            disabled={disabled || quantity >= Math.min(product.stock, 99)}
            onClick={() => setQuantity((q) => Math.min(Math.min(product.stock, 99), q + 1))}
            className="flex h-14 w-12 items-center justify-center rounded-full transition-colors hover:bg-sand/60 active:scale-90 disabled:opacity-40"
          >
            <Plus className="h-4 w-4" strokeWidth={1.8} />
          </button>
        </div>

        <div className="flex-1">
          <AddToCartButton product={product} quantity={quantity} />
        </div>
      </div>

      {/* Barra adhesiva móvil */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-ivory/95 px-5 py-3 pb-safe backdrop-blur-xl lg:hidden">
        <div className="flex items-center gap-4">
          <div className="min-w-0">
            <p className="truncate font-display text-lg font-medium">{product.name}</p>
            <p className="text-sm font-semibold text-gold-strong">{formatPrice(product.priceCents)}</p>
          </div>
          <div className="flex-1">
            <AddToCartButton product={product} quantity={quantity} className="h-12 text-xs" />
          </div>
        </div>
      </div>
    </>
  );
}
