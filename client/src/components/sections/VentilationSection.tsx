/**
 * Section 6 — Ventilação / Ventilation
 * Combustion air supply, room ventilation, grilles
 */
import { useAssessment } from "@/contexts/AssessmentContext";
import FormField from "@/components/FormField";
import { SectionImageAIReview } from "@/components/SectionImageAIReview";

export default function VentilationSection() {
  const { state, updateField } = useAssessment();
  const v = state.data.ventilation;
  const u = (field: string, value: string) =>
    updateField("ventilation", field, value);

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-3 mb-4">
        <h2 className="text-lg font-heading font-bold text-foreground">
          Ventilação
        </h2>
        <p className="text-sm text-muted-foreground">
          Ventilation &amp; Combustion Air
        </p>
      </div>

      <SectionImageAIReview
        sectionId="ventilation"
        sectionName="Ventilation"
      />

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800">
        <strong>DL 97/2017 Art. 22:</strong> Todos os espaços com aparelhos a
        gás devem ter ventilação adequada para combustão e evacuação de gases.
        <br />
        <span className="text-xs">
          All spaces with gas appliances must have adequate ventilation for
          combustion and gas evacuation.
        </span>
      </div>

      <fieldset className="space-y-4">
        <legend className="text-sm font-semibold text-navy uppercase tracking-wide mb-2">
          Ar de Combustão / Combustion Air
        </legend>
        <FormField
          type="defect"
          labelPt="Admissão de Ar para Combustão"
          labelEn="Combustion Air Supply"
          value={v.combustion_air_supply}
          onChange={(val) => u("combustion_air_supply", val)}
        />
        <FormField
          type="defect"
          labelPt="Aberturas de Ar Adequadas"
          labelEn="Air Openings Adequate"
          value={v.combustion_air_openings_adequate}
          onChange={(val) => u("combustion_air_openings_adequate", val)}
        />
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-sm font-semibold text-navy uppercase tracking-wide mb-2">
          Ventilação dos Espaços / Room Ventilation
        </legend>
        <FormField
          type="defect"
          labelPt="Ventilação Geral dos Espaços"
          labelEn="General Room Ventilation"
          value={v.room_ventilation}
          onChange={(val) => u("room_ventilation", val)}
        />
        <FormField
          type="defect"
          labelPt="Ventilação da Cozinha"
          labelEn="Kitchen Ventilation"
          value={v.kitchen_ventilation}
          onChange={(val) => u("kitchen_ventilation", val)}
        />
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-sm font-semibold text-navy uppercase tracking-wide mb-2">
          Grelhas de Ventilação / Ventilation Grilles
        </legend>
        <FormField
          type="defect"
          labelPt="Estado das Grelhas"
          labelEn="Grille Condition"
          value={v.ventilation_grille_condition}
          onChange={(val) => u("ventilation_grille_condition", val)}
        />
        <FormField
          type="defect"
          labelPt="Dimensionamento das Grelhas"
          labelEn="Grille Sizing"
          value={v.ventilation_grille_sizing}
          onChange={(val) => u("ventilation_grille_sizing", val)}
        />
      </fieldset>

      <FormField
        type="textarea"
        labelPt="Notas"
        labelEn="Notes"
        value={v.notes}
        onChange={(val) => u("notes", val)}
        placeholder="Observações sobre a ventilação..."
      />
    </div>
  );
}
