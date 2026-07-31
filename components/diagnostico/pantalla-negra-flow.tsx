"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { DiagnosticResult } from "@/lib/types";
import { DiagnosticResultView } from "@/components/diagnostico/diagnostic-result-view";

type QuestionId = "luces-equipo" | "ruido-ventiladores" | "monitor" | "conexion-video";

interface Question {
  id: QuestionId;
  title: string;
  options: string[];
}

const QUESTIONS: Question[] = [
  {
    id: "luces-equipo",
    title: "¿Las luces del computador (encendido, teclado) están encendidas?",
    options: ["Sí, están encendidas", "No, no hay ninguna luz", "No lo sé"],
  },
  {
    id: "ruido-ventiladores",
    title: "¿Escuchas ruido de ventiladores o el equipo se siente encendido?",
    options: ["Sí, se escucha funcionando", "No se escucha nada", "No estoy seguro"],
  },
  {
    id: "monitor",
    title: "¿El monitor está encendido (tiene luz indicadora activa)?",
    options: ["Sí, está encendido", "No, está apagado", "No lo sé"],
  },
  {
    id: "conexion-video",
    title: "¿El cable de video está bien conectado entre el monitor y el equipo?",
    options: ["Sí, está bien conectado", "No estoy seguro", "Lo desconecté y reconecté y sigue igual"],
  },
];

type Answers = Partial<Record<QuestionId, string>>;

type Severity = "Bajo" | "Medio" | "Alto";

interface DiagnosisResult {
  cause: string;
  severity: Severity;
  recommendations: string[];
}

function getDiagnosisResult(answers: Answers): DiagnosisResult {
  const {
    "luces-equipo": lucesEquipo,
    "ruido-ventiladores": ruidoVentiladores,
    monitor,
    "conexion-video": conexionVideo,
  } = answers;
  const recommendations: string[] = [];

  let cause = "Posible falla temporal de salida de video";
  let severity: Severity = "Bajo";

  if (lucesEquipo === "No, no hay ninguna luz" && ruidoVentiladores === "No se escucha nada") {
    cause = "El equipo no está encendiendo (posible falla de energía)";
    severity = "Alto";
    recommendations.push(
      "Verificar la conexión eléctrica y el cable de poder",
      "Probar con otro tomacorriente"
    );
  }

  if (
    (lucesEquipo === "Sí, están encendidas" || ruidoVentiladores === "Sí, se escucha funcionando") &&
    monitor === "No, está apagado"
  ) {
    cause = severity === "Alto" ? cause : "El monitor no está recibiendo energía";
    severity = severity === "Alto" ? severity : "Alto";
    recommendations.push(
      "Verificar el cable de poder del monitor",
      "Probar el botón de encendido del monitor"
    );
  }

  if (
    (lucesEquipo === "Sí, están encendidas" || ruidoVentiladores === "Sí, se escucha funcionando") &&
    monitor === "Sí, está encendido" &&
    conexionVideo !== "Sí, está bien conectado"
  ) {
    cause = severity === "Alto" ? cause : "Posible falla en el cable o conexión de video";
    severity = severity === "Alto" ? severity : "Medio";
    recommendations.push(
      "Revisar que el cable de video esté firmemente conectado en ambos extremos",
      "Probar con otro cable de video si está disponible",
      "Probar otra entrada de video (HDMI, VGA, DisplayPort) en el monitor"
    );
  }

  if (conexionVideo === "Lo desconecté y reconecté y sigue igual") {
    recommendations.push("Probar el monitor con otro equipo para descartar falla del monitor");
  }

  if (monitor === "No lo sé") {
    recommendations.push("Verificar si el monitor tiene una luz indicadora de encendido");
  }

  recommendations.push("Reiniciar el equipo y el monitor antes de un nuevo intento");

  return {
    cause,
    severity,
    recommendations: Array.from(new Set(recommendations)),
  };
}

/**
 * Adapta el resultado interno de este diagnóstico y las respuestas
 * crudas al contrato compartido `DiagnosticResult`.
 */
function toDiagnosticResult(answers: Answers): DiagnosticResult {
  const result = getDiagnosisResult(answers);

  return {
    title: "Pantalla negra",
    category: "pantalla-negra",
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

interface PantallaNegraFlowProps {
  onFinish?: () => void;
  onExitFirstQuestion?: () => void;
}

export function PantallaNegraFlow({ onFinish, onExitFirstQuestion }: PantallaNegraFlowProps) {
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