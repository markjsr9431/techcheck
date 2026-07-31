"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { DiagnosticResult } from "@/lib/types";
import { DiagnosticResultView } from "@/components/diagnostico/diagnostic-result-view";

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

/**
 * Adapta el resultado interno de este diagnóstico (cause/severity/
 * recommendations) y las respuestas crudas al contrato compartido
 * `DiagnosticResult`, que es lo único que conocen la pantalla de
 * resultado y el futuro exportador de PDF.
 */
function toDiagnosticResult(answers: Answers): DiagnosticResult {
  const result = getDiagnosisResult(answers);

  return {
    title: "PC lenta",
    category: "pc-lenta",
    severity: result.severity,
    probableCause: result.cause,
    recommendations: result.recommendations,
    answers: QUESTIONS.map((q) => ({
      question: q.title,
      answer: answers[q.id] ?? "",
    })),
    generatedAt: new Date(),
  };
}

interface PcLentaFlowProps {
  onFinish?: () => void;
  onExitFirstQuestion?: () => void;
}

/**
 * Flujo de preguntas del diagnóstico "PC lenta".
 *
 * Recorre las 4 preguntas, guarda respuestas en memoria y, al
 * finalizar, muestra una pantalla de resultado calculada con
 * reglas fijas (sin IA, sin base de datos, sin persistencia).
 */
export function PcLentaFlow({ onFinish, onExitFirstQuestion }: PcLentaFlowProps) {
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
    } else {
      onExitFirstQuestion?.();
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
    return (
      <DiagnosticResultView
        result={toDiagnosticResult(answers)}
        onRestart={handleRestart}
      />
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
            aria-pressed={selected === option}
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