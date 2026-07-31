"use client";

import Link from "next/link";
import { Download } from "lucide-react";
import { jsPDF } from "jspdf";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { DiagnosticResult } from "@/lib/types";

interface DiagnosticResultViewProps {
  result: DiagnosticResult;
  onRestart: () => void;
}

/**
 * Pantalla de resultado compartida por todos los diagnósticos.
 *
 * Recibe únicamente un `DiagnosticResult` ya calculado: no conoce
 * las preguntas, los IDs de respuesta ni las reglas de ningún
 * diagnóstico en particular. Esto reemplaza el bloque de resultado
 * que antes estaba duplicado en cada *-flow.tsx, y es el mismo tipo
 * de objeto que consume la exportación a PDF.
 *
 * La exportación a PDF genera un archivo .pdf real con jsPDF
 * (sin diálogo de impresión del navegador) a partir del mismo
 * `DiagnosticResult` que se muestra en pantalla.
 */
export function DiagnosticResultView({ result, onRestart }: DiagnosticResultViewProps) {
  const generatedAtLabel = result.generatedAt.toLocaleString("es-CO", {
    dateStyle: "long",
    timeStyle: "short",
  });

  function handleDownloadPdf() {
    const doc = new jsPDF();
    const marginX = 20;
    const pageHeight = doc.internal.pageSize.getHeight();
    const bottomMargin = 20;
    let y = 20;

    function ensureSpace(nextLineHeight: number) {
      if (y + nextLineHeight > pageHeight - bottomMargin) {
        doc.addPage();
        y = 20;
      }
    }

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("TechCheck — Resultado del diagnóstico", marginX, y);

    y += 10;
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(result.title, marginX, y);

    y += 7;
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generado el ${generatedAtLabel}`, marginX, y);
    doc.setTextColor(0);

    y += 12;
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    ensureSpace(6);
    doc.text("Posible causa principal", marginX, y);
    y += 6;
    doc.setFont("helvetica", "normal");
    const causeLines = doc.splitTextToSize(result.probableCause, 170);
    ensureSpace(causeLines.length * 6);
    doc.text(causeLines, marginX, y);
    y += causeLines.length * 6 + 6;

    doc.setFont("helvetica", "bold");
    ensureSpace(6);
    doc.text("Nivel de gravedad", marginX, y);
    y += 6;
    doc.setFont("helvetica", "normal");
    ensureSpace(6);
    doc.text(result.severity, marginX, y);
    y += 12;

    doc.setFont("helvetica", "bold");
    ensureSpace(7);
    doc.text("Recomendaciones", marginX, y);
    y += 7;
    doc.setFont("helvetica", "normal");
    result.recommendations.forEach((recommendation) => {
      const lines = doc.splitTextToSize(`• ${recommendation}`, 170);
      ensureSpace(lines.length * 6);
      doc.text(lines, marginX, y);
      y += lines.length * 6 + 2;
    });

    const normalizedCategory = result.category
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    doc.save(`techcheck-diagnostico-${normalizedCategory}.pdf`);
  }

  return (
    <div>
      <h1 className="text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
        Resultado del diagnóstico
      </h1>

      <div className="mt-6 rounded-md border border-border bg-surface p-5">
        <p className="text-xs font-medium uppercase tracking-wide text-muted">
          Posible causa principal
        </p>
        <p className="mt-1.5 text-[15px] font-medium text-foreground">
          {result.probableCause}
        </p>

        <p className="mt-5 text-xs font-medium uppercase tracking-wide text-muted">
          Nivel de gravedad
        </p>
        <span
          className={cn(
            "mt-1.5 inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-medium",
            result.severity === "Alto" &&
              "border-accent bg-accent/15 text-accent",
            result.severity === "Medio" &&
              "border-accent/60 bg-accent/10 text-accent",
            result.severity === "Bajo" &&
              "border-border bg-background text-muted"
          )}
        >
          {result.severity}
        </span>
      </div>

      <div className="mt-6">
        <h2 className="text-[15px] font-medium text-foreground">
          Recomendaciones
        </h2>
        <ul className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {result.recommendations.map((recommendation) => (
            <Card
              key={recommendation}
              className="text-left text-sm text-foreground"
            >
              {recommendation}
            </Card>
          ))}
        </ul>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 rounded-md border border-border bg-surface px-5 py-3 text-sm font-medium text-foreground transition-colors hover:border-muted/40"
        >
          Volver al inicio
        </Link>
        <Button onClick={onRestart}>Realizar nuevamente el diagnóstico</Button>
        <Button variant="secondary" onClick={handleDownloadPdf}>
          <Download className="h-4 w-4" aria-hidden="true" />
          Descargar PDF
        </Button>
      </div>
    </div>
  );
}