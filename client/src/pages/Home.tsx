/**
 * Home — Main page for InspectOS Gas Installation Inspection
 * Layout: Desktop sidebar + content area; Mobile bottom nav
 * Design: Industrial Safety Aesthetic — navy, safety colors
 */
import { useAssessment } from '@/contexts/AssessmentContext';
import { SECTIONS } from '@/lib/types';
import type { ViewType } from '@/lib/types';
import VerdictBadge from '@/components/VerdictBadge';
import ProgressBar from '@/components/ProgressBar';
import PropertySection from '@/components/sections/PropertySection';
import GasSupplySection from '@/components/sections/GasSupplySection';
import PipingSection from '@/components/sections/PipingSection';
import ValvesSection from '@/components/sections/ValvesSection';
import AppliancesSection from '@/components/sections/AppliancesSection';
import VentilationSection from '@/components/sections/VentilationSection';
import FlueSection from '@/components/sections/FlueSection';
import SafetySection from '@/components/sections/SafetySection';
import ObservationsSection from '@/components/sections/ObservationsSection';
import DefectsPanel from '@/components/DefectsPanel';
import GasInspectionReport from '@/components/GasInspectionReport';
import { Button } from '@/components/ui/button';
import {
  ChevronLeft, ChevronRight, ClipboardList, AlertTriangle,
  FileText, BarChart3, RotateCcw, Flame
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const HERO_IMG = 'https://d2xsxph8kpxj0f.cloudfront.net/108410706/QDx4TbGyp9PR3n3fm3oVgC/gas-hero_3efa44e5.png';

const sectionComponents: Record<string, React.ComponentType> = {
  property: PropertySection,
  gasSupply: GasSupplySection,
  piping: PipingSection,
  valves: ValvesSection,
  appliances: AppliancesSection,
  ventilation: VentilationSection,
  flue: FlueSection,
  safety: SafetySection,
  observations: ObservationsSection,
};

export default function Home() {
  const { state, goToSection, goNext, goPrev, setView, resetAssessment } = useAssessment();
  const { currentSection, currentView, compliance } = state;
  const section = SECTIONS[currentSection];
  const SectionComponent = sectionComponents[section.id];

  const viewTabs: { id: ViewType; label: string; icon: typeof ClipboardList }[] = [
    { id: 'form', label: 'Inspeção', icon: ClipboardList },
    { id: 'results', label: 'Resultado', icon: BarChart3 },
    { id: 'defects', label: 'Defeitos', icon: AlertTriangle },
    { id: 'report', label: 'Relatório', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-navy text-white shadow-lg print:hidden">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center">
              <Flame className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h1 className="text-base font-heading font-bold tracking-tight leading-tight">InspectOS Gas</h1>
              <p className="text-[10px] text-white/60 leading-tight">Inspeção de Gás · DL 97/2017</p>
            </div>
          </div>
          <div className="hidden md:block">
            <VerdictBadge verdict={compliance.verdict} defects={compliance.defects} compact />
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (confirm('Reiniciar inspeção? / Reset inspection?')) resetAssessment();
            }}
            className="text-white/70 hover:text-white hover:bg-white/10 h-9 w-9 p-0"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </header>

      {/* View Tabs */}
      <div className="bg-white border-b border-border print:hidden">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex gap-0">
            {viewTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = currentView === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setView(tab.id)}
                  className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                    isActive
                      ? 'border-navy text-navy'
                      : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        <div className="max-w-7xl mx-auto w-full flex">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:flex flex-col w-72 border-r border-border bg-white p-4 gap-4 print:hidden">
            <VerdictBadge verdict={compliance.verdict} defects={compliance.defects} />

            {/* Completion */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Progresso / Progress</span>
                <span className="font-mono font-semibold text-foreground">{compliance.completionPercent}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-navy rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${compliance.completionPercent}%` }}
                  transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                />
              </div>
            </div>

            {/* Section Navigation */}
            {currentView === 'form' && (
              <ProgressBar sectionVerdicts={compliance.sectionVerdicts} vertical />
            )}
          </aside>

          {/* Content Area */}
          <main className="flex-1 min-w-0">
            {currentView === 'form' && (
              <>
                {/* Mobile section nav */}
                <div className="lg:hidden bg-white border-b border-border px-4 pt-2">
                  <div className="flex items-center gap-2 mb-2">
                    <VerdictBadge verdict={compliance.verdict} defects={compliance.defects} compact />
                  </div>
                  <ProgressBar sectionVerdicts={compliance.sectionVerdicts} />
                </div>

                {/* Section Content */}
                <div className="p-4 md:p-6 max-w-3xl">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={section.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                    >
                      {SectionComponent && <SectionComponent />}
                    </motion.div>
                  </AnimatePresence>

                  {/* Navigation buttons */}
                  <div className="flex items-center justify-between mt-8 pt-4 border-t border-border">
                    <Button
                      variant="outline"
                      onClick={goPrev}
                      disabled={currentSection === 0}
                      className="min-h-[44px]"
                    >
                      <ChevronLeft className="w-4 h-4 mr-1" />
                      <span className="hidden sm:inline">Anterior</span>
                    </Button>

                    <span className="text-xs text-muted-foreground font-mono">
                      {currentSection + 1} / {SECTIONS.length}
                    </span>

                    {currentSection < SECTIONS.length - 1 ? (
                      <Button onClick={goNext} className="min-h-[44px] bg-navy hover:bg-navy/90">
                        <span className="hidden sm:inline">Seguinte</span>
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    ) : (
                      <Button onClick={() => setView('results')} className="min-h-[44px] bg-navy hover:bg-navy/90">
                        Ver Resultado
                        <BarChart3 className="w-4 h-4 ml-1" />
                      </Button>
                    )}
                  </div>
                </div>
              </>
            )}

            {currentView === 'results' && (
              <div className="p-4 md:p-6 max-w-3xl">
                <ResultsView />
              </div>
            )}

            {currentView === 'defects' && (
              <div className="p-4 md:p-6 max-w-3xl">
                <DefectsPanel />
              </div>
            )}

            {currentView === 'report' && (
              <div className="p-4 md:p-6 max-w-4xl">
                <GasInspectionReport />
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

// Results Summary View
function ResultsView() {
  const { state } = useAssessment();
  const { compliance, data } = state;

  const sectionResults = SECTIONS.filter(s => s.id !== 'property' && s.id !== 'observations').map(s => ({
    ...s,
    verdict: compliance.sectionVerdicts[s.id] || 'pending',
    defects: compliance.defectsBySection[s.id] || { ok: 0, A: 0, B: 0, G: 0, total: 0 },
  }));

  const verdictStyle: Record<string, string> = {
    approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    conditional: 'bg-amber-50 text-amber-700 border-amber-200',
    failed: 'bg-red-50 text-red-700 border-red-200',
    pending: 'bg-slate-50 text-slate-500 border-slate-200',
  };

  const verdictLabel: Record<string, string> = {
    approved: 'Conforme',
    conditional: 'Condicionado',
    failed: 'Reprovado',
    pending: 'Pendente',
  };

  return (
    <div className="space-y-6">
      {/* Hero banner */}
      <div className="relative rounded-xl overflow-hidden h-40 md:h-48">
        <img
          src={HERO_IMG}
          alt="Gas inspection"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy/90 to-navy/50" />
        <div className="relative z-10 p-6 h-full flex flex-col justify-end text-white">
          <h2 className="text-xl md:text-2xl font-heading font-bold">Resultado da Inspeção</h2>
          <p className="text-sm opacity-80">Inspection Result Summary</p>
        </div>
      </div>

      {/* Overall Verdict */}
      <VerdictBadge verdict={compliance.verdict} defects={compliance.defects} />

      {/* Completion */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">Completude / Completion</span>
          <span className="text-sm font-mono font-bold text-navy">{compliance.completionPercent}%</span>
        </div>
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-navy rounded-full transition-all" style={{ width: `${compliance.completionPercent}%` }} />
        </div>
      </div>

      {/* Section-by-section */}
      <div className="space-y-2">
        <h3 className="text-sm font-heading font-bold text-foreground uppercase tracking-wide">
          Resumo por Secção / Section Summary
        </h3>
        {sectionResults.map((s) => (
          <div key={s.id} className="flex items-center justify-between bg-card border border-border rounded-lg px-4 py-3">
            <div>
              <p className="text-sm font-medium text-foreground">{s.label_pt}</p>
              <p className="text-[10px] text-muted-foreground">{s.label_en}</p>
            </div>
            <div className="flex items-center gap-2">
              {s.defects.total > 0 && (
                <div className="flex gap-1">
                  {s.defects.A > 0 && <span className="text-[10px] font-mono bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded">A:{s.defects.A}</span>}
                  {s.defects.B > 0 && <span className="text-[10px] font-mono bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded">B:{s.defects.B}</span>}
                  {s.defects.G > 0 && <span className="text-[10px] font-mono bg-red-50 text-red-700 px-1.5 py-0.5 rounded">G:{s.defects.G}</span>}
                </div>
              )}
              <span className={`text-xs font-semibold px-2 py-1 rounded border ${verdictStyle[s.verdict]}`}>
                {verdictLabel[s.verdict]}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Property summary */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h3 className="text-sm font-heading font-bold text-foreground uppercase tracking-wide mb-3">
          Dados do Imóvel / Property Data
        </h3>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
          <SummaryField label="Morada" value={data.property.address} />
          <SummaryField label="Distrito" value={data.property.district} />
          <SummaryField label="Tipo" value={data.property.building_type} />
          <SummaryField label="Inspetor" value={data.property.inspector_name} />
          <SummaryField label="Data" value={data.property.inspection_date} />
          <SummaryField label="EIG" value={data.property.eig_name} />
        </div>
      </div>
    </div>
  );
}

function SummaryField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-xs text-muted-foreground">{label}: </span>
      <span className="text-sm font-medium text-foreground">{value || '—'}</span>
    </div>
  );
}
