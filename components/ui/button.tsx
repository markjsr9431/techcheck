import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const VARIANT_STYLES: Record<ButtonVariant, string> = {
  primary:
    "bg-accent text-accent-foreground shadow-subtle hover:bg-accent/90",
  secondary:
    "border border-border bg-surface text-foreground hover:border-muted/40",
};

/**
 * Botón base del Design System.
 *
 * Replica exactamente los estilos de acción usados en Hero
 * (variantes primary/secondary). No introduce nuevos tamaños ni
 * colores; solo formaliza el patrón existente como componente
 * reutilizable.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-md px-5 py-3 text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50",
          VARIANT_STYLES[variant],
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";