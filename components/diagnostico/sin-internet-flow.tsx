"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { DiagnosticResult } from "@/lib/types";
import { DiagnosticResultView } from "@/components/diagnostico/diagnostic-result-view";

type QuestionId = "otros-dispositivos" | "router" | "cable-wifi" | "mensaje";

interface Question {
  id: QuestionId;
  title: string;
  options: string[];
}

const QUESTIONS: Question[] = [
  {
    id: "otros-dispositivos",
    title: "¿Otros dispositivos (celular, tablet) tienen internet en la misma red?",
    options: ["Sí", "No", "No lo sé"],
  },
  {
    id: "router",
    title: "¿Las luces del router/módem están encendidas y estables?",
    options: ["Sí, todas normales", "Parpadean o hay alguna apagada", "No hay luces encendidas"],
  },
  {
    id: "cable-wifi",
    title: "¿Te conectas por cable o por Wi-Fi?",
    options: ["Por cable", "Por Wi-Fi", "He probado ambos"],
  },
  {
    id: "mensaje",
    title: "¿Qué mensaje muestra el equipo al intentar navegar?",
    options: [
      "Sin conexión / sin Internet",
      "Conectado, sin acceso a Internet",
      "No muestra ningún error",
    ],
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
  const { "otros-dispositivos": otrosDispositivos, router, "cable-wifi": cableWifi, mensaje } = answers;
  const recommendations: string[] = [];

  let cause = "Posible falla temporal de conexión";
  let severity: Severity = "Bajo";

  if (otrosDispositivos === "No") {
    cause = "Falla del servicio de Internet o del router";
    severity = "Alto";
    recommendations.push(
      "Reiniciar el router/módem desconectándolo 30 segundos",
      "Contactar al proveedor de servicio de Internet (ISP)"
    );
  }

  if (router === "No hay luces encendidas") {
    cause = "El router/módem no está recibiendo energía";
    severity = "Alto";
    recommendations.push("Verificar la conexión eléctrica del router/módem");
  }

  if (router === "Parpadean o hay alguna apagada") {
    cause = severity === "Alto" ? cause : "Posible falla de señal del proveedor";
    severity = severity === "Alto" ? severity : "Medio";
    recommendations.push("Reiniciar el router/módem desconectándolo 30 segundos");
  }

  if (otrosDispositivos === "Sí" && cableWifi === "Por Wi-Fi") {
    cause = severity === "Alto" ? cause : "Posible problema de Wi-Fi en este equipo";
    severity = severity === "Alto" ? severity : "Medio";
    recommendations.push(
      "Olvidar la red Wi-Fi y volver a conectarse",
      "Acercar el equipo al router o probar con cable de red"
    );
  }

  if (otrosDispositivos === "Sí" && cableWifi === "Por cable") {
    cause = severity === "Alto" ? cause : "Posible falla del cable o adaptador de red";
    severity = severity === "Alto" ? severity : "Medio";
    recommendations.push("Probar con otro cable de red o puerto del router");
  }

  if (mensaje === "Conectado, sin acceso a Internet") {
    cause = severity === "Alto" ? cause : "Posible problema de DNS o configuración de red";
    severity = severity === "Alto" ? severity : "Medio";
    recommendations.push("Reiniciar el equipo y probar de nuevo la navegación");
  }

  if (otrosDispositivos === "No lo sé") {
    recommendations.push("Probar la conexión en otro dispositivo dentro de la misma red");
  }

  recommendations.push("Reiniciar el router y el equipo antes de un nuevo intento");

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
    title: "Sin Internet",
    category: "sin-internet",
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

interface SinInternetFlowProps {
  onFinish?: () => void;
  onExitFirstQuestion?: () => void;
}

export function SinInternetFlow({ onFinish, onExitFirstQuestion }: SinInternetFlowProps) {
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