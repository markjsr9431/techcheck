"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { DiagnosticResult } from "@/lib/types";
import { DiagnosticResultView } from "@/components/diagnostico/diagnostic-result-view";

type QuestionId =
  | "al-conectar"
  | "led-carga"
  | "cargador-original"
  | "bateria-removible"
  | "funciona-conectada";

interface Question {
  id: QuestionId;
  title: string;
  options: string[];
}

const QUESTIONS: Question[] = [
  {
    id: "al-conectar",
    title: "¿Qué sucede al conectar el cargador?",
    options: [
      "No ocurre nada",
      "Carga de forma intermitente",
      "Dice \"Conectado, sin cargar\"",
      "Solo carga apagada",
      "La batería no aumenta",
    ],
  },
  {
    id: "led-carga",
    title: "¿El LED de carga enciende?",
    options: ["Sí", "No", "Mi laptop no tiene LED", "No estoy seguro"],
  },
  {
    id: "cargador-original",
    title: "¿El cargador es el original?",
    options: ["Sí", "No", "No lo sé"],
  },
  {
    id: "bateria-removible",
    title: "¿La batería es removible?",
    options: ["Sí", "No", "No estoy seguro"],
  },
  {
    id: "funciona-conectada",
    title: "¿La laptop funciona conectada al cargador?",
    options: ["Sí", "No", "Algunas veces"],
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
    "al-conectar": alConectar,
    "led-carga": ledCarga,
    "cargador-original": cargadorOriginal,
    "funciona-conectada": funcionaConectada,
  } = answers;

  if (funcionaConectada === "No") {
    return {
      cause: "Posible fallo de la placa de alimentación",
      severity: "Alto",
      recommendations: [
        "No continuar usando el equipo si presenta falsos contactos",
        "Revisar el circuito de carga",
        "Respaldar la información si es posible",
        "Contactar a un técnico especializado",
      ],
    };
  }

  if (alConectar === "No ocurre nada" && ledCarga === "No") {
    return {
      cause: "Posible daño en el puerto de carga",
      severity: "Alto",
      recommendations: [
        "Revisar si el conector tiene movimiento",
        "Inspeccionar visualmente el puerto",
        "Evitar seguir forzando el conector",
        "Contactar a un técnico especializado",
      ],
    };
  }

  if (cargadorOriginal === "No" || cargadorOriginal === "No lo sé") {
    return {
      cause: "Posible fallo del cargador",
      severity: "Medio",
      recommendations: [
        "Verificar el cargador con un multímetro o uno compatible",
        "Revisar el cable por daños",
        "Probar otro tomacorriente",
        "Confirmar el voltaje correcto",
      ],
    };
  }

  if (
    alConectar === "Dice \"Conectado, sin cargar\"" ||
    alConectar === "Carga de forma intermitente"
  ) {
    return {
      cause: "Problema de software o controlador ACPI",
      severity: "Medio",
      recommendations: [
        "Reinstalar el controlador de batería ACPI",
        "Reiniciar el equipo",
        "Actualizar BIOS y Windows",
        "Verificar nuevamente",
      ],
    };
  }

  return {
    cause: "Posible batería desgastada",
    severity: "Medio",
    recommendations: [
      "Revisar el estado de salud de la batería",
      "Ejecutar el reporte de batería de Windows",
      "Considerar reemplazar la batería",
      "Verificar ciclos de carga",
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
    title: "Laptop no carga",
    category: "laptop-no-carga",
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

interface LaptopNoCargaFlowProps {
  onFinish?: () => void;
  onExitFirstQuestion?: () => void;
}

export function LaptopNoCargaFlow({ onFinish, onExitFirstQuestion }: LaptopNoCargaFlowProps) {
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