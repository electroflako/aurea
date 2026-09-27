"use client";

import Image from "next/image";
import { useState } from "react";
import clsx from "clsx";

export function ProductGallery({ images, name, priority }: { images: string[]; name: string; priority?: boolean }) {
  const [active, setActive] = useState(0);
  const hasMany = images.length > 1;

  return (
    <div>
      {/* Imagen principal */}
      <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-cream shadow-card">
        {images.map((src, i) => (
          <Image
            key={src}
            src={src}
            alt={i === 0 ? name : `${name} — vista ${i + 1}`}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority={priority && i === 0}
            aria-hidden={i !== active}
            className={clsx(
              "object-cover transition-opacity duration-500",
              i === active ? "opacity-100" : "opacity-0",
            )}
          />
        ))}

        {/* Puntos (móvil) */}
        {hasMany && (
          <div className="absolute inset-x-0 bottom-4 flex justify-center gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Ver imagen ${i + 1}`}
                className={clsx(
                  "h-2 rounded-full transition-all duration-300",
                  i === active ? "w-6 bg-ivory" : "w-2 bg-ivory/50",
                )}
              />
            ))}
          </div>
        )}
      </div>

      {/* Miniaturas */}
      {hasMany && (
        <div className="mt-4 flex gap-3">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Miniatura ${i + 1} de ${name}`}
              aria-current={i === active}
              className={clsx(
                "relative h-20 w-16 overflow-hidden rounded-xl transition-all",
                i === active ? "ring-2 ring-gold ring-offset-2 ring-offset-ivory" : "opacity-60 hover:opacity-100",
              )}
            >
              <Image src={src} alt="" fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
