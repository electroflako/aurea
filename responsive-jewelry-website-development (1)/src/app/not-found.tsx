import Link from "next/link";
import { Gem } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[80svh] flex-col items-center justify-center px-6 pt-24 pb-20 text-center">
      <span className="flex h-20 w-20 items-center justify-center rounded-full bg-cream">
        <Gem className="h-9 w-9 text-gold-strong" strokeWidth={1.2} />
      </span>
      <p className="mt-8 font-display text-7xl font-light text-gold-strong italic sm:text-8xl">404</p>
      <h1 className="mt-4 font-display text-3xl font-light">Esta vitrina está vacía</h1>
      <p className="mt-3 max-w-[40ch] text-sm leading-relaxed text-taupe">
        La página que buscas se ha movido, se ha vendido o nunca existió. Pero el taller sigue
        lleno de piezas esperándote.
      </p>
      <div className="mt-9 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/tienda"
          className="flex h-13 items-center justify-center rounded-full bg-ink px-9 text-xs font-semibold tracking-[0.16em] text-ivory uppercase active:scale-95"
        >
          Explorar la tienda
        </Link>
        <Link
          href="/"
          className="flex h-13 items-center justify-center rounded-full border border-line px-9 text-xs font-semibold tracking-[0.16em] uppercase hover:border-gold active:scale-95"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
