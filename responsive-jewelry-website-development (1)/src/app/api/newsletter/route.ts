import { NextResponse } from "next/server";
import { db } from "@/db";
import { newsletterSubscribers } from "@/db/schema";

export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(request: Request) {
  let body: { email?: unknown };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ ok: false, message: "Petición inválida." }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase().slice(0, 160) : "";
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { ok: false, message: "Introduce un correo electrónico válido." },
      { status: 422 },
    );
  }

  try {
    await db
      .insert(newsletterSubscribers)
      .values({ email })
      .onConflictDoNothing({ target: newsletterSubscribers.email });
  } catch (error) {
    console.error("Error en newsletter:", error);
    return NextResponse.json(
      { ok: false, message: "No hemos podido registrar tu email. Inténtalo más tarde." },
      { status: 500 },
    );
  }

  return NextResponse.json({
    ok: true,
    message: "¡Bienvenida al círculo AUREA! Revisa tu bandeja de entrada.",
  });
}
