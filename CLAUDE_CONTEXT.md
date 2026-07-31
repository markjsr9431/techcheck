# TechCheck

## Estado
En desarrollo.

## Tarea actual
Exportar PDF (Sprint 9) — completado.

## Completado
- Arquitectura base.
- Home.
- Categorías.
- Hero.
- Footer.
- Proyecto en GitHub.
- Despliegue preparado para Vercel.
- Design System (Button, Card, Badge, Section, Container) en components/ui.
- Flujo inicial de navegación del diagnóstico: Home → /diagnostico (bienvenida) → primera pregunta con 5 opciones.
- Diagnóstico "PC lenta" completo (4 preguntas, resultado con causa/gravedad/recomendaciones).
- Diagnóstico "No enciende" completo: 4 preguntas con progreso y Atrás/Siguiente, pantalla de resultado (causa principal, nivel de gravedad Bajo/Medio/Alto, recomendaciones según respuestas) y botones "Volver al inicio" / "Realizar nuevamente el diagnóstico". Sin IA, sin base de datos, sin PDF, sin historial.
- Diagnóstico "Sin Internet" completo (Sprint 5): 4 preguntas (otros dispositivos conectados, estado de luces del router, tipo de conexión cable/Wi-Fi, mensaje de error mostrado), progreso y Atrás/Siguiente, pantalla de resultado (causa principal, nivel de gravedad Bajo/Medio/Alto, recomendaciones según respuestas) y botones "Volver al inicio" / "Realizar nuevamente el diagnóstico". Mismo patrón visual y estructural que "PC lenta" y "No enciende". Sin IA, sin base de datos, sin PDF, sin historial.
- Diagnóstico "Pantalla negra" completo (Sprint 6): 4 preguntas (luces del equipo, ruido de ventiladores, estado del monitor, conexión del cable de video), progreso y Atrás/Siguiente, pantalla de resultado (causa principal, nivel de gravedad Bajo/Medio/Alto, recomendaciones según respuestas) y botones "Volver al inicio" / "Realizar nuevamente el diagnóstico". Mismo patrón visual y estructural que los diagnósticos anteriores. Sin IA, sin base de datos, sin PDF, sin historial.
- Correcciones de navegación/usabilidad: botón "Atrás" en la primera pregunta, logo del Header y acceso a "Acerca de" desde cualquier página.
- Diagnóstico "Otro" completo (Sprint 7): 4 preguntas (tipo de problema, frecuencia, momento de inicio, cambios recientes), progreso y Atrás/Siguiente, pantalla de resultado (causa principal, nivel de gravedad Bajo/Medio/Alto, recomendaciones según respuestas) y botones "Volver al inicio" / "Realizar nuevamente el diagnóstico". Mismo patrón visual y estructural que los diagnósticos anteriores. Sin IA, sin base de datos, sin PDF, sin historial.
- Sistema de navegación y UX (Sprint 8): breadcrumb de navegación ("Inicio / Diagnóstico / Selección de problema / [Problema]") visible en toda la página /diagnostico, con segmentos anteriores clicables para evitar callejones sin salida. Categorías del Home ahora enlazan a /diagnostico cuando el diagnóstico existe (PC lenta, No enciende, Sin Internet, Pantalla negra); las categorías aún no implementadas se muestran claramente deshabilitadas ("Próximamente") en lugar de simular un enlace roto. Verificado que todos los botones/enlaces existentes (Atrás/Siguiente, Volver al inicio, Realizar nuevamente el diagnóstico, Acerca de, logo del Header) funcionan correctamente y no dejan al usuario bloqueado. Revisado comportamiento responsive (grid de opciones, botones de navegación) sin cambios necesarios. Sin cambios en la lógica ni en las preguntas de los diagnósticos existentes.
- Capa de abstracción de resultados (previa al Sprint 9): se introdujo el tipo compartido `DiagnosticResult` (title, category, severity, probableCause, recommendations, answers, generatedAt) en `lib/types.ts`, y el componente `DiagnosticResultView` (`components/diagnostico/diagnostic-result-view.tsx`) que renderiza la pantalla de resultado a partir de ese único contrato. Cada `*-flow.tsx` (PC lenta, No enciende, Sin Internet, Pantalla negra, Otro) conserva intacta su función interna `getDiagnosisResult` y agrega un adaptador `toDiagnosticResult` que traduce su resultado propio al contrato compartido. Ningún componente de presentación ni de exportación conoce la lógica interna de un diagnóstico en particular (principio Open/Closed): un diagnóstico nuevo solo necesita su propio adaptador.
- Exportar PDF (Sprint 9): botón "Descargar PDF" agregado en `DiagnosticResultView`, el único punto de pantalla de resultado compartido por los 4 diagnósticos existentes. Genera un archivo .pdf real (no impresión del navegador) usando la librería `jspdf`, con nombre del diagnóstico, fecha y hora de generación, causa principal, nivel de gravedad y recomendaciones, en un layout simple de una columna. El nombre del archivo se normaliza (sin tildes, espacios ni caracteres especiales) a partir de `result.category`. Si el contenido excede el alto de una página, se agrega automáticamente una nueva página (`doc.addPage()`) mediante un control de espacio (`ensureSpace`) antes de cada bloque de texto. No se modificó la lógica de ningún diagnóstico, ni la arquitectura ni las rutas existentes; el único archivo de producción modificado fue `diagnostic-result-view.tsx` (además de `package.json`/`package-lock.json` por la nueva dependencia).

## Archivos principales modificados en Sprint 9
- `components/diagnostico/diagnostic-result-view.tsx` (lógica de generación y descarga del PDF, botón "Descargar PDF").
- `package.json` / `package-lock.json` (dependencia `jspdf` añadida).

## Decisiones de arquitectura (Sprint 9)
- Se usa `jspdf` por ser la librería mínima suficiente para generar un PDF real en el cliente sin backend ni build tooling adicional.
- La generación de PDF vive en un único componente (`DiagnosticResultView`), no en cada `*-flow.tsx`, aprovechando la capa de abstracción `DiagnosticResult` ya existente: el generador de PDF no conoce la lógica ni las preguntas de ningún diagnóstico.
- Se descartó la primera implementación basada en `window.print()` (diálogo de impresión del navegador) por no producir una descarga de archivo real, reemplazándola por la generación directa con `jsPDF`.

## Pendiente
- Integrar componentes del Design System en Home (no realizado en esta tarea).
- Implementar modo claro/oscuro real con persistencia de preferencia del usuario.
- SEO (Sprint 10).
- PWA (Sprint 11).
- Optimización final (Sprint 12).

## Última tarea
Se implementó la exportación a PDF del resultado del diagnóstico (Sprint 9): botón "Descargar PDF" en la pantalla de resultado compartida, generación de un archivo .pdf real con `jspdf` (nombre del diagnóstico, fecha/hora, causa principal, gravedad y recomendaciones), nombre de archivo normalizado y paginación automática cuando el contenido excede una página. No se modificó la lógica de ningún diagnóstico ni la arquitectura existente.

## Próxima tarea
SEO (Sprint 10).