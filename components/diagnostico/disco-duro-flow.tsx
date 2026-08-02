"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { DiagnosticResult } from "@/lib/types";
import { DiagnosticResultView } from "@/components/diagnostico/diagnostic-result-view";

type QuestionId =
  | "sintoma"
  | "frecuencia"
  | "ubicacion-windows"
  | "mensajes"
  | "acceso-archivos";

interface Question {
  id: QuestionId;
  title: string;
  options: string[];
}

const QUESTIONS: Question[] = [
  {
    id: "sintoma",
    title: "¿Cuál es el síntoma principal?",
    options: [
      "El computador está muy lento",
      "Se escuchan clics o ruidos extraños",
      "Windows no inicia",
      "Aparecen errores de lectura o escritura",
      "Archivos desaparecen o se corrompen",
      "Otro",
    ],
  },
  {
    id: "frecuencia",
    title: "¿El problema ocurre siempre?",
    options: ["Sí", "Solo algunas veces", "Empezó recientemente", "No estoy seguro"],
  },
  {
    id: "ubicacion-windows",
    title: "¿Dónde está instalado Windows?",
    options: ["SSD", "Disco duro mecánico (HDD)", "No lo sé"],
  },
  {
    id: "mensajes",
    title: "¿Has recibido alguno de estos mensajes?",
    options: ["SMART Failure", "No boot device", "Error de disco", "Ninguno"],
  },
  {
    id: "acceso-archivos",
    title: "¿Puedes acceder normalmente a tus archivos?",
    options: ["Sí", "Solo algunos", "No puedo acceder", "Windows no inicia"],
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
    sintoma,
    "ubicacion-windows": ubicacionWindows,
    mensajes,
    "acceso-archivos": accesoArchivos,
  } = answers;

  if (mensajes === "No boot device") {
    return {
      cause: "Windows no encuentra el dispositivo de almacenamiento",
      severity: "Alto",
      recommendations: [
        "Revisar conexiones SATA o M.2",
        "Verificar si el disco aparece en la BIOS",
        "No reinstalar Windows antes de respaldar la información",
        "Contactar a un técnico especializado",
      ],
    };
  }

  if (
    sintoma === "Windows no inicia" ||
    accesoArchivos === "Windows no inicia" ||
    accesoArchivos === "No puedo acceder"
  ) {
    if (ubicacionWindows === "SSD") {
      return {
        cause: "Posible fallo del SSD",
        severity: "Alto",
        recommendations: [
          "Verificar el estado SMART",
          "Revisar garantía del SSD",
          "Respaldar la información",
          "Contactar a un técnico especializado",
        ],
      };
    }

    return {
      cause: "Posible fallo físico del disco",
      severity: "Alto",
      recommendations: [
        "No seguir utilizando el equipo innecesariamente",
        "Respaldar la información cuanto antes",
        "Reemplazar el disco",
        "Contactar a un técnico especializado",
      ],
    };
  }

  if (
    sintoma === "Se escuchan clics o ruidos extraños" ||
    mensajes === "SMART Failure"
  ) {
    if (ubicacionWindows === "SSD") {
      return {
        cause: "Posible fallo del SSD",
        severity: "Alto",
        recommendations: [
          "Verificar el estado SMART",
          "Revisar garantía del SSD",
          "Respaldar la información",
          "Contactar a un técnico especializado",
        ],
      };
    }

    return {
      cause: "Posible fallo físico del disco",
      severity: "Alto",
      recommendations: [
        "No seguir utilizando el equipo innecesariamente",
        "Respaldar la información cuanto antes",
        "Reemplazar el disco",
        "Contactar a un técnico especializado",
      ],
    };
  }

  if (
    sintoma === "Aparecen errores de lectura o escritura" ||
    sintoma === "Archivos desaparecen o se corrompen" ||
    mensajes === "Error de disco" ||
    accesoArchivos === "Solo algunos"
  ) {
    return {
      cause: "Posibles sectores defectuosos",
      severity: "Medio",
      recommendations: [
        "Respaldar la información inmediatamente",
        "Ejecutar diagnóstico SMART",
        "Revisar el estado del disco",
        "Considerar reemplazar el disco si aumentan los errores",
      ],
    };
  }

  return {
    cause: "Disco saludable con posible problema de software",
    severity: "Bajo",
    recommendations: [
      "Ejecutar CHKDSK",
      "Revisar archivos del sistema",
      "Comprobar espacio disponible",
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
    title: "Disco duro",
    category: "disco-duro",
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

interface DiscoDuroFlowProps {
  onFinish?: () => void;
  onExitFirstQuestion?: () => void;
}

export function DiscoDuroFlow({ onFinish, onExitFirstQuestion }: DiscoDuroFlowProps) {
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