/**
 * GasInspectionReport — Structured inspection report with JSON export
 * Matches DGEG (Direção-Geral de Energia e Geologia) / EIG format
 */
import { useAssessment } from '@/contexts/AssessmentContext';
import { calculateCompliance, getDefectList } from '@/lib/calculations';
import { SECTIONS } from '@/lib/types';
import type { GasAppliance } from '@/lib/types';
import { Download, FileJson, Printer, ShieldCheck, ShieldAlert, ShieldX, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

const verdictLabels: Record<string, { pt: string; en: string; icon: typeof ShieldCheck; cls: string }> = {
  approved: { pt: 'APROVADO', en: 'APPROVED', icon: ShieldCheck, cls: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
  conditional: { pt: 'CONDICIONADO', en: 'CONDITIONAL', icon: ShieldAlert, cls: 'text-amber-700 bg-amber-50 border-amber-200' },
  failed: { pt: 'REPROVADO', en: 'FAILED', icon: ShieldX, cls: 'text-red-700 bg-red-50 border-red-200' },
  pending: { pt: 'PENDENTE', en: 'PENDING', icon: Clock, cls: 'text-slate-600 bg-slate-50 border-slate-200' },
};

export default function GasInspectionReport() {
  const { state } = useAssessment();
  const { data } = state;
  const compliance = calculateCompliance(data);
  const defects = getDefectList(data);
  const vConfig = verdictLabels[compliance.verdict];
  const VerdictIcon = vConfig.icon;

  const exportJSON = () => {
    const exportData = {
      schema: 'InspectOS-GasInspection-v1',
      exported_at: new Date().toISOString(),
      property: data.property,
      sections: {
        gasSupply: data.gasSupply,
        piping: data.piping,
        valves: data.valves,
        appliances: data.appliances,
        ventilation: data.ventilation,
        flue: data.flue,
        safety: data.safety,
        observations: data.observations,
      },
      compliance: {
        verdict: compliance.verdict,
        defect_summary: compliance.defects,
        defect_list: defects,
      },
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gas-inspection-${data.property.address.replace(/\s+/g, '-') || 'report'}-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => window.print();

  return (
    <div className="space-y-6">
      {/* Action buttons */}
      <div className="flex gap-2 print:hidden">
        <Button onClick={exportJSON} variant="outline" size="sm">
          <FileJson className="w-4 h-4 mr-1.5" /> Exportar JSON
        </Button>
        <Button onClick={handlePrint} variant="outline" size="sm">
          <Printer className="w-4 h-4 mr-1.5" /> Imprimir
        </Button>
      </div>

      {/* Report Header */}
      <div className="border-2 border-navy rounded-lg overflow-hidden print:border-black">
        <div className="bg-navy text-white px-6 py-4 print:bg-black">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-heading font-bold">Relatório de Inspeção de Gás</h1>
              <p className="text-sm opacity-80">Gas Installation Inspection Report</p>
            </div>
            <div className="text-right">
              <p className="text-xs opacity-60">InspectOS</p>
              <p className="text-xs opacity-60">DL 97/2017 · Lei 59/2018</p>
            </div>
          </div>
        </div>

        {/* Verdict Banner */}
        <div className={`px-6 py-4 border-b ${vConfig.cls} flex items-center gap-3`}>
          <VerdictIcon className="w-8 h-8" />
          <div>
            <p className="text-lg font-heading font-bold">{vConfig.pt}</p>
            <p className="text-xs opacity-75">{vConfig.en}</p>
          </div>
          <div className="ml-auto flex gap-2">
            {(['ok', 'A', 'B', 'G'] as const).map((key) => (
              <span key={key} className="text-xs font-mono bg-white/60 px-2 py-1 rounded">
                {key}: {compliance.defects[key]}
              </span>
            ))}
          </div>
        </div>

        {/* Property Info */}
        <div className="px-6 py-4 border-b border-border">
          <h3 className="text-sm font-heading font-bold text-navy mb-3 uppercase tracking-wide">
            1. Identificação / Identification
          </h3>
          <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
            <ReportField label="Morada / Address" value={data.property.address} />
            <ReportField label="Distrito / District" value={data.property.district} />
            <ReportField label="Freguesia / Parish" value={data.property.parish} />
            <ReportField label="Concelho / Municipality" value={data.property.municipality} />
            <ReportField label="Código Postal / Postal Code" value={data.property.postal_code} />
            <ReportField label="Fração / Fraction" value={data.property.fraction} />
            <ReportField label="Tipo de Edifício / Building Type" value={data.property.building_type} />
            <ReportField label="Ano de Construção / Year Built" value={data.property.year_of_construction} />
            <ReportField label="Área / Area" value={data.property.floor_area_m2 ? `${data.property.floor_area_m2} m²` : ''} />
            <ReportField label="Nº Contador / Meter No." value={data.property.meter_number} />
            <ReportField label="Proprietário / Owner" value={data.property.owner_name} />
            <ReportField label="NIF" value={data.property.owner_nif} />
          </div>
        </div>

        {/* Inspection Info */}
        <div className="px-6 py-4 border-b border-border">
          <h3 className="text-sm font-heading font-bold text-navy mb-3 uppercase tracking-wide">
            Dados da Inspeção / Inspection Data
          </h3>
          <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
            <ReportField label="Tipo / Type" value={data.property.inspection_type} />
            <ReportField label="Data / Date" value={data.property.inspection_date} />
            <ReportField label="Inspetor / Inspector" value={data.property.inspector_name} />
            <ReportField label="Nº Carteira / ID" value={data.property.inspector_id} />
            <ReportField label="EIG (Entidade Inspetora de Gás)" value={data.property.eig_name} />
            <ReportField label="Licença EIG / EIG License" value={data.property.eig_license} />
          </div>
        </div>

        {/* Section Summaries */}
        {SECTIONS.filter(s => s.id !== 'property' && s.id !== 'observations').map((section, idx) => {
          const sectionDefects = defects.filter(d => d.section === section.id);
          return (
            <div key={section.id} className="px-6 py-4 border-b border-border">
              <h3 className="text-sm font-heading font-bold text-navy mb-2 uppercase tracking-wide">
                {idx + 2}. {section.label_pt} / {section.label_en}
              </h3>
              {sectionDefects.length === 0 ? (
                <p className="text-sm text-emerald-600 font-medium">Conforme / Compliant</p>
              ) : (
                <div className="space-y-1.5">
                  {sectionDefects.map((d, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <span className={`shrink-0 text-xs font-mono font-bold px-1.5 py-0.5 rounded ${
                        d.severity === 'G' ? 'bg-red-100 text-red-700' :
                        d.severity === 'B' ? 'bg-amber-100 text-amber-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>{d.severity}</span>
                      <div>
                        <span className="text-foreground">{d.label_pt}</span>
                        <span className="text-muted-foreground"> / {d.label_en}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Appliances Detail */}
        {data.appliances.appliances.length > 0 && (
          <div className="px-6 py-4 border-b border-border">
            <h3 className="text-sm font-heading font-bold text-navy mb-3 uppercase tracking-wide">
              Detalhe dos Aparelhos / Appliance Details
            </h3>
            <div className="space-y-3">
              {data.appliances.appliances.map((app: GasAppliance, idx: number) => (
                <div key={app.id} className="border border-border rounded-md p-3 text-sm">
                  <p className="font-semibold text-foreground mb-1">Aparelho {idx + 1}: {app.type || 'N/D'}</p>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                    <ReportField label="Marca / Brand" value={app.brand} small />
                    <ReportField label="Modelo / Model" value={app.model} small />
                    <ReportField label="Potência / Power" value={app.power_kw ? `${app.power_kw} kW` : ''} small />
                    <ReportField label="Local / Location" value={app.location} small />
                    <ReportField label="Ligação / Connection" value={app.connection_type} small />
                    <ReportField label="Chama / Flame" value={app.flame_condition} small />
                    <ReportField label="CO" value={app.co_reading_ppm ? `${app.co_reading_ppm} ppm` : ''} small />
                    <ReportField label="Classificação / Status" value={app.status} small />
                  </div>
                  {app.notes && <p className="text-xs text-muted-foreground mt-1">Notas: {app.notes}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Observations */}
        {(data.observations.general_notes || data.observations.recommendations_to_owner) && (
          <div className="px-6 py-4 border-b border-border">
            <h3 className="text-sm font-heading font-bold text-navy mb-3 uppercase tracking-wide">
              Observações / Observations
            </h3>
            {data.observations.general_notes && (
              <div className="mb-2">
                <p className="text-xs font-semibold text-muted-foreground mb-0.5">Observações Gerais / General</p>
                <p className="text-sm text-foreground">{data.observations.general_notes}</p>
              </div>
            )}
            {data.observations.recommendations_to_owner && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-0.5">Recomendações / Recommendations</p>
                <p className="text-sm text-foreground">{data.observations.recommendations_to_owner}</p>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-4 bg-muted/30 text-xs text-muted-foreground">
          <div className="flex items-center justify-between">
            <div>
              <p>Gerado por InspectOS — Sistema de Inspeção de Gás</p>
              <p>Generated by InspectOS — Gas Inspection System</p>
            </div>
            <div className="text-right">
              <p>{new Date().toLocaleDateString('pt-PT')} · {new Date().toLocaleTimeString('pt-PT')}</p>
              <p className="font-mono">DL 97/2017 · Lei 59/2018</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReportField({ label, value, small }: { label: string; value: string; small?: boolean }) {
  return (
    <div className={small ? '' : 'py-0.5'}>
      <span className={`text-muted-foreground ${small ? 'text-[10px]' : 'text-xs'}`}>{label}: </span>
      <span className={`text-foreground font-medium ${small ? 'text-xs' : 'text-sm'}`}>{value || '—'}</span>
    </div>
  );
}
