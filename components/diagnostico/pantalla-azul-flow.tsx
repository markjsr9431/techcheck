"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { DiagnosticResult } from "@/lib/types";
import { DiagnosticResultView } from "@/components/diagnostico/diagnostic-result-view";

type QuestionId =
  | "momento-aparicion"
  | "reinicio-automatico"
  | "instalacion-reciente"
  | "inicio-windows"
  | "frecuencia-error";

interface Question {
  id: QuestionId;
  title: string;
  options: string[];
}

const QUESTIONS: Question[] = [
  {
    id: "momento-aparicion",
    title: "¿Cuándo aparece la pantalla azul?",
    options: [
      "Al iniciar Windows",
      "Mientras estoy usando el computador",
      "Al jugar o ejecutar programas pesados",
      "Después de una actualización",
      "Ocurre aleatoriamente",
    ],
  },
  {
    id: "reinicio-automatico",
    title: "¿El computador se reinicia automáticamente?",
    options: ["Sí", "No", "Algunas veces"],
  },
  {
    id: "instalacion-reciente",
    title: "¿Instalaste recientemente alguno de estos elementos?",
    options: [
      "Controladores (drivers)",
      "Actualizaciones de Windows",
      "Hardware nuevo",
      "Ninguno",
      "No lo sé",
    ],
  },
  {
    id: "inicio-windows",
    title: "¿Puedes iniciar Windows normalmente?",
    options: ["Sí", "Solo en Modo Seguro", "No inicia"],
  },
  {
    id: "frecuencia-error",
    title: "¿El error ocurre siempre?",
    options: [
      "En cada inicio",
      "Solo ocasionalmente",
      "Solo bajo carga (juegos, edición, etc.)",
      "No estoy seguro",
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
  const {
    "instalacion-reciente": instalacionReciente,
    "inicio-windows": inicioWindows,
    "frecuencia-error": frecuenciaError,
  } = answers;

  if (inicioWindows === "No inicia" || frecuenciaError === "En cada inicio") {
    return {
      cause: "Error crítico recurrente de Windows",
      severity: "Alto",
      recommendations: [
        "Intentar iniciar en Modo Seguro",
        "Restaurar el sistema",
        "Analizar archivos de volcado (Minidump) si existen",
        "Contactar a un técnico especializado",
      ],
    };
  }

  if (
    instalacionReciente === "Controladores (drivers)" ||
    instalacionReciente === "Hardware nuevo"
  ) {
    return {
      cause: "Posible conflicto de controladores",
      severity: "Medio",
      recommendations: [
        "Actualizar o revertir los controladores instalados recientemente",
        "Revisar el Administrador de dispositivos",
        "Ejecutar Windows Update",
        "Reiniciar el equipo y verificar si el problema desaparece",
      ],
    };
  }

  if (frecuenciaError === "Solo bajo carga (juegos, edición, etc.)") {
    return {
      cause: "Posible fallo de memoria RAM o hardware",
      severity: "Alto",
      recommendations: [
        "Ejecutar el Diagnóstico de memoria de Windows",
        "Revisar módulos RAM",
        "Comprobar temperaturas del equipo",
        "Contactar a un técnico especializado",
      ],
    };
  }

  if (instalacionReciente === "Actualizaciones de Windows") {
    return {
      cause: "Posible corrupción de archivos del sistema",
      severity: "Medio",
      recommendations: [
        "Ejecutar SFC /scannow",
        "Ejecutar DISM",
        "Instalar todas las actualizaciones pendientes",
        "Reiniciar el equipo",
      ],
    };
  }

  return {
    cause: "Posible fallo de almacenamiento (SSD/HDD)",
    severity: "Alto",
    recommendations: [
      "Revisar el estado SMART del disco",
      "Ejecutar CHKDSK",
      "Respaldar la información importante",
      "Contactar a un técnico especializado",
    ],
  };
}

/**
 * Adapta el resultado interno de este diagnóstico y las respuestas
 * crudas al contrato compartido `DiagnosticResult`.
 */
function toDiagnosticResult(answers: Answers): DiagnosticResult {
  const result = getDiagnosisResult(answers);

  return {
    title: "Pantalla azul",
    category: "pantalla-azul",
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

interface PantallaAzulFlowProps {
  onFinish?: () => void;
  onExitFirstQuestion?: () => void;
}

export function PantallaAzulFlow({ onFinish, onExitFirstQuestion }: PantallaAzulFlowProps) {
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