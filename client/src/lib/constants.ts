// ============================================================
// InspectOS Gas — Constants & Presets
// Portuguese Gas Installation Inspection Data
// ============================================================

export const DISTRICTS = [
  'Aveiro', 'Beja', 'Braga', 'Bragança', 'Castelo Branco',
  'Coimbra', 'Évora', 'Faro', 'Guarda', 'Leiria',
  'Lisboa', 'Portalegre', 'Porto', 'Santarém', 'Setúbal',
  'Viana do Castelo', 'Vila Real', 'Viseu',
  'Região Autónoma dos Açores', 'Região Autónoma da Madeira',
];

export const BUILDING_TYPES: { value: string; label_pt: string; label_en: string }[] = [
  { value: 'type_I', label_pt: 'Tipo I — Habitacional', label_en: 'Type I — Residential' },
  { value: 'type_II', label_pt: 'Tipo II — Estacionamentos', label_en: 'Type II — Parking' },
  { value: 'type_III', label_pt: 'Tipo III — Administrativos', label_en: 'Type III — Administrative' },
  { value: 'type_IV', label_pt: 'Tipo IV — Escolares', label_en: 'Type IV — Educational' },
  { value: 'type_V', label_pt: 'Tipo V — Hospitalares / Lares', label_en: 'Type V — Hospital / Care Home' },
  { value: 'type_VI', label_pt: 'Tipo VI — Espetáculos / Reuniões', label_en: 'Type VI — Entertainment' },
  { value: 'type_VII', label_pt: 'Tipo VII — Hoteleiros / Restauração', label_en: 'Type VII — Hotel / Restaurant' },
  { value: 'type_VIII', label_pt: 'Tipo VIII — Comerciais / Gares', label_en: 'Type VIII — Commercial' },
  { value: 'type_IX', label_pt: 'Tipo IX — Desportivos / Lazer', label_en: 'Type IX — Sports / Leisure' },
  { value: 'type_X', label_pt: 'Tipo X — Museus / Galerias', label_en: 'Type X — Museums' },
  { value: 'type_XI', label_pt: 'Tipo XI — Bibliotecas / Arquivos', label_en: 'Type XI — Libraries' },
  { value: 'type_XII', label_pt: 'Tipo XII — Industriais / Oficinas', label_en: 'Type XII — Industrial' },
];

export const GAS_TYPES: { value: string; label_pt: string; label_en: string }[] = [
  { value: 'natural_gas', label_pt: 'Gás Natural (GN)', label_en: 'Natural Gas (GN)' },
  { value: 'lpg_canalized', label_pt: 'GPL Canalizado', label_en: 'LPG Canalized' },
  { value: 'lpg_bottle', label_pt: 'GPL Garrafa', label_en: 'LPG Bottle' },
];

export const GAS_SUPPLIERS = [
  'Galp Gás Natural', 'EDP Comercial', 'Goldenergy', 'Endesa',
  'Iberdrola', 'Prio Energy', 'Lisboagás', 'Portgás', 'Setgás',
  'Medigás', 'Tagusgás', 'Lusitaniagás', 'Outro',
];

export const PIPE_MATERIALS: { value: string; label_pt: string; label_en: string }[] = [
  { value: 'copper', label_pt: 'Cobre', label_en: 'Copper' },
  { value: 'steel', label_pt: 'Aço', label_en: 'Steel' },
  { value: 'polyethylene', label_pt: 'Polietileno', label_en: 'Polyethylene' },
  { value: 'multilayer', label_pt: 'Multicamada', label_en: 'Multilayer' },
  { value: 'other', label_pt: 'Outro', label_en: 'Other' },
];

export const APPLIANCE_TYPES: { value: string; label_pt: string; label_en: string }[] = [
  { value: 'water_heater', label_pt: 'Esquentador', label_en: 'Water Heater' },
  { value: 'boiler', label_pt: 'Caldeira', label_en: 'Boiler' },
  { value: 'cooktop', label_pt: 'Placa / Fogão', label_en: 'Cooktop / Stove' },
  { value: 'oven', label_pt: 'Forno', label_en: 'Oven' },
  { value: 'dryer', label_pt: 'Secador', label_en: 'Dryer' },
  { value: 'heater', label_pt: 'Aquecedor', label_en: 'Space Heater' },
  { value: 'other', label_pt: 'Outro', label_en: 'Other' },
];

export const FLUE_TYPES: { value: string; label_pt: string; label_en: string }[] = [
  { value: 'individual', label_pt: 'Individual', label_en: 'Individual' },
  { value: 'collective', label_pt: 'Coletiva', label_en: 'Collective' },
  { value: 'room_sealed', label_pt: 'Câmara Estanque', label_en: 'Room Sealed' },
  { value: 'none', label_pt: 'Sem Exaustão', label_en: 'None' },
];

export const DEFECT_LABELS: Record<string, { label_pt: string; label_en: string; color: string }> = {
  ok: { label_pt: 'Conforme', label_en: 'OK', color: 'safety-green' },
  A: { label_pt: 'Defeito A (Menor)', label_en: 'Defect A (Minor)', color: 'blue' },
  B: { label_pt: 'Defeito B (Grave)', label_en: 'Defect B (Serious)', color: 'safety-amber' },
  G: { label_pt: 'Defeito G (Crítico)', label_en: 'Defect G (Critical)', color: 'safety-red' },
};

