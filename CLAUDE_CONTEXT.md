# TechCheck

## Estado
Proyecto inicial.

## Sprint actual
Sprint 2

## Completado
- Arquitectura base.
- Home.
- Categorías.
- Hero.
- Footer.
- Proyecto en GitHub.
- Despliegue preparado para Vercel.
- Design System (Button, Card, Badge, Section, Container) en components/ui.
- Flujo inicial de navegación del diagnóstico: Home → /diagnostico (bienvenida) → primera pregunta con 5 opciones. Sin lógica, sin base de datos, sin historial.

## Pendiente
- Integrar componentes del Design System en Home (no realizado en esta tarea).
- Lógica del diagnóstico (evaluar opciones, ramificar preguntas).
- Diagnóstico: PC lenta (Sprint 3).
- Navegación completa (Sprint 6).
- PWA.

## Última tarea
Se conectó el botón principal del Hero ("Comenzar diagnóstico") a /diagnostico usando next/link, sin alterar su estilo. Se creó app/diagnostico/page.tsx con dos pantallas controladas por estado local: bienvenida (título, descripción, botón "Iniciar diagnóstico") y primera pregunta "¿Cuál es el problema principal?" con las opciones PC lenta, No enciende, Sin Internet, Pantalla negra, Otro. Reutiliza Header, Section, Container, Button y Card del Design System. No se implementó lógica de diagnóstico ni persistencia.

## Próxima tarea
Sprint 3: Diagnóstico PC lenta.