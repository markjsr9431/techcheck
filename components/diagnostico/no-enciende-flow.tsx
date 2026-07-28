"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type QuestionId = "luces" | "sonidos" | "cable" | "bateria";

interface Question {
  id: QuestionId;
  title: string;
  options: string[];
}

const QUESTIONS: Question[] = [
  {
    id: "luces",
    title: "¿Se enciende alguna luz o LED al conectar el equipo?",
    options: ["Sí", "No", "No lo sé"],
  },
  {
    id: "sonidos",
    title: "¿Escuchas algún sonido (ventiladores, pitidos) al intentar encenderlo?",
    options: ["Sí, funciona normal", "Sí, pero hace pitidos", "No, no hace nada"],
  },
  {
    id: "cable",
    title: "¿Ya probaste con otro cable o toma de corriente?",
    options: ["Sí", "No", "No aplica (es portátil)"],
  },
  {
    id: "bateria",
    title: "¿El equipo es portátil y has probado sin la batería, solo con el cargador?",
    options: ["Sí", "No", "No aplica (es de escritorio)"],
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
  const { luces, sonidos, cable, bateria } = answers;
  const recommendations: string[] = [];

  let cause = "Posible falla de encendido no crítica";
  let severity: Severity = "Bajo";

  if (luces === "No" && sonidos === "No, no hace nada") {
    cause = "Sin llegada de energía al equipo";
    severity = "Alto";
    recommendations.push(
      "Verificar la toma de corriente con otro dispositivo",
      "Probar con otro cable de poder"
    );
  }

  if (sonidos === "Sí, pero hace pitidos") {
    cause = "Posible falla de memoria RAM o tarjeta madre";
    severity = "Alto";
    recommendations.push("Contactar a un técnico especializado");
  }

  if (cable === "No") {
    recommendations.push("Probar con otro cable o toma de corriente");
  }

  if (bateria === "No") {
    cause = severity === "Alto" ? cause : "Posible falla de batería";
    severity = severity === "Alto" ? severity : "Medio";
    recommendations.push("Probar el equipo sin la batería, solo con el cargador");
  }

  if (luces === "Sí" && sonidos === "Sí, funciona normal") {
    cause = "El equipo enciende pero no muestra imagen";
    severity = severity === "Alto" ? severity : "Medio";
    recommendations.push("Revisar la conexión del monitor o pantalla");
  }

  if (luces === "No lo sé") {
    recommendations.push("Verificar la toma de corriente con otro dispositivo");
  }

  recommendations.push("Reiniciar el equipo tras revisar las conexiones");

  return {
    cause,
    severity,
    recommendations: Array.from(new Set(recommendations)),
  };
}

interface NoEnciendeFlowProps {
  onFinish?: () => void;
  onExitFirstQuestion?: () => void;
}

export function NoEnciendeFlow({ onFinish, onExitFirstQuestion }: NoEnciendeFlowProps) {
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