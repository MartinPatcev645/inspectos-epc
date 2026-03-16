// ============================================================
// InspectOS Gas — Compliance Calculation Engine
// Determines inspection verdict based on defect classification
// per DL 97/2017 & Lei 59/2018
// ============================================================

import type { GasAssessment, DefectType, Verdict } from './types';

export interface DefectSummary {
  ok: number;
  A: number;
  B: number;
  G: number;
  total: number;
}

export interface ComplianceResult {
  verdict: Verdict;
  defects: DefectSummary;
  defectsBySection: Record<string, DefectSummary>;
  sectionVerdicts: Record<string, Verdict>;
  completionPercent: number;
}

function collectDefects(data: Record<string, unknown>): DefectType[] {
  const defects: DefectType[] = [];
  for (const [, value] of Object.entries(data)) {
    if (value === 'ok' || value === 'A' || value === 'B' || value === 'G') {
      defects.push(value as DefectType);
    }
  }
  return defects;
}

function countDefects(defects: DefectType[]): DefectSummary {
  const summary: DefectSummary = { ok: 0, A: 0, B: 0, G: 0, total: defects.length };
  for (const d of defects) {
    summary[d]++;
  }
  return summary;
}

function sectionVerdict(summary: DefectSummary): Verdict {
  if (summary.G > 0) return 'failed';
  if (summary.B > 0) return 'conditional';
  if (summary.total === 0) return 'pending';
  return 'approved';
}

function sectionCompletion(sectionId: string, data: GasAssessment): number {
  switch (sectionId) {
    case 'property': {
      const p = data.property;
      const fields = [p.address, p.district, p.building_type, p.inspection_type, p.inspection_date, p.inspector_name, p.eig_name];
      return fields.filter(f => f && f.length > 0).length / fields.length;
    }
    case 'gasSupply': {
      const g = data.gasSupply;
      const fields = [g.gas_type, g.meter_location];
      return fields.filter(f => f && f.length > 0).length / fields.length;
    }
    case 'piping': {
      const p = data.piping;
      const fields = [p.pipe_material, p.pipe_routing];
      return fields.filter(f => f && f.length > 0).length / fields.length;
    }
    case 'valves': return 1;
    case 'appliances': return data.appliances.appliances.length > 0 ? 1 : 0;
    case 'ventilation': return 1;
    case 'flue': return data.flue.flue_type ? 1 : 0;
    case 'safety': return 1;
    case 'observations': return 1;
    default: return 0;
  }
}

export function calculateCompliance(data: GasAssessment): ComplianceResult {
  const sections: Record<string, Record<string, unknown>> = {
    gasSupply: data.gasSupply as unknown as Record<string, unknown>,
    piping: data.piping as unknown as Record<string, unknown>,
    valves: data.valves as unknown as Record<string, unknown>,
    ventilation: data.ventilation as unknown as Record<string, unknown>,
    flue: data.flue as unknown as Record<string, unknown>,
    safety: data.safety as unknown as Record<string, unknown>,
  };

  const applianceDefects: DefectType[] = data.appliances.appliances.map(a => a.status);
  const defectsBySection: Record<string, DefectSummary> = {};
  const sectionVerdicts: Record<string, Verdict> = {};
  let allDefects: DefectType[] = [];

  for (const [key, sectionData] of Object.entries(sections)) {
    const defects = collectDefects(sectionData);
    defectsBySection[key] = countDefects(defects);
    sectionVerdicts[key] = sectionVerdict(defectsBySection[key]);
    allDefects = allDefects.concat(defects);
  }

  defectsBySection['appliances'] = countDefects(applianceDefects);
  sectionVerdicts['appliances'] = sectionVerdict(defectsBySection['appliances']);
  allDefects = allDefects.concat(applianceDefects);

  defectsBySection['property'] = { ok: 0, A: 0, B: 0, G: 0, total: 0 };
  sectionVerdicts['property'] = 'approved';
  defectsBySection['observations'] = { ok: 0, A: 0, B: 0, G: 0, total: 0 };
  sectionVerdicts['observations'] = 'approved';

  const totalDefects = countDefects(allDefects);

  let verdict: Verdict = 'pending';
  if (totalDefects.total > 0) {
    if (totalDefects.G > 0) verdict = 'failed';
    else if (totalDefects.B > 0) verdict = 'conditional';
    else verdict = 'approved';
  }

  const sectionIds = ['property', 'gasSupply', 'piping', 'valves', 'appliances', 'ventilation', 'flue', 'safety', 'observations'];
  const completions = sectionIds.map(id => sectionCompletion(id, data));
  const completionPercent = Math.round((completions.reduce((a, b) => a + b, 0) / sectionIds.length) * 100);

  return { verdict, defects: totalDefects, defectsBySection, sectionVerdicts, completionPercent };
}

export interface DefectItem {
  section: string;
  field: string;
  severity: 'A' | 'B' | 'G';
  label_pt: string;
  label_en: string;
  remediation?: string;
}

