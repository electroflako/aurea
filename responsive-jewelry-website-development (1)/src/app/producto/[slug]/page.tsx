import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ChevronDown, ChevronRight, Gift, Leaf, RotateCcw, Truck } from "lucide-react";
import { getProductBySlug, getRelatedProducts } from "@/lib/data";
import { formatPrice } from "@/lib/format";
import { ProductGallery } from "@/components/product-gallery";
import { ProductPurchase } from "@/components/product-purchase";
import { ProductCard } from "@/components/product-card";
import { Reveal } from "@/components/reveal";

export const dynamic = "force-dynamic";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Pieza no encontrada" };
  return {
    title: `${product.name} — ${product.categoryName}`,
    description: product.description,
    openGraph: {
      title: `${product.name} · AUREA`,
      description: product.description,
      images: [{ url: product.images[0], width: 1000, height: 1250, alt: product.name }],
    },
  };
}

const TRUST = [
  { icon: Truck, label: "Envío 24-48 h · Gratis desde 150 €" },
  { icon: RotateCcw, label: "Devoluciones hasta 30 días" },
  { icon: Gift, label: "Estuche de regalo incluido" },
  { icon: Leaf, label: "Plata 100 % reciclada" },
];

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(slug, 4);
  const discount =
    product.compareAtCents && product.compareAtCents > product.priceCents
      ? Math.round((1 - product.priceCents / product.compareAtCents) * 100)
      : 0;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images,
    brand: { "@type": "Brand", name: "AUREA" },
    offers: {
      "@type": "Offer",
      priceCurrency: "EUR",
      price: (product.priceCents / 100).toFixed(2),
      availability:
        product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };

  return (
    <div className="mx-auto max-w-7xl px-5 pt-[calc(6.25rem+env(safe-area-inset-top))] pb-36 sm:px-8 md:pt-40 lg:px-10 lg:pb-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Migas de pan */}
      <nav aria-label="Migas de pan" className="flex flex-wrap items-center gap-1.5 text-xs text-taupe">
        <Link href="/" className="hover:text-ink">Inicio</Link>
        <ChevronRight className="h-3 w-3" strokeWidth={1.5} />
        <Link href="/tienda" className="hover:text-ink">Tienda</Link>
        <ChevronRight className="h-3 w-3" strokeWidth={1.5} />
        <Link href={`/tienda?categoria=${product.categorySlug}`} className="hover:text-ink">
          {product.categoryName}
        </Link>
        <ChevronRight className="h-3 w-3" strokeWidth={1.5} />
        <span className="font-medium text-ink">{product.name}</span>
      </nav>

      <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Galería */}
        <ProductGallery images={product.images} name={product.name} priority />

        {/* Información */}
        <div className="lg:py-4">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/tienda?categoria=${product.categorySlug}`}
              className="text-[11px] font-semibold tracking-[0.24em] text-gold-strong uppercase"
            >
              {product.categoryName}
            </Link>
            {product.isNew && (
              <span className="rounded-full bg-gold px-2.5 py-1 text-[10px] font-bold tracking-wider text-ivory uppercase">
                Nuevo
              </span>
            )}
            {discount > 0 && (
              <span className="rounded-full bg-ink px-2.5 py-1 text-[10px] font-bold tracking-wider text-ivory">
                -{discount}%
              </span>
            )}
          </div>

          <h1 className="mt-3 font-display text-4xl leading-[1.05] font-light sm:text-5xl">
            {product.name}
          </h1>

          <div className="mt-4 flex items-baseline gap-3">
            <p className="font-display text-3xl font-medium">{formatPrice(product.priceCents)}</p>
            {product.compareAtCents && product.compareAtCents > product.priceCents && (
              <p className="text-base text-taupe line-through">{formatPrice(product.compareAtCents)}</p>
            )}
          </div>

          <p className="mt-1 text-xs text-taupe">
            {product.material} · Impuestos incluidos
          </p>

          {/* Stock */}
          <p className="mt-4 flex items-center gap-2 text-sm">
            <span
              className={`h-2 w-2 rounded-full ${
                product.stock === 0 ? "bg-red-400" : product.stock <= 5 ? "bg-amber-500" : "bg-emerald-500"
              }`}
            />
            {product.stock === 0
              ? "Agotada temporalmente"
              : product.stock <= 5
                ? `Últimas ${product.stock} unidades`
                : "En stock — lista para enviar"}
          </p>

          <p className="mt-6 text-[15px] leading-relaxed text-espresso/85">{product.description}</p>

          <div className="mt-8">
            <ProductPurchase product={product} />
          </div>

          {/* Confianza */}
          <ul className="mt-8 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {TRUST.map((item) => (
              <li key={item.label} className="flex items-center gap-3 rounded-2xl border border-line bg-white/50 px-4 py-3 text-xs font-medium text-espresso/80">
                <item.icon className="h-4.5 w-4.5 shrink-0 text-gold-strong" strokeWidth={1.5} />
                {item.label}
              </li>
            ))}
          </ul>

          {/* Acordeones */}
          <div className="mt-8 divide-y divide-line border-y border-line">
            <details className="accordion group py-5">
              <summary className="flex items-center justify-between text-sm font-semibold tracking-[0.1em] uppercase">
                Materiales y detalles
                <ChevronDown className="chevron h-4 w-4 text-taupe" strokeWidth={1.8} />
              </summary>
              <p className="pt-4 text-sm leading-relaxed text-espresso/80">{product.details}</p>
            </details>
            <details className="accordion group py-5">
              <summary className="flex items-center justify-between text-sm font-semibold tracking-[0.1em] uppercase">
                Cuidados de la pieza
                <ChevronDown className="chevron h-4 w-4 text-taupe" strokeWidth={1.8} />
              </summary>
              <ul className="list-disc space-y-1.5 pt-4 pl-5 text-sm leading-relaxed text-espresso/80">
                <li>Guárdala en su estuche, lejos de la humedad.</li>
                <li>Evita perfumes, cremas y cloro directamente sobre la pieza.</li>
                <li>Límpiala con un paño suave de algodón.</li>
                <li>El baño de oro dura años con un uso cuidadoso; ofrecemos re-baño de por vida.</li>
              </ul>
            </details>
            <details className="accordion group py-5">
              <summary className="flex items-center justify-between text-sm font-semibold tracking-[0.1em] uppercase">
                Envíos y devoluciones
                <ChevronDown className="chevron h-4 w-4 text-taupe" strokeWidth={1.8} />
              </summary>
              <p className="pt-4 text-sm leading-relaxed text-espresso/80">
                Preparamos tu pedido en 24 h laborables. Envío a Península en 24-48 h (6,90 €,
                gratuito desde 150 €) y a Baleares/UE en 3-5 días. Tienes 30 días para cambios y
                devoluciones sin preguntas; las piezas grabadas son venta final.
              </p>
            </details>
          </div>
        </div>
      </div>

      {/* Relacionados */}
      {related.length > 0 && (
        <section className="mt-20 md:mt-28">
          <Reveal className="flex items-end justify-between gap-6">
            <h2 className="font-display text-3xl leading-tight font-light sm:text-4xl">
              También te puede <em className="text-gold-strong italic">gustar</em>
            </h2>
            <Link
              href={`/tienda?categoria=${product.categorySlug}`}
              className="gold-underline hidden shrink-0 text-xs font-semibold tracking-[0.18em] uppercase sm:block"
            >
              Ver {product.categoryName.toLowerCase()}
            </Link>
          </Reveal>
          <div className="snap-row no-scrollbar -mx-5 mt-8 flex gap-5 overflow-x-auto px-5 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4">
            {related.map((p) => (
              <div key={p.slug} className="w-[62vw] shrink-0 sm:w-auto">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
