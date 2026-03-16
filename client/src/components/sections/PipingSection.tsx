/**
 * Section 3 — Tubagem / Internal Piping
 * Pipe material, routing, condition, tightness test
 */
import { useAssessment } from "@/contexts/AssessmentContext";
import FormField from "@/components/FormField";
import { PIPE_MATERIALS } from "@/lib/constants";
import { SectionImageAIReview } from "@/components/SectionImageAIReview";

export default function PipingSection() {
  const { state, updateField } = useAssessment();
  const p = state.data.piping;
  const u = (field: string, value: string | boolean) =>
    updateField("piping", field, value);

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-3 mb-4">
        <h2 className="text-lg font-heading font-bold text-foreground">
          Rede de Tubagem Interior
        </h2>
        <p className="text-sm text-muted-foreground">
          Internal Piping Network
        </p>
      </div>

      <SectionImageAIReview sectionId="piping" sectionName="Piping" />

      <fieldset className="space-y-4">
        <legend className="text-sm font-semibold text-navy uppercase tracking-wide mb-2">
          Características / Characteristics
        </legend>
        <FormField
          type="select"
          labelPt="Material"
          labelEn="Material"
          value={p.pipe_material}
          onChange={(v) => u("pipe_material", v)}
          options={PIPE_MATERIALS.map((m) => ({
            value: m.value,
            label: `${m.label_pt} / ${m.label_en}`,
          }))}
          required
        />
        <FormField
          type="select"
          labelPt="Tipo de Traçado"
          labelEn="Routing Type"
          value={p.pipe_routing}
          onChange={(v) => u("pipe_routing", v)}
          options={[
            { value: "visible", label: "Visível / Visible" },
            { value: "concealed", label: "Embutida / Concealed" },
            { value: "mixed", label: "Mista / Mixed" },
          ]}
          required
        />
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-sm font-semibold text-navy uppercase tracking-wide mb-2">
          Verificações / Checks
        </legend>
        <FormField
          type="defect"
          labelPt="Estado Geral da Tubagem"
          labelEn="General Pipe Condition"
          value={p.pipe_condition}
          onChange={(v) => u("pipe_condition", v)}
        />
        <FormField
          type="defect"
          labelPt="Suportes e Fixações"
          labelEn="Supports & Fixings"
          value={p.pipe_supports}
          onChange={(v) => u("pipe_supports", v)}
        />
        <FormField
          type="defect"
          labelPt="Corrosão"
          labelEn="Corrosion"
          value={p.pipe_corrosion}
          onChange={(v) => u("pipe_corrosion", v)}
        />
        <FormField
          type="defect"
          labelPt="Integridade das Juntas"
          labelEn="Joint Integrity"
          value={p.joints_integrity}
          onChange={(v) => u("joints_integrity", v)}
        />
        <FormField
          type="defect"
          labelPt="Identificação / Etiquetagem"
          labelEn="Labeling"
          value={p.labeling}
          onChange={(v) => u("labeling", v)}
        />
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-sm font-semibold text-navy uppercase tracking-wide mb-2">
          Teste de Estanquidade / Tightness Test
        </legend>
        <FormField
          type="switch"
          labelPt="Teste Realizado"
          labelEn="Test Performed"
          value={p.tightness_test_performed}
          onChange={(v) => u("tightness_test_performed", v)}
        />
        {p.tightness_test_performed && (
          <>
            <FormField
              type="select"
              labelPt="Resultado"
              labelEn="Result"
              value={p.tightness_test_result}
              onChange={(v) => u("tightness_test_result", v)}
              options={[
                { value: "pass", label: "Aprovado / Pass" },
                { value: "fail", label: "Reprovado / Fail" },
              ]}
            />
            <div className="grid grid-cols-2 gap-3">
              <FormField
                type="number"
                labelPt="Pressão de Teste"
                labelEn="Test Pressure"
                value={p.tightness_test_pressure_mbar}
                onChange={(v) =>
                  u("tightness_test_pressure_mbar", v)
                }
                unit="mbar"
                inputMode="decimal"
              />
              <FormField
                type="number"
                labelPt="Duração do Teste"
                labelEn="Test Duration"
                value={p.tightness_test_duration_min}
                onChange={(v) =>
                  u("tightness_test_duration_min", v)
                }
                unit="min"
                inputMode="numeric"
              />
            </div>
          </>
        )}
      </fieldset>

      <FormField
        type="textarea"
        labelPt="Notas"
        labelEn="Notes"
        value={p.notes}
        onChange={(v) => u("notes", v)}
        placeholder="Observações sobre a tubagem..."
      />
    </div>
  );
}
