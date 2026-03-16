// ============================================================
// InspectOS Gas — Types & Data Model
// Gas Installation Inspection under DL 97/2017 & Lei 59/2018
// DGEG (Direção-Geral de Energia e Geologia) / EIG (Entidade Inspetora de Gás)
// ============================================================

export type DefectType = 'ok' | 'A' | 'B' | 'G';
export type Verdict = 'approved' | 'conditional' | 'failed' | 'pending';
export type InspectionType = 'initial' | 'periodic' | 'extraordinary';
export type GasType = 'natural_gas' | 'lpg_canalized' | 'lpg_bottle' | '';
export type BuildingType =
  | 'type_I' | 'type_II' | 'type_III' | 'type_IV' | 'type_V' | 'type_VI'
  | 'type_VII' | 'type_VIII' | 'type_IX' | 'type_X' | 'type_XI' | 'type_XII' | '';
export type PipeMaterial = 'copper' | 'steel' | 'polyethylene' | 'multilayer' | 'other' | '';
export type ApplianceType = 'water_heater' | 'boiler' | 'cooktop' | 'oven' | 'dryer' | 'heater' | 'other' | '';
export type FlueType = 'individual' | 'collective' | 'room_sealed' | 'none' | '';
export type ViewType = 'form' | 'results' | 'defects' | 'report';

export interface GasAppliance {
  id: string;
  type: ApplianceType;
  brand: string;
  model: string;
  power_kw: string;
  location: string;
  connection_type: 'rigid' | 'flexible' | '';
  flame_condition: 'good' | 'yellow' | 'irregular' | '';
  safety_device: boolean;
  co_reading_ppm: string;
  status: DefectType;
  notes: string;
}

export interface PropertyData {
  address: string;
  parish: string;
  municipality: string;
  district: string;
  postal_code: string;
  fraction: string;
  building_type: BuildingType;
  year_of_construction: string;
  floor_area_m2: string;
  owner_name: string;
  owner_nif: string;
  inspection_type: InspectionType;
  inspection_date: string;
  inspector_name: string;
  inspector_id: string;
  eig_name: string;
  eig_license: string;
  previous_inspection_date: string;
  meter_number: string;
}

export interface GasSupplyData {
  gas_type: GasType;
  supplier: string;
  meter_location: string;
  meter_accessible: DefectType;
  meter_condition: DefectType;
  pressure_regulator_type: string;
  pressure_regulator_condition: DefectType;
  supply_pressure_mbar: string;
  supply_pipe_material: PipeMaterial;
  supply_pipe_condition: DefectType;
  notes: string;
}

export interface PipingData {
  pipe_material: PipeMaterial;
  pipe_routing: 'visible' | 'concealed' | 'mixed' | '';
  pipe_condition: DefectType;
  pipe_supports: DefectType;
  pipe_corrosion: DefectType;
  joints_integrity: DefectType;
  tightness_test_performed: boolean;
  tightness_test_result: 'pass' | 'fail' | '';
  tightness_test_pressure_mbar: string;
  tightness_test_duration_min: string;
  labeling: DefectType;
  notes: string;
}

export interface ValvesData {
  general_shutoff_present: boolean;
  general_shutoff_accessible: DefectType;
  general_shutoff_operable: DefectType;
  floor_shutoff_present: boolean;
  floor_shutoff_accessible: DefectType;
  floor_shutoff_operable: DefectType;
  appliance_shutoffs_present: boolean;
  appliance_shutoffs_accessible: DefectType;
  appliance_shutoffs_operable: DefectType;
  notes: string;
}

export interface AppliancesData {
  appliances: GasAppliance[];
  notes: string;
}

export interface VentilationData {
  combustion_air_supply: DefectType;
  combustion_air_openings_adequate: DefectType;
  room_ventilation: DefectType;
  ventilation_grille_condition: DefectType;
  ventilation_grille_sizing: DefectType;
  kitchen_ventilation: DefectType;
  notes: string;
}

export interface FlueData {
  flue_type: FlueType;
  flue_material: string;
  flue_condition: DefectType;
  flue_termination: DefectType;
  draft_test_performed: boolean;
  draft_test_result: 'adequate' | 'inadequate' | '';
  co_spillage_test: 'pass' | 'fail' | '';
  condensation_drain: DefectType;
  notes: string;
}

export interface SafetyData {
  gas_leak_detected: boolean;
  leak_location: string;
  emergency_shutoff_accessible: DefectType;
  co_detector_present: boolean;
  co_detector_functional: boolean;
  signage_adequate: DefectType;
  fire_risk_assessment: DefectType;
  notes: string;
}

