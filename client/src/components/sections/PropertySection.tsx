/**
 * Section 1 — Identificação / Property Identification
 * Captures property, owner, and inspector details
 */
import { useAssessment } from "@/contexts/AssessmentContext";
import FormField from "@/components/FormField";
import {
  DISTRICTS,
  BUILDING_TYPES,
  INSPECTION_TYPES,
} from "@/lib/constants";
import { SectionImageAIReview } from "@/components/SectionImageAIReview";

export default function PropertySection() {
  const { state, updateField } = useAssessment();
  const p = state.data.property;
  const u = (field: string, value: string) =>
    updateField("property", field, value);

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-3 mb-4">
        <h2 className="text-lg font-heading font-bold text-foreground">
          Identificação do Imóvel
        </h2>
        <p className="text-sm text-muted-foreground">
          Property &amp; Inspector Identification
        </p>
      </div>

      <SectionImageAIReview sectionId="property" sectionName="Property ID" />

      <fieldset className="space-y-4">
        <legend className="text-sm font-semibold text-navy uppercase tracking-wide mb-2">
          Dados do Imóvel / Property Data
        </legend>
        <FormField
          type="text"
          labelPt="Morada"
          labelEn="Address"
          value={p.address}
          onChange={(v) => u("address", v)}
          placeholder="Rua, Nº, Andar"
          required
        />
        <div className="grid grid-cols-2 gap-3">
          <FormField
            type="text"
            labelPt="Freguesia"
            labelEn="Parish"
            value={p.parish}
            onChange={(v) => u("parish", v)}
          />
          <FormField
            type="text"
            labelPt="Concelho"
            labelEn="Municipality"
            value={p.municipality}
            onChange={(v) => u("municipality", v)}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <FormField
            type="select"
            labelPt="Distrito"
            labelEn="District"
            value={p.district}
            onChange={(v) => u("district", v)}
            options={DISTRICTS.map((d) => ({ value: d, label: d }))}
            required
          />
          <FormField
            type="text"
            labelPt="Código Postal"
            labelEn="Postal Code"
            value={p.postal_code}
            onChange={(v) => u("postal_code", v)}
            placeholder="1000-001"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <FormField
            type="text"
            labelPt="Fração"
            labelEn="Fraction"
            value={p.fraction}
            onChange={(v) => u("fraction", v)}
            placeholder="3º Esq."
          />
          <FormField
            type="select"
            labelPt="Tipo de Edifício"
            labelEn="Building Type"
            value={p.building_type}
            onChange={(v) => u("building_type", v)}
            options={BUILDING_TYPES.map((b) => ({
              value: b.value,
              label: b.label_pt,
            }))}
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <FormField
            type="number"
            labelPt="Ano de Construção"
            labelEn="Year Built"
            value={p.year_of_construction}
            onChange={(v) => u("year_of_construction", v)}
            placeholder="1985"
            inputMode="numeric"
          />
          <FormField
            type="number"
            labelPt="Área Bruta"
            labelEn="Floor Area"
            value={p.floor_area_m2}
            onChange={(v) => u("floor_area_m2", v)}
            placeholder="85"
            unit="m²"
            inputMode="decimal"
          />
        </div>
        <FormField
          type="text"
          labelPt="Nº Contador de Gás"
          labelEn="Gas Meter Number"
          value={p.meter_number}
          onChange={(v) => u("meter_number", v)}
          placeholder="G-12345678"
        />
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-sm font-semibold text-navy uppercase tracking-wide mb-2">
          Proprietário / Owner
        </legend>
        <FormField
          type="text"
          labelPt="Nome do Proprietário"
          labelEn="Owner Name"
          value={p.owner_name}
          onChange={(v) => u("owner_name", v)}
        />
        <FormField
          type="text"
          labelPt="NIF do Proprietário"
          labelEn="Owner Tax ID (NIF)"
          value={p.owner_nif}
          onChange={(v) => u("owner_nif", v)}
          placeholder="123456789"
          inputMode="numeric"
        />
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-sm font-semibold text-navy uppercase tracking-wide mb-2">
          Dados da Inspeção / Inspection Data
        </legend>
        <FormField
          type="select"
          labelPt="Tipo de Inspeção"
          labelEn="Inspection Type"
          value={p.inspection_type}
          onChange={(v) => u("inspection_type", v)}
          options={INSPECTION_TYPES.map((t) => ({
            value: t.value,
            label: t.label_pt,
          }))}
          required
        />
        <div className="grid grid-cols-2 gap-3">
          <FormField
            type="date"
            labelPt="Data da Inspeção"
            labelEn="Inspection Date"
            value={p.inspection_date}
            onChange={(v) => u("inspection_date", v)}
            required
          />
          <FormField
            type="date"
            labelPt="Inspeção Anterior"
            labelEn="Previous Inspection"
            value={p.previous_inspection_date}
            onChange={(v) => u("previous_inspection_date", v)}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <FormField
            type="text"
            labelPt="Nome do Inspetor"
            labelEn="Inspector Name"
            value={p.inspector_name}
            onChange={(v) => u("inspector_name", v)}
            required
          />
          <FormField
            type="text"
            labelPt="Nº Carteira"
            labelEn="Inspector ID"
            value={p.inspector_id}
            onChange={(v) => u("inspector_id", v)}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <FormField
            type="text"
            labelPt="EIG (Entidade Inspetora de Gás)"
            labelEn="Gas Inspection Entity"
            value={p.eig_name}
            onChange={(v) => u("eig_name", v)}
            placeholder="Nome da EIG"
            required
          />
          <FormField
            type="text"
            labelPt="Licença EIG"
            labelEn="EIG License"
            value={p.eig_license}
            onChange={(v) => u("eig_license", v)}
          />
        </div>
      </fieldset>
    </div>
  );
}
