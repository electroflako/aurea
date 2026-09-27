import Link from "next/link";
import { Suspense } from "react";
import { PackageSearch } from "lucide-react";
import clsx from "clsx";
import { getCategories, getMaterials, getProducts } from "@/lib/data";
import { normalizeSort } from "@/lib/shop";
import { ProductCard } from "@/components/product-card";
import { ShopControls } from "@/components/shop-controls";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Tienda — Todas las piezas",
  description:
    "Explora anillos, collares, pendientes y pulseras de oro vermeil y plata 925, hechos a mano en Madrid.",
};

interface TiendaPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function single(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

const CATEGORY_META: Record<string, { title: string; blurb: string }> = {
  anillos: { title: "Anillos", blurb: "Promesas talladas a mano para llevar cada día." },
  collares: { title: "Collares", blurb: "Luz que cae exactamente donde debe caer." },
  pendientes: { title: "Pendientes", blurb: "Destellos en movimiento, del amanecer a la pista de baile." },
  pulseras: { title: "Pulseras", blurb: "Gestos que abrazan la muñeca con calidez." },
};

async function ShopContent({ searchParams }: TiendaPageProps) {
  const sp = await searchParams;
  const categoria = single(sp.categoria);
  const q = single(sp.q);
  const material = single(sp.material);
  const ordenRaw = single(sp.orden);
  const orden = normalizeSort(ordenRaw);

  const [products, categories, materials] = await Promise.all([
    getProducts({ categoria: categoria || undefined, q: q || undefined, material: material || undefined, orden }),
    getCategories(),
    getMaterials(),
  ]);

  const meta = CATEGORY_META[categoria];
  const title = meta?.title ?? (q ? `Resultados para “${q}”` : "Todas las piezas");

  const pillHref = (slug: string) => {
    const params = new URLSearchParams();
    if (slug) params.set("categoria", slug);
    if (q) params.set("q", q);
    if (material) params.set("material", material);
    if (orden !== "destacados") params.set("orden", orden);
    const qs = params.toString();
    return qs ? `/tienda?${qs}` : "/tienda";
  };

  return (
    <div className="mx-auto max-w-7xl px-5 pt-[calc(6.25rem+env(safe-area-inset-top))] pb-16 sm:px-8 md:pt-40 lg:px-10">
      {/* Cabecera */}
      <header className="max-w-2xl">
        <p className="text-[11px] font-semibold tracking-[0.3em] text-gold-strong uppercase">
          La colección
        </p>
        <h1 className="mt-3 font-display text-5xl leading-[1.02] font-light sm:text-6xl">
          {meta ? (
            <>
              {meta.title.split(" ")[0]} <em className="text-gold-strong italic">{meta.title.split(" ").slice(1).join(" ") || ""}</em>
            </>
          ) : (
            title
          )}
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-taupe">
          {meta?.blurb ??
            "Piezas de oro vermeil de 18 k y plata 925 reciclada, forjadas a mano en nuestro taller de Madrid. Series cortas, stock real."}
        </p>
      </header>

      {/* Píldoras de categoría */}
      <nav aria-label="Categorías" className="no-scrollbar -mx-5 mt-8 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
        <Link
          href={pillHref("")}
          scroll={false}
          className={clsx(
            "flex h-11 shrink-0 items-center rounded-full border px-5 text-sm font-medium whitespace-nowrap transition-colors active:scale-95",
            !categoria
              ? "border-ink bg-ink text-ivory"
              : "border-line bg-white/60 hover:border-gold",
          )}
        >
          Todo
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={pillHref(cat.slug)}
            scroll={false}
            className={clsx(
              "flex h-11 shrink-0 items-center rounded-full border px-5 text-sm font-medium whitespace-nowrap transition-colors active:scale-95",
              categoria === cat.slug
                ? "border-ink bg-ink text-ivory"
                : "border-line bg-white/60 hover:border-gold",
            )}
          >
            {cat.name}
          </Link>
        ))}
      </nav>

      {/* Controles */}
      <div className="mt-5">
        <ShopControls materials={materials} resultCount={products.length} current={{ q, material, orden }} />
      </div>

      {/* Rejilla */}
      {products.length === 0 ? (
        <div className="mt-16 flex flex-col items-center rounded-3xl border border-dashed border-line bg-white/40 px-6 py-20 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-cream">
            <PackageSearch className="h-7 w-7 text-taupe" strokeWidth={1.4} />
          </span>
          <p className="mt-5 font-display text-2xl font-light italic">Nada por aquí… todavía</p>
          <p className="mt-2 max-w-[36ch] text-sm text-taupe">
            No encontramos piezas con esos filtros. Prueba con otra búsqueda o mira la colección
            completa.
          </p>
          <Link
            href="/tienda"
            className="mt-6 flex h-12 items-center rounded-full bg-ink px-8 text-xs font-semibold tracking-[0.16em] text-ivory uppercase active:scale-95"
          >
            Ver toda la tienda
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product, i) => (
            <ProductCard key={product.slug} product={product} priority={i < 4} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function TiendaPage(props: TiendaPageProps) {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-5 pt-40 pb-24">
          <div className="h-12 w-56 animate-soft-pulse rounded-2xl bg-sand" />
          <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-[4/5] animate-soft-pulse rounded-2xl bg-sand" style={{ animationDelay: `${i * 120}ms` }} />
            ))}
          </div>
        </div>
      }
    >
      <ShopContent {...props} />
    </Suspense>
  );
}
