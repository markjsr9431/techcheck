import type { LucideIcon } from "lucide-react";

interface CategoryCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

/**
 * Tarjeta de categoría de diagnóstico.
 *
 * Hoy es un elemento no interactivo (article). Cuando existan rutas
 * de diagnóstico, se envolverá en <Link> sin cambiar su estructura
 * visual ni su API de props.
 */
export function CategoryCard({ icon: Icon, title, description }: CategoryCardProps) {
  return (
    <article className="group rounded-lg border border-border bg-surface p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-muted/40 hover:shadow-soft">
      <span className="flex h-10 w-10 items-center justify-center rounded-md bg-accent/10 text-accent transition-colors duration-200 group-hover:bg-accent/15">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <h3 className="mt-4 text-[15px] font-medium text-foreground">{title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-muted">{description}</p>
    </article>
  );
}
