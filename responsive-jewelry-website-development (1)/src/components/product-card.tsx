import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/format";
import type { ProductCardData } from "@/lib/data";
import { QuickAddButton } from "@/components/add-to-cart-button";

export function ProductCard({ product, priority = false }: { product: ProductCardData; priority?: boolean }) {
  const discount =
    product.compareAtCents && product.compareAtCents > product.priceCents
      ? Math.round((1 - product.priceCents / product.compareAtCents) * 100)
      : 0;

  return (
    <article className="group relative flex flex-col">
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-cream shadow-card transition-shadow duration-500 group-hover:shadow-lift">
        <Link href={`/producto/${product.slug}`} aria-label={product.name} className="absolute inset-0">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 46vw, (max-width: 1024px) 32vw, 300px"
            priority={priority}
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
          />
          {product.images[1] && (
            <Image
              src={product.images[1]}
              alt=""
              fill
              sizes="(max-width: 640px) 46vw, (max-width: 1024px) 32vw, 300px"
              aria-hidden
              className="hidden object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100 sm:block"
            />
          )}
        </Link>

        {/* Insignias */}
        <div className="pointer-events-none absolute top-3 left-3 flex flex-col gap-1.5">
          {discount > 0 && (
            <span className="rounded-full bg-ink px-2.5 py-1 text-[10px] font-bold tracking-wider text-ivory">
              -{discount}%
            </span>
          )}
          {product.isNew && (
            <span className="rounded-full bg-gold px-2.5 py-1 text-[10px] font-bold tracking-wider text-ivory uppercase">
              Nuevo
            </span>
          )}
          {product.isBestseller && (
            <span className="rounded-full bg-ivory/90 px-2.5 py-1 text-[10px] font-bold tracking-wider text-espresso uppercase backdrop-blur">
              Más vendido
            </span>
          )}
        </div>

        {product.stock === 0 && (
          <span className="absolute inset-x-0 bottom-0 bg-ink/70 py-2 text-center text-[11px] font-semibold tracking-[0.18em] text-ivory uppercase backdrop-blur-sm">
            Agotado
          </span>
        )}
      </div>

      <div className="flex items-start justify-between gap-2 pt-3.5">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold tracking-[0.18em] text-taupe uppercase">
            {product.categoryName}
          </p>
          <h3 className="mt-1 truncate font-display text-lg leading-snug font-medium">
            <Link href={`/producto/${product.slug}`} className="hover:text-gold-strong">
              {product.name}
            </Link>
          </h3>
          <div className="mt-1 flex items-baseline gap-2">
            <p className="text-[15px] font-semibold">{formatPrice(product.priceCents)}</p>
            {product.compareAtCents && product.compareAtCents > product.priceCents && (
              <p className="text-xs text-taupe line-through">{formatPrice(product.compareAtCents)}</p>
            )}
          </div>
        </div>
        {product.stock > 0 && <QuickAddButton product={product} />}
      </div>
    </article>
  );
}
