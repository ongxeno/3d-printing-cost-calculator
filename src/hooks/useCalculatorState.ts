import { useState, useMemo, useEffect } from 'react';
import { filamentPresets, printerProfiles } from '../data/seedData';
import type { MaintenanceComponent } from '../data/seedData';
import type { CalculatorState, JobMaterial } from '../utils/formulas';
import {
  calculateTotalTime,
  calculateMaterialCost,
  getActiveMultipliers,
  calculateEnergyCost,
  calculateLaborCost,
  calculateBaseHardwareDepreciation,
  calculateTotalComponentWear,
  calculateComponentWear
} from '../utils/formulas';

const generateId = () => Math.random().toString(36).substring(2, 9);

export const useCalculatorState = () => {
  // Default to the first printer profile
  const initialPrinter = printerProfiles['bambu_x2d_combo'] || Object.values(printerProfiles)[0];
  
  const [state, setState] = useState<CalculatorState>(() => {
    try {
      const saved = localStorage.getItem('3dprint_calculator_state');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (printerProfiles[parsed.printerId]) {
          return parsed;
        }
      }
    } catch (e) {
      console.error("Failed to parse local storage data", e);
    }
    return {
      printerId: initialPrinter.id,
      
      printTimeHours: 0,
      printTimeMins: 0,
      jobMaterials: [],
      
      elecRate: 5.0, // THB/kWh Default
      laborRate: 150, // THB/hr Default
      
      prepTime: 5,
      setupTime: 5,
      postTime: 5,
      failureRate: 5, // 5% default
      
      printerPrice: initialPrinter.purchase_price_thb,
      printerLifespan: initialPrinter.estimated_lifespan_hours,
      basePowerDraw: initialPrinter.base_power_draw_watts,
      maintenanceParts: JSON.parse(JSON.stringify(initialPrinter.maintenance_components)), // deep copy
    };
  });

  useEffect(() => {
    localStorage.setItem('3dprint_calculator_state', JSON.stringify(state));
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
        maintenanceParts: JSON.parse(JSON.stringify(printer.maintenance_components))
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
    localStorage.removeItem('3dprint_calculator_state');
    setState({
      printerId: initialPrinter.id,
      printTimeHours: 0,
      printTimeMins: 0,
      jobMaterials: [],
      elecRate: 5.0,
      laborRate: 150,
      prepTime: 5,
      setupTime: 5,
      postTime: 5,
      failureRate: 5,
      printerPrice: initialPrinter.purchase_price_thb,
      printerLifespan: initialPrinter.estimated_lifespan_hours,
      basePowerDraw: initialPrinter.base_power_draw_watts,
      maintenanceParts: JSON.parse(JSON.stringify(initialPrinter.maintenance_components)),
    });
  };

  // Computed Values
  const computed = useMemo(() => {
    const totalTimeHours = calculateTotalTime(state.printTimeHours, state.printTimeMins);
    const materialCost = calculateMaterialCost(state.jobMaterials);
    const multipliers = getActiveMultipliers(state.jobMaterials);
    
    const energyCost = calculateEnergyCost(
      state.basePowerDraw,
      multipliers.power,
      totalTimeHours,
      state.elecRate
    );

    const laborCost = calculateLaborCost(
      state.prepTime,
      state.setupTime,
      state.postTime,
      state.laborRate
    );

    const baseHardwareDepreciation = calculateBaseHardwareDepreciation(
      state.printerPrice,
      state.printerLifespan,
      totalTimeHours
    );

    const totalComponentWear = calculateTotalComponentWear(
      state.maintenanceParts,
      totalTimeHours,
      multipliers.wear
    );
    
    // Component Wear detailed breakdown for UI
    const componentWearDetails = state.maintenanceParts.map(part => ({
      name: part.name,
      cost: calculateComponentWear(part, totalTimeHours, multipliers.wear)
    }));

    const baseCost = materialCost + energyCost + laborCost + baseHardwareDepreciation + totalComponentWear;
    const failureBufferCost = baseCost * (state.failureRate / 100);
    const grandTotal = baseCost + failureBufferCost;
    
    // Material breakdown by role (for Receipt)
    const materialsByRole: Record<string, number> = {};
    state.jobMaterials.forEach(mat => {
      const cost = (mat.price_per_kg_thb / 1000) * (mat.weight_g || 0);
      materialsByRole[mat.role] = (materialsByRole[mat.role] || 0) + cost;
    });

    return {
      totalTimeHours,
      materialCost,
      multipliers,
      energyCost,
      laborCost,
      baseHardwareDepreciation,
      totalComponentWear,
      componentWearDetails,
      baseCost,
      failureBufferCost,
      grandTotal,
      materialsByRole,
      effectiveDrawWatts: state.basePowerDraw * multipliers.power
    };
  }, [state]);

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
