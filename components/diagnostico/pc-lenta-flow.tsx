"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type QuestionId = "frecuencia" | "inicio" | "disco" | "antivirus";

interface Question {
  id: QuestionId;
  title: string;
  options: string[];
}

const QUESTIONS: Question[] = [
  {
    id: "frecuencia",
    title: "¿Cuándo notas la lentitud?",
    options: [
      "Siempre",
      "Solo al iniciar",
      "Solo al abrir programas",
      "Solo navegando en Internet",
    ],
  },
  {
    id: "inicio",
    title: "¿Hace cuánto comenzó?",
    options: ["Hoy", "Hace unos días", "Hace semanas", "Hace meses"],
  },
  {
    id: "disco",
    title: "¿El disco está casi lleno?",
    options: ["Sí", "No", "No lo sé"],
  },
  {
    id: "antivirus",
    title: "¿Tienes antivirus instalado?",
    options: ["Sí", "No", "No estoy seguro"],
  },
];

type Answers = Partial<Record<QuestionId, string>>;

type Severity = "Bajo" | "Medio" | "Alto";

interface DiagnosisResult {
  cause: string;
  severity: Severity;
  recommendations: string[];
}

/**
 * Deriva un resultado simple a partir de las respuestas.
 *
 * Reglas fijas, sin IA ni servicios externos: prioriza la señal
 * más determinante (disco casi lleno, antivirus ausente, tiempo
 * de aparición) para elegir una causa principal y arma la lista
 * de recomendaciones según coincidan las respuestas.
 */
function getDiagnosisResult(answers: Answers): DiagnosisResult {
  const { frecuencia, inicio, disco, antivirus } = answers;
  const recommendations: string[] = [];

  let cause = "Acumulación de procesos y archivos temporales";
  let severity: Severity = "Bajo";

  if (disco === "Sí") {
    cause = "Espacio en disco casi agotado";
    severity = "Alto";
    recommendations.push("Liberar espacio en disco", "Desinstalar programas innecesarios");
  }

  if (antivirus === "No") {
    cause = disco === "Sí" ? cause : "Posible infección o software malicioso";
    severity = severity === "Alto" ? "Alto" : "Medio";
    recommendations.push("Ejecutar un análisis antivirus");
  } else if (antivirus === "No estoy seguro") {
    recommendations.push("Ejecutar un análisis antivirus");
  }

  if (frecuencia === "Solo al iniciar") {
    recommendations.push("Revisar programas de inicio");
  }

  if (frecuencia === "Solo navegando en Internet") {
    cause = severity === "Alto" ? cause : "Exceso de extensiones o pestañas del navegador";
    recommendations.push("Revisar programas de inicio");
  }

  if (inicio === "Hace meses" || inicio === "Hace semanas") {
    severity = severity === "Bajo" ? "Medio" : severity;
    recommendations.push("Revisar el estado del disco");
  }

  if (inicio === "Hoy") {
    recommendations.push("Reiniciar el equipo");
  }

  recommendations.push("Actualizar Windows");

  return {
    cause,
    severity,
    recommendations: Array.from(new Set(recommendations)),
  };
}

interface PcLentaFlowProps {
  onFinish?: () => void;
}

/**
 * Flujo de preguntas del diagnóstico "PC lenta".
 *
 * Recorre las 4 preguntas, guarda respuestas en memoria y, al
 * finalizar, muestra una pantalla de resultado calculada con
 * reglas fijas (sin IA, sin base de datos, sin persistencia).
 */
export function PcLentaFlow({ onFinish }: PcLentaFlowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [showResult, setShowResult] = useState(false);

  const question = QUESTIONS[currentIndex];
  const isLast = currentIndex === QUESTIONS.length - 1;
  const isFirst = currentIndex === 0;
  const progress = ((currentIndex + 1) / QUESTIONS.length) * 100;

  function selectOption(option: string) {
    setAnswers((prev) => ({ ...prev, [question.id]: option }));
  }

  function goNext() {
    if (!isLast) {
      setCurrentIndex((prev) => prev + 1);
    }
  }

  function goBack() {
    if (!isFirst) {
      setCurrentIndex((prev) => prev - 1);
    }
  }

  function handleSeeResult() {
    setShowResult(true);
    onFinish?.();
  }

  function handleRestart() {
    setAnswers({});
    setCurrentIndex(0);
    setShowResult(false);
  }

  const selected = answers[question.id];

  if (showResult) {
    const result = getDiagnosisResult(answers);

    return (
      <div>
        <h1 className="text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
          Resultado del diagnóstico
        </h1>

        <div className="mt-6 rounded-md border border-border bg-surface p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">
            Posible causa principal
          </p>
          <p className="mt-1.5 text-[15px] font-medium text-foreground">
            {result.cause}
          </p>

          <p className="mt-5 text-xs font-medium uppercase tracking-wide text-muted">
            Nivel de gravedad
          </p>
          <span
            className={cn(
              "mt-1.5 inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-medium",
              result.severity === "Alto" &&
                "border-accent bg-accent/15 text-accent",
              result.severity === "Medio" &&
                "border-accent/60 bg-accent/10 text-accent",
              result.severity === "Bajo" &&
                "border-border bg-background text-muted"
            )}
          >
            {result.severity}
          </span>
        </div>

        <div className="mt-6">
          <h2 className="text-[15px] font-medium text-foreground">
            Recomendaciones
          </h2>
          <ul className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {result.recommendations.map((recommendation) => (
              <Card
                key={recommendation}
                className="text-left text-sm text-foreground"
              >
                {recommendation}
              </Card>
            ))}
          </ul>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-md border border-border bg-surface px-5 py-3 text-sm font-medium text-foreground transition-colors hover:border-muted/40"
          >
            Volver al inicio
          </Link>
          <Button onClick={handleRestart}>Realizar nuevamente el diagnóstico</Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-border">
        <div
          className="h-full rounded-full bg-accent transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="mt-2 text-xs text-muted">
        Pregunta {currentIndex + 1} de {QUESTIONS.length}
      </p>

      <h1 className="mt-6 text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
        {question.title}
      </h1>

      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {question.options.map((option) => (
          <Card
            key={option}
            role="button"
            tabIndex={0}
            onClick={() => selectOption(option)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                selectOption(option);
              }
            }}
            className={cn(
              "cursor-pointer text-left text-[15px] font-medium text-foreground transition-colors hover:border-muted/40",
              selected === option && "border-accent bg-accent/10"
            )}
          >
            {option}
          </Card>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between gap-3">
        <Button
          variant="secondary"
          onClick={goBack}
          disabled={isFirst}
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Atrás
        </Button>

        {isLast ? (
          <Button onClick={handleSeeResult} disabled={!selected}>
            Ver resultado
          </Button>
        ) : (
          <Button onClick={goNext} disabled={!selected}>
            Siguiente
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        )}
      </div>
    </div>
  );
}