import { MousePointerClick, ListChecks, BadgeCheck } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";

const STEPS = [
  {
    icon: MousePointerClick,
    title: "Selecciona un problema",
    description: "Elige la categoría que mejor describe lo que ocurre en tu equipo.",
  },
  {
    icon: ListChecks,
    title: "Sigue el procedimiento",
    description: "Avanza por pasos claros, ordenados y sin tecnicismos innecesarios.",
  },
  {
    icon: BadgeCheck,
    title: "Obtén un diagnóstico",
    description: "Identifica la causa probable y la acción recomendada a seguir.",
  },
] as const;

export function HowItWorks() {
  return (
    <Section>
      <Container>
        <div className="max-w-xl">
          <h2 className="text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
            ¿Cómo funciona?
          </h2>
        </div>

        <ol className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {STEPS.map(({ icon: Icon, title, description }, index) => (
            <li
              key={title}
              className="relative rounded-lg border border-border bg-surface p-5"
            >
              <div className="flex items-center gap-3">
                <Badge className="h-9 w-9 shrink-0">
                  <Icon className="h-4.5 w-4.5" aria-hidden="true" />
                </Badge>
                <span className="font-mono text-xs text-muted">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="mt-4 text-[15px] font-medium text-foreground">
                {title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">
                {description}
              </p>
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  );
}