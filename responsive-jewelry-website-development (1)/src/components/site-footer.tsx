import Link from "next/link";
import { AtSign, Gem, Mail, MapPin, Phone } from "lucide-react";

const SHOP_LINKS = [
  { href: "/tienda", label: "Todas las piezas" },
  { href: "/tienda?categoria=anillos", label: "Anillos" },
  { href: "/tienda?categoria=collares", label: "Collares" },
  { href: "/tienda?categoria=pendientes", label: "Pendientes" },
  { href: "/tienda?categoria=pulseras", label: "Pulseras" },
];

const HELP_LINKS = [
  { href: "/#taller", label: "Nuestro taller" },
  { href: "/#compromiso", label: "Materiales y cuidados" },
  { href: "/tienda", label: "Envíos y devoluciones" },
  { href: "/tienda", label: "Guía de tallas" },
];

export function SiteFooter() {
  return (
    <footer id="contacto" className="relative overflow-hidden bg-ink text-ivory grain">
      <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 md:py-20 lg:px-10">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          {/* Marca */}
          <div>
            <p className="font-display text-3xl font-semibold tracking-[0.28em]">AUREA</p>
            <p className="mt-4 max-w-[30ch] text-sm leading-relaxed text-ivory/60">
              Joyería artesanal forjada a mano en Madrid desde 2016. Oro vermeil de 18 k, plata
              reciclada y piedras con historia.
            </p>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex h-11 w-11 items-center justify-center rounded-full border border-ivory/20 text-ivory/80 transition-colors hover:border-gold hover:text-gold-light"
              aria-label="Instagram de AUREA"
            >
              <AtSign className="h-5 w-5" strokeWidth={1.5} />
            </a>
          </div>

          {/* Tienda */}
          <nav aria-label="Tienda">
            <p className="text-xs font-semibold tracking-[0.2em] text-gold-light uppercase">Tienda</p>
            <ul className="mt-5 space-y-3">
              {SHOP_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="gold-underline text-sm text-ivory/70 transition-colors hover:text-ivory"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Ayuda */}
          <nav aria-label="Ayuda">
            <p className="text-xs font-semibold tracking-[0.2em] text-gold-light uppercase">Ayuda</p>
            <ul className="mt-5 space-y-3">
              {HELP_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="gold-underline text-sm text-ivory/70 transition-colors hover:text-ivory"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contacto */}
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-gold-light uppercase">
              Atelier & Showroom
            </p>
            <ul className="mt-5 space-y-4 text-sm text-ivory/70">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" strokeWidth={1.5} />
                Calle del Barquillo 21, bajo
                <br />
                28004 Madrid
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-gold" strokeWidth={1.5} />
                <a href="tel:+34910000000" className="hover:text-ivory">+34 910 000 000</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-gold" strokeWidth={1.5} />
                <a href="mailto:hola@aurea.es" className="hover:text-ivory">hola@aurea.es</a>
              </li>
              <li className="flex items-center gap-3">
                <Gem className="h-4 w-4 shrink-0 text-gold" strokeWidth={1.5} />
                Visitas con cita previa
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-ivory/10 pt-7 text-[11px] tracking-wide text-ivory/45 sm:flex-row">
          <p>© {new Date().getFullYear()} AUREA Joyería. Todos los derechos reservados.</p>
          <p className="tracking-[0.18em] uppercase">Visa · Mastercard · PayPal · Bizum</p>
        </div>
      </div>
    </footer>
  );
}
