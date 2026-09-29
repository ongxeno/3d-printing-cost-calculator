import { filamentPresets, printerProfiles } from '../data/seedData';
import type { CalculatorState, JobMaterial } from './formulas';
import type { MaintenanceComponent } from '../data/seedData';
import { generateId } from './id';

export const STORAGE_KEY = '3dprint_calculator_state';
export const SCHEMA_VERSION = 1;

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isNonNegativeFiniteNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value) && value >= 0;

const sanitizeJobMaterial = (raw: Record<string, unknown>): JobMaterial => {
  const filamentId = typeof raw.filamentId === 'string' ? raw.filamentId : 'mat_pla';
  const preset = filamentPresets[filamentId];
  return {
    id: typeof raw.id === 'string' ? raw.id : generateId(),
    filamentId,
    role: typeof raw.role === 'string' ? raw.role : 'Part',
    weight_g: isNonNegativeFiniteNumber(raw.weight_g) ? raw.weight_g : 0,
    price_per_kg_thb: isNonNegativeFiniteNumber(raw.price_per_kg_thb)
      ? raw.price_per_kg_thb
      : preset ? preset.price_per_kg_thb : 0,
    power_draw_multiplier: isNonNegativeFiniteNumber(raw.power_draw_multiplier)
      ? raw.power_draw_multiplier
      : preset ? preset.power_draw_multiplier : 1,
    hardware_wear_multiplier: isNonNegativeFiniteNumber(raw.hardware_wear_multiplier)
      ? raw.hardware_wear_multiplier
      : preset ? preset.hardware_wear_multiplier : 1,
  };
};

const sanitizeMaintenancePart = (raw: Record<string, unknown>): MaintenanceComponent => ({
  id: typeof raw.id === 'string' ? raw.id : generateId(),
  name: typeof raw.name === 'string' ? raw.name : 'Component',
  replacement_cost_thb: isNonNegativeFiniteNumber(raw.replacement_cost_thb) ? raw.replacement_cost_thb : 0,
  replacement_lifespan_hours: isNonNegativeFiniteNumber(raw.replacement_lifespan_hours) ? raw.replacement_lifespan_hours : 0,
  periodic_maintenance_cost_thb: isNonNegativeFiniteNumber(raw.periodic_maintenance_cost_thb) ? raw.periodic_maintenance_cost_thb : 0,
  periodic_maintenance_interval_hours: isNonNegativeFiniteNumber(raw.periodic_maintenance_interval_hours) ? raw.periodic_maintenance_interval_hours : 0,
});

export const createDefaultState = (): CalculatorState => {
  const printer = printerProfiles['bambu_x2d_combo'] || Object.values(printerProfiles)[0];
  return {
    printerId: printer.id,
    printTimeHours: 0,
    printTimeMins: 0,
    jobMaterials: [],
    elecRate: 5,
    laborRate: 150,
    markupPercent: 30,
    prepTime: 5,
    setupTime: 5,
    postTime: 5,
    failureRate: 5,
    printerPrice: printer.purchase_price_thb,
    printerLifespan: printer.estimated_lifespan_hours,
    basePowerDraw: printer.base_power_draw_watts,
    maintenanceParts: structuredClone(printer.maintenance_components),
  };
};

const NUMERIC_FIELDS = [
  'printTimeHours',
  'printTimeMins',
  'elecRate',
  'laborRate',
  'prepTime',
  'setupTime',
  'postTime',
  'failureRate',
  'printerPrice',
  'printerLifespan',
  'basePowerDraw',
  'markupPercent',
] as const;

export const sanitizeState = (raw: unknown): CalculatorState | null => {
  if (!isPlainObject(raw)) return null;
  const rawPrinterId = raw.printerId;
  if (typeof rawPrinterId !== 'string' || !printerProfiles[rawPrinterId]) return null;
  const printer = printerProfiles[rawPrinterId];

  const state: CalculatorState = {
    ...createDefaultState(),
    printerId: printer.id,
    printerPrice: printer.purchase_price_thb,
    printerLifespan: printer.estimated_lifespan_hours,
    basePowerDraw: printer.base_power_draw_watts,
    maintenanceParts: structuredClone(printer.maintenance_components),
  };

  NUMERIC_FIELDS.forEach(field => {
    const value = raw[field];
    if (isNonNegativeFiniteNumber(value)) {
      state[field] = value;
    }
  });

  const rawMaterials = raw.jobMaterials;
  state.jobMaterials = Array.isArray(rawMaterials)
    ? rawMaterials
      .filter((item): item is Record<string, unknown> => isPlainObject(item))
      .map(sanitizeJobMaterial)
    : [];

  const rawParts = raw.maintenanceParts;
  if (Array.isArray(rawParts)) {
    state.maintenanceParts = rawParts
      .filter((item): item is Record<string, unknown> => isPlainObject(item))
      .map(sanitizeMaintenancePart);
  }

  return state;
};

export const loadState = (): CalculatorState => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === null) {
      return createDefaultState();
    }
    const parsed: unknown = JSON.parse(saved);
    let raw: unknown;
    if (isPlainObject(parsed) && typeof parsed.schemaVersion === 'number') {
      if (parsed.schemaVersion > SCHEMA_VERSION) {
        return createDefaultState();
      }
      raw = parsed.state;
    } else {
      raw = parsed;
    }
    return sanitizeState(raw) ?? createDefaultState();
  } catch (e) {
    console.error('Failed to load calculator state', e);
    return createDefaultState();
  }
};

export const saveState = (state: CalculatorState): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ schemaVersion: SCHEMA_VERSION, state }));
  } catch (e) {
    console.error('Failed to save calculator state', e);
  }
};

export const clearState = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
};
