import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Gem, Gift, Recycle, ShieldCheck, Sparkles, Star, Truck } from "lucide-react";
import { getCategories, getFeaturedProducts } from "@/lib/data";
import { ProductCard } from "@/components/product-card";
import { Reveal } from "@/components/reveal";
import { NewsletterForm } from "@/components/newsletter-form";

export const dynamic = "force-dynamic";

const px = (id: number, w = 1000, h = 1250) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=${w}&h=${h}`;

const MARQUEE_ITEMS = [
  "Oro vermeil de 18 k",
  "Plata 925 reciclada",
  "Hecho a mano en Madrid",
  "Envuelto para regalo",
  "Envío gratuito desde 150 €",
  "Garantía de 2 años",
];

const VALUES = [
  { icon: Gem, title: "Materiales nobles", text: "Oro vermeil de 18 k y plata 925 reciclada, trazable pieza a pieza." },
  { icon: Recycle, title: "Producción consciente", text: "Series cortas y bajo pedido. Cero stock desperdiciado." },
  { icon: Truck, title: "Envío 24-48 h", text: "Península en 24-48 h. Gratuito a partir de 150 €." },
  { icon: Gift, title: "Listo para regalo", text: "Estuche de algodón y tarjeta manuscrita incluidos siempre." },
];

const TESTIMONIALS = [
  {
    quote: "El collar de perla barroca es más bonito en persona que en las fotos. Se nota la mano del artesano en cada detalle.",
    name: "Lucía M.",
    city: "Barcelona",
  },
  {
    quote: "Pedí los aros un lunes por la mañana y el martes ya los llevaba puestos. El packaging es una experiencia en sí mismo.",
    name: "Carmen R.",
    city: "Valencia",
  },
  {
    quote: "Grabaron nuestras iniciales en el anillo de compromiso. Un trato cercano y una pieza que llevaremos toda la vida.",
    name: "Andrea y Pablo",
    city: "Madrid",
  },
];

const LOOKBOOK = [
  { id: 8637403, alt: "Retrato con pulsera de eslabones dorados" },
  { id: 35274507, alt: "Estilismo editorial con joyería dorada" },
  { id: 10681031, alt: "Retrato con perlas y joyería" },
  { id: 20858959, alt: "Vitrina con piezas de la colección" },
];

export default async function HomePage() {
  const [categories, featured] = await Promise.all([getCategories(), getFeaturedProducts(8)]);

  return (
    <div className="overflow-x-clip">
      {/* ============ HERO ============ */}
      <section className="relative bg-ivory md:min-h-[100svh]">
        {/* Imagen editorial: dos piezas sobre travertino */}
        <div className="relative h-[56svh] min-h-[360px] overflow-hidden md:absolute md:inset-0 md:h-full md:min-h-0">
          <Image
            src="/images/hero.jpg"
            alt="Collar de oro con perla barroca y anillo de oro fino sobre piedra travertino"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center md:object-[50%_70%]"
          />
          {/* Fundido suave hacia el contenido (móvil) y veladura lateral (escritorio) */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ivory to-transparent md:hidden" />
          <div className="absolute inset-0 hidden bg-gradient-to-r from-ivory/90 via-ivory/40 to-transparent md:block" />
        </div>

        {/* Contenido */}
        <div className="relative mx-auto flex w-full max-w-7xl px-5 sm:px-8 md:min-h-[100svh] md:items-center lg:px-10">
          <div className="max-w-xl pt-2 pb-14 md:py-44">
            <Reveal>
              <p className="flex items-center gap-3 text-[11px] font-semibold tracking-[0.3em] text-gold-strong uppercase">
                <span className="h-px w-10 bg-gold-strong/60" />
                Joyería artesanal · Madrid
              </p>
            </Reveal>
            <Reveal delay={120}>
              <h1 className="text-balance mt-6 max-w-[12ch] font-display text-[13.5vw] leading-[0.98] font-light tracking-tight text-ink sm:text-7xl lg:text-[88px]">
                La luz que llevas dentro, <em className="font-normal text-gold-strong italic">hecha joya</em>
              </h1>
            </Reveal>
            <Reveal delay={240}>
              <p className="mt-6 max-w-[46ch] text-[15px] leading-relaxed text-espresso/75 sm:text-base">
                Piezas de oro vermeil y plata reciclada forjadas a mano en nuestro taller. Series
                cortas, oficio lento y brillo que dura.
              </p>
            </Reveal>
            <Reveal delay={360}>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  href="/tienda"
                  className="group flex h-14 items-center justify-center gap-3 rounded-full bg-ink px-9 text-sm font-semibold tracking-[0.16em] text-ivory uppercase transition-all hover:bg-espresso active:scale-[0.97]"
                >
                  Descubrir la colección
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={2} />
                </Link>
                <a
                  href="#taller"
                  className="flex h-14 items-center justify-center gap-3 rounded-full border border-ink/20 px-9 text-sm font-semibold tracking-[0.16em] text-ink uppercase transition-colors hover:border-ink hover:bg-ink hover:text-ivory active:scale-[0.97]"
                >
                  Conocer el taller
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============ MARQUESINA ============ */}
      <div className="overflow-hidden border-b border-line bg-cream py-4" aria-hidden>
        <div className="animate-marquee flex w-max items-center gap-8 whitespace-nowrap">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i} className="flex items-center gap-8 text-[11px] font-semibold tracking-[0.24em] text-espresso/80 uppercase">
              <Sparkles className="h-3.5 w-3.5 text-gold" strokeWidth={1.5} />
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ============ CATEGORÍAS ============ */}
      <section className="mx-auto max-w-7xl px-5 pt-20 sm:px-8 md:pt-28 lg:px-10">
        <Reveal className="flex items-end justify-between gap-6">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.3em] text-gold-strong uppercase">Colecciones</p>
            <h2 className="mt-3 font-display text-4xl leading-tight font-light sm:text-5xl">
              Elige tu <em className="text-gold-strong italic">capítulo</em>
            </h2>
          </div>
          <Link
            href="/tienda"
            className="gold-underline hidden shrink-0 items-center gap-2 text-xs font-semibold tracking-[0.18em] uppercase sm:flex"
          >
            Ver todo <ArrowUpRight className="h-4 w-4" strokeWidth={1.8} />
          </Link>
        </Reveal>

        <div className="snap-row no-scrollbar -mx-5 mt-10 flex gap-4 overflow-x-auto px-5 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4">
          {categories.map((cat, i) => (
            <Reveal key={cat.slug} delay={i * 90} className="w-[68vw] shrink-0 sm:w-auto">
              <Link
                href={`/tienda?categoria=${cat.slug}`}
                className="group relative block aspect-[3/4] overflow-hidden rounded-3xl bg-espresso shadow-card"
              >
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 640px) 68vw, (max-width: 1024px) 46vw, 23vw"
                  className="object-cover opacity-90 transition-all duration-700 ease-out group-hover:scale-[1.07] group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <p className="text-[10px] font-semibold tracking-[0.24em] text-gold-light uppercase">{cat.tagline}</p>
                  <p className="mt-1.5 flex items-center justify-between font-display text-2xl font-medium text-ivory">
                    {cat.name}
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-ivory/30 transition-all group-hover:border-gold group-hover:bg-gold">
                      <ArrowUpRight className="h-4 w-4" strokeWidth={1.8} />
                    </span>
                  </p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============ MÁS VENDIDOS ============ */}
      <section className="mx-auto max-w-7xl px-5 pt-20 sm:px-8 md:pt-28 lg:px-10">
        <Reveal className="flex items-end justify-between gap-6">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.3em] text-gold-strong uppercase">Favoritas</p>
            <h2 className="mt-3 font-display text-4xl leading-tight font-light sm:text-5xl">
              Las que <em className="text-gold-strong italic">vuelan</em> del taller
            </h2>
          </div>
          <Link
            href="/tienda"
            className="gold-underline hidden shrink-0 items-center gap-2 text-xs font-semibold tracking-[0.18em] uppercase sm:flex"
          >
            Ver tienda <ArrowUpRight className="h-4 w-4" strokeWidth={1.8} />
          </Link>
        </Reveal>

        <div className="snap-row no-scrollbar -mx-5 mt-10 flex gap-5 overflow-x-auto px-5 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4">
          {featured.map((product, i) => (
            <div key={product.slug} className="w-[62vw] shrink-0 sm:w-auto">
              <ProductCard product={product} priority={i < 2} />
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-center sm:hidden">
          <Link
            href="/tienda"
            className="flex h-13 items-center justify-center gap-2 rounded-full border border-ink/20 px-8 py-4 text-xs font-semibold tracking-[0.18em] uppercase active:scale-[0.97]"
          >
            Ver toda la tienda <ArrowRight className="h-4 w-4" strokeWidth={1.8} />
          </Link>
        </div>
      </section>

      {/* ============ EDITORIAL COLECCIÓN ============ */}
      <section className="mx-auto max-w-7xl px-5 pt-20 sm:px-8 md:pt-28 lg:px-10">
        <Reveal>
          <Link
            href="/tienda?orden=novedades"
            className="group relative block overflow-hidden rounded-[2rem] bg-ink shadow-lift"
          >
            <div className="relative aspect-[16/10] sm:aspect-[21/9]">
              <Image
                src={px(10293700, 1800, 1200)}
                alt="Colección Éclat — retrato editorial con velo y joyería dorada"
                fill
                sizes="(max-width: 768px) 100vw, 1280px"
                className="object-cover opacity-75 transition-transform duration-[1.6s] ease-out group-hover:scale-[1.05]"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/30 to-transparent" />
            </div>
            <div className="absolute inset-0 flex flex-col justify-center p-7 sm:p-14">
              <p className="text-[11px] font-semibold tracking-[0.3em] text-gold-light uppercase">Nueva colección</p>
              <h3 className="mt-3 font-display text-5xl font-light text-ivory italic sm:text-7xl">Éclat</h3>
              <p className="mt-4 max-w-[34ch] text-sm leading-relaxed text-ivory/75 sm:text-base">
                Piezas de declaración inspiradas en la hora dorada. Edición limitada, numerada a mano.
              </p>
              <span className="mt-7 inline-flex w-fit items-center gap-3 rounded-full border border-ivory/40 px-6 py-3.5 text-xs font-semibold tracking-[0.18em] text-ivory uppercase transition-all group-hover:border-gold group-hover:bg-gold group-hover:text-ink">
                Explorar Éclat <ArrowRight className="h-4 w-4" strokeWidth={2} />
              </span>
            </div>
          </Link>
        </Reveal>
      </section>

      {/* ============ TALLER ============ */}
      <section id="taller" className="relative mt-20 bg-espresso text-ivory grain md:mt-28">
        <div className="relative mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-8 md:grid-cols-2 md:items-center md:py-28 lg:px-10">
          <div className="relative">
            <Reveal className="relative aspect-[4/5] overflow-hidden rounded-[2rem] sm:aspect-[5/5.4]">
              <Image
                src={px(7167020, 1000, 1200)}
                alt="Artesana trabajando un anillo en el taller"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </Reveal>
            <Reveal
              delay={200}
              className="absolute -right-4 -bottom-8 hidden w-44 overflow-hidden rounded-2xl border-4 border-espresso shadow-lift sm:block md:-right-8 md:w-56"
            >
              <div className="relative aspect-[3/4]">
                <Image
                  src={px(38239304, 600, 800)}
                  alt="Detalle de manos engastando una pieza bajo luz cálida"
                  fill
                  sizes="224px"
                  className="object-cover"
                />
              </div>
            </Reveal>
          </div>

          <div>
            <Reveal>
              <p className="text-[11px] font-semibold tracking-[0.3em] text-gold-light uppercase">El taller</p>
              <h2 className="mt-4 font-display text-4xl leading-tight font-light sm:text-5xl">
                Oficio lento,
                <br />
                brillo <em className="text-gold-light italic">eterno</em>
              </h2>
              <p className="mt-5 max-w-[52ch] text-[15px] leading-relaxed text-ivory/70">
                Cada pieza nace sobre el banco de trabajo: se dibuja, se funde, se lima y se pule a
                mano. Sin moldes industriales, sin prisas. Por eso no hay dos exactamente iguales.
              </p>
            </Reveal>

            <ol className="mt-9 space-y-6">
              {[
                { n: "01", t: "Dibujo y modelo", d: "Cada diseño empieza a lápiz y se esculpe en cera." },
                { n: "02", t: "Fundición", d: "Plata reciclada fundida a la cera perdida, pieza a pieza." },
                { n: "03", t: "Engaste y baño", d: "Piedras engastadas a mano y baño de oro de 18 k." },
                { n: "04", t: "Pulido final", d: "Acabado espejo y control de calidad antes del estuche." },
              ].map((step, i) => (
                <Reveal as="li" key={step.n} delay={i * 100} className="flex gap-5 border-b border-ivory/10 pb-6">
                  <span className="font-display text-lg text-gold-light italic">{step.n}</span>
                  <div>
                    <p className="font-semibold tracking-wide">{step.t}</p>
                    <p className="mt-1 text-sm text-ivory/60">{step.d}</p>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ============ COMPROMISO ============ */}
      <section id="compromiso" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 md:py-28 lg:px-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((value, i) => (
            <Reveal
              key={value.title}
              delay={i * 90}
              className="group rounded-3xl border border-line bg-white/50 p-7 transition-all duration-500 hover:-translate-y-1.5 hover:border-gold/50 hover:shadow-card"
            >
              <span className="flex h-13 w-13 items-center justify-center rounded-full bg-cream transition-colors group-hover:bg-gold/15">
                <value.icon className="h-6 w-6 text-gold-strong" strokeWidth={1.4} />
              </span>
              <p className="mt-5 font-display text-xl font-medium">{value.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-taupe">{value.text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============ TESTIMONIOS ============ */}
      <section className="border-y border-line bg-cream/70">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 md:py-24 lg:px-10">
          <Reveal className="mx-auto max-w-xl text-center">
            <p className="text-[11px] font-semibold tracking-[0.3em] text-gold-strong uppercase">Testimonios</p>
            <h2 className="mt-3 font-display text-4xl leading-tight font-light sm:text-5xl">
              Historias que <em className="text-gold-strong italic">brillan</em>
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={t.name} delay={i * 110} as="figure" className="flex flex-col rounded-3xl bg-ivory p-7 shadow-card">
                <div className="flex gap-1" aria-label="5 de 5 estrellas">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} className="h-4 w-4 fill-gold text-gold" strokeWidth={1} />
                  ))}
                </div>
                <blockquote className="mt-5 flex-1 font-display text-lg leading-relaxed font-light text-espresso italic">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-6 text-xs font-semibold tracking-[0.18em] text-taupe uppercase">
                  {t.name} · {t.city}
                </figcaption>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ LOOKBOOK ============ */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 md:py-28 lg:px-10">
        <Reveal className="flex items-end justify-between gap-6">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.3em] text-gold-strong uppercase">Lookbook</p>
            <h2 className="mt-3 font-display text-4xl leading-tight font-light sm:text-5xl">
              AUREA <em className="text-gold-strong italic">puesto</em>
            </h2>
          </div>
          <p className="hidden max-w-[24ch] text-right text-sm text-taupe sm:block">
            Piezas reales en piel real. Sin retoques que escondan la luz.
          </p>
        </Reveal>
        <div className="snap-row no-scrollbar -mx-5 mt-10 flex gap-4 overflow-x-auto px-5 pb-2 sm:mx-0 sm:grid sm:grid-cols-4 sm:overflow-visible sm:px-0">
          {LOOKBOOK.map((shot, i) => (
            <Reveal key={shot.id} delay={i * 90} className="w-[58vw] shrink-0 sm:w-auto">
              <Link
                href="/tienda"
                className="group relative block aspect-[3/4] overflow-hidden rounded-3xl bg-cream"
                aria-label="Ver piezas en la tienda"
              >
                <Image
                  src={px(shot.id, 800, 1067)}
                  alt={shot.alt}
                  fill
                  sizes="(max-width: 640px) 58vw, 23vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                />
                <span className="absolute right-3 bottom-3 flex h-10 w-10 items-center justify-center rounded-full bg-ivory/85 opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
                  <ArrowUpRight className="h-4 w-4 text-ink" strokeWidth={1.8} />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============ NEWSLETTER ============ */}
      <section className="relative overflow-hidden bg-ink text-ivory grain">
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 py-20 sm:px-8 md:grid-cols-2 md:py-24 lg:px-10">
          <div>
            <Reveal>
              <p className="flex items-center gap-3 text-[11px] font-semibold tracking-[0.3em] text-gold-light uppercase">
                <ShieldCheck className="h-4 w-4" strokeWidth={1.5} /> Círculo AUREA
              </p>
              <h2 className="mt-4 font-display text-4xl leading-tight font-light sm:text-5xl">
                Entra antes que <em className="text-gold-light italic">nadie</em>
              </h2>
              <p className="mt-4 max-w-[46ch] text-[15px] leading-relaxed text-ivory/70">
                Acceso anticipado a colecciones, piezas únicas de taller y un 10 % en tu primer
                pedido. Solo cartas que merecen la pena, una al mes.
              </p>
            </Reveal>
            <Reveal delay={150} className="mt-8">
              <NewsletterForm />
            </Reveal>
          </div>
          <Reveal delay={200} className="relative hidden aspect-[4/3] overflow-hidden rounded-[2rem] md:block">
            <Image
              src={px(32283148, 1000, 750)}
              alt="Estuche de regalo AUREA con tarjeta de agradecimiento"
              fill
              sizes="50vw"
              className="object-cover"
            />
          </Reveal>
        </div>
      </section>
    </div>
  );
}
