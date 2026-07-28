# TechCheck

## Estado
En desarrollo.

## Tarea actual
Diagnóstico: No enciende

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
- Diagnóstico "PC lenta" completo: 4 preguntas con progreso y Atrás/Siguiente, pantalla de resultado (causa principal, nivel de gravedad Bajo/Medio/Alto, recomendaciones según respuestas) y botones "Volver al inicio" / "Realizar nuevamente el diagnóstico". Sin IA, sin base de datos, sin PDF, sin historial.

## Pendiente
- Integrar componentes del Design System en Home (no realizado en esta tarea).
- Diagnóstico: No enciende (Sprint 4).
- Diagnósticos: Sin Internet, Pantalla negra, Otro (sin implementar).
- Navegación completa (Sprint 6).
- PWA.

## Última tarea
Se completó components/diagnostico/pc-lenta-flow.tsx con la pantalla de resultado: función interna getDiagnosisResult (reglas fijas, sin IA) que deriva causa principal, nivel de gravedad (Bajo/Medio/Alto) y una lista de recomendaciones (liberar espacio en disco, desinstalar programas innecesarios, revisar programas de inicio, ejecutar antivirus, revisar estado del disco, reiniciar el equipo, actualizar Windows) a partir de las respuestas guardadas. Se agregaron los botones "Volver al inicio" (enlace a la Home del sitio) y "Realizar nuevamente el diagnóstico" (reinicia el flujo de preguntas). No se tocaron las preguntas existentes ni la navegación previa de app/diagnostico/page.tsx. No se implementó IA, base de datos, PDF ni historial.

## Próxima tarea
Diagnóstico: No enciende.