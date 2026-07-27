"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

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

interface PcLentaFlowProps {
  onFinish?: () => void;
}

/**
 * Flujo de preguntas del diagnóstico "PC lenta".
 *
 * Solo recorre las 4 preguntas, guarda respuestas en memoria y
 * expone "Ver resultado" al final. No calcula ni interpreta
 * ningún resultado.
 */
export function PcLentaFlow({ onFinish }: PcLentaFlowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});

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
    }
  }

  const selected = answers[question.id];

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
          disabled={isFirst}
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Atrás
        </Button>

        {isLast ? (
          <Button onClick={onFinish} disabled={!selected || !onFinish}>
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