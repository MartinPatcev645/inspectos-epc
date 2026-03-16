/**
 * Section 5 — Aparelhos a Gás / Gas Appliances
 * Dynamic list of appliances with individual defect classification
 */
import { useAssessment } from "@/contexts/AssessmentContext";
import FormField from "@/components/FormField";
import { createDefaultAppliance } from "@/lib/types";
import type { GasAppliance } from "@/lib/types";
import { APPLIANCE_TYPES } from "@/lib/constants";
import { Plus, Trash2, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionImageAIReview } from "@/components/SectionImageAIReview";

export default function AppliancesSection() {
  const { state, updateField } = useAssessment();
  const data = state.data.appliances;

  const addAppliance = () => {
    updateField('appliances', 'appliances', [...data.appliances, createDefaultAppliance()]);
  };

  const removeAppliance = (id: string) => {
    updateField('appliances', 'appliances', data.appliances.filter((a: GasAppliance) => a.id !== id));
  };

  const updateAppliance = (id: string, field: string, value: string | boolean) => {
    updateField('appliances', 'appliances', data.appliances.map((a: GasAppliance) =>
      a.id === id ? { ...a, [field]: value } : a
    ));
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-3 mb-4">
        <h2 className="text-lg font-heading font-bold text-foreground">
          Aparelhos a Gás
        </h2>
        <p className="text-sm text-muted-foreground">Gas Appliances</p>
      </div>

      <SectionImageAIReview
        sectionId="appliances"
        sectionName="Appliances"
      />

      {data.appliances.length === 0 && (
        <div className="text-center py-8 bg-muted/30 rounded-lg border-2 border-dashed border-border">
          <Flame className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground mb-3">Nenhum aparelho registado / No appliances registered</p>
          <Button onClick={addAppliance} variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-1" /> Adicionar Aparelho
          </Button>
        </div>
      )}

      {data.appliances.map((appliance: GasAppliance, idx: number) => (
        <div key={appliance.id} className="border border-border rounded-lg p-4 space-y-4 bg-card">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-heading font-bold text-navy">
              Aparelho {idx + 1}
            </h3>
            <Button variant="ghost" size="sm" onClick={() => removeAppliance(appliance.id)} className="text-destructive hover:text-destructive h-8 w-8 p-0">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>

          <FormField type="select" labelPt="Tipo de Aparelho" labelEn="Appliance Type" value={appliance.type} onChange={(v) => updateAppliance(appliance.id, 'type', v)} options={APPLIANCE_TYPES.map(t => ({ value: t.value, label: `${t.label_pt} / ${t.label_en}` }))} required />

          <div className="grid grid-cols-2 gap-3">
            <FormField type="text" labelPt="Marca" labelEn="Brand" value={appliance.brand} onChange={(v) => updateAppliance(appliance.id, 'brand', v)} />
            <FormField type="text" labelPt="Modelo" labelEn="Model" value={appliance.model} onChange={(v) => updateAppliance(appliance.id, 'model', v)} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FormField type="number" labelPt="Potência" labelEn="Power" value={appliance.power_kw} onChange={(v) => updateAppliance(appliance.id, 'power_kw', v)} unit="kW" inputMode="decimal" />
            <FormField type="text" labelPt="Localização" labelEn="Location" value={appliance.location} onChange={(v) => updateAppliance(appliance.id, 'location', v)} placeholder="Cozinha, WC..." />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FormField type="select" labelPt="Tipo de Ligação" labelEn="Connection Type" value={appliance.connection_type} onChange={(v) => updateAppliance(appliance.id, 'connection_type', v)} options={[
              { value: 'rigid', label: 'Rígida / Rigid' },
              { value: 'flexible', label: 'Flexível / Flexible' },
            ]} />
            <FormField type="select" labelPt="Estado da Chama" labelEn="Flame Condition" value={appliance.flame_condition} onChange={(v) => updateAppliance(appliance.id, 'flame_condition', v)} options={[
              { value: 'good', label: 'Boa (Azul) / Good (Blue)' },
              { value: 'yellow', label: 'Amarela / Yellow' },
              { value: 'irregular', label: 'Irregular' },
            ]} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FormField type="switch" labelPt="Dispositivo de Segurança" labelEn="Safety Device" value={appliance.safety_device} onChange={(v) => updateAppliance(appliance.id, 'safety_device', v)} />
            <FormField type="number" labelPt="Leitura CO" labelEn="CO Reading" value={appliance.co_reading_ppm} onChange={(v) => updateAppliance(appliance.id, 'co_reading_ppm', v)} unit="ppm" inputMode="numeric" />
          </div>

          <FormField type="defect" labelPt="Classificação do Aparelho" labelEn="Appliance Classification" value={appliance.status} onChange={(v) => updateAppliance(appliance.id, 'status', v)} />
          <FormField type="textarea" labelPt="Notas do Aparelho" labelEn="Appliance Notes" value={appliance.notes} onChange={(v) => updateAppliance(appliance.id, 'notes', v)} />
        </div>
      ))}

      {data.appliances.length > 0 && (
        <Button onClick={addAppliance} variant="outline" className="w-full">
          <Plus className="w-4 h-4 mr-1" /> Adicionar Outro Aparelho / Add Another Appliance
        </Button>
      )}

      <FormField type="textarea" labelPt="Notas Gerais dos Aparelhos" labelEn="General Appliance Notes" value={data.notes} onChange={(v) => updateField('appliances', 'notes', v)} />
    </div>
  );
}
