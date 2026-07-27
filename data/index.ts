/**
 * Punto único de acceso al contenido de TechCheck.
 *
 * Toda categoría de diagnóstico se define en su propio archivo
 * dentro de /data (ej. `data/hardware.ts`, `data/redes.ts`) y se
 * re-exporta desde aquí. El resto de la aplicación importa
 * siempre desde "@/data", nunca desde un archivo individual.
 *
 * Aún no existen categorías: este archivo se completará cuando
 * se agregue el primer contenido de diagnóstico.
 */

export {};
