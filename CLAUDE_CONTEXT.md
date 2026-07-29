# TechCheck

## Estado
En desarrollo.

## Tarea actual
Sistema de navegación y UX (Sprint 8) — completado.

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

## Pendiente
- Integrar componentes del Design System en Home (no realizado en esta tarea).
- Implementar modo claro/oscuro real con persistencia de preferencia del usuario.
- Exportar PDF (Sprint 9).
- PWA (Sprint 11).

## Última tarea
Se mejoró la navegación y UX del proyecto (Sprint 8): breadcrumb de ubicación en /diagnostico, categorías del Home conectadas a /diagnostico o marcadas como "Próximamente" según disponibilidad real, y verificación de que ningún botón o enlace deja al usuario en un estado bloqueado. No se modificó la lógica ni las preguntas de ningún diagnóstico existente.

## Próxima tarea
Exportar PDF.