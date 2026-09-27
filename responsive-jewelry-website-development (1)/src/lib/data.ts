import { and, desc, eq, ilike, ne, or, asc, type SQL } from "drizzle-orm";
import { db } from "@/db";
import { categories, orderItems, orders, products } from "@/db/schema";
import type { SortKey } from "@/lib/shop";

export type Category = typeof categories.$inferSelect;

export interface ProductCardData {
  id: number;
  name: string;
  slug: string;
  description: string;
  details: string;
  priceCents: number;
  compareAtCents: number | null;
  material: string;
  images: string[];
  stock: number;
  isFeatured: boolean;
  isNew: boolean;
  isBestseller: boolean;
  categorySlug: string;
  categoryName: string;
}

export type { SortKey } from "@/lib/shop";

function toCard(row: { product: typeof products.$inferSelect; category: Category | null }): ProductCardData {
  return {
    id: row.product.id,
    name: row.product.name,
    slug: row.product.slug,
    description: row.product.description,
    details: row.product.details,
    priceCents: row.product.priceCents,
    compareAtCents: row.product.compareAtCents,
    material: row.product.material,
    images: row.product.images,
    stock: row.product.stock,
    isFeatured: row.product.isFeatured,
    isNew: row.product.isNew,
    isBestseller: row.product.isBestseller,
    categorySlug: row.category?.slug ?? "",
    categoryName: row.category?.name ?? "",
  };
}

export async function getCategories(): Promise<Category[]> {
  return db.select().from(categories).orderBy(asc(categories.id));
}

export async function getProducts(opts: {
  categoria?: string;
  q?: string;
  material?: string;
  orden?: SortKey;
}): Promise<ProductCardData[]> {
  const conditions: SQL[] = [];

  if (opts.categoria) {
    conditions.push(eq(categories.slug, opts.categoria));
  }
  if (opts.q) {
    const pattern = `%${opts.q.trim()}%`;
    conditions.push(or(ilike(products.name, pattern), ilike(products.description, pattern))!);
  }
  if (opts.material) {
    conditions.push(eq(products.material, opts.material));
  }

  const orderBy =
    opts.orden === "precio-asc"
      ? [asc(products.priceCents)]
      : opts.orden === "precio-desc"
        ? [desc(products.priceCents)]
        : opts.orden === "novedades"
          ? [desc(products.createdAt), desc(products.id)]
          : [desc(products.isFeatured), desc(products.isBestseller), asc(products.id)];

  const rows = await db
    .select({ product: products, category: categories })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(...orderBy);

  return rows.map(toCard);
}

export async function getProductBySlug(slug: string): Promise<ProductCardData | null> {
  const rows = await db
    .select({ product: products, category: categories })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(eq(products.slug, slug))
    .limit(1);
  return rows[0] ? toCard(rows[0]) : null;
}

export async function getFeaturedProducts(limit = 8): Promise<ProductCardData[]> {
  const rows = await db
    .select({ product: products, category: categories })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(eq(products.isFeatured, true))
    .orderBy(desc(products.isBestseller), asc(products.id))
    .limit(limit);
  return rows.map(toCard);
}

export async function getRelatedProducts(slug: string, limit = 4): Promise<ProductCardData[]> {
  const current = await getProductBySlug(slug);
  if (!current) return [];
  const rows = await db
    .select({ product: products, category: categories })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(and(ne(products.slug, slug), eq(categories.slug, current.categorySlug)))
    .orderBy(desc(products.isFeatured), asc(products.id))
    .limit(limit);
  if (rows.length >= limit) return rows.map(toCard);

  const extra = await db
    .select({ product: products, category: categories })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(ne(products.slug, slug))
    .orderBy(desc(products.isFeatured), asc(products.id))
    .limit(limit);
  const merged = new Map<number, ProductCardData>();
  for (const row of [...rows, ...extra]) merged.set(row.product.id, toCard(row));
  merged.delete(current.id);
  return Array.from(merged.values()).slice(0, limit);
}

export async function getMaterials(): Promise<string[]> {
  const rows = await db.selectDistinct({ material: products.material }).from(products);
  return rows.map((r) => r.material).sort();
}

export interface OrderDetail {
  order: typeof orders.$inferSelect;
  items: (typeof orderItems.$inferSelect)[];
}

export async function getOrderByNumber(number: string): Promise<OrderDetail | null> {
  const [order] = await db.select().from(orders).where(eq(orders.number, number)).limit(1);
  if (!order) return null;
  const items = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, order.id))
    .orderBy(asc(orderItems.id));
  return { order, items };
}
