import type { MaintenanceComponent } from '../data/seedData';

export interface JobMaterial {
  id: string; // unique stable id
  filamentId: string; // key from filamentPresets
  weight_g: number;
  role: string;
  price_per_kg_thb: number;
  power_draw_multiplier: number;
  hardware_wear_multiplier: number;
  waste_g: number;
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

export const calculateMaterialLineCost = (mat: JobMaterial): number =>
  (mat.price_per_kg_thb / 1000) * ((mat.weight_g || 0) + (mat.waste_g || 0));

export const calculateWasteCost = (jobMaterials: JobMaterial[]): number =>
  jobMaterials.reduce(
    (total, mat) => total + (mat.price_per_kg_thb / 1000) * (mat.waste_g || 0),
    0
  );

export const calculateMaterialCost = (
  jobMaterials: JobMaterial[]
) => {
  return jobMaterials.reduce((total, mat) => {
    return total + calculateMaterialLineCost(mat);
  }, 0);
};

export const getActiveMultipliers = (
  jobMaterials: JobMaterial[]
) => {
  if (jobMaterials.length === 0) {
    return { power: 1, wear: 1 };
  }
  
  let maxPower = 1;
  let maxWear = 1;

  jobMaterials.forEach(mat => {
    if (mat.power_draw_multiplier > maxPower) maxPower = mat.power_draw_multiplier;
    if (mat.hardware_wear_multiplier > maxWear) maxWear = mat.hardware_wear_multiplier;
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

export interface CostBreakdown {
  totalTimeHours: number;
  materialCost: number;
  wasteCost: number;
  multipliers: { power: number; wear: number };
  energyCost: number;
  laborCost: number;
  baseHardwareDepreciation: number;
  totalComponentWear: number;
  componentWearDetails: { name: string; cost: number }[];
  baseCost: number;
  failureBufferCost: number;
  grandTotal: number;
  materialsByRole: Record<string, number>;
  effectiveDrawWatts: number;
}

export const computeCosts = (state: CalculatorState): CostBreakdown => {
  const totalTimeHours = calculateTotalTime(state.printTimeHours, state.printTimeMins);
  const materialCost = calculateMaterialCost(state.jobMaterials);
  const wasteCost = calculateWasteCost(state.jobMaterials);
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

  const componentWearDetails = state.maintenanceParts.map(part => ({
    name: part.name,
    cost: calculateComponentWear(part, totalTimeHours, multipliers.wear)
  }));

  const baseCost = materialCost + energyCost + laborCost + baseHardwareDepreciation + totalComponentWear;
  const failureBufferCost = baseCost * (state.failureRate / 100);
  const grandTotal = baseCost + failureBufferCost;

  const materialsByRole: Record<string, number> = {};
  state.jobMaterials.forEach(mat => {
    const cost = calculateMaterialLineCost(mat);
    materialsByRole[mat.role] = (materialsByRole[mat.role] || 0) + cost;
  });

  return {
    totalTimeHours,
    materialCost,
    wasteCost,
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
};
