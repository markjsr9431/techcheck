"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { DiagnosticResult } from "@/lib/types";
import { DiagnosticResultView } from "@/components/diagnostico/diagnostic-result-view";

type QuestionId = "tipo-problema" | "frecuencia" | "momento-inicio" | "cambios-recientes";

interface Question {
  id: QuestionId;
  title: string;
  options: string[];
}

const QUESTIONS: Question[] = [
  {
    id: "tipo-problema",
    title: "¿Cómo describirías mejor el problema que presenta tu equipo?",
    options: [
      "Comportamiento inusual (errores, cierres, reinicios)",
      "Un componente específico no funciona (sonido, teclado, cámara, etc.)",
      "El equipo funciona pero de forma inconsistente",
      "No estoy seguro de cómo describirlo",
    ],
  },
  {
    id: "frecuencia",
    title: "¿Con qué frecuencia ocurre el problema?",
    options: [
      "Siempre que uso el equipo",
      "Solo en ciertas ocasiones",
      "Ocurrió una sola vez",
      "No lo he notado con claridad",
    ],
  },
  {
    id: "momento-inicio",
    title: "¿Cuándo comenzó a presentarse el problema?",
    options: [
      "Después de una actualización o instalación",
      "Después de un golpe, caída o derrame de líquido",
      "Sin una causa aparente",
      "No lo recuerdo",
    ],
  },
  {
    id: "cambios-recientes",
    title: "¿Has realizado cambios recientes en el equipo (hardware o software)?",
    options: [
      "Sí, instalé o cambié algo recientemente",
      "No he hecho ningún cambio",
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
    "tipo-problema": tipoProblema,
    frecuencia,
    "momento-inicio": momentoInicio,
    "cambios-recientes": cambiosRecientes,
  } = answers;
  const recommendations: string[] = [];

  let cause = "Problema no clasificado dentro de las categorías comunes";
  let severity: Severity = "Bajo";

  if (momentoInicio === "Después de un golpe, caída o derrame de líquido") {
    cause = "Posible daño físico en el equipo";
    severity = "Alto";
    recommendations.push(
      "Evitar seguir usando el equipo hasta revisarlo",
      "Llevar el equipo a un servicio técnico especializado"
    );
  }

  if (momentoInicio === "Después de una actualización o instalación") {
    cause = severity === "Alto" ? cause : "El problema puede estar relacionado con un cambio de software reciente";
    severity = severity === "Alto" ? severity : "Medio";
    recommendations.push(
      "Revisar si el problema comenzó justo después de instalar algo",
      "Desinstalar o revertir la actualización más reciente si es posible"
    );
  }

  if (cambiosRecientes === "Sí, instalé o cambié algo recientemente") {
    recommendations.push("Verificar la compatibilidad del componente o programa instalado");
  }

  if (frecuencia === "Siempre que uso el equipo") {
    cause = severity === "Alto" ? cause : "Problema recurrente que afecta el uso normal del equipo";
    severity = severity === "Alto" ? severity : "Medio";
    recommendations.push("Registrar en qué momento exacto ocurre el problema para facilitar el diagnóstico");
  }

  if (tipoProblema === "Un componente específico no funciona (sonido, teclado, cámara, etc.)") {
    recommendations.push(
      "Verificar drivers o controladores del componente afectado",
      "Probar el componente en otro equipo si es posible (periféricos externos)"
    );
  }

  if (tipoProblema === "El equipo funciona pero de forma inconsistente") {
    recommendations.push("Revisar el Administrador de tareas para identificar procesos con alto consumo");
  }

  if (
    tipoProblema === "No estoy seguro de cómo describirlo" ||
    frecuencia === "No lo he notado con claridad" ||
    momentoInicio === "No lo recuerdo"
  ) {
    recommendations.push("Anotar los detalles del problema (cuándo ocurre, qué se ve o escucha) antes de buscar soporte técnico");
  }

  recommendations.push("Reiniciar el equipo y observar si el problema persiste");

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
    title: "Otro",
    category: "otro",
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

interface OtroFlowProps {
  onFinish?: () => void;
  onExitFirstQuestion?: () => void;
}

export function OtroFlow({ onFinish, onExitFirstQuestion }: OtroFlowProps) {
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