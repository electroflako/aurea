"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Plus, ShoppingBag } from "lucide-react";
import clsx from "clsx";
import { useCart } from "@/components/cart-provider";
import type { ProductCardData } from "@/lib/data";

function toCartPayload(product: ProductCardData) {
  return {
    productId: product.id,
    slug: product.slug,
    name: product.name,
    material: product.material,
    priceCents: product.priceCents,
    image: product.images[0],
  };
}

/** Botón circular de añadido rápido usado en las tarjetas. */
export function QuickAddButton({ product }: { product: ProductCardData }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  return (
    <button
      type="button"
      aria-label={`Añadir ${product.name} a la bolsa`}
      onClick={() => {
        addItem(toCartPayload(product));
        setAdded(true);
        timer.current = setTimeout(() => setAdded(false), 1500);
      }}
      className={clsx(
        "mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-all duration-300 active:scale-90",
        added
          ? "border-gold bg-gold text-ivory"
          : "border-line bg-white/70 text-ink hover:border-gold hover:bg-gold hover:text-ivory",
      )}
    >
      {added ? (
        <Check className="h-4 w-4" strokeWidth={2.5} />
      ) : (
        <Plus className="h-4 w-4" strokeWidth={1.8} />
      )}
    </button>
  );
}

/** Botón principal de la ficha de producto. */
export function AddToCartButton({
  product,
  quantity = 1,
  className,
}: {
  product: ProductCardData;
  quantity?: number;
  className?: string;
}) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const disabled = product.stock === 0;

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => {
        addItem(toCartPayload(product), quantity);
        setAdded(true);
        timer.current = setTimeout(() => setAdded(false), 1500);
      }}
      className={clsx(
        "flex h-14 w-full items-center justify-center gap-3 rounded-full text-sm font-semibold tracking-[0.16em] uppercase transition-all active:scale-[0.98]",
        disabled
          ? "cursor-not-allowed bg-sand text-taupe"
          : added
            ? "bg-gold text-ivory"
            : "bg-ink text-ivory hover:bg-espresso",
        className,
      )}
    >
      {disabled ? (
        "Agotado"
      ) : added ? (
        <>
          <Check className="h-5 w-5" strokeWidth={2.2} /> Añadido a la bolsa
        </>
      ) : (
        <>
          <ShoppingBag className="h-5 w-5" strokeWidth={1.6} /> Añadir a la bolsa
        </>
      )}
    </button>
  );
}
