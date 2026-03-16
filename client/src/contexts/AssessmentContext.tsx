// ============================================================
// InspectOS Gas — Assessment Context
// Global state management for gas installation inspection
// ============================================================

import React, { createContext, useContext, useReducer, useCallback, useMemo } from 'react';
import type { GasAssessment, ViewType } from '@/lib/types';
import { createDefaultAssessment, SECTIONS } from '@/lib/types';
import { calculateCompliance, type ComplianceResult } from '@/lib/calculations';

interface AssessmentContextState {
  data: GasAssessment;
  currentSection: number;
  currentView: ViewType;
  compliance: ComplianceResult;
}

type Action =
  | { type: 'SET_SECTION'; payload: number }
  | { type: 'SET_VIEW'; payload: ViewType }
  | { type: 'UPDATE_PROPERTY'; payload: Partial<GasAssessment['property']> }
  | { type: 'UPDATE_GAS_SUPPLY'; payload: Partial<GasAssessment['gasSupply']> }
  | { type: 'UPDATE_PIPING'; payload: Partial<GasAssessment['piping']> }
  | { type: 'UPDATE_VALVES'; payload: Partial<GasAssessment['valves']> }
  | { type: 'UPDATE_APPLIANCES'; payload: Partial<GasAssessment['appliances']> }
  | { type: 'UPDATE_VENTILATION'; payload: Partial<GasAssessment['ventilation']> }
  | { type: 'UPDATE_FLUE'; payload: Partial<GasAssessment['flue']> }
  | { type: 'UPDATE_SAFETY'; payload: Partial<GasAssessment['safety']> }
  | { type: 'UPDATE_OBSERVATIONS'; payload: Partial<GasAssessment['observations']> }
  | { type: 'RESET' };

function reducer(state: AssessmentContextState, action: Action): AssessmentContextState {
  let newData = state.data;

  switch (action.type) {
    case 'SET_SECTION':
      return { ...state, currentSection: action.payload, currentView: 'form' };
    case 'SET_VIEW':
      return { ...state, currentView: action.payload };
    case 'UPDATE_PROPERTY':
      newData = { ...state.data, property: { ...state.data.property, ...action.payload } };
      break;
    case 'UPDATE_GAS_SUPPLY':
      newData = { ...state.data, gasSupply: { ...state.data.gasSupply, ...action.payload } };
      break;
    case 'UPDATE_PIPING':
      newData = { ...state.data, piping: { ...state.data.piping, ...action.payload } };
      break;
    case 'UPDATE_VALVES':
      newData = { ...state.data, valves: { ...state.data.valves, ...action.payload } };
      break;
    case 'UPDATE_APPLIANCES':
      newData = { ...state.data, appliances: { ...state.data.appliances, ...action.payload } };
      break;
    case 'UPDATE_VENTILATION':
      newData = { ...state.data, ventilation: { ...state.data.ventilation, ...action.payload } };
      break;
    case 'UPDATE_FLUE':
      newData = { ...state.data, flue: { ...state.data.flue, ...action.payload } };
      break;
    case 'UPDATE_SAFETY':
      newData = { ...state.data, safety: { ...state.data.safety, ...action.payload } };
      break;
    case 'UPDATE_OBSERVATIONS':
      newData = { ...state.data, observations: { ...state.data.observations, ...action.payload } };
      break;
    case 'RESET':
      return createInitialState();
    default:
      return state;
  }

  return { ...state, data: newData, compliance: calculateCompliance(newData) };
}

function createInitialState(): AssessmentContextState {
  const data = createDefaultAssessment();
  return {
    data,
    currentSection: 0,
    currentView: 'form',
    compliance: calculateCompliance(data),
  };
}

interface AssessmentContextValue {
  state: AssessmentContextState;
  dispatch: React.Dispatch<Action>;
  goToSection: (index: number) => void;
  goNext: () => void;
  goPrev: () => void;
  setView: (view: ViewType) => void;
  updateField: (section: string, field: string, value: unknown) => void;
  resetAssessment: () => void;
}

const AssessmentContext = createContext<AssessmentContextValue | null>(null);

export function AssessmentProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, createInitialState);

  const goToSection = useCallback((index: number) => {
    dispatch({ type: 'SET_SECTION', payload: Math.max(0, Math.min(index, SECTIONS.length - 1)) });
  }, []);

  const goNext = useCallback(() => {
    if (state.currentSection < SECTIONS.length - 1) {
      dispatch({ type: 'SET_SECTION', payload: state.currentSection + 1 });
    }
  }, [state.currentSection]);

  const goPrev = useCallback(() => {
    if (state.currentSection > 0) {
      dispatch({ type: 'SET_SECTION', payload: state.currentSection - 1 });
    }
  }, [state.currentSection]);

  const setView = useCallback((view: ViewType) => {
    dispatch({ type: 'SET_VIEW', payload: view });
  }, []);

  const updateField = useCallback((section: string, field: string, value: unknown) => {
    const actionMap: Record<string, Action['type']> = {
      property: 'UPDATE_PROPERTY',
      gasSupply: 'UPDATE_GAS_SUPPLY',
      piping: 'UPDATE_PIPING',
      valves: 'UPDATE_VALVES',
      appliances: 'UPDATE_APPLIANCES',
      ventilation: 'UPDATE_VENTILATION',
      flue: 'UPDATE_FLUE',
      safety: 'UPDATE_SAFETY',
      observations: 'UPDATE_OBSERVATIONS',
    };
    const type = actionMap[section];
    if (type) {
      dispatch({ type, payload: { [field]: value } } as Action);
    }
  }, []);

  const resetAssessment = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  const value = useMemo(() => ({
    state, dispatch, goToSection, goNext, goPrev, setView, updateField, resetAssessment,
  }), [state, goToSection, goNext, goPrev, setView, updateField, resetAssessment]);

  return (
    <AssessmentContext.Provider value={value}>
      {children}
    </AssessmentContext.Provider>
  );
}

export function useAssessment() {
  const ctx = useContext(AssessmentContext);
  if (!ctx) throw new Error('useAssessment must be used within AssessmentProvider');
  return ctx;
}
