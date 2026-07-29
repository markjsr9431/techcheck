import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface CategoryCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  available: boolean;
}

/**
 * Tarjeta de categoría de diagnóstico.
 *
 * Cuando la categoría ya tiene un flujo implementado (available),
 * enlaza a /diagnostico para iniciar el diagnóstico correspondiente.
 * Las categorías aún no implementadas se muestran deshabilitadas en
 * lugar de simular un enlace roto.
 */
export function CategoryCard({ icon: Icon, title, description, available }: CategoryCardProps) {
  const content = (
    <>
      <span className="flex h-10 w-10 items-center justify-center rounded-md bg-accent/10 text-accent transition-colors duration-200 group-hover:bg-accent/15">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <h3 className="mt-4 text-[15px] font-medium text-foreground">{title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-muted">{description}</p>
      {!available && (
        <span className="mt-3 inline-flex w-fit items-center rounded-md border border-border bg-background px-2 py-0.5 text-xs text-muted">
          Próximamente
        </span>
      )}
    </>
  );

  if (!available) {
    return (
      <article
        aria-label={`${title}: diagnóstico próximamente disponible`}
        className="group flex flex-col rounded-lg border border-border bg-surface p-5 opacity-70"
      >
        {content}
      </article>
    );
  }

  return (
    <Link
      href="/diagnostico"
      className={cn(
        "group flex flex-col rounded-lg border border-border bg-surface p-5 transition-all duration-200",
        "hover:-translate-y-0.5 hover:border-muted/40 hover:shadow-soft"
      )}
    >
      {content}
    </Link>
  );
}