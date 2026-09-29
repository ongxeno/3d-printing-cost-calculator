import { filamentPresets, printerProfiles } from '../data/seedData';
import type { FilamentPreset, PrinterProfile, MaintenanceComponent } from '../data/seedData';
import { generateId } from './id';

export interface ProfileSet {
  filaments: Record<string, FilamentPreset>;
  printers: Record<string, PrinterProfile>;
}

export const CUSTOM_PROFILES_KEY = '3dprint_custom_profiles';
export const CUSTOM_PROFILES_VERSION = 1;
export const CUSTOM_ID_PREFIX = 'custom_';

export const seedProfiles: ProfileSet = {
  filaments: filamentPresets,
  printers: printerProfiles,
};

export const emptyCustomProfiles = (): ProfileSet => ({ filaments: {}, printers: {} });

export const mergeProfiles = (custom: ProfileSet): ProfileSet => ({
  filaments: { ...seedProfiles.filaments, ...custom.filaments },
  printers: { ...seedProfiles.printers, ...custom.printers },
});

export const isCustomId = (id: string): boolean => id.startsWith(CUSTOM_ID_PREFIX);

export const newCustomId = (): string => `${CUSTOM_ID_PREFIX}${generateId()}`;

export const sanitizeMaintenancePart = (raw: Record<string, unknown>): MaintenanceComponent => ({
  id: typeof raw.id === 'string' ? raw.id : generateId(),
  name: typeof raw.name === 'string' ? raw.name : 'Component',
  replacement_cost_thb: isNonNegativeFiniteNumber(raw.replacement_cost_thb) ? raw.replacement_cost_thb : 0,
  replacement_lifespan_hours: isNonNegativeFiniteNumber(raw.replacement_lifespan_hours) ? raw.replacement_lifespan_hours : 0,
  periodic_maintenance_cost_thb: isNonNegativeFiniteNumber(raw.periodic_maintenance_cost_thb) ? raw.periodic_maintenance_cost_thb : 0,
  periodic_maintenance_interval_hours: isNonNegativeFiniteNumber(raw.periodic_maintenance_interval_hours) ? raw.periodic_maintenance_interval_hours : 0,
});

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isNonNegativeFiniteNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value) && value >= 0;

export const sanitizeCustomProfiles = (raw: unknown): ProfileSet => {
  if (!isPlainObject(raw)) return emptyCustomProfiles();

  const result = emptyCustomProfiles();

  const filaments = isPlainObject(raw.filaments) ? raw.filaments : {};
  for (const [key, value] of Object.entries(filaments)) {
    if (!isCustomId(key) || !isPlainObject(value)) continue;
    result.filaments[key] = {
      id: key,
      name: typeof value.name === 'string' && value.name.trim() ? value.name.trim() : 'Custom filament',
      price_per_kg_thb: isNonNegativeFiniteNumber(value.price_per_kg_thb) ? value.price_per_kg_thb : 0,
      power_draw_multiplier: isNonNegativeFiniteNumber(value.power_draw_multiplier) ? value.power_draw_multiplier : 1,
      hardware_wear_multiplier: isNonNegativeFiniteNumber(value.hardware_wear_multiplier) ? value.hardware_wear_multiplier : 1,
    };
  }

  const printers = isPlainObject(raw.printers) ? raw.printers : {};
  for (const [key, value] of Object.entries(printers)) {
    if (!isCustomId(key) || !isPlainObject(value)) continue;
    result.printers[key] = {
      id: key,
      name: typeof value.name === 'string' && value.name.trim() ? value.name.trim() : 'Custom printer',
      purchase_price_thb: isNonNegativeFiniteNumber(value.purchase_price_thb) ? value.purchase_price_thb : 0,
      estimated_lifespan_hours: isNonNegativeFiniteNumber(value.estimated_lifespan_hours) ? value.estimated_lifespan_hours : 0,
      base_power_draw_watts: isNonNegativeFiniteNumber(value.base_power_draw_watts) ? value.base_power_draw_watts : 0,
      supports_multi_color: value.supports_multi_color === true,
      maintenance_components: Array.isArray(value.maintenance_components)
        ? value.maintenance_components
            .filter((item): item is Record<string, unknown> => isPlainObject(item))
            .map(sanitizeMaintenancePart)
        : [],
    };
  }

  return result;
};

export const loadCustomProfiles = (): ProfileSet => {
  try {
    const saved = localStorage.getItem(CUSTOM_PROFILES_KEY);
    if (saved === null) return emptyCustomProfiles();
    const parsed: unknown = JSON.parse(saved);
    if (!isPlainObject(parsed) || typeof parsed.version !== 'number' || parsed.version > CUSTOM_PROFILES_VERSION) {
      return emptyCustomProfiles();
    }
    return sanitizeCustomProfiles({ filaments: parsed.filaments, printers: parsed.printers });
  } catch {
    return emptyCustomProfiles();
  }
};

export const saveCustomProfiles = (custom: ProfileSet): void => {
  try {
    localStorage.setItem(
      CUSTOM_PROFILES_KEY,
      JSON.stringify({ version: CUSTOM_PROFILES_VERSION, filaments: custom.filaments, printers: custom.printers })
    );
  } catch {
    // ignore
  }
};

export type FilamentValues = Omit<FilamentPreset, 'id' | 'name'>;
export type PrinterValues = Omit<PrinterProfile, 'id' | 'name'>;

export const upsertCustomFilament = (
  custom: ProfileSet,
  name: string,
  values: FilamentValues,
  id?: string
): { custom: ProfileSet; id: string } => {
  const cleanName = name.trim() ? name.trim() : 'Custom filament';
  if (id !== undefined && isCustomId(id) && id in custom.filaments) {
    const next: ProfileSet = {
      filaments: { ...custom.filaments, [id]: { id, name: cleanName, ...structuredClone(values) } },
      printers: { ...custom.printers },
    };
    return { custom: next, id };
  }
  const newId = newCustomId();
  const next: ProfileSet = {
    filaments: { ...custom.filaments, [newId]: { id: newId, name: cleanName, ...structuredClone(values) } },
    printers: { ...custom.printers },
  };
  return { custom: next, id: newId };
};

export const removeCustomFilament = (custom: ProfileSet, id: string): ProfileSet => {
  if (!isCustomId(id) || !(id in custom.filaments)) return custom;
  const filaments = { ...custom.filaments };
  delete filaments[id];
  return { filaments, printers: { ...custom.printers } };
};

export const upsertCustomPrinter = (
  custom: ProfileSet,
  name: string,
  values: PrinterValues,
  id?: string
): { custom: ProfileSet; id: string } => {
  const cleanName = name.trim() ? name.trim() : 'Custom printer';
  if (id !== undefined && isCustomId(id) && id in custom.printers) {
    const next: ProfileSet = {
      filaments: { ...custom.filaments },
      printers: { ...custom.printers, [id]: { id, name: cleanName, ...structuredClone(values) } },
    };
    return { custom: next, id };
  }
  const newId = newCustomId();
  const next: ProfileSet = {
    filaments: { ...custom.filaments },
    printers: { ...custom.printers, [newId]: { id: newId, name: cleanName, ...structuredClone(values) } },
  };
  return { custom: next, id: newId };
};

export const removeCustomPrinter = (custom: ProfileSet, id: string): ProfileSet => {
  if (!isCustomId(id) || !(id in custom.printers)) return custom;
  const printers = { ...custom.printers };
  delete printers[id];
  return { filaments: { ...custom.filaments }, printers };
};