export interface ObservationsData {
  general_notes: string;
  access_conditions: string;
  inspection_limitations: string;
  recommendations_to_owner: string;
  inspector_internal_notes: string;
}

export interface GasAssessment {
  property: PropertyData;
  gasSupply: GasSupplyData;
  piping: PipingData;
  valves: ValvesData;
  appliances: AppliancesData;
  ventilation: VentilationData;
  flue: FlueData;
  safety: SafetyData;
  observations: ObservationsData;
}

export interface SectionDef {
  id: string;
  number: number;
  label_pt: string;
  label_en: string;
  icon: string;
}

export const SECTIONS: SectionDef[] = [
  { id: 'property', number: 1, label_pt: 'Identificação', label_en: 'Property ID', icon: 'Building2' },
  { id: 'gasSupply', number: 2, label_pt: 'Abastecimento', label_en: 'Gas Supply', icon: 'Gauge' },
  { id: 'piping', number: 3, label_pt: 'Tubagem', label_en: 'Piping', icon: 'Cable' },
  { id: 'valves', number: 4, label_pt: 'Válvulas', label_en: 'Valves', icon: 'Disc3' },
  { id: 'appliances', number: 5, label_pt: 'Aparelhos', label_en: 'Appliances', icon: 'Flame' },
  { id: 'ventilation', number: 6, label_pt: 'Ventilação', label_en: 'Ventilation', icon: 'Wind' },
  { id: 'flue', number: 7, label_pt: 'Exaustão', label_en: 'Flue Gas', icon: 'ArrowUpFromLine' },
  { id: 'safety', number: 8, label_pt: 'Segurança', label_en: 'Safety', icon: 'ShieldCheck' },
  { id: 'observations', number: 9, label_pt: 'Observações', label_en: 'Observations', icon: 'ClipboardList' },
];

export function createDefaultAppliance(): GasAppliance {
  return {
    id: crypto.randomUUID(), type: '', brand: '', model: '', power_kw: '',
    location: '', connection_type: '', flame_condition: '', safety_device: true,
    co_reading_ppm: '', status: 'ok', notes: '',
  };
}

export function createDefaultAssessment(): GasAssessment {
  return {
    property: {
      address: '', parish: '', municipality: '', district: '', postal_code: '',
      fraction: '', building_type: '', year_of_construction: '',
      floor_area_m2: '', owner_name: '', owner_nif: '',
      inspection_type: 'periodic', inspection_date: new Date().toISOString().split('T')[0],
      inspector_name: '', inspector_id: '', eig_name: '', eig_license: '',
      previous_inspection_date: '', meter_number: '',
    },
    gasSupply: {
      gas_type: '', supplier: '', meter_location: '', meter_accessible: 'ok',
      meter_condition: 'ok', pressure_regulator_type: '', pressure_regulator_condition: 'ok',
      supply_pressure_mbar: '', supply_pipe_material: '', supply_pipe_condition: 'ok', notes: '',
    },
    piping: {
      pipe_material: '', pipe_routing: '', pipe_condition: 'ok', pipe_supports: 'ok',
      pipe_corrosion: 'ok', joints_integrity: 'ok', tightness_test_performed: false,
      tightness_test_result: '', tightness_test_pressure_mbar: '',
      tightness_test_duration_min: '', labeling: 'ok', notes: '',
    },
    valves: {
      general_shutoff_present: true, general_shutoff_accessible: 'ok',
      general_shutoff_operable: 'ok', floor_shutoff_present: true,
      floor_shutoff_accessible: 'ok', floor_shutoff_operable: 'ok',
      appliance_shutoffs_present: true, appliance_shutoffs_accessible: 'ok',
      appliance_shutoffs_operable: 'ok', notes: '',
    },
    appliances: { appliances: [], notes: '' },
    ventilation: {
      combustion_air_supply: 'ok', combustion_air_openings_adequate: 'ok',
      room_ventilation: 'ok', ventilation_grille_condition: 'ok',
      ventilation_grille_sizing: 'ok', kitchen_ventilation: 'ok', notes: '',
    },
    flue: {
      flue_type: '', flue_material: '', flue_condition: 'ok', flue_termination: 'ok',
      draft_test_performed: false, draft_test_result: '', co_spillage_test: '',
      condensation_drain: 'ok', notes: '',
    },
    safety: {
      gas_leak_detected: false, leak_location: '', emergency_shutoff_accessible: 'ok',
      co_detector_present: false, co_detector_functional: false,
      signage_adequate: 'ok', fire_risk_assessment: 'ok', notes: '',
    },
    observations: {
      general_notes: '', access_conditions: '', inspection_limitations: '',
      recommendations_to_owner: '', inspector_internal_notes: '',
    },
  };
}
