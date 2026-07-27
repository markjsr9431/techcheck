import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type BadgeProps = HTMLAttributes<HTMLSpanElement>;

/**
 * Badge base del Design System.
 *
 * Replica el contenedor de icono circular/cuadrado usado en
 * CategoryCard, HowItWorks y Footer (bg-accent/10 o /15, texto
 * accent, radio md). Pensado para envolver un icono u otro
 * indicador corto.
 */
export function Badge({ className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex h-10 w-10 items-center justify-center rounded-md bg-accent/10 text-accent",
        className
      )}
      {...props}
    />
  );
}