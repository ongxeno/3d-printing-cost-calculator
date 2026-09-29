import type { CalculatorState, JobMaterial } from './formulas';
import type { FilamentPreset } from '../data/seedData';
import { seedProfiles } from './profiles';
import type { ProfileSet } from './profiles';
import { sanitizeMaintenancePart } from './profiles';
import { generateId } from './id';

export const STORAGE_KEY = '3dprint_calculator_state';
export const SCHEMA_VERSION = 1;

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isNonNegativeFiniteNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value) && value >= 0;

const sanitizeJobMaterial = (raw: Record<string, unknown>, filaments: Record<string, FilamentPreset>): JobMaterial => {
  const filamentId = typeof raw.filamentId === 'string' ? raw.filamentId : 'mat_pla';
  const preset = filaments[filamentId];
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
    waste_g: isNonNegativeFiniteNumber(raw.waste_g) ? raw.waste_g : 0,
  };
};

export const createDefaultState = (profiles: ProfileSet = seedProfiles): CalculatorState => {
  const printer = profiles.printers['bambu_x2d_combo'] || Object.values(profiles.printers)[0];
  return {
    printerId: printer.id,
    printTimeHours: 0,
    printTimeMins: 0,
    quantity: 1,
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

export const sanitizeState = (raw: unknown, profiles: ProfileSet = seedProfiles): CalculatorState | null => {
  if (!isPlainObject(raw)) return null;
  const rawPrinterId = raw.printerId;
  if (typeof rawPrinterId !== 'string' || !profiles.printers[rawPrinterId]) return null;
  const printer = profiles.printers[rawPrinterId];

  const state: CalculatorState = {
    ...createDefaultState(profiles),
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

  const rawQuantity = raw.quantity;
  state.quantity = typeof rawQuantity === 'number' && Number.isFinite(rawQuantity) && rawQuantity >= 1
    ? Math.floor(rawQuantity)
    : 1;

  const rawMaterials = raw.jobMaterials;
  state.jobMaterials = Array.isArray(rawMaterials)
    ? rawMaterials
      .filter((item): item is Record<string, unknown> => isPlainObject(item))
      .map(item => sanitizeJobMaterial(item, profiles.filaments))
    : [];

  const rawParts = raw.maintenanceParts;
  if (Array.isArray(rawParts)) {
    state.maintenanceParts = rawParts
      .filter((item): item is Record<string, unknown> => isPlainObject(item))
      .map(sanitizeMaintenancePart);
  }

  return state;
};

export const loadState = (profiles: ProfileSet = seedProfiles): CalculatorState => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === null) {
      return createDefaultState(profiles);
    }
    const parsed: unknown = JSON.parse(saved);
    let raw: unknown;
    if (isPlainObject(parsed) && typeof parsed.schemaVersion === 'number') {
      if (parsed.schemaVersion > SCHEMA_VERSION) {
        return createDefaultState(profiles);
      }
      raw = parsed.state;
    } else {
      raw = parsed;
    }
    return sanitizeState(raw, profiles) ?? createDefaultState(profiles);
  } catch (e) {
    console.error('Failed to load calculator state', e);
    return createDefaultState(profiles);
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
