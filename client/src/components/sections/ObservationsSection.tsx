/**
 * Section 9 — Observações / Site Observations
 * General notes, photos, and additional remarks
 */
import { useAssessment } from "@/contexts/AssessmentContext";
import FormField from "@/components/FormField";
import { SectionImageAIReview } from "@/components/SectionImageAIReview";

export default function ObservationsSection() {
  const { state, updateField } = useAssessment();
  const o = state.data.observations;
  const u = (field: string, value: string) =>
    updateField("observations", field, value);

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-3 mb-4">
        <h2 className="text-lg font-heading font-bold text-foreground">
          Observações Gerais
        </h2>
        <p className="text-sm text-muted-foreground">
          Site Observations &amp; General Notes
        </p>
      </div>

      <SectionImageAIReview
        sectionId="observations"
        sectionName="Observations"
      />

      <FormField
        type="textarea"
        labelPt="Observações Gerais"
        labelEn="General Observations"
        value={o.general_notes}
        onChange={(v) => u("general_notes", v)}
        placeholder="Descrever quaisquer observações adicionais relevantes para a inspeção..."
      />

      <FormField
        type="textarea"
        labelPt="Condições de Acesso"
        labelEn="Access Conditions"
        value={o.access_conditions}
        onChange={(v) => u("access_conditions", v)}
        placeholder="Descrever condições de acesso ao imóvel e aos equipamentos..."
      />

      <FormField
        type="textarea"
        labelPt="Limitações da Inspeção"
        labelEn="Inspection Limitations"
        value={o.inspection_limitations}
        onChange={(v) => u("inspection_limitations", v)}
        placeholder="Descrever quaisquer limitações encontradas durante a inspeção..."
      />

      <FormField
        type="textarea"
        labelPt="Recomendações ao Proprietário"
        labelEn="Recommendations to Owner"
        value={o.recommendations_to_owner}
        onChange={(v) => u("recommendations_to_owner", v)}
        placeholder="Recomendações específicas para o proprietário..."
      />

      <FormField
        type="textarea"
        labelPt="Notas Internas do Inspetor"
        labelEn="Inspector Internal Notes"
        value={o.inspector_internal_notes}
        onChange={(v) => u("inspector_internal_notes", v)}
        placeholder="Notas internas (não incluídas no relatório)..."
      />
    </div>
  );
}

