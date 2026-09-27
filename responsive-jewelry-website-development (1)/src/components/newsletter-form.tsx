"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, Check } from "lucide-react";

type Status = "idle" | "loading" | "success" | "error";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = (await res.json()) as { ok: boolean; message?: string };
      if (!res.ok || !data.ok) {
        setStatus("error");
        setMessage(data.message ?? "No hemos podido registrar tu email. Inténtalo de nuevo.");
        return;
      }
      setStatus("success");
      setMessage(data.message ?? "¡Bienvenida al círculo AUREA!");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Error de conexión. Inténtalo de nuevo en unos segundos.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="w-full">
      <div className="flex flex-col gap-3 sm:flex-row">
        <label htmlFor="newsletter-email" className="sr-only">
          Tu correo electrónico
        </label>
        <input
          id="newsletter-email"
          type="email"
          required
          inputMode="email"
          autoComplete="email"
          placeholder="tu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-14 flex-1 rounded-full border border-ivory/25 bg-ivory/10 px-6 text-base text-ivory placeholder:text-ivory/45 focus:border-gold-light focus:ring-2 focus:ring-gold/40 focus:outline-none"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="flex h-14 items-center justify-center gap-2 rounded-full bg-gold px-8 text-sm font-semibold tracking-[0.16em] text-ink uppercase transition-all hover:bg-gold-light active:scale-[0.97] disabled:opacity-60"
        >
          {status === "loading" ? "Enviando…" : "Unirme"}
          <ArrowRight className="h-4 w-4" strokeWidth={2} />
        </button>
      </div>
      {message && (
        <p
          role={status === "error" ? "alert" : "status"}
          className={`mt-4 flex items-center gap-2 text-sm ${
            status === "error" ? "text-red-300" : "text-gold-light"
          }`}
        >
          {status === "success" && <Check className="h-4 w-4" strokeWidth={2.5} />}
          {message}
        </p>
      )}
    </form>
  );
}
