"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PcLentaFlow } from "@/components/diagnostico/pc-lenta-flow";
import { NoEnciendeFlow } from "@/components/diagnostico/no-enciende-flow";
import { SinInternetFlow } from "@/components/diagnostico/sin-internet-flow";

const OPTIONS = ["PC lenta", "No enciende", "Sin Internet", "Pantalla negra", "Otro"] as const;

type Step = "bienvenida" | "pregunta-1" | "pc-lenta" | "no-enciende" | "sin-internet";

export default function DiagnosticoPage() {
  const [step, setStep] = useState<Step>("bienvenida");

  function selectProblem(option: (typeof OPTIONS)[number]) {
    if (option === "PC lenta") {
      setStep("pc-lenta");
    } else if (option === "No enciende") {
      setStep("no-enciende");
    } else if (option === "Sin Internet") {
      setStep("sin-internet");
    }
  }

  return (
    <>
      <Header />
      <main>
        <Section>
          <Container className="max-w-2xl">
            {step === "bienvenida" && (
              <div className="text-center">
                <h1 className="text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
                  Diagnóstico de tu computador
                </h1>
                <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">
                  Responde algunas preguntas simples y te ayudaremos a
                  identificar el problema de tu equipo paso a paso.
                </p>
                <div className="mt-8 flex justify-center">
                  <Button onClick={() => setStep("pregunta-1")}>
                    Iniciar diagnóstico
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </div>
              </div>
            )}

            {step === "pregunta-1" && (
              <div>
                <h1 className="text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
                  ¿Cuál es el problema principal?
                </h1>

                <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {OPTIONS.map((option) => (
                    <Card
                      key={option}
                      role="button"
                      tabIndex={0}
                      onClick={() => selectProblem(option)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          selectProblem(option);
                        }
                      }}
                      className="cursor-pointer text-left text-[15px] font-medium text-foreground transition-colors hover:border-muted/40"
                    >
                      {option}
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {step === "pc-lenta" && (
              <PcLentaFlow onExitFirstQuestion={() => setStep("pregunta-1")} />
            )}

            {step === "no-enciende" && (
              <NoEnciendeFlow onExitFirstQuestion={() => setStep("pregunta-1")} />
            )}

            {step === "sin-internet" && (
              <SinInternetFlow onExitFirstQuestion={() => setStep("pregunta-1")} />
            )}
          </Container>
        </Section>
      </main>
    </>
  );
}