export const VERDICT_LABELS: Record<string, { label_pt: string; label_en: string; description_pt: string }> = {
  approved: {
    label_pt: 'Aprovado',
    label_en: 'Approved',
    description_pt: 'Instalação conforme. Sem defeitos ou apenas defeitos Tipo A.',
  },
  conditional: {
    label_pt: 'Condicionado',
    label_en: 'Conditional',
    description_pt: 'Defeitos Tipo B detetados. Correção obrigatória dentro do prazo.',
  },
  failed: {
    label_pt: 'Reprovado',
    label_en: 'Failed',
    description_pt: 'Defeitos Tipo G detetados. Corte imediato do abastecimento de gás.',
  },
  pending: {
    label_pt: 'Pendente',
    label_en: 'Pending',
    description_pt: 'Inspeção em curso. Resultado ainda não determinado.',
  },
};

export const INSPECTION_TYPES: { value: string; label_pt: string; label_en: string }[] = [
  { value: 'initial', label_pt: 'Inspeção Inicial', label_en: 'Initial Inspection' },
  { value: 'periodic', label_pt: 'Inspeção Periódica', label_en: 'Periodic Inspection' },
  { value: 'extraordinary', label_pt: 'Inspeção Extraordinária', label_en: 'Extraordinary Inspection' },
];

export interface DeficiencyRecommendation {
  id: string;
  area: string;
  defect_type: 'B' | 'G';
  title_pt: string;
  title_en: string;
  description_pt: string;
  corrective_action_pt: string;
  corrective_action_en: string;
  deadline_days: number;
  estimated_cost_range: [number, number];
  regulatory_ref: string;
}

