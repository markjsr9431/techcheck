"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Home as HomeIcon, ChevronRight } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PcLentaFlow } from "@/components/diagnostico/pc-lenta-flow";
import { NoEnciendeFlow } from "@/components/diagnostico/no-enciende-flow";
import { SinInternetFlow } from "@/components/diagnostico/sin-internet-flow";
import { PantallaNegraFlow } from "@/components/diagnostico/pantalla-negra-flow";
import { OtroFlow } from "@/components/diagnostico/otro-flow";
import { PosibleVirusFlow } from "@/components/diagnostico/posible-virus-flow";
import { DiscoDuroFlow } from "@/components/diagnostico/disco-duro-flow";

const OPTIONS = ["PC lenta", "No enciende", "Sin Internet", "Pantalla negra", "Posible virus", "Disco duro", "Otro"] as const;

type Step =
  | "bienvenida"
  | "pregunta-1"
  | "pc-lenta"
  | "no-enciende"
  | "sin-internet"
  | "pantalla-negra"
  | "posible-virus"
  | "disco-duro"
  | "otro";

const STEP_LABELS: Record<Step, string> = {
  bienvenida: "Inicio del diagnóstico",
  "pregunta-1": "Selección de problema",
  "pc-lenta": "PC lenta",
  "no-enciende": "No enciende",
  "sin-internet": "Sin Internet",
  "pantalla-negra": "Pantalla negra",
  "posible-virus": "Posible virus",
  "disco-duro": "Disco duro",
  otro: "Otro",
};

export default function DiagnosticoPage() {
  const [step, setStep] = useState<Step>("bienvenida");

  function selectProblem(option: (typeof OPTIONS)[number]) {
    if (option === "PC lenta") {
      setStep("pc-lenta");
    } else if (option === "No enciende") {
      setStep("no-enciende");
    } else if (option === "Sin Internet") {
      setStep("sin-internet");
    } else if (option === "Pantalla negra") {
      setStep("pantalla-negra");
    } else if (option === "Posible virus") {
      setStep("posible-virus");
    } else if (option === "Disco duro") {
      setStep("disco-duro");
    } else if (option === "Otro") {
      setStep("otro");
    }
  }

  return (
    <>
      <Header />
      <main>
        <Section>
          <Container className="max-w-2xl">
            <nav
              aria-label="Ruta de navegación"
              className="mb-6 flex flex-wrap items-center gap-1.5 text-xs text-muted"
            >
              <Link
                href="/"
                className="inline-flex items-center gap-1 rounded-md px-1.5 py-1 transition-colors hover:text-foreground"
              >
                <HomeIcon className="h-3.5 w-3.5" aria-hidden="true" />
                Inicio
              </Link>
              <ChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              {step === "bienvenida" ? (
                <span className="font-medium text-foreground">Diagnóstico</span>
              ) : (
                <button
                  type="button"
                  onClick={() => setStep("bienvenida")}
                  className="rounded-md px-1.5 py-1 transition-colors hover:text-foreground"
                >
                  Diagnóstico
                </button>
              )}
              {step !== "bienvenida" && step !== "pregunta-1" && (
                <>
                  <ChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  <button
                    type="button"
                    onClick={() => setStep("pregunta-1")}
                    className="rounded-md px-1.5 py-1 transition-colors hover:text-foreground"
                  >
                    Selección de problema
                  </button>
                  <ChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  <span className="font-medium text-foreground">
                    {STEP_LABELS[step]}
                  </span>
                </>
              )}
              {step === "pregunta-1" && (
                <>
                  <ChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  <span className="font-medium text-foreground">
                    {STEP_LABELS[step]}
                  </span>
                </>
              )}
            </nav>

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

            {step === "pantalla-negra" && (
              <PantallaNegraFlow onExitFirstQuestion={() => setStep("pregunta-1")} />
            )}

            {step === "posible-virus" && (
              <PosibleVirusFlow onExitFirstQuestion={() => setStep("pregunta-1")} />
            )}

            {step === "disco-duro" && (
              <DiscoDuroFlow onExitFirstQuestion={() => setStep("pregunta-1")} />
            )}

            {step === "otro" && (
              <OtroFlow onExitFirstQuestion={() => setStep("pregunta-1")} />
            )}
          </Container>
        </Section>
      </main>
    </>
  );
}