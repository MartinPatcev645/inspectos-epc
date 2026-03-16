/**
 * Section 7 — Exaustão / Flue Gas Evacuation
 * Flue type, condition, draft test, CO spillage test
 */
import { useAssessment } from "@/contexts/AssessmentContext";
import FormField from "@/components/FormField";
import { FLUE_TYPES } from "@/lib/constants";
import { SectionImageAIReview } from "@/components/SectionImageAIReview";

export default function FlueSection() {
  const { state, updateField } = useAssessment();
  const f = state.data.flue;
  const u = (field: string, value: string | boolean) =>
    updateField("flue", field, value);

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-3 mb-4">
        <h2 className="text-lg font-heading font-bold text-foreground">
          Evacuação de Gases de Combustão
        </h2>
        <p className="text-sm text-muted-foreground">Flue Gas Evacuation</p>
      </div>

      <SectionImageAIReview sectionId="flue" sectionName="Flue Gas" />

      <fieldset className="space-y-4">
        <legend className="text-sm font-semibold text-navy uppercase tracking-wide mb-2">
          Tipo de Conduta / Flue Type
        </legend>
        <FormField
          type="select"
          labelPt="Tipo de Exaustão"
          labelEn="Flue Type"
          value={f.flue_type}
          onChange={(v) => u("flue_type", v)}
          options={FLUE_TYPES.map((t) => ({
            value: t.value,
            label: `${t.label_pt} / ${t.label_en}`,
          }))}
          required
        />
        <FormField
          type="text"
          labelPt="Material da Conduta"
          labelEn="Flue Material"
          value={f.flue_material}
          onChange={(v) => u("flue_material", v)}
          placeholder="Ex: Alumínio, Aço Inox..."
        />
      </fieldset>

      {f.flue_type && f.flue_type !== "none" && (
        <>
          <fieldset className="space-y-4">
            <legend className="text-sm font-semibold text-navy uppercase tracking-wide mb-2">
              Estado da Conduta / Flue Condition
            </legend>
            <FormField
              type="defect"
              labelPt="Estado Geral da Conduta"
              labelEn="General Flue Condition"
              value={f.flue_condition}
              onChange={(v) => u("flue_condition", v)}
            />
            <FormField
              type="defect"
              labelPt="Terminação da Conduta"
              labelEn="Flue Termination"
              value={f.flue_termination}
              onChange={(v) => u("flue_termination", v)}
            />
            <FormField
              type="defect"
              labelPt="Dreno de Condensados"
              labelEn="Condensation Drain"
              value={f.condensation_drain}
              onChange={(v) => u("condensation_drain", v)}
            />
          </fieldset>

          <fieldset className="space-y-4">
            <legend className="text-sm font-semibold text-navy uppercase tracking-wide mb-2">
              Testes / Tests
            </legend>
            <FormField
              type="switch"
              labelPt="Teste de Tiragem Realizado"
              labelEn="Draft Test Performed"
              value={f.draft_test_performed}
              onChange={(v) => u("draft_test_performed", v)}
            />
            {f.draft_test_performed && (
              <FormField
                type="select"
                labelPt="Resultado da Tiragem"
                labelEn="Draft Test Result"
                value={f.draft_test_result}
                onChange={(v) => u("draft_test_result", v)}
                options={[
                  { value: "adequate", label: "Adequada / Adequate" },
                  {
                    value: "inadequate",
                    label: "Inadequada / Inadequate",
                  },
                ]}
              />
            )}
            <FormField
              type="select"
              labelPt="Teste de Derrame de CO"
              labelEn="CO Spillage Test"
              value={f.co_spillage_test}
              onChange={(v) => u("co_spillage_test", v)}
              options={[
                { value: "pass", label: "Aprovado / Pass" },
                { value: "fail", label: "Reprovado / Fail" },
              ]}
            />
          </fieldset>
        </>
      )}

      <FormField
        type="textarea"
        labelPt="Notas"
        labelEn="Notes"
        value={f.notes}
        onChange={(v) => u("notes", v)}
        placeholder="Observações sobre a exaustão..."
      />
    </div>
  );
}
