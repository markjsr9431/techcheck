# TechCheck

## Estado
En desarrollo.

## Tarea actual
Diagnóstico: Pantalla negra (Sprint 6) — completado.

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

## Pendiente
- Integrar componentes del Design System en Home (no realizado en esta tarea).
- Diagnóstico: Otro (sin implementar).
- Sistema de navegación y UX (Sprint 6 según ROADMAP.md, aún no abordado como tal).
- Implementar modo claro/oscuro real con persistencia de preferencia del usuario.
- Exportar PDF (Sprint 7).
- PWA (Sprint 9).

## Última tarea
Se implementó el diagnóstico "Pantalla negra": 4 preguntas, cálculo de resultado con reglas fijas y pantalla final, siguiendo el mismo patrón visual y estructural que los diagnósticos previos. Se conectó al selector de problema en /diagnostico. Nota: ROADMAP.md asigna Sprint 6 a "Sistema de navegación y UX"; "Pantalla negra" no figura como sprint en el roadmap, pero se implementó por instrucción explícita.

## Próxima tarea
Diagnóstico: Otro, o Sistema de navegación y UX (Sprint 6 según ROADMAP.md).