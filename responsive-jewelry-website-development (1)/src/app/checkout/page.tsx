"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, type FormEvent } from "react";
import { ArrowLeft, CircleAlert, CreditCard, Lock, MapPin, ShoppingBag, Truck, User } from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { FREE_SHIPPING_THRESHOLD_CENTS, formatPrice, shippingFor } from "@/lib/format";

const INPUT_CLASS =
  "h-14 w-full rounded-2xl border border-line bg-white/70 px-5 text-[15px] focus:border-gold focus:ring-2 focus:ring-gold/30 focus:outline-none";

type Status = "idle" | "loading" | "error";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotalCents, clearCart, hydrated } = useCart();
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  const shippingCents = useMemo(() => shippingFor(subtotalCents), [subtotalCents]);
  const totalCents = subtotalCents + shippingCents;
  const remainingForFree = FREE_SHIPPING_THRESHOLD_CENTS - subtotalCents;

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "loading" || items.length === 0) return;
    setStatus("loading");
    setError("");

    const form = new FormData(e.currentTarget);
    const payload = {
      customer: {
        name: form.get("name"),
        email: form.get("email"),
        phone: form.get("phone"),
        address: form.get("address"),
        city: form.get("city"),
        postalCode: form.get("postalCode"),
        country: form.get("country"),
        notes: form.get("notes"),
      },
      items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
    };

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as { ok: boolean; number?: string; message?: string };
      if (!res.ok || !data.ok || !data.number) {
        setStatus("error");
        setError(data.message ?? "No hemos podido completar el pedido.");
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      clearCart();
      router.push(`/pedido/${data.number}`);
    } catch {
      setStatus("error");
      setError("Error de conexión. Comprueba tu red e inténtalo de nuevo.");
    }
  }

  /* ---- Estados de carga / bolsa vacía ---- */
  if (!hydrated) {
    return (
      <div className="mx-auto max-w-3xl px-5 pt-40 pb-24 sm:px-8">
        <div className="h-10 w-48 animate-soft-pulse rounded-2xl bg-sand" />
        <div className="mt-8 space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-14 animate-soft-pulse rounded-2xl bg-sand" style={{ animationDelay: `${i * 100}ms` }} />
          ))}
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-5 pt-44 pb-28 text-center">
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-cream">
          <ShoppingBag className="h-8 w-8 text-taupe" strokeWidth={1.2} />
        </span>
        <h1 className="mt-6 font-display text-3xl font-light italic">Tu bolsa está vacía</h1>
        <p className="mt-3 text-sm text-taupe">Añade alguna pieza antes de finalizar la compra.</p>
        <Link
          href="/tienda"
          className="mt-8 flex h-13 items-center rounded-full bg-ink px-9 text-xs font-semibold tracking-[0.16em] text-ivory uppercase active:scale-95"
        >
          Volver a la tienda
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-5 pt-[calc(6.25rem+env(safe-area-inset-top))] pb-24 sm:px-8 md:pt-40 lg:px-10">
      <Link href="/tienda" className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.16em] text-taupe uppercase hover:text-ink">
        <ArrowLeft className="h-4 w-4" strokeWidth={1.8} /> Seguir comprando
      </Link>
      <h1 className="mt-4 font-display text-4xl font-light sm:text-5xl">
        Finalizar <em className="text-gold-strong italic">compra</em>
      </h1>

      {status === "error" && error && (
        <div role="alert" className="mt-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-800">
          <CircleAlert className="mt-0.5 h-5 w-5 shrink-0" strokeWidth={1.6} />
          {error}
        </div>
      )}

      <form onSubmit={onSubmit} className="mt-10 grid items-start gap-12 lg:grid-cols-[1.5fr_1fr]">
        {/* ============ Formulario ============ */}
        <div className="space-y-10">
          <fieldset>
            <legend className="flex items-center gap-3 font-display text-2xl font-medium">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-cream">
                <User className="h-5 w-5 text-gold-strong" strokeWidth={1.5} />
              </span>
              Datos de contacto
            </legend>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <span className="mb-1.5 block text-xs font-semibold tracking-[0.14em] text-taupe uppercase">Nombre y apellidos *</span>
                <input name="name" required minLength={2} autoComplete="name" placeholder="María García López" className={INPUT_CLASS} />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold tracking-[0.14em] text-taupe uppercase">Email *</span>
                <input name="email" type="email" required inputMode="email" autoComplete="email" placeholder="maria@email.com" className={INPUT_CLASS} />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold tracking-[0.14em] text-taupe uppercase">Teléfono *</span>
                <input name="phone" type="tel" required inputMode="tel" autoComplete="tel" placeholder="+34 600 000 000" className={INPUT_CLASS} />
              </label>
            </div>
          </fieldset>

          <fieldset>
            <legend className="flex items-center gap-3 font-display text-2xl font-medium">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-cream">
                <MapPin className="h-5 w-5 text-gold-strong" strokeWidth={1.5} />
              </span>
              Dirección de envío
            </legend>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <span className="mb-1.5 block text-xs font-semibold tracking-[0.14em] text-taupe uppercase">Calle, número, piso *</span>
                <input name="address" required minLength={4} autoComplete="street-address" placeholder="Calle Mayor 12, 3ºA" className={INPUT_CLASS} />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold tracking-[0.14em] text-taupe uppercase">Ciudad *</span>
                <input name="city" required minLength={2} autoComplete="address-level2" placeholder="Madrid" className={INPUT_CLASS} />
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold tracking-[0.14em] text-taupe uppercase">C. postal *</span>
                  <input name="postalCode" required minLength={4} maxLength={12} inputMode="numeric" autoComplete="postal-code" placeholder="28004" className={INPUT_CLASS} />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold tracking-[0.14em] text-taupe uppercase">País *</span>
                  <select name="country" required defaultValue="España" autoComplete="country-name" className={INPUT_CLASS}>
                    <option>España</option>
                    <option>Portugal</option>
                    <option>Andorra</option>
                    <option>Francia</option>
                    <option>Italia</option>
                    <option>Alemania</option>
                  </select>
                </label>
              </div>
              <label className="block sm:col-span-2">
                <span className="mb-1.5 block text-xs font-semibold tracking-[0.14em] text-taupe uppercase">
                  Notas <span className="normal-case opacity-60">(opcional · ej. es un regalo, dedicatoria…)</span>
                </span>
                <textarea name="notes" rows={3} maxLength={500} placeholder="Escribe aquí tu dedicatoria…" className={`${INPUT_CLASS} h-auto resize-none py-4`} />
              </label>
            </div>
          </fieldset>

          {/* Pago simulado */}
          <fieldset>
            <legend className="flex items-center gap-3 font-display text-2xl font-medium">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-cream">
                <CreditCard className="h-5 w-5 text-gold-strong" strokeWidth={1.5} />
              </span>
              Pago
            </legend>
            <div className="mt-6 rounded-2xl border border-gold/40 bg-gold/5 px-5 py-4 text-sm leading-relaxed text-espresso/80">
              <p className="flex items-center gap-2 font-semibold text-espresso">
                <Lock className="h-4 w-4 text-gold-strong" strokeWidth={1.8} />
                Entorno de demostración
              </p>
              <p className="mt-1.5">
                Esta tienda es una demo funcional: el pedido se registra de verdad en la base de
                datos, pero <strong>no se realizará ningún cargo</strong>. Al confirmar simularemos
                un pago con tarjeta correcto.
              </p>
            </div>
          </fieldset>
        </div>

        {/* ============ Resumen ============ */}
        <aside className="lg:sticky lg:top-36">
          <div className="rounded-3xl border border-line bg-white/60 p-6 shadow-card sm:p-7">
            <p className="font-display text-2xl font-medium">Tu pedido</p>

            <ul className="mt-5 max-h-72 space-y-4 overflow-y-auto pr-1">
              {items.map((item) => (
                <li key={item.productId} className="flex items-center gap-3.5">
                  <span className="relative h-16 w-13 shrink-0 overflow-hidden rounded-xl bg-cream">
                    <Image src={item.image} alt={item.name} fill sizes="52px" className="object-cover" />
                    <span className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-ink/85 text-[10px] font-bold text-ivory">
                      {item.quantity}
                    </span>
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{item.name}</p>
                    <p className="text-xs text-taupe">{item.material}</p>
                  </div>
                  <p className="text-sm font-semibold whitespace-nowrap">
                    {formatPrice(item.priceCents * item.quantity)}
                  </p>
                </li>
              ))}
            </ul>

            {remainingForFree > 0 && (
              <p className="mt-4 flex items-center gap-2 rounded-xl bg-cream px-4 py-3 text-xs text-espresso/80">
                <Truck className="h-4 w-4 shrink-0 text-gold-strong" strokeWidth={1.6} />
                Añade {formatPrice(remainingForFree)} más y el envío te sale gratis.
              </p>
            )}

            <dl className="mt-5 space-y-2.5 border-t border-line pt-5 text-sm">
              <div className="flex justify-between">
                <dt className="text-taupe">Subtotal</dt>
                <dd className="font-medium">{formatPrice(subtotalCents)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-taupe">Envío (24-48 h)</dt>
                <dd className="font-medium">
                  {shippingCents === 0 ? <span className="text-gold-strong">Gratis</span> : formatPrice(shippingCents)}
                </dd>
              </div>
              <div className="flex items-baseline justify-between border-t border-line pt-3">
                <dt className="font-semibold">Total</dt>
                <dd className="font-display text-3xl font-semibold">{formatPrice(totalCents)}</dd>
              </div>
              <p className="text-right text-[11px] text-taupe">Impuestos incluidos</p>
            </dl>

            <button
              type="submit"
              disabled={status === "loading"}
              className="mt-6 flex h-14 w-full items-center justify-center gap-3 rounded-full bg-ink text-sm font-semibold tracking-[0.16em] text-ivory uppercase transition-all hover:bg-espresso active:scale-[0.98] disabled:opacity-60"
            >
              {status === "loading" ? (
                <>Procesando pedido…</>
              ) : (
                <>
                  <Lock className="h-4 w-4" strokeWidth={1.8} /> Confirmar pedido
                </>
              )}
            </button>
            <p className="mt-3 text-center text-[11px] leading-relaxed text-taupe">
              Al confirmar aceptas nuestros términos. Devoluciones gratuitas hasta 30 días.
            </p>
          </div>
        </aside>
      </form>
    </div>
  );
}
