import { Moon } from "lucide-react";

/**
 * Botón de modo claro/oscuro.
 *
 * Por ahora es solo visual: la aplicación funciona únicamente en
 * modo oscuro. Cuando se implemente el modo claro, este componente
 * pasará a ser un Client Component con estado y su propio ícono
 * dinámico (Sun / Moon).
 */
export function ThemeToggle() {
  return (
    <button
      type="button"
      disabled
      aria-label="Modo oscuro activo. El modo claro estará disponible próximamente."
      title="Modo claro próximamente"
      className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-surface text-muted transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-70"
    >
      <Moon className="h-4 w-4" aria-hidden="true" />
    </button>
  );
}
