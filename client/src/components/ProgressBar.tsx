/**
 * ProgressBar — Section navigation with defect-status indicators
 * Horizontal scrollable on mobile, vertical rail on desktop sidebar
 */
import { SECTIONS } from '@/lib/types';
import type { Verdict } from '@/lib/types';
import { useAssessment } from '@/contexts/AssessmentContext';
import { Building2, Gauge, Cable, Disc3, Flame, Wind, ArrowUpFromLine, ShieldCheck, ClipboardList } from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Building2, Gauge, Cable, Disc3, Flame, Wind, ArrowUpFromLine, ShieldCheck, ClipboardList,
};

interface ProgressBarProps {
  sectionVerdicts?: Record<string, Verdict>;
  vertical?: boolean;
}

const verdictDot: Record<string, string> = {
  approved: 'bg-emerald-500',
  conditional: 'bg-amber-500',
  failed: 'bg-red-500',
  pending: 'bg-slate-300',
};

export default function ProgressBar({ sectionVerdicts, vertical = false }: ProgressBarProps) {
  const { state, goToSection } = useAssessment();
  const { currentSection } = state;

  if (vertical) {
    return (
      <nav className="space-y-1">
        {SECTIONS.map((section, idx) => {
          const Icon = iconMap[section.icon] || ClipboardList;
          const isActive = idx === currentSection;
          const verdict = sectionVerdicts?.[section.id] || 'pending';

          return (
            <button
              key={section.id}
              onClick={() => goToSection(idx)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all ${
                isActive
                  ? 'bg-navy/10 text-navy font-semibold'
                  : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
              }`}
            >
              <div className="relative">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  isActive ? 'bg-navy text-white' : 'bg-muted text-muted-foreground'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                {section.id !== 'property' && section.id !== 'observations' && (
                  <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ${verdictDot[verdict]}`} />
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm truncate">{section.label_pt}</p>
                <p className="text-[10px] text-muted-foreground truncate">{section.label_en}</p>
              </div>
            </button>
          );
        })}
      </nav>
    );
  }

  // Horizontal scrollable (mobile)
  return (
    <nav className="flex gap-1 overflow-x-auto pb-2 scrollbar-hide" style={{ WebkitOverflowScrolling: 'touch' }}>
      {SECTIONS.map((section, idx) => {
        const Icon = iconMap[section.icon] || ClipboardList;
        const isActive = idx === currentSection;
        const verdict = sectionVerdicts?.[section.id] || 'pending';

        return (
          <button
            key={section.id}
            onClick={() => goToSection(idx)}
            className={`flex-shrink-0 flex flex-col items-center gap-1 px-2.5 py-2 rounded-lg transition-all min-w-[56px] ${
              isActive
                ? 'bg-navy/10 text-navy'
                : 'text-muted-foreground hover:bg-muted/60'
            }`}
          >
            <div className="relative">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                isActive ? 'bg-navy text-white' : 'bg-muted text-muted-foreground'
              }`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
              {section.id !== 'property' && section.id !== 'observations' && (
                <div className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-white ${verdictDot[verdict]}`} />
              )}
            </div>
            <span className={`text-[10px] leading-tight text-center ${isActive ? 'font-semibold' : ''}`}>
              {section.label_pt}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
