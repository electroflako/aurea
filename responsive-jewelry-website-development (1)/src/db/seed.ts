import "dotenv/config";
import { db } from "./index";
import { categories, newsletterSubscribers, orderItems, orders, products } from "./schema";

const px = (id: number, w = 1000, h = 1250) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=${w}&h=${h}`;

const pxWide = (id: number, w = 1400, h = 1000) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=${w}&h=${h}`;

async function seed() {
  console.log("Limpiando tablas…");
  await db.delete(orderItems);
  await db.delete(orders);
  await db.delete(products);
  await db.delete(categories);
  await db.delete(newsletterSubscribers);

  console.log("Insertando categorías…");
  const [anillos, collares, pendientes, pulseras] = await db
    .insert(categories)
    .values([
      {
        name: "Anillos",
        slug: "anillos",
        tagline: "Promesas talladas a mano",
        image: px(30541171, 900, 1200),
      },
      {
        name: "Collares",
        slug: "collares",
        tagline: "Luz que cae sobre la piel",
        image: px(19869445, 900, 1200),
      },
      {
        name: "Pendientes",
        slug: "pendientes",
        tagline: "Destellos en movimiento",
        image: px(32797485, 900, 1200),
      },
      {
        name: "Pulseras",
        slug: "pulseras",
        tagline: "Gestos que abrazan la muñeca",
        image: px(34399150, 900, 1200),
      },
    ])
    .returning();

  console.log("Insertando productos…");
  await db.insert(products).values([
    {
      name: "Anillo Aurora",
      slug: "anillo-aurora",
      description:
        "Un destello de primera hora de la mañana. Solitario de oro vermeil de 18 k con piedra central tallada a mano y engaste en cesta baja para llevar a diario.",
      details:
        "Oro vermeil de 18 k sobre plata 925 reciclada · Piedra central de circonita talla brillante · Engaste artesanal · Hipoalergénico, sin níquel · Entregado en estuche de regalo.",
      priceCents: 18900,
      compareAtCents: 24000,
      categoryId: anillos.id,
      material: "Oro vermeil 18k",
      images: [px(30541171), px(30541177)],
      stock: 12,
      isFeatured: true,
      isBestseller: true,
    },
    {
      name: "Anillo Serena Perla",
      slug: "anillo-serena-perla",
      description:
        "Una perla cultivada de agua dulce suspendida sobre un aro orgánico de líneas suaves. Serenidad absoluta en una pieza mínima.",
      details:
        "Plata 925 con baño de oro de 18 k · Perla cultivada de agua dulce de 6 mm · Aro forjado a mano, cada pieza es única · Sin níquel.",
      priceCents: 14500,
      categoryId: anillos.id,
      material: "Plata 925 baño oro",
      images: [px(16689783), px(19525066)],
      stock: 8,
      isFeatured: true,
      isNew: true,
    },
    {
      name: "Anillo Ébano",
      slug: "anillo-ebano",
      description:
        "Carácter gráfico y textura martilleada. Un anillo escultórico en plata con acento de oro que dialoga con la sombra.",
      details:
        "Plata 925 texturizada a martillo · Acento en oro de 18 k · Acabado mate pulido a mano.",
      priceCents: 9800,
      categoryId: anillos.id,
      material: "Plata 925 y oro 18k",
      images: [px(16274872)],
      stock: 15,
    },
    {
      name: "Collar Flor de Lino",
      slug: "collar-flor-de-lino",
      description:
        "Cadena fina con colgante floral modelado a mano. La delicadeza de un pétalo suspendida a la altura del corazón.",
      details:
        "Oro vermeil de 18 k sobre plata 925 · Cadena de 40 cm + extensor de 5 cm · Colgante modelado a mano · Cierre de mosquetón.",
      priceCents: 16500,
      categoryId: collares.id,
      material: "Oro vermeil 18k",
      images: [px(27357168)],
      stock: 10,
      isFeatured: true,
      isNew: true,
    },
    {
      name: "Collar Perla Barroca",
      slug: "collar-perla-barroca",
      description:
        "Perla barroca de formas imposibles sobre cadena de oro. Cada perla es distinta: ningún collar se repite jamás.",
      details:
        "Cadena de oro vermeil de 18 k · Perla barroca natural de 10-12 mm · Largos disponibles: 40 y 45 cm · Hecho a mano en Madrid.",
      priceCents: 22800,
      categoryId: collares.id,
      material: "Oro vermeil 18k",
      images: [px(34372553), px(4889719)],
      stock: 6,
      isFeatured: true,
      isBestseller: true,
    },
    {
      name: "Collar Cruz Malta",
      slug: "collar-cruz-malta",
      description:
        "Geometría solemne y pulido espejo. Un colgante de cruz contemporáneo, depurado hasta la esencia.",
      details:
        "Plata 925 con baño de oro de 18 k · Colgante de 18 mm · Cadena veneziana de 45 cm.",
      priceCents: 13200,
      categoryId: collares.id,
      material: "Plata 925 baño oro",
      images: [px(29003596)],
      stock: 14,
    },
    {
      name: "Collar Mariposa Nuit",
      slug: "collar-mariposa-nuit",
      description:
        "Pieza de declaración de la colección Éclat. Vuelo nocturno capturado en metal y luz, pensado para escenarios y miradas.",
      details:
        "Latón con baño de oro de 18 k · Eslabones articulados a mano · Pieza de edición limitada numerada.",
      priceCents: 24600,
      categoryId: collares.id,
      material: "Latón baño oro 18k",
      images: [px(15433841)],
      stock: 4,
      isNew: true,
    },
    {
      name: "Aros Espejo",
      slug: "aros-espejo",
      description:
        "El aro perfecto existe: perfil redondo, pulido espejo y cierre invisible. Pesan tan poco que olvidarás que los llevas.",
      details:
        "Oro vermeil de 18 k sobre plata 925 reciclada · Diámetro de 25 mm · Cierre de click oculto · Sin níquel, aptos para piel sensible.",
      priceCents: 11400,
      categoryId: pendientes.id,
      material: "Oro vermeil 18k",
      images: [px(38940737), px(32797485)],
      stock: 20,
      isFeatured: true,
      isBestseller: true,
    },
    {
      name: "Pendientes Estrella Fugaz",
      slug: "pendientes-estrella-fugaz",
      description:
        "Aros con charm de estrella tallada que atrapa la luz a cada paso. Un pequeño deseo colgado de la oreja.",
      details:
        "Oro vermeil de 18 k · Charm desmontable de estrella · Aro de 15 mm · Cierre articulado de seguridad.",
      priceCents: 12800,
      categoryId: pendientes.id,
      material: "Oro vermeil 18k",
      images: [px(34372559)],
      stock: 11,
      isFeatured: true,
    },
    {
      name: "Pendientes Prisma",
      slug: "pendientes-prisma",
      description:
        "Aros orgánicos de caída líquida que descomponen la luz en matices cálidos. Escultura mínima para el día a día.",
      details:
        "Plata 925 con baño de oro de 18 k · Fundición a la cera perdida · Largo de 30 mm · Tuerca a presión extra segura.",
      priceCents: 15900,
      compareAtCents: 18900,
      categoryId: pendientes.id,
      material: "Plata 925 baño oro",
      images: [px(14940718), px(35933224)],
      stock: 9,
    },
    {
      name: "Brazalete Trébol",
      slug: "brazalete-trebol",
      description:
        "Un talismán discreto. Brazalete rígido con motivo de trébol pulido a mano que se lleva solo o en compañía.",
      details:
        "Oro vermeil de 18 k · Brazalete rígido ajustable · Motivo pulido espejo · Grabado interior opcional.",
      priceCents: 17400,
      categoryId: pulseras.id,
      material: "Oro vermeil 18k",
      images: [px(34399138), px(34399150)],
      stock: 13,
      isNew: true,
    },
    {
      name: "Pulsera Eslabones Oro",
      slug: "pulsera-eslabones-oro",
      description:
        "Eslabones forjados uno a uno con el ritmo del taller. Presencia cálida y peso honesto en la muñeca.",
      details:
        "Plata 925 con baño de oro de 18 k · Eslabones forjados y soldados a mano · Largo de 18 cm + extensor · Cierre de reasa.",
      priceCents: 19800,
      categoryId: pulseras.id,
      material: "Plata 925 baño oro",
      images: [px(37401985), pxWide(25227839)],
      stock: 7,
    },
  ]);

  console.log("Seed completado.");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Error durante el seed:", err);
  process.exit(1);
});
