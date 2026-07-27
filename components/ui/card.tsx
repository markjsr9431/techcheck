import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type CardProps = HTMLAttributes<HTMLDivElement>;

/**
 * Card base del Design System.
 *
 * Replica el patrón visual usado en CategoryCard y HowItWorks
 * (borde, fondo surface, radio md, padding p-5). No añade
 * comportamiento; los estados hover/transición se aplican vía
 * className cuando el consumidor los necesita, igual que hoy.
 */
export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-md border border-border bg-surface p-5",
        className
      )}
      {...props}
    />
  );
}