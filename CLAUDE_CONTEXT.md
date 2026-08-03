# TechCheck

## Estado

En desarrollo.

## Tarea actual

Nuevo flujo de diagnóstico "Pantalla azul" — completado.

## Completado

- Arquitectura base, Home, Design System.
- Diagnósticos: PC lenta, No enciende, Sin Internet, Pantalla negra, Posible virus, Disco duro, Pantalla azul, Otro.
- Sistema de navegación y UX (breadcrumb, estados deshabilitados).
- Capa de abstracción `DiagnosticResult` compartida entre diagnósticos.
- Exportar PDF del resultado del diagnóstico.
- SEO (Sprint 10): metadata, Open Graph, Twitter, canonical, robots.txt y sitemap.xml.
- PWA (Sprint 11): manifest.webmanifest, íconos, viewport/themeColor, instalación standalone.
- Optimización final (Sprint 12): lint/TypeScript sin advertencias, `aria-pressed` en flujos de diagnóstico.
- Integrar componentes del Design System en Home: Container, Section y Badge aplicados donde eran equivalentes al markup existente. Sin cambios visuales ni de comportamiento.
- CTA de contacto con técnico especializado: bloque con WhatsApp, Instagram y Telegram, mostrado solo cuando el resultado del diagnóstico recomienda consultar con un técnico especializado.

## Pendiente

- Sin tareas pendientes.

## IMPORTANTE

Al finalizar la implementación del flujo:

- Habilita automáticamente la categoría correspondiente.
- Elimina la etiqueta "Próximamente".
- Conéctala al nuevo flow.
- Debe comportarse exactamente igual que PC lenta, No enciende, Sin Internet y Pantalla negra.

## Última tarea

Nuevo flujo de diagnóstico "Pantalla azul": misma arquitectura que los demás diagnósticos (componente de flow con `DiagnosticResult`/`DiagnosticResultView`), integrado en la pantalla de selección. Categoría "Pantalla azul" habilitada en Home (`available: true`), etiqueta "Próximamente" ya no se muestra para esta categoría. Build verificado sin errores.

## Próxima tarea

Sin tareas pendientes en el ROADMAP.
