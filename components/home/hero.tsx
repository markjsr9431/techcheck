import { ArrowRight, LayoutGrid } from "lucide-react";
import { DiagnosticConsole } from "@/components/home/diagnostic-console";

export function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-20 pt-16 sm:pb-28 sm:pt-24">
      <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        <div className="max-w-xl">
          <h1 className="text-3xl font-medium leading-[1.15] tracking-tight text-foreground sm:text-5xl sm:leading-[1.1]">
            Diagnostica problemas de tu computador paso a paso.
          </h1>

          <p className="mt-5 text-base leading-relaxed text-muted sm:text-lg">
            Encuentra procedimientos claros para identificar y solucionar
            fallos comunes en equipos Windows de forma rápida y organizada.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#categorias"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-accent px-5 py-3 text-sm font-medium text-accent-foreground shadow-subtle transition-colors hover:bg-accent/90"
            >
              Comenzar diagnóstico
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <a
              href="#categorias"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-border bg-surface px-5 py-3 text-sm font-medium text-foreground transition-colors hover:border-muted/40"
            >
              <LayoutGrid className="h-4 w-4" aria-hidden="true" />
              Explorar categorías
            </a>
          </div>
        </div>

        <div className="flex justify-center lg:justify-end">
          <DiagnosticConsole />
        </div>
      </div>
    </section>
  );
}
