"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { DiagnosticResult } from "@/lib/types";
import { DiagnosticResultView } from "@/components/diagnostico/diagnostic-result-view";

type QuestionId =
  | "problema"
  | "ubicacion"
  | "comenzo-despues"
  | "windows-detecta"
  | "tipo-equipo";

interface Question {
  id: QuestionId;
  title: string;
  options: string[];
}

const QUESTIONS: Question[] = [
  {
    id: "problema",
    title: "¿Cuál es el problema?",
    options: [
      "No se escucha absolutamente nada",
      "Solo un parlante funciona",
      "Se escucha con interferencia",
      "El sonido se corta",
      "Solo no hay sonido en una aplicación",
    ],
  },
  {
    id: "ubicacion",
    title: "¿Dónde ocurre el problema?",
    options: ["Parlantes", "Audífonos", "HDMI", "Bluetooth", "Todos los dispositivos"],
  },
  {
    id: "comenzo-despues",
    title: "¿El problema comenzó después de...?",
    options: [
      "Actualizar Windows",
      "Instalar un controlador",
      "Conectar un dispositivo nuevo",
      "No lo sé",
      "Ninguna de las anteriores",
    ],
  },
  {
    id: "windows-detecta",
    title: "¿Windows detecta el dispositivo de audio?",
    options: ["Sí", "No", "No estoy seguro"],
  },
  {
    id: "tipo-equipo",
    title: "¿Qué tipo de equipo utilizas?",
    options: ["PC de escritorio", "Laptop", "No estoy seguro"],
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
    problema,
    ubicacion,
    "comenzo-despues": comenzoDespues,
    "windows-detecta": windowsDetecta,
  } = answers;

  if (windowsDetecta === "No") {
    return {
      cause: "Posible fallo de hardware de la tarjeta de sonido",
      severity: "Alto",
      recommendations: [
        "Verificar el dispositivo en el Administrador de dispositivos",
        "Comprobar si el audio funciona desde otro sistema operativo",
        "Considerar reemplazo del hardware",
        "Contactar a un técnico especializado",
      ],
    };
  }

  if (
    problema === "Solo un parlante funciona" ||
    problema === "Se escucha con interferencia"
  ) {
    return {
      cause: "Posible fallo del dispositivo de audio",
      severity: "Alto",
      recommendations: [
        "Probar otros parlantes o audífonos",
        "Verificar conexiones físicas",
        "Probar otro puerto",
        "Contactar a un técnico especializado",
      ],
    };
  }

  if (
    comenzoDespues === "Instalar un controlador" ||
    comenzoDespues === "Actualizar Windows"
  ) {
    return {
      cause: "Controlador de audio dañado",
      severity: "Medio",
      recommendations: [
        "Actualizar o reinstalar el controlador",
        "Ejecutar Windows Update",
        "Reiniciar el equipo",
        "Verificar nuevamente el sonido",
      ],
    };
  }

  if (
    problema === "Solo no hay sonido en una aplicación" ||
    ubicacion === "HDMI" ||
    ubicacion === "Bluetooth"
  ) {
    return {
      cause: "Dispositivo de salida incorrecto",
      severity: "Bajo",
      recommendations: [
        "Seleccionar el dispositivo de reproducción correcto",
        "Verificar el volumen del sistema",
        "Reiniciar el servicio de audio",
        "Probar nuevamente",
      ],
    };
  }

  return {
    cause: "Problema de configuración de Windows",
    severity: "Medio",
    recommendations: [
      "Ejecutar el solucionador de problemas de audio",
      "Revisar los servicios de audio",
      "Restablecer la configuración de sonido",
      "Reiniciar el equipo",
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
    title: "Sin sonido",
    category: "sin-sonido",
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

interface SinSonidoFlowProps {
  onFinish?: () => void;
  onExitFirstQuestion?: () => void;
}

export function SinSonidoFlow({ onFinish, onExitFirstQuestion }: SinSonidoFlowProps) {
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