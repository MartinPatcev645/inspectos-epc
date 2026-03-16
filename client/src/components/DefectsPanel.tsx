/**
 * DefectsPanel — Lists all defects found with remediation guidance
 * Groups by severity (G → B → A), shows remediation steps and deadlines
 */
import { useAssessment } from '@/contexts/AssessmentContext';
import { getDefectList, type DefectItem } from '@/lib/calculations';
import { AlertTriangle, ShieldX, Info, Clock, Wrench } from 'lucide-react';

const severityConfig: Record<string, {
  label: string;
  labelEn: string;
  icon: typeof AlertTriangle;
  bgClass: string;
  textClass: string;
  borderClass: string;
  description: string;
  deadline: string;
}> = {
  G: {
    label: 'Tipo G — Grave',
    labelEn: 'Type G — Critical',
    icon: ShieldX,
    bgClass: 'bg-red-50',
    textClass: 'text-red-800',
    borderClass: 'border-red-200',
    description: 'Perigo imediato. Corte de gás obrigatório. / Immediate danger. Gas cutoff mandatory.',
    deadline: 'Imediato / Immediate',
  },
  B: {
    label: 'Tipo B — Significativo',
    labelEn: 'Type B — Significant',
    icon: AlertTriangle,
    bgClass: 'bg-amber-50',
    textClass: 'text-amber-800',
    borderClass: 'border-amber-200',
    description: 'Reparação obrigatória em 30 dias. / Mandatory repair within 30 days.',
    deadline: '30 dias / 30 days',
  },
  A: {
    label: 'Tipo A — Menor',
    labelEn: 'Type A — Minor',
    icon: Info,
    bgClass: 'bg-blue-50',
    textClass: 'text-blue-700',
    borderClass: 'border-blue-200',
    description: 'Recomendação de correção na próxima manutenção. / Recommended fix at next maintenance.',
    deadline: 'Próxima manutenção / Next maintenance',
  },
};

export default function DefectsPanel() {
  const { state } = useAssessment();
  const defects = getDefectList(state.data);

  const grouped: Record<string, DefectItem[]> = { G: [], B: [], A: [] };
  defects.forEach((d) => {
    if (grouped[d.severity]) grouped[d.severity].push(d);
  });

  const totalDefects = defects.length;

  if (totalDefects === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
          <Wrench className="w-8 h-8 text-emerald-600" />
        </div>
        <h3 className="text-lg font-heading font-bold text-foreground mb-1">Sem Defeitos Registados</h3>
        <p className="text-sm text-muted-foreground">No defects recorded. Complete the inspection sections to identify issues.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-3">
        <h2 className="text-lg font-heading font-bold text-foreground">Defeitos e Correções</h2>
        <p className="text-sm text-muted-foreground">Defects & Remediation — {totalDefects} item(s) found</p>
      </div>

      {(['G', 'B', 'A'] as const).map((severity) => {
        const items = grouped[severity];
        if (items.length === 0) return null;
        const config = severityConfig[severity];
        const Icon = config.icon;

        return (
          <div key={severity} className={`rounded-lg border ${config.borderClass} overflow-hidden`}>
            <div className={`${config.bgClass} px-4 py-3 flex items-center gap-3`}>
              <Icon className={`w-5 h-5 ${config.textClass}`} />
              <div>
                <p className={`text-sm font-bold ${config.textClass}`}>{config.label}</p>
                <p className={`text-xs ${config.textClass} opacity-75`}>{config.labelEn}</p>
              </div>
              <span className={`ml-auto text-xs font-mono font-bold ${config.textClass} bg-white/50 px-2 py-0.5 rounded`}>
                {items.length}
              </span>
            </div>
            <div className={`p-3 text-xs ${config.textClass} ${config.bgClass} opacity-80 border-b ${config.borderClass}`}>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{config.description}</span>
              </div>
            </div>
            <div className="divide-y divide-border">
              {items.map((defect, idx) => (
                <div key={idx} className="px-4 py-3 bg-white">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium text-foreground">{defect.label_pt}</p>
                      <p className="text-xs text-muted-foreground">{defect.label_en}</p>
                    </div>
                    <span className="text-[10px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded shrink-0">
                      {defect.section}
                    </span>
                  </div>
                  {defect.remediation && (
                    <div className="mt-2 flex items-start gap-1.5 text-xs text-muted-foreground">
                      <Wrench className="w-3 h-3 mt-0.5 shrink-0" />
                      <span>{defect.remediation}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
