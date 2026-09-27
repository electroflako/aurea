"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { ChevronDown, Search, SlidersHorizontal, X } from "lucide-react";
import clsx from "clsx";
import { SORT_OPTIONS, type SortKey } from "@/lib/shop";

interface ShopControlsProps {
  materials: string[];
  resultCount: number;
  current: {
    q: string;
    material: string;
    orden: SortKey;
  };
}

export function ShopControls({ materials, resultCount, current }: ShopControlsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [query, setQuery] = useState(current.q);
  const [isPending, startTransition] = useTransition();

  useEffect(() => setQuery(current.q), [current.q]);

  useEffect(() => {
    document.body.style.overflow = sheetOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [sheetOpen]);

  function apply(updates: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  }

  function clearAll() {
    setQuery("");
    startTransition(() => router.push(pathname));
    setSheetOpen(false);
  }

  const hasFilters = Boolean(current.q || current.material);

  // Búsqueda con debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query !== current.q) apply({ q: query });
    }, 450);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const sortSelect = (
    <label className="relative flex items-center">
      <span className="sr-only">Ordenar por</span>
      <select
        value={current.orden}
        onChange={(e) => apply({ orden: e.target.value })}
        className="h-12 w-full appearance-none rounded-full border border-line bg-white/70 pr-10 pl-5 text-sm font-medium focus:border-gold focus:ring-2 focus:ring-gold/30 focus:outline-none sm:w-auto"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-4 h-4 w-4 text-taupe" strokeWidth={1.8} />
    </label>
  );

  const materialSelect = (
    <label className="relative flex items-center">
      <span className="sr-only">Filtrar por material</span>
      <select
        value={current.material}
        onChange={(e) => apply({ material: e.target.value })}
        className="h-12 w-full appearance-none rounded-full border border-line bg-white/70 pr-10 pl-5 text-sm font-medium focus:border-gold focus:ring-2 focus:ring-gold/30 focus:outline-none sm:w-auto"
      >
        <option value="">Todos los materiales</option>
        {materials.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-4 h-4 w-4 text-taupe" strokeWidth={1.8} />
    </label>
  );

  const searchInput = (
    <label className="relative flex flex-1 items-center">
      <span className="sr-only">Buscar piezas</span>
      <Search className="pointer-events-none absolute left-4 h-4 w-4 text-taupe" strokeWidth={1.8} />
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar: perla, aros, oro…"
        enterKeyHint="search"
        className="h-12 w-full rounded-full border border-line bg-white/70 pr-4 pl-11 text-sm focus:border-gold focus:ring-2 focus:ring-gold/30 focus:outline-none"
      />
    </label>
  );

  return (
    <div className={clsx(isPending && "pointer-events-none opacity-70 transition-opacity")}>
      {/* Barra móvil */}
      <div className="flex gap-2.5 sm:hidden">
        <button
          type="button"
          onClick={() => setSheetOpen(true)}
          className={clsx(
            "flex h-12 flex-1 items-center justify-center gap-2 rounded-full border text-sm font-semibold active:scale-[0.97]",
            hasFilters ? "border-gold bg-gold/10 text-gold-strong" : "border-line bg-white/70",
          )}
        >
          <SlidersHorizontal className="h-4 w-4" strokeWidth={1.8} />
          Filtros {hasFilters && "·"}
        </button>
        {sortSelect}
      </div>

      {/* Barra escritorio */}
      <div className="hidden items-center gap-3 sm:flex">
        <div className="w-full max-w-xs">{searchInput}</div>
        {materialSelect}
        {sortSelect}
        <p className="ml-auto text-sm text-taupe">
          {resultCount} {resultCount === 1 ? "pieza" : "piezas"}
        </p>
      </div>

      {/* Hoja inferior de filtros (móvil) */}
      {sheetOpen && (
        <div className="fixed inset-0 z-50 sm:hidden" role="dialog" aria-modal="true" aria-label="Filtros">
          <button
            type="button"
            aria-label="Cerrar filtros"
            onClick={() => setSheetOpen(false)}
            className="animate-fade-in absolute inset-0 bg-ink/55 backdrop-blur-sm"
          />
          <div className="animate-sheet-in absolute inset-x-0 bottom-0 rounded-t-[2rem] bg-ivory p-6 pb-safe shadow-lift">
            <div className="flex items-center justify-between">
              <p className="font-display text-2xl font-medium">Filtros</p>
              <button
                type="button"
                onClick={() => setSheetOpen(false)}
                aria-label="Cerrar"
                className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-sand/60"
              >
                <X className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </div>

            <div className="mt-6 space-y-5">
              <div>
                <p className="mb-2 text-xs font-semibold tracking-[0.18em] text-taupe uppercase">Buscar</p>
                {searchInput}
              </div>
              <div>
                <p className="mb-2 text-xs font-semibold tracking-[0.18em] text-taupe uppercase">Material</p>
                {materialSelect}
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <button
                type="button"
                onClick={clearAll}
                className="h-13 flex-1 rounded-full border border-line py-4 text-sm font-semibold tracking-[0.14em] uppercase active:scale-[0.97]"
              >
                Limpiar
              </button>
              <button
                type="button"
                onClick={() => setSheetOpen(false)}
                className="h-13 flex-[2] rounded-full bg-ink py-4 text-sm font-semibold tracking-[0.14em] text-ivory uppercase active:scale-[0.97]"
              >
                Ver {resultCount} {resultCount === 1 ? "pieza" : "piezas"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
