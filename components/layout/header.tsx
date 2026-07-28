import Link from "next/link";
import { Terminal } from "lucide-react";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-accent/15 text-accent">
            <Terminal className="h-4 w-4" aria-hidden="true" />
          </span>
          <span className="text-[15px] font-medium tracking-tight text-foreground">
            TechCheck
          </span>
        </Link>

        <nav className="flex items-center gap-2" aria-label="Navegación principal">
          <Link
            href="/#acerca-de"
            className="rounded-md px-3 py-2 text-sm text-muted transition-colors hover:text-foreground"
          >
            Acerca de
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}