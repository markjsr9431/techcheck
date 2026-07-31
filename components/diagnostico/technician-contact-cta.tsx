import { MessageCircle, Instagram, Send } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const CONTACT_OPTIONS = [
  {
    icon: MessageCircle,
    label: "WhatsApp",
    handle: "@rubiotechlab.co",
    href: "https://wa.me/@rubiotechlab.co",
  },
  {
    icon: Instagram,
    label: "Instagram",
    handle: "@rubiotechlab.co",
    href: "https://instagram.com/rubiotechlab.co",
  },
  {
    icon: Send,
    label: "Telegram",
    handle: "@rubiotechlab",
    href: "https://t.me/rubiotechlab",
  },
] as const;

/**
 * CTA de contacto mostrado cuando una recomendación del diagnóstico
 * sugiere consultar con un técnico especializado.
 *
 * Reutiliza Card y Badge del Design System; no introduce nuevos
 * patrones visuales.
 */
export function TechnicianContactCta() {
  return (
    <Card className="text-left">
      <p className="text-[15px] font-medium text-foreground">
        Contacta a un técnico especializado
      </p>

      <p className="mt-1.5 text-sm leading-relaxed text-muted">
        Elige un canal para recibir soporte directo.
      </p>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {CONTACT_OPTIONS.map(({ icon: Icon, label, handle, href }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 rounded-md border border-border bg-background px-3 py-2.5 transition-colors hover:border-muted/40"
          >
            <Badge className="h-9 w-9 shrink-0 transition-colors duration-200 group-hover:bg-accent/15">
              <Icon className="h-4 w-4" aria-hidden="true" />
            </Badge>

            <span className="flex flex-col">
              <span className="text-sm font-medium text-foreground">
                {label}
              </span>
              <span className="text-xs text-muted">{handle}</span>
            </span>
          </a>
        ))}
      </div>
    </Card>
  );
}