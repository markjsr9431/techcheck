/**
 * Tipos compartidos del dominio de TechCheck.
 *
 * Este archivo define la forma que debe tener todo el contenido
 * almacenado en /data. No contiene datos: solo contratos.
 *
 * Cuando se añada la primera categoría de diagnóstico, su archivo
 * en /data deberá tipar su export con estas interfaces.
 */

/**
 * Nivel de gravedad de un diagnóstico.
 *
 * Usado tanto por la pantalla de resultado en pantalla como por
 * cualquier exportación (PDF u otra) que necesite representar la
 * severidad de forma consistente.
 */
export type DiagnosticSeverity = "Bajo" | "Medio" | "Alto";

/**
 * Par pregunta/respuesta tal como se le mostró al usuario, en el
 * orden en que se respondió. Se usa para mostrar o exportar el
 * detalle de respuestas sin depender de la forma interna (IDs,
 * enums) que use cada diagnóstico para modelar sus preguntas.
 */
export interface DiagnosticAnswer {
  question: string;
  answer: string;
}

/**
 * Resultado normalizado de cualquier diagnóstico de TechCheck.
 *
 * Todo diagnóstico (existente o futuro) debe producir un objeto con
 * esta forma antes de mostrarlo o exportarlo. Es el único contrato
 * que conocen los componentes de presentación de resultado y de
 * exportación (por ejemplo PDFExporter): ninguno de los dos conoce
 * la lógica interna, las preguntas, ni las reglas de un diagnóstico
 * en particular. Esto permite agregar nuevos diagnósticos sin
 * modificar esos componentes (principio Open/Closed).
 */
export interface DiagnosticResult {
  /** Nombre del diagnóstico, ej. "PC lenta". */
  title: string;
  /** Categoría o identificador estable, ej. "pc-lenta". */
  category: string;
  severity: DiagnosticSeverity;
  probableCause: string;
  recommendations: string[];
  answers: DiagnosticAnswer[];
  /** Momento en que se generó el resultado. */
  generatedAt: Date;
}

export {};