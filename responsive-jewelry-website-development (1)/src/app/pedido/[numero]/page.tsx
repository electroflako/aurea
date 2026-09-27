import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CircleCheck, Mail, MapPin, Package, Truck } from "lucide-react";
import { getOrderByNumber } from "@/lib/data";
import { formatPrice } from "@/lib/format";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Pedido confirmado",
  robots: { index: false },
};

interface PedidoPageProps {
  params: Promise<{ numero: string }>;
}

export default async function PedidoPage({ params }: PedidoPageProps) {
  const { numero } = await params;
  const detail = await getOrderByNumber(numero);
  if (!detail) notFound();

  const { order, items } = detail;
  const fecha = new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(order.createdAt);

  return (
    <div className="mx-auto max-w-3xl px-5 pt-[calc(6.25rem+env(safe-area-inset-top))] pb-24 sm:px-8 md:pt-40">
      {/* Cabecera de confirmación */}
      <div className="flex flex-col items-center text-center">
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-gold/15">
          <CircleCheck className="h-10 w-10 text-gold-strong" strokeWidth={1.4} />
        </span>
        <p className="mt-6 text-[11px] font-semibold tracking-[0.3em] text-gold-strong uppercase">
          Pedido {order.number}
        </p>
        <h1 className="mt-3 font-display text-4xl leading-tight font-light sm:text-5xl">
          Gracias, <em className="text-gold-strong italic">{order.customerName.split(" ")[0]}</em>
        </h1>
        <p className="mt-4 max-w-[46ch] text-[15px] leading-relaxed text-taupe">
          Tu pedido está confirmado y ya estamos preparándolo en el taller. Te avisaremos por email
          cuando salga hacia ti.
        </p>
        <p className="mt-2 flex items-center gap-2 text-xs text-taupe">
          <Mail className="h-3.5 w-3.5" strokeWidth={1.6} /> Confirmación enviada a {order.email}
        </p>
      </div>

      {/* Resumen */}
      <div className="mt-12 rounded-3xl border border-line bg-white/60 p-6 shadow-card sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="font-display text-2xl font-medium">Resumen del pedido</p>
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3.5 py-1.5 text-xs font-semibold text-emerald-800">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            {order.status === "confirmado" ? "Confirmado" : order.status} · {fecha}
          </span>
        </div>

        <ul className="mt-6 divide-y divide-line">
          {items.map((item) => (
            <li key={item.id} className="flex items-center gap-4 py-4">
              <span className="relative h-18 w-14 shrink-0 overflow-hidden rounded-xl bg-cream">
                {item.image && (
                  <Image src={item.image} alt={item.name} fill sizes="56px" className="object-cover" />
                )}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{item.name}</p>
                <p className="text-xs text-taupe">Cantidad: {item.quantity}</p>
              </div>
              <p className="text-sm font-semibold whitespace-nowrap">
                {formatPrice(item.priceCents * item.quantity)}
              </p>
            </li>
          ))}
        </ul>

        <dl className="mt-4 space-y-2.5 border-t border-line pt-5 text-sm">
          <div className="flex justify-between">
            <dt className="text-taupe">Subtotal</dt>
            <dd>{formatPrice(order.subtotalCents)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-taupe">Envío</dt>
            <dd>{order.shippingCents === 0 ? "Gratis" : formatPrice(order.shippingCents)}</dd>
          </div>
          <div className="flex items-baseline justify-between border-t border-line pt-3">
            <dt className="font-semibold">Total pagado</dt>
            <dd className="font-display text-3xl font-semibold">{formatPrice(order.totalCents)}</dd>
          </div>
        </dl>
      </div>

      {/* Envío */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-3xl border border-line bg-white/50 p-6">
          <p className="flex items-center gap-2.5 text-xs font-semibold tracking-[0.16em] text-taupe uppercase">
            <MapPin className="h-4 w-4 text-gold-strong" strokeWidth={1.6} /> Dirección de entrega
          </p>
          <p className="mt-3 text-sm leading-relaxed">
            {order.customerName}
            <br />
            {order.address}
            <br />
            {order.postalCode} {order.city}
            <br />
            {order.country}
          </p>
          {order.notes && (
            <p className="mt-3 rounded-xl bg-cream px-4 py-3 text-xs leading-relaxed text-espresso/80 italic">
              “{order.notes}”
            </p>
          )}
        </div>
        <div className="rounded-3xl border border-line bg-white/50 p-6">
          <p className="flex items-center gap-2.5 text-xs font-semibold tracking-[0.16em] text-taupe uppercase">
            <Truck className="h-4 w-4 text-gold-strong" strokeWidth={1.6} /> Entrega estimada
          </p>
          <p className="mt-3 text-sm leading-relaxed">
            Preparación en 24 h laborables y entrega en 24-48 h en Península. Recibirás el número de
            seguimiento por email.
          </p>
          <p className="mt-4 flex items-center gap-2 rounded-xl bg-cream px-4 py-3 text-xs font-medium text-espresso/80">
            <Package className="h-4 w-4 shrink-0 text-gold-strong" strokeWidth={1.6} />
            Tu pedido viaja en estuche de regalo, sin coste adicional.
          </p>
        </div>
      </div>

      <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <Link
          href="/tienda"
          className="flex h-14 w-full items-center justify-center rounded-full bg-ink px-10 text-xs font-semibold tracking-[0.16em] text-ivory uppercase transition-transform active:scale-[0.97] sm:w-auto"
        >
          Volver a la tienda
        </Link>
        <Link
          href="/"
          className="flex h-14 w-full items-center justify-center rounded-full border border-line px-10 text-xs font-semibold tracking-[0.16em] uppercase transition-colors hover:border-gold active:scale-[0.97] sm:w-auto"
        >
          Ir al inicio
        </Link>
      </div>
    </div>
  );
}
