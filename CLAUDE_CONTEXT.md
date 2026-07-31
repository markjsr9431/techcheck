# TechCheck

## Estado

En desarrollo.

## Tarea actual

Optimización final (Sprint 12) — completado.

## Completado

- Arquitectura base, Home, Design System.
- Diagnósticos: PC lenta, No enciende, Sin Internet, Pantalla negra, Otro.
- Sistema de navegación y UX (breadcrumb, estados deshabilitados).
- Capa de abstracción `DiagnosticResult` compartida entre diagnósticos.
- Exportar PDF del resultado del diagnóstico.
- SEO (Sprint 10): metadata, Open Graph, Twitter, canonical, robots.txt y sitemap.xml.
- PWA (Sprint 11): manifest.webmanifest, íconos, viewport/themeColor, instalación standalone.
- Optimización final (Sprint 12): revisión de lint/TypeScript (sin advertencias), accesibilidad mejorada (`aria-pressed` en las opciones seleccionables de los 5 diagnósticos) y eliminación de un `export {}` redundante en `lib/types.ts`. Sin nuevas funcionalidades, sin cambios visuales ni de arquitectura.

## Pendiente

- Integrar componentes del Design System en Home.

## Última tarea

Optimización final (Sprint 12): `aria-pressed` en tarjetas seleccionables de los flujos de diagnóstico y limpieza de código muerto menor. Build, lint y `tsc --noEmit` verificados sin errores.

## Próxima tarea

Sin tareas pendientes en el ROADMAP; quedan las "Mejoras de interfaz" (modo claro/oscuro) sin sprint asignado.
