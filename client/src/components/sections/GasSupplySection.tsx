/**
 * Section 2 — Abastecimento / Gas Supply & Metering
 * Gas type, meter, pressure regulator, supply pipe
 */
import { useAssessment } from "@/contexts/AssessmentContext";
import FormField from "@/components/FormField";
import { GAS_TYPES, GAS_SUPPLIERS, PIPE_MATERIALS } from "@/lib/constants";
import { SectionImageAIReview } from "@/components/SectionImageAIReview";

export default function GasSupplySection() {
  const { state, updateField } = useAssessment();
  const g = state.data.gasSupply;
  const u = (field: string, value: string | boolean) =>
    updateField("gasSupply", field, value);

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-3 mb-4">
        <h2 className="text-lg font-heading font-bold text-foreground">
          Abastecimento de Gás
        </h2>
        <p className="text-sm text-muted-foreground">
          Gas Supply &amp; Metering
        </p>
      </div>

      <SectionImageAIReview sectionId="gasSupply" sectionName="Gas Supply" />

      <fieldset className="space-y-4">
        <legend className="text-sm font-semibold text-navy uppercase tracking-wide mb-2">
          Tipo de Gás / Gas Type
        </legend>
        <FormField
          type="select"
          labelPt="Tipo de Gás"
          labelEn="Gas Type"
          value={g.gas_type}
          onChange={(v) => u("gas_type", v)}
          options={GAS_TYPES.map((t) => ({
            value: t.value,
            label: `${t.label_pt} / ${t.label_en}`,
          }))}
          required
        />
        <FormField
          type="select"
          labelPt="Fornecedor"
          labelEn="Supplier"
          value={g.supplier}
          onChange={(v) => u("supplier", v)}
          options={GAS_SUPPLIERS.map((s) => ({ value: s, label: s }))}
        />
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-sm font-semibold text-navy uppercase tracking-wide mb-2">
          Contador / Meter
        </legend>
        <FormField
          type="text"
          labelPt="Localização do Contador"
          labelEn="Meter Location"
          value={g.meter_location}
          onChange={(v) => u("meter_location", v)}
          placeholder="Ex: Caixa exterior, hall de entrada..."
        />
        <FormField
          type="defect"
          labelPt="Acessibilidade do Contador"
          labelEn="Meter Accessibility"
          value={g.meter_accessible}
          onChange={(v) => u("meter_accessible", v)}
        />
        <FormField
          type="defect"
          labelPt="Estado do Contador"
          labelEn="Meter Condition"
          value={g.meter_condition}
          onChange={(v) => u("meter_condition", v)}
        />
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-sm font-semibold text-navy uppercase tracking-wide mb-2">
          Regulador de Pressão / Pressure Regulator
        </legend>
        <FormField
          type="text"
          labelPt="Tipo de Regulador"
          labelEn="Regulator Type"
          value={g.pressure_regulator_type}
          onChange={(v) => u("pressure_regulator_type", v)}
          placeholder="Ex: 1ª redução, 2ª redução..."
        />
        <FormField
          type="defect"
          labelPt="Estado do Regulador"
          labelEn="Regulator Condition"
          value={g.pressure_regulator_condition}
          onChange={(v) => u("pressure_regulator_condition", v)}
        />
        <FormField
          type="number"
          labelPt="Pressão de Fornecimento"
          labelEn="Supply Pressure"
          value={g.supply_pressure_mbar}
          onChange={(v) => u("supply_pressure_mbar", v)}
          placeholder="21"
          unit="mbar"
          inputMode="decimal"
        />
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-sm font-semibold text-navy uppercase tracking-wide mb-2">
          Tubagem de Alimentação / Supply Pipe
        </legend>
        <FormField
          type="select"
          labelPt="Material da Tubagem"
          labelEn="Pipe Material"
          value={g.supply_pipe_material}
          onChange={(v) => u("supply_pipe_material", v)}
          options={PIPE_MATERIALS.map((m) => ({
            value: m.value,
            label: `${m.label_pt} / ${m.label_en}`,
          }))}
        />
        <FormField
          type="defect"
          labelPt="Estado da Tubagem"
          labelEn="Pipe Condition"
          value={g.supply_pipe_condition}
          onChange={(v) => u("supply_pipe_condition", v)}
        />
      </fieldset>

      <FormField
        type="textarea"
        labelPt="Notas"
        labelEn="Notes"
        value={g.notes}
        onChange={(v) => u("notes", v)}
        placeholder="Observações adicionais sobre o abastecimento..."
      />
    </div>
  );
}
