import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ContainerProps = HTMLAttributes<HTMLDivElement>;

/**
 * Container base del Design System.
 *
 * Replica el ancho máximo y padding horizontal usados en Hero,
 * Categories, HowItWorks y Footer (mx-auto max-w-6xl px-6).
 */
export function Container({ className, ...props }: ContainerProps) {
  return (
    <div
      className={cn("mx-auto max-w-6xl px-6", className)}
      {...props}
    />
  );
}