export const COMMON_DEFICIENCIES: DeficiencyRecommendation[] = [
  {
    id: 'D01', area: 'piping', defect_type: 'G',
    title_pt: 'Fuga de gás na tubagem', title_en: 'Gas leak in piping',
    description_pt: 'Fuga de gás detetada na rede interior de tubagem.',
    corrective_action_pt: 'Reparação imediata da tubagem por EI (Entidade Instaladora de Gás) certificada. Corte de gás obrigatório.',
    corrective_action_en: 'Immediate pipe repair by certified EI (Gas Installer Entity). Gas supply cutoff mandatory.',
    deadline_days: 0, estimated_cost_range: [150, 500], regulatory_ref: 'DL 97/2017 Art. 29',
  },
  {
    id: 'D02', area: 'piping', defect_type: 'B',
    title_pt: 'Corrosão visível na tubagem', title_en: 'Visible pipe corrosion',
    description_pt: 'Sinais de corrosão na tubagem de aço ou cobre.',
    corrective_action_pt: 'Substituição dos troços afetados por EI (Entidade Instaladora de Gás) certificada.',
    corrective_action_en: 'Replacement of affected sections by certified installer.',
    deadline_days: 30, estimated_cost_range: [200, 800], regulatory_ref: 'RT-RIGP',
  },
  {
    id: 'D03', area: 'piping', defect_type: 'B',
    title_pt: 'Teste de estanquidade reprovado', title_en: 'Tightness test failed',
    description_pt: 'A rede de tubagem não passou no teste de estanquidade.',
    corrective_action_pt: 'Identificação e reparação de fugas. Novo teste de estanquidade obrigatório.',
    corrective_action_en: 'Identify and repair leaks. New tightness test required.',
    deadline_days: 15, estimated_cost_range: [100, 400], regulatory_ref: 'DL 97/2017',
  },
  {
    id: 'D04', area: 'valves', defect_type: 'G',
    title_pt: 'Válvula de corte geral inoperável', title_en: 'General shutoff valve inoperable',
    description_pt: 'A válvula de corte geral não funciona ou está inacessível.',
    corrective_action_pt: 'Substituição imediata da válvula de corte geral por EI (Entidade Instaladora de Gás) certificada.',
    corrective_action_en: 'Immediate replacement of general shutoff valve by certified installer.',
    deadline_days: 0, estimated_cost_range: [80, 250], regulatory_ref: 'DL 97/2017 Art. 15',
  },
  {
    id: 'D05', area: 'valves', defect_type: 'B',
    title_pt: 'Válvula de corte de aparelho em falta', title_en: 'Appliance shutoff valve missing',
    description_pt: 'Um ou mais aparelhos a gás não possuem válvula de corte individual.',
    corrective_action_pt: 'Instalação de válvulas de corte individuais por EI (Entidade Instaladora de Gás) certificada.',
    corrective_action_en: 'Installation of individual shutoff valves by certified installer.',
    deadline_days: 30, estimated_cost_range: [50, 150], regulatory_ref: 'RT-RIGP',
  },
  {
    id: 'D06', area: 'appliances', defect_type: 'G',
    title_pt: 'Nível de CO perigoso', title_en: 'Dangerous CO level',
    description_pt: 'Leitura de CO (monóxido de carbono) acima de 200 ppm num aparelho a gás.',
    corrective_action_pt: 'Desativação imediata do aparelho. Reparação ou substituição obrigatória.',
    corrective_action_en: 'Immediate appliance shutdown. Repair or replacement mandatory.',
    deadline_days: 0, estimated_cost_range: [200, 1500], regulatory_ref: 'DL 97/2017',
  },
  {
    id: 'D07', area: 'appliances', defect_type: 'B',
    title_pt: 'Chama amarela / irregular', title_en: 'Yellow / irregular flame',
    description_pt: 'Combustão incompleta detetada — chama amarela ou irregular.',
    corrective_action_pt: 'Limpeza e regulação do queimador por técnico qualificado.',
    corrective_action_en: 'Burner cleaning and adjustment by qualified technician.',
    deadline_days: 15, estimated_cost_range: [60, 200], regulatory_ref: 'RT-RIGP',
  },
  {
    id: 'D08', area: 'appliances', defect_type: 'B',
    title_pt: 'Ligação flexível deteriorada', title_en: 'Deteriorated flexible connection',
    description_pt: 'Tubo flexível de ligação ao aparelho em mau estado ou fora de validade.',
    corrective_action_pt: 'Substituição do tubo flexível por modelo certificado.',
    corrective_action_en: 'Replace flexible hose with certified model.',
    deadline_days: 15, estimated_cost_range: [20, 60], regulatory_ref: 'RT-RIGP',
  },
  {
    id: 'D09', area: 'ventilation', defect_type: 'G',
    title_pt: 'Ventilação insuficiente — risco de asfixia', title_en: 'Insufficient ventilation — asphyxiation risk',
    description_pt: 'Aberturas de ventilação para combustão bloqueadas ou inexistentes em espaço com aparelho a gás.',
    corrective_action_pt: 'Desobstrução ou criação de aberturas de ventilação conformes. Corte de gás até resolução.',
    corrective_action_en: 'Unblock or create compliant ventilation openings. Gas cutoff until resolved.',
    deadline_days: 0, estimated_cost_range: [100, 400], regulatory_ref: 'DL 97/2017 Art. 22',
  },
  {
    id: 'D10', area: 'ventilation', defect_type: 'B',
    title_pt: 'Grelha de ventilação subdimensionada', title_en: 'Undersized ventilation grille',
    description_pt: 'Área livre da grelha de ventilação inferior ao mínimo regulamentar.',
    corrective_action_pt: 'Substituição da grelha por modelo com área livre adequada.',
    corrective_action_en: 'Replace grille with adequately sized model.',
    deadline_days: 30, estimated_cost_range: [30, 100], regulatory_ref: 'RT-RIGP',
  },
  {
    id: 'D11', area: 'flue', defect_type: 'G',
    title_pt: 'Conduta de exaustão desligada', title_en: 'Disconnected flue duct',
    description_pt: 'Conduta de evacuação de gases de combustão desligada do aparelho ou da chaminé.',
    corrective_action_pt: 'Reconexão imediata da conduta. Corte de gás obrigatório até resolução.',
    corrective_action_en: 'Immediate flue reconnection. Gas cutoff mandatory until resolved.',
    deadline_days: 0, estimated_cost_range: [80, 300], regulatory_ref: 'DL 97/2017',
  },
  {
    id: 'D12', area: 'flue', defect_type: 'B',
    title_pt: 'Conduta de exaustão corroída', title_en: 'Corroded flue duct',
    description_pt: 'Sinais de corrosão ou deterioração na conduta de exaustão.',
    corrective_action_pt: 'Substituição da conduta de exaustão.',
    corrective_action_en: 'Replace flue duct.',
    deadline_days: 30, estimated_cost_range: [100, 400], regulatory_ref: 'RT-RIGP',
  },
  {
    id: 'D13', area: 'safety', defect_type: 'G',
    title_pt: 'Fuga de gás ativa detetada', title_en: 'Active gas leak detected',
    description_pt: 'Fuga de gás ativa detetada durante a inspeção.',
    corrective_action_pt: 'Corte imediato do abastecimento de gás. Reparação urgente por EI (Entidade Instaladora de Gás) certificada.',
    corrective_action_en: 'Immediate gas supply cutoff. Urgent repair by certified installer.',
    deadline_days: 0, estimated_cost_range: [100, 600], regulatory_ref: 'DL 97/2017 Art. 29',
  },
  {
    id: 'D14', area: 'safety', defect_type: 'B',
    title_pt: 'Detetor de CO ausente (recomendado)', title_en: 'CO detector absent (recommended)',
    description_pt: 'Não existe detetor de monóxido de carbono instalado.',
    corrective_action_pt: 'Instalação de detetor de CO (monóxido de carbono) em espaços com aparelhos a gás.',
    corrective_action_en: 'Install CO (carbon monoxide) detector in spaces with gas appliances.',
    deadline_days: 60, estimated_cost_range: [25, 80], regulatory_ref: 'Recomendação DGEG (Direção-Geral de Energia e Geologia)',
  },
];
