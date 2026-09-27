import { NextResponse } from "next/server";
import { and, eq, gte, inArray, sql } from "drizzle-orm";
import { randomBytes } from "node:crypto";
import { db } from "@/db";
import { orderItems, orders, products } from "@/db/schema";
import { shippingFor } from "@/lib/format";

export const dynamic = "force-dynamic";

interface IncomingItem {
  productId?: unknown;
  quantity?: unknown;
}

interface IncomingCustomer {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  address?: unknown;
  city?: unknown;
  postalCode?: unknown;
  country?: unknown;
  notes?: unknown;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function asString(value: unknown, max = 120): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  let body: { customer?: IncomingCustomer; items?: IncomingItem[] };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ ok: false, message: "Cuerpo de la petición inválido." }, { status: 400 });
  }

  // ---- Validación del cliente ----
  const c = body.customer ?? {};
  const customer = {
    name: asString(c.name),
    email: asString(c.email, 160).toLowerCase(),
    phone: asString(c.phone, 24),
    address: asString(c.address, 200),
    city: asString(c.city),
    postalCode: asString(c.postalCode, 12),
    country: asString(c.country, 60) || "España",
    notes: asString(c.notes, 500) || null,
  };

  if (
    customer.name.length < 2 ||
    !EMAIL_RE.test(customer.email) ||
    customer.phone.replace(/\D/g, "").length < 6 ||
    customer.address.length < 4 ||
    customer.city.length < 2 ||
    customer.postalCode.length < 4
  ) {
    return NextResponse.json(
      { ok: false, message: "Revisa los datos de envío: hay campos incompletos o inválidos." },
      { status: 422 },
    );
  }

  // ---- Validación de la bolsa ----
  const rawItems = Array.isArray(body.items) ? body.items.slice(0, 50) : [];
  const lines = rawItems
    .map((item) => ({
      productId: Number(item.productId),
      quantity: Math.floor(Number(item.quantity)),
    }))
    .filter((l) => Number.isInteger(l.productId) && l.productId > 0 && l.quantity >= 1 && l.quantity <= 20);

  if (lines.length === 0) {
    return NextResponse.json({ ok: false, message: "Tu bolsa está vacía." }, { status: 422 });
  }

  const ids = [...new Set(lines.map((l) => l.productId))];
  const dbProducts = await db.select().from(products).where(inArray(products.id, ids));
  const byId = new Map(dbProducts.map((p) => [p.id, p]));

  for (const line of lines) {
    const product = byId.get(line.productId);
    if (!product) {
      return NextResponse.json(
        { ok: false, message: "Alguna pieza ya no está disponible. Revisa tu bolsa." },
        { status: 409 },
      );
    }
    if (product.stock < line.quantity) {
      return NextResponse.json(
        {
          ok: false,
          message: `Solo quedan ${product.stock} unidades de “${product.name}”. Ajusta la cantidad.`,
        },
        { status: 409 },
      );
    }
  }

  // ---- Totales calculados SIEMPRE en servidor ----
  const subtotalCents = lines.reduce(
    (acc, l) => acc + byId.get(l.productId)!.priceCents * l.quantity,
    0,
  );
  const shippingCents = shippingFor(subtotalCents);
  const totalCents = subtotalCents + shippingCents;
  const number = `AUR-${randomBytes(3).toString("hex").toUpperCase()}`;

  try {
    await db.transaction(async (tx) => {
      const [order] = await tx
        .insert(orders)
        .values({
          number,
          customerName: customer.name,
          email: customer.email,
          phone: customer.phone,
          address: customer.address,
          city: customer.city,
          postalCode: customer.postalCode,
          country: customer.country,
          notes: customer.notes,
          subtotalCents,
          shippingCents,
          totalCents,
          status: "confirmado",
        })
        .returning({ id: orders.id });

      await tx.insert(orderItems).values(
        lines.map((l) => {
          const p = byId.get(l.productId)!;
          return {
            orderId: order.id,
            productId: p.id,
            name: p.name,
            image: p.images[0] ?? "",
            priceCents: p.priceCents,
            quantity: l.quantity,
          };
        }),
      );

      for (const line of lines) {
        const updated = await tx
          .update(products)
          .set({ stock: sql`${products.stock} - ${line.quantity}` })
          .where(and(eq(products.id, line.productId), gte(products.stock, line.quantity)))
          .returning({ id: products.id });
        if (updated.length === 0) {
          throw new Error(`STOCK:${line.productId}`);
        }
      }
    });
  } catch (error) {
    console.error("Error creando el pedido:", error);
    return NextResponse.json(
      { ok: false, message: "No hemos podido completar el pedido. Inténtalo de nuevo." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true, number, totalCents });
}
