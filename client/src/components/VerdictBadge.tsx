/**
 * VerdictBadge — Live compliance verdict display
 * Shows Aprovado/Condicionado/Reprovado with defect counters
 * Always visible in sidebar (desktop) or header (mobile)
 */
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, ShieldAlert, ShieldX, Clock } from 'lucide-react';
import type { Verdict } from '@/lib/types';
import type { DefectSummary } from '@/lib/calculations';

interface VerdictBadgeProps {
  verdict: Verdict;
  defects: DefectSummary;
  compact?: boolean;
}

const verdictConfig: Record<Verdict, {
  label_pt: string;
  label_en: string;
  bgClass: string;
  textClass: string;
  icon: typeof ShieldCheck;
}> = {
  approved: {
    label_pt: 'Aprovado',
    label_en: 'Approved',
    bgClass: 'bg-emerald-600',
    textClass: 'text-white',
    icon: ShieldCheck,
  },
  conditional: {
    label_pt: 'Condicionado',
    label_en: 'Conditional',
    bgClass: 'bg-amber-500',
    textClass: 'text-amber-950',
    icon: ShieldAlert,
  },
  failed: {
    label_pt: 'Reprovado',
    label_en: 'Failed',
    bgClass: 'bg-red-600',
    textClass: 'text-white',
    icon: ShieldX,
  },
  pending: {
    label_pt: 'Pendente',
    label_en: 'Pending',
    bgClass: 'bg-slate-400',
    textClass: 'text-white',
    icon: Clock,
  },
};

export default function VerdictBadge({ verdict, defects, compact = false }: VerdictBadgeProps) {
  const config = verdictConfig[verdict];
  const Icon = config.icon;

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md ${config.bgClass} ${config.textClass}`}>
          <Icon className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-wide">{config.label_pt}</span>
        </div>
        <DefectChips defects={defects} small />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <AnimatePresence mode="wait">
        <motion.div
          key={verdict}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className={`rounded-lg p-4 ${config.bgClass} ${config.textClass} shadow-lg`}
        >
          <div className="flex items-center gap-3">
            <Icon className="w-8 h-8" />
            <div>
              <p className="text-lg font-bold font-heading tracking-wide">{config.label_pt}</p>
              <p className="text-xs opacity-80">{config.label_en}</p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <DefectChips defects={defects} />
    </div>
  );
}

function DefectChips({ defects, small = false }: { defects: DefectSummary; small?: boolean }) {
  const chips = [
    { label: 'OK', count: defects.ok, className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { label: 'A', count: defects.A, className: 'bg-blue-50 text-blue-700 border-blue-200' },
    { label: 'B', count: defects.B, className: 'bg-amber-50 text-amber-700 border-amber-200' },
    { label: 'G', count: defects.G, className: 'bg-red-50 text-red-700 border-red-200' },
  ];

  return (
    <div className={`flex gap-1.5 ${small ? '' : 'flex-wrap'}`}>
      {chips.map((chip) => (
        <div
          key={chip.label}
          className={`inline-flex items-center gap-1 border rounded-md font-mono font-semibold ${chip.className} ${
            small ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-1 text-xs'
          }`}
        >
          <span>{chip.label}</span>
          <span>{chip.count}</span>
        </div>
      ))}
    </div>
  );
}
