import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type SectionProps = HTMLAttributes<HTMLElement>;

/**
 * Section base del Design System.
 *
 * Replica el espaciado vertical usado en Hero, Categories y
 * HowItWorks (py-20 sm:py-28). No incluye el max-w-6xl/px-6: ese
 * espaciado horizontal corresponde a Container, que se compone
 * dentro de Section cuando se necesite.
 */
export function Section({ className, ...props }: SectionProps) {
  return (
    <section
      className={cn("py-20 sm:py-28", className)}
      {...props}
    />
  );
}