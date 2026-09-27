# AUREA — Tienda de joyería artesanal

E-commerce completo y funcional para una joyería: landing editorial, catálogo con
filtros, fichas de producto, carrito persistente, checkout real con pedidos en base de
datos y newsletter. Diseño **mobile-first** con navegación inferior, hoja de filtros y
barra de compra adhesiva.

## Stack

- **Next.js 16** (App Router, Server Components, Turbopack)
- **React 19** · **TypeScript** estricto
- **Tailwind CSS 4** (sistema de diseño por tokens)
- **PostgreSQL + Drizzle ORM** (productos, categorías, pedidos, suscriptores)
- **Lucide** (iconos)

## Desarrollo local

Requisitos: Node.js 20+ y una base de datos PostgreSQL accesible.

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp .env.example .env        # ajusta DATABASE_URL si es necesario

# 3. Crear las tablas
npx drizzle-kit push

# 4. Cargar el catálogo de ejemplo (12 piezas, 4 categorías)
npx tsx src/db/seed.ts

# 5. Arrancar
npm run dev                 # http://localhost:3000
```

Otros comandos: `npm run build` (build de producción), `npm start` (servir el build),
`npm run typecheck` (TypeScript), `npm run lint`.

## Subirlo a tu GitHub

```bash
git init -b main
git add .
git commit -m "AUREA — tienda de joyería (Next.js + Drizzle + PostgreSQL)"

# Crea un repo vacío en github.com (sin README ni .gitignore) y luego:
git remote add origin https://github.com/TU-USUARIO/aurea.git
git push -u origin main
```

> El `.gitignore` ya excluye `.env`, `node_modules` y `.next` — tus secretos no se suben.

## Despliegue en Vercel (recomendado)

1. **Base de datos**: crea una PostgreSQL gratuita en [Neon](https://neon.tech)
   (también vale Supabase, Railway o Vercel Postgres) y copia la cadena de conexión.
2. **Vercel**: `Import Project` → selecciona tu repo de GitHub (detecta Next.js solo).
3. **Variables de entorno** en el proyecto de Vercel:
   - `DATABASE_URL` → tu cadena de conexión de producción
   - `NEXT_PUBLIC_SITE_URL` → `https://tu-proyecto.vercel.app`
4. **Deploy**. Cada `git push` a `main` redesplegará automáticamente.
5. **Datos iniciales** (una sola vez, desde tu máquina):

```bash
DATABASE_URL="postgres://…tu-url-de-producción…" npx drizzle-kit push
DATABASE_URL="postgres://…tu-url-de-producción…" npx tsx src/db/seed.ts
```

## Estructura

```
src/
├── app/
│   ├── page.tsx                 # Landing (hero editorial, taller, lookbook…)
│   ├── tienda/                  # Catálogo con filtros por URL
│   ├── producto/[slug]/         # Ficha de producto (galería, stock, JSON-LD)
│   ├── checkout/                # Formulario de pedido
│   ├── pedido/[numero]/         # Confirmación del pedido
│   └── api/                     # checkout · newsletter · health
├── components/                  # Header, carrito, tarjetas, controles de tienda…
├── db/                          # schema.ts (Drizzle) · seed.ts
└── lib/                         # data.ts (queries) · format.ts · shop.ts
```

## Notas

- **Pagos**: el checkout es una demo funcional — registra pedidos reales y descuenta
  stock en transacción, pero no cobra. Para cobrar de verdad, integra Stripe Checkout
  o Redsys en `src/app/api/checkout/route.ts`.
- Las fotos de producto apuntan a Pexels (hotlink permitido) y el hero es una imagen
  propia en `public/images/hero.jpg`. Sustitúyelas por las tuyas editando `src/db/seed.ts`.
- Los precios se gestionan siempre en **céntimos** y se recalculan en el servidor.
