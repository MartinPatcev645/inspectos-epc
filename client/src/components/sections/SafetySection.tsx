/**
 * Section 8 — Segurança / Safety & Emergency
 * Gas leaks, CO detectors, emergency shutoff, fire risk
 */
import { useAssessment } from "@/contexts/AssessmentContext";
import FormField from "@/components/FormField";
import { SectionImageAIReview } from "@/components/SectionImageAIReview";

export default function SafetySection() {
  const { state, updateField } = useAssessment();
  const s = state.data.safety;
  const u = (field: string, value: string | boolean) =>
    updateField("safety", field, value);

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-3 mb-4">
        <h2 className="text-lg font-heading font-bold text-foreground">
          Segurança e Emergência
        </h2>
        <p className="text-sm text-muted-foreground">Safety &amp; Emergency</p>
      </div>

      <SectionImageAIReview sectionId="safety" sectionName="Safety" />

      <fieldset className="space-y-4">
        <legend className="text-sm font-semibold text-navy uppercase tracking-wide mb-2">
          Deteção de Fugas / Leak Detection
        </legend>
        <FormField
          type="switch"
          labelPt="Fuga de Gás Detetada"
          labelEn="Gas Leak Detected"
          value={s.gas_leak_detected}
          onChange={(v) => u("gas_leak_detected", v)}
        />
        {s.gas_leak_detected && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm font-semibold text-red-800 mb-2">
              Defeito Tipo G — Corte imediato obrigatório
            </p>
            <p className="text-xs text-red-700 mb-2">
              Type G Defect — Immediate gas supply cutoff mandatory
            </p>
            <FormField
              type="text"
              labelPt="Localização da Fuga"
              labelEn="Leak Location"
              value={s.leak_location}
              onChange={(v) => u("leak_location", v)}
              placeholder="Descrever localização..."
            />
          </div>
        )}
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-sm font-semibold text-navy uppercase tracking-wide mb-2">
          Corte de Emergência / Emergency Shutoff
        </legend>
        <FormField
          type="defect"
          labelPt="Acessibilidade do Corte de Emergência"
          labelEn="Emergency Shutoff Accessible"
          value={s.emergency_shutoff_accessible}
          onChange={(v) => u("emergency_shutoff_accessible", v)}
        />
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-sm font-semibold text-navy uppercase tracking-wide mb-2">
          Detetor de CO (Monóxido de Carbono) / CO Detector
        </legend>
        <FormField
          type="switch"
          labelPt="Detetor de CO Presente"
          labelEn="CO Detector Present"
          value={s.co_detector_present}
          onChange={(v) => u("co_detector_present", v)}
        />
        {s.co_detector_present && (
          <FormField
            type="switch"
            labelPt="Detetor de CO Funcional"
            labelEn="CO Detector Functional"
            value={s.co_detector_functional}
            onChange={(v) => u("co_detector_functional", v)}
          />
        )}
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-sm font-semibold text-navy uppercase tracking-wide mb-2">
          Avaliação Geral / General Assessment
        </legend>
        <FormField
          type="defect"
          labelPt="Sinalização Adequada"
          labelEn="Adequate Signage"
          value={s.signage_adequate}
          onChange={(v) => u("signage_adequate", v)}
        />
        <FormField
          type="defect"
          labelPt="Avaliação de Risco de Incêndio"
          labelEn="Fire Risk Assessment"
          value={s.fire_risk_assessment}
          onChange={(v) => u("fire_risk_assessment", v)}
        />
      </fieldset>

      <FormField
        type="textarea"
        labelPt="Notas"
        labelEn="Notes"
        value={s.notes}
        onChange={(v) => u("notes", v)}
        placeholder="Observações sobre segurança..."
      />
    </div>
  );
}