const DEFECT_FIELD_LABELS: Record<string, { pt: string; en: string }> = {
  meter_accessible: { pt: 'Acessibilidade do contador', en: 'Meter accessibility' },
  meter_condition: { pt: 'Estado do contador', en: 'Meter condition' },
  pressure_regulator_condition: { pt: 'Estado do regulador', en: 'Regulator condition' },
  supply_pipe_condition: { pt: 'Estado da tubagem de alimentação', en: 'Supply pipe condition' },
  pipe_condition: { pt: 'Estado geral da tubagem', en: 'General pipe condition' },
  pipe_supports: { pt: 'Suportes e fixações', en: 'Supports & fixings' },
  pipe_corrosion: { pt: 'Corrosão da tubagem', en: 'Pipe corrosion' },
  joints_integrity: { pt: 'Integridade das juntas', en: 'Joint integrity' },
  labeling: { pt: 'Identificação/etiquetagem', en: 'Labeling' },
  general_shutoff_accessible: { pt: 'Acessibilidade da válvula geral', en: 'General shutoff accessibility' },
  general_shutoff_operable: { pt: 'Operacionalidade da válvula geral', en: 'General shutoff operability' },
  floor_shutoff_accessible: { pt: 'Acessibilidade da válvula de piso', en: 'Floor shutoff accessibility' },
  floor_shutoff_operable: { pt: 'Operacionalidade da válvula de piso', en: 'Floor shutoff operability' },
  appliance_shutoffs_accessible: { pt: 'Acessibilidade das válvulas de aparelhos', en: 'Appliance shutoffs accessibility' },
  appliance_shutoffs_operable: { pt: 'Operacionalidade das válvulas de aparelhos', en: 'Appliance shutoffs operability' },
  combustion_air_supply: { pt: 'Admissão de ar para combustão', en: 'Combustion air supply' },
  combustion_air_openings_adequate: { pt: 'Aberturas de ar adequadas', en: 'Air openings adequate' },
  room_ventilation: { pt: 'Ventilação geral dos espaços', en: 'General room ventilation' },
  kitchen_ventilation: { pt: 'Ventilação da cozinha', en: 'Kitchen ventilation' },
  ventilation_grille_condition: { pt: 'Estado das grelhas', en: 'Grille condition' },
  ventilation_grille_sizing: { pt: 'Dimensionamento das grelhas', en: 'Grille sizing' },
  flue_condition: { pt: 'Estado da conduta', en: 'Flue condition' },
  flue_termination: { pt: 'Terminação da conduta', en: 'Flue termination' },
  condensation_drain: { pt: 'Dreno de condensados', en: 'Condensation drain' },
  emergency_shutoff_accessible: { pt: 'Corte de emergência acessível', en: 'Emergency shutoff accessible' },
  signage_adequate: { pt: 'Sinalização adequada', en: 'Adequate signage' },
  fire_risk_assessment: { pt: 'Avaliação de risco de incêndio', en: 'Fire risk assessment' },
};

export function getDefectList(data: GasAssessment): DefectItem[] {
  const items: DefectItem[] = [];
  const sections: Record<string, Record<string, unknown>> = {
    gasSupply: data.gasSupply as unknown as Record<string, unknown>,
    piping: data.piping as unknown as Record<string, unknown>,
    valves: data.valves as unknown as Record<string, unknown>,
    ventilation: data.ventilation as unknown as Record<string, unknown>,
    flue: data.flue as unknown as Record<string, unknown>,
    safety: data.safety as unknown as Record<string, unknown>,
  };

  for (const [sectionId, sectionData] of Object.entries(sections)) {
    for (const [field, value] of Object.entries(sectionData)) {
      if (value === 'A' || value === 'B' || value === 'G') {
        const labels = DEFECT_FIELD_LABELS[field] || { pt: field, en: field };
        items.push({
          section: sectionId,
          field,
          severity: value as 'A' | 'B' | 'G',
          label_pt: labels.pt,
          label_en: labels.en,
        });
      }
    }
  }

  // Appliance defects
  data.appliances.appliances.forEach((app, idx) => {
    if (app.status === 'A' || app.status === 'B' || app.status === 'G') {
      items.push({
        section: 'appliances',
        field: `appliance_${idx}`,
        severity: app.status,
        label_pt: `Aparelho ${idx + 1}: ${app.type || 'N/D'} — ${app.brand || ''}`,
        label_en: `Appliance ${idx + 1}: ${app.type || 'N/A'} — ${app.brand || ''}`,
      });
    }
  });

  // Gas leak is always Type G
  if (data.safety.gas_leak_detected) {
    items.push({
      section: 'safety',
      field: 'gas_leak',
      severity: 'G',
      label_pt: 'Fuga de gás ativa detetada',
      label_en: 'Active gas leak detected',
      remediation: 'Corte imediato do abastecimento de gás / Immediate gas supply cutoff',
    });
  }

  // Sort: G first, then B, then A
  const order = { G: 0, B: 1, A: 2 };
  items.sort((a, b) => order[a.severity] - order[b.severity]);

  return items;
}

export function getNextInspectionDate(buildingType: string, inspectionDate: string): string {
  if (!inspectionDate) return '';
  const date = new Date(inspectionDate);
  if (buildingType === 'type_I' || buildingType === 'type_II') {
    date.setFullYear(date.getFullYear() + 5);
  } else {
    date.setFullYear(date.getFullYear() + 3);
  }
  return date.toISOString().split('T')[0];
}
