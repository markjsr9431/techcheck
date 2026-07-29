import {
  Gauge,
  Zap,
  WifiOff,
  ShieldAlert,
  HardDrive,
  MonitorX,
  Printer,
  VolumeX,
  MonitorOff,
  BatteryWarning,
} from "lucide-react";
import { CategoryCard } from "@/components/home/category-card";

const CATEGORIES = [
  { icon: Gauge, title: "PC lenta", description: "Rendimiento por debajo de lo esperado.", available: true },
  { icon: Zap, title: "No enciende", description: "El equipo no responde al encendido.", available: true },
  { icon: WifiOff, title: "Sin Internet", description: "Problemas de conexión o red.", available: true },
  { icon: MonitorOff, title: "Pantalla negra", description: "El equipo enciende pero no hay imagen.", available: true },
  { icon: ShieldAlert, title: "Posible virus", description: "Comportamiento sospechoso del sistema.", available: false },
  { icon: HardDrive, title: "Disco duro", description: "Fallos de almacenamiento o lectura.", available: false },
  { icon: MonitorX, title: "Pantalla azul", description: "Errores críticos del sistema.", available: false },
  { icon: Printer, title: "Impresoras", description: "Fallos de impresión o conexión.", available: false },
  { icon: VolumeX, title: "Sin sonido", description: "Audio ausente o con fallos.", available: false },
  { icon: BatteryWarning, title: "Laptop no carga", description: "Problemas de carga o batería.", available: false },
] as const;

export function Categories() {
  return (
    <section id="categorias" className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
      <div className="max-w-xl">
        <h2 className="text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
          Categorías de diagnóstico
        </h2>
        <p className="mt-3 text-base text-muted">
          Selecciona el problema que más se ajuste a lo que estás
          experimentando. Las categorías aún no disponibles pueden
          diagnosticarse igualmente eligiendo &quot;Otro&quot; al iniciar.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORIES.map((category) => (
          <CategoryCard key={category.title} {...category} />
        ))}
      </div>
    </section>
  );
}