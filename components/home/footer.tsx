import { Terminal } from "lucide-react";

export function Footer() {
  return (
    <footer id="acerca-de" className="border-t border-border/60">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-accent/15 text-accent">
              <Terminal className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-medium text-foreground">TechCheck</p>
              <p className="text-xs text-muted">
                Herramienta gratuita para diagnóstico técnico.
              </p>
            </div>
          </div>

          {/* Espacio reservado para futuros enlaces (redes, contacto, changelog, etc.) */}
          <nav aria-label="Enlaces adicionales" className="flex gap-4" />
        </div>
      </div>
    </footer>
  );
}
