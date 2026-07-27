import { Cpu, HardDrive, Wifi, CheckCircle2, Circle } from "lucide-react";

const CHECKS = [
  { label: "CPU", icon: Cpu, status: "ok" as const },
  { label: "Disco", icon: HardDrive, status: "ok" as const },
  { label: "Red", icon: Wifi, status: "pending" as const },
];

/**
 * Ilustración del hero: una consola de diagnóstico simplificada.
 * Representa literalmente lo que TechCheck hace (verificar
 * componentes paso a paso), construida solo con iconos Lucide
 * y tipografía mono. Sin imágenes externas.
 */
export function DiagnosticConsole() {
  return (
    <div
      aria-hidden="true"
      className="w-full max-w-sm rounded-lg border border-border bg-surface p-5 shadow-soft"
    >
      <div className="mb-4 flex items-center gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full bg-border" />
        <span className="h-2.5 w-2.5 rounded-full bg-border" />
        <span className="h-2.5 w-2.5 rounded-full bg-border" />
        <span className="ml-2 font-mono text-xs text-muted">
          diagnóstico.sh
        </span>
      </div>

      <div className="space-y-3">
        {CHECKS.map(({ label, icon: Icon, status }) => (
          <div
            key={label}
            className="flex items-center justify-between rounded-md border border-border/60 bg-background/40 px-3 py-2.5"
          >
            <div className="flex items-center gap-2.5">
              <Icon className="h-4 w-4 text-muted" />
              <span className="font-mono text-sm text-foreground">
                {label}
              </span>
            </div>
            {status === "ok" ? (
              <CheckCircle2 className="h-4 w-4 text-accent" />
            ) : (
              <Circle className="h-4 w-4 animate-pulse text-muted" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
