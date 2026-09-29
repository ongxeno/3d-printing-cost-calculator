import { useState, useMemo, useEffect } from 'react';
import { filamentPresets, printerProfiles } from '../data/seedData';
import type { MaintenanceComponent } from '../data/seedData';
import type { CalculatorState, JobMaterial } from '../utils/formulas';
import { computeCosts } from '../utils/formulas';
import { loadState, saveState, clearState, createDefaultState } from '../utils/persistence';
import { generateId } from '../utils/id';

export const useCalculatorState = () => {
  const [state, setState] = useState<CalculatorState>(loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  // Handle printer change
  const setPrinterId = (id: string) => {
    const printer = printerProfiles[id];
    if (printer) {
      setState(prev => ({
        ...prev,
        printerId: id,
        printerPrice: printer.purchase_price_thb,
        printerLifespan: printer.estimated_lifespan_hours,
        basePowerDraw: printer.base_power_draw_watts,
        maintenanceParts: structuredClone(printer.maintenance_components)
      }));
    }
  };

  const updateState = (updates: Partial<CalculatorState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  // Job Material CRUD
  const addJobMaterial = () => {
    const preset = filamentPresets['mat_pla'];
    const newMaterial: JobMaterial = {
      id: generateId(),
      filamentId: 'mat_pla',
      weight_g: 0,
      role: 'Part',
      price_per_kg_thb: preset.price_per_kg_thb,
      power_draw_multiplier: preset.power_draw_multiplier,
      hardware_wear_multiplier: preset.hardware_wear_multiplier
    };
    setState(prev => ({ ...prev, jobMaterials: [...prev.jobMaterials, newMaterial] }));
  };

  const updateJobMaterial = (id: string, updates: Partial<JobMaterial>) => {
    setState(prev => {
      const jobMaterials = prev.jobMaterials.map(m => {
        if (m.id === id) {
          const updated = { ...m, ...updates };
          if (updates.filamentId && updates.filamentId !== m.filamentId) {
            const preset = filamentPresets[updates.filamentId];
            if (preset) {
              updated.price_per_kg_thb = preset.price_per_kg_thb;
              updated.power_draw_multiplier = preset.power_draw_multiplier;
              updated.hardware_wear_multiplier = preset.hardware_wear_multiplier;
            }
          }
          return updated;
        }
        return m;
      });
      return { ...prev, jobMaterials };
    });
  };

  const removeJobMaterial = (id: string) => {
    setState(prev => ({
      ...prev,
      jobMaterials: prev.jobMaterials.filter(m => m.id !== id)
    }));
  };

  // Maintenance Part CRUD
  const addMaintenancePart = () => {
    const newPart: MaintenanceComponent = {
      id: generateId(),
      name: 'New Component',
      replacement_cost_thb: 0,
      replacement_lifespan_hours: 0,
      periodic_maintenance_cost_thb: 0,
      periodic_maintenance_interval_hours: 0
    };
    setState(prev => ({ ...prev, maintenanceParts: [...prev.maintenanceParts, newPart] }));
  };

  const updateMaintenancePart = (id: string, updates: Partial<MaintenanceComponent>) => {
    setState(prev => ({
      ...prev,
      maintenanceParts: prev.maintenanceParts.map(p => p.id === id ? { ...p, ...updates } : p)
    }));
  };

  const removeMaintenancePart = (id: string) => {
    setState(prev => ({
      ...prev,
      maintenanceParts: prev.maintenanceParts.filter(p => p.id !== id)
    }));
  };

  const resetState = () => {
    clearState();
    setState(createDefaultState());
  };

  const computed = useMemo(() => computeCosts(state), [state]);

  return {
    state,
    resetState,
    setPrinterId,
    updateState,
    addJobMaterial,
    updateJobMaterial,
    removeJobMaterial,
    addMaintenancePart,
    updateMaintenancePart,
    removeMaintenancePart,
    computed
  };
};
