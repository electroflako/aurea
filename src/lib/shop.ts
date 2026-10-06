export type SortKey = "destacados" | "precio-asc" | "precio-desc" | "novedades";

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "destacados", label: "Destacados" },
  { value: "novedades", label: "Novedades" },
  { value: "precio-asc", label: "Precio: menor a mayor" },
  { value: "precio-desc", label: "Precio: mayor a menor" },
];

export function normalizeSort(value: string): SortKey {
  return SORT_OPTIONS.some((o) => o.value === value) ? (value as SortKey) : "destacados";
}
