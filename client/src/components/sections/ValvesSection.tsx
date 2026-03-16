/**
 * Section 4 — Válvulas de Corte / Shutoff Valves
 * General, floor, and appliance shutoff valves
 */
import { useAssessment } from "@/contexts/AssessmentContext";
import FormField from "@/components/FormField";
import { SectionImageAIReview } from "@/components/SectionImageAIReview";

export default function ValvesSection() {
  const { state, updateField } = useAssessment();
  const v = state.data.valves;
  const u = (field: string, value: string | boolean) =>
    updateField("valves", field, value);

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-3 mb-4">
        <h2 className="text-lg font-heading font-bold text-foreground">
          Válvulas de Corte
        </h2>
        <p className="text-sm text-muted-foreground">Shutoff Valves</p>
      </div>

      <SectionImageAIReview sectionId="valves" sectionName="Valves" />

      {/* General Shutoff */}
      <fieldset className="space-y-4">
        <legend className="text-sm font-semibold text-navy uppercase tracking-wide mb-2">
          Válvula de Corte Geral / General Shutoff
        </legend>
        <FormField
          type="switch"
          labelPt="Válvula Presente"
          labelEn="Valve Present"
          value={v.general_shutoff_present}
          onChange={(val) => u("general_shutoff_present", val)}
        />
        {v.general_shutoff_present && (
          <>
            <FormField
              type="defect"
              labelPt="Acessibilidade"
              labelEn="Accessibility"
              value={v.general_shutoff_accessible}
              onChange={(val) => u("general_shutoff_accessible", val)}
            />
            <FormField
              type="defect"
              labelPt="Operacionalidade"
              labelEn="Operability"
              value={v.general_shutoff_operable}
              onChange={(val) => u("general_shutoff_operable", val)}
            />
          </>
        )}
      </fieldset>

      {/* Floor Shutoff */}
      <fieldset className="space-y-4">
        <legend className="text-sm font-semibold text-navy uppercase tracking-wide mb-2">
          Válvula de Piso / Floor Shutoff
        </legend>
        <FormField
          type="switch"
          labelPt="Válvula Presente"
          labelEn="Valve Present"
          value={v.floor_shutoff_present}
          onChange={(val) => u("floor_shutoff_present", val)}
        />
        {v.floor_shutoff_present && (
          <>
            <FormField
              type="defect"
              labelPt="Acessibilidade"
              labelEn="Accessibility"
              value={v.floor_shutoff_accessible}
              onChange={(val) => u("floor_shutoff_accessible", val)}
            />
            <FormField
              type="defect"
              labelPt="Operacionalidade"
              labelEn="Operability"
              value={v.floor_shutoff_operable}
              onChange={(val) => u("floor_shutoff_operable", val)}
            />
          </>
        )}
      </fieldset>

      {/* Appliance Shutoffs */}
      <fieldset className="space-y-4">
        <legend className="text-sm font-semibold text-navy uppercase tracking-wide mb-2">
          Válvulas de Aparelhos / Appliance Shutoffs
        </legend>
        <FormField
          type="switch"
          labelPt="Válvulas Presentes"
          labelEn="Valves Present"
          value={v.appliance_shutoffs_present}
          onChange={(val) => u("appliance_shutoffs_present", val)}
        />
        {v.appliance_shutoffs_present && (
          <>
            <FormField
              type="defect"
              labelPt="Acessibilidade"
              labelEn="Accessibility"
              value={v.appliance_shutoffs_accessible}
              onChange={(val) => u("appliance_shutoffs_accessible", val)}
            />
            <FormField
              type="defect"
              labelPt="Operacionalidade"
              labelEn="Operability"
              value={v.appliance_shutoffs_operable}
              onChange={(val) => u("appliance_shutoffs_operable", val)}
            />
          </>
        )}
      </fieldset>

      <FormField
        type="textarea"
        labelPt="Notas"
        labelEn="Notes"
        value={v.notes}
        onChange={(val) => u("notes", val)}
        placeholder="Observações sobre as válvulas..."
      />
    </div>
  );
}

