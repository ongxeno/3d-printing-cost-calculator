import type { MaintenanceComponent } from '../data/seedData';

export interface JobMaterial {
  id: string; // unique stable id
  filamentId: string; // key from filamentPresets
  weight_g: number;
  role: string;
}

export interface CalculatorState {
  // Hardware Profile
  printerId: string;
  
  // Job Details
  printTimeHours: number;
  printTimeMins: number;
  jobMaterials: JobMaterial[];
  
  // Local Economics
  elecRate: number; // THB/kWh
  laborRate: number; // THB/hr
  
  // Labor & Buffers
  prepTime: number; // mins
  setupTime: number; // mins
  postTime: number; // mins
  failureRate: number; // %
  
  // Advanced Variables (Overrides)
  printerPrice: number;
  printerLifespan: number;
  basePowerDraw: number;
  maintenanceParts: MaintenanceComponent[];
}

export const calculateTotalTime = (hours: number, mins: number) => {
  return hours + (mins / 60);
};

export const calculateMaterialCost = (
  jobMaterials: JobMaterial[],
  filamentsData: Record<string, any>
) => {
  return jobMaterials.reduce((total, mat) => {
    const filament = filamentsData[mat.filamentId];
    if (!filament) return total;
    return total + (filament.price_per_kg_thb / 1000) * (mat.weight_g || 0);
  }, 0);
};

export const getActiveMultipliers = (
  jobMaterials: JobMaterial[],
  filamentsData: Record<string, any>
) => {
  if (jobMaterials.length === 0) {
    return { power: 1, wear: 1 };
  }
  
  let maxPower = 1;
  let maxWear = 1;

  jobMaterials.forEach(mat => {
    const filament = filamentsData[mat.filamentId];
    if (filament) {
      if (filament.power_draw_multiplier > maxPower) maxPower = filament.power_draw_multiplier;
      if (filament.hardware_wear_multiplier > maxWear) maxWear = filament.hardware_wear_multiplier;
    }
  });

  return { power: maxPower, wear: maxWear };
};

export const calculateEnergyCost = (
  basePowerWatts: number,
  activePowerMultiplier: number,
  totalTimeHours: number,
  elecRate: number
) => {
  return ((basePowerWatts * activePowerMultiplier) / 1000) * totalTimeHours * elecRate;
};

export const calculateLaborCost = (
  prepMins: number,
  setupMins: number,
  postMins: number,
  laborRate: number
) => {
  return ((prepMins + setupMins + postMins) / 60) * laborRate;
};

export const calculateBaseHardwareDepreciation = (
  printerPrice: number,
  printerLifespanHours: number,
  totalTimeHours: number
) => {
  if (printerLifespanHours <= 0) return 0;
  return (printerPrice / printerLifespanHours) * totalTimeHours;
};

export const calculateComponentWear = (
  part: MaintenanceComponent,
  totalTimeHours: number,
  activeWearMultiplier: number
) => {
  const hourlyReplacementCost = part.replacement_lifespan_hours > 0 
    ? part.replacement_cost_thb / part.replacement_lifespan_hours 
    : 0;
    
  const hourlyPeriodicCost = part.periodic_maintenance_interval_hours > 0 
    ? part.periodic_maintenance_cost_thb / part.periodic_maintenance_interval_hours 
    : 0;

  return (hourlyReplacementCost + hourlyPeriodicCost) * totalTimeHours * activeWearMultiplier;
};

export const calculateTotalComponentWear = (
  maintenanceParts: MaintenanceComponent[],
  totalTimeHours: number,
  activeWearMultiplier: number
) => {
  return maintenanceParts.reduce((total, part) => {
    return total + calculateComponentWear(part, totalTimeHours, activeWearMultiplier);
  }, 0);
};
