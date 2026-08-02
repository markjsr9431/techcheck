"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { DiagnosticResult } from "@/lib/types";
import { DiagnosticResultView } from "@/components/diagnostico/diagnostic-result-view";

type QuestionId =
  | "comportamiento"
  | "inicio-problema"
  | "antivirus-instalado"
  | "antivirus-detecta"
  | "inicio-windows";

interface Question {
  id: QuestionId;
  title: string;
  options: string[];
}

const QUESTIONS: Question[] = [
  {
    id: "comportamiento",
    title: "¿Qué comportamiento presenta el computador?",
    options: [
      "Aparecen muchas ventanas o anuncios",
      "El computador está extremadamente lento",
      "El navegador cambia solo de página o buscador",
      "El antivirus detectó una amenaza",
      "Archivos desaparecieron o fueron cifrados",
      "Otro",
    ],
  },
  {
    id: "inicio-problema",
    title: "¿Cuándo comenzó el problema?",
    options: [
      "Después de instalar un programa",
      "Después de descargar un archivo",
      "Después de conectar una memoria USB",
      "Después de abrir un correo",
      "No lo sé",
    ],
  },
  {
    id: "antivirus-instalado",
    title: "¿Tienes instalado un antivirus?",
    options: ["Windows Defender", "Otro antivirus", "No tengo", "No estoy seguro"],
  },
  {
    id: "antivirus-detecta",
    title: "¿El antivirus detecta amenazas actualmente?",
    options: ["Sí", "No", "Nunca he realizado un análisis"],
  },
  {
    id: "inicio-windows",
    title: "¿Puedes iniciar Windows normalmente?",
    options: ["Sí", "Solo inicia en Modo Seguro", "No inicia"],
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
    comportamiento,
    "inicio-windows": inicioWindows,
    "antivirus-detecta": antivirusDetecta,
  } = answers;

  if (inicioWindows === "No inicia") {
    return {
      cause: "Infección grave que impide iniciar Windows",
      severity: "Alto",
      recommendations: [
        "Iniciar desde un medio de recuperación",
        "Ejecutar un análisis offline",
        "Respaldar la información si es posible",
        "Contactar a un técnico especializado",
      ],
    };
  }

  if (comportamiento === "Archivos desaparecieron o fueron cifrados") {
    return {
      cause: "Posible ransomware",
      severity: "Alto",
      recommendations: [
        "Desconectar Internet inmediatamente",
        "No pagar ningún rescate",
        "Intentar respaldar la información si es posible",
        "Contactar a un técnico especializado",
      ],
    };
  }

  if (
    comportamiento === "El antivirus detectó una amenaza" ||
    antivirusDetecta === "Sí"
  ) {
    return {
      cause: "Posible malware activo",
      severity: "Medio",
      recommendations: [
        "Ejecutar un análisis sin conexión de Microsoft Defender",
        "Actualizar el antivirus",
        "Analizar el equipo con una segunda herramienta",
        "No ingresar contraseñas hasta finalizar el análisis",
      ],
    };
  }

  if (
    comportamiento === "Aparecen muchas ventanas o anuncios" ||
    comportamiento === "El navegador cambia solo de página o buscador"
  ) {
    return {
      cause: "Posible adware o PUP",
      severity: "Bajo",
      recommendations: [
        "Ejecutar un análisis completo",
        "Desinstalar programas recientes",
        "Revisar las extensiones del navegador",
        "Reiniciar el equipo",
      ],
    };
  }

  return {
    cause: "No se encontraron indicios suficientes de infección",
    severity: "Bajo",
    recommendations: [
      "Actualizar Windows",
      "Ejecutar un análisis completo",
      "Mantener Microsoft Defender activo",
      "Evitar descargar software de origen desconocido",
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
    title: "Posible virus",
    category: "posible-virus",
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

interface PosibleVirusFlowProps {
  onFinish?: () => void;
  onExitFirstQuestion?: () => void;
}

export function PosibleVirusFlow({ onFinish, onExitFirstQuestion }: PosibleVirusFlowProps) {
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