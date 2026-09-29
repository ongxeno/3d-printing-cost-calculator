import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  CUSTOM_PROFILES_KEY,
  CUSTOM_PROFILES_VERSION,
  CUSTOM_ID_PREFIX,
  seedProfiles,
  emptyCustomProfiles,
  mergeProfiles,
  isCustomId,
  newCustomId,
  sanitizeCustomProfiles,
  loadCustomProfiles,
  saveCustomProfiles,
  upsertCustomFilament,
  removeCustomFilament,
  upsertCustomPrinter,
  removeCustomPrinter,
} from './profiles';
import type { FilamentValues, PrinterValues } from './profiles';

const makeStorage = () => {
  const store: Record<string, string> = {};
  return {
    store,
    api: {
      getItem: (k: string) => (k in store ? store[k] : null),
      setItem: (k: string, v: string) => { store[k] = v; },
      removeItem: (k: string) => { delete store[k]; },
    },
  };
};

const filamentValues: FilamentValues = {
  price_per_kg_thb: 500,
  power_draw_multiplier: 1.2,
  hardware_wear_multiplier: 1.5,
};

const printerValues: PrinterValues = {
  purchase_price_thb: 10000,
  estimated_lifespan_hours: 5000,
  base_power_draw_watts: 150,
  supports_multi_color: false,
  maintenance_components: [
    { id: 'c1', name: 'Nozzle', replacement_cost_thb: 100, replacement_lifespan_hours: 400, periodic_maintenance_cost_thb: 0, periodic_maintenance_interval_hours: 0 },
  ],
};

describe('mergeProfiles', () => {
  it('includes all seed entries', () => {
    const merged = mergeProfiles(emptyCustomProfiles());
    expect(Object.keys(merged.filaments)).toEqual(Object.keys(seedProfiles.filaments));
    expect(Object.keys(merged.printers)).toEqual(Object.keys(seedProfiles.printers));
  });

  it('adds custom entries', () => {
    const custom = emptyCustomProfiles();
    const result = upsertCustomFilament(custom, 'My Fil', filamentValues);
    const merged = mergeProfiles(result.custom);
    expect(merged.filaments[result.id].name).toBe('My Fil');
    expect(Object.keys(merged.filaments)).toHaveLength(Object.keys(seedProfiles.filaments).length + 1);
  });
});

describe('isCustomId / newCustomId', () => {
  it('detects the prefix', () => {
    expect(isCustomId('custom_abc')).toBe(true);
    expect(isCustomId('abc')).toBe(false);
    expect(newCustomId().startsWith(CUSTOM_ID_PREFIX)).toBe(true);
  });
});

describe('sanitizeCustomProfiles', () => {
  it('returns empty for non-object input', () => {
    expect(sanitizeCustomProfiles(null)).toEqual(emptyCustomProfiles());
    expect(sanitizeCustomProfiles('x')).toEqual(emptyCustomProfiles());
    expect(sanitizeCustomProfiles([])).toEqual(emptyCustomProfiles());
  });

  it('drops non-prefixed keys and non-object values', () => {
    const result = sanitizeCustomProfiles({
      filaments: { mat_pla: { name: 'PLA' }, custom_a: 'nope', custom_b: { name: 'B', price_per_kg_thb: 1, power_draw_multiplier: 1, hardware_wear_multiplier: 1 } },
      printers: { custom_c: 42 },
    });
    expect(Object.keys(result.filaments)).toEqual(['custom_b']);
    expect(Object.keys(result.printers)).toEqual([]);
    expect(result.filaments['custom_b'].id).toBe('custom_b');
  });

  it('repairs bad numbers, blank names and non-array components; sets id = key', () => {
    const result = sanitizeCustomProfiles({
      filaments: { custom_f: { name: '   ', price_per_kg_thb: -5, power_draw_multiplier: NaN, hardware_wear_multiplier: 'x' } },
      printers: { custom_p: { name: '  P ', purchase_price_thb: 'x', estimated_lifespan_hours: -1, base_power_draw_watts: 2, supports_multi_color: 'yes', maintenance_components: 'nope' } },
    });
    const f = result.filaments['custom_f'];
    expect(f.id).toBe('custom_f');
    expect(f.name).toBe('Custom filament');
    expect(f.price_per_kg_thb).toBe(0);
    expect(f.power_draw_multiplier).toBe(1);
    expect(f.hardware_wear_multiplier).toBe(1);
    const p = result.printers['custom_p'];
    expect(p.name).toBe('P');
    expect(p.purchase_price_thb).toBe(0);
    expect(p.estimated_lifespan_hours).toBe(0);
    expect(p.base_power_draw_watts).toBe(2);
    expect(p.supports_multi_color).toBe(false);
    expect(p.maintenance_components).toEqual([]);
  });

  it('keeps valid maintenance components', () => {
    const result = sanitizeCustomProfiles({
      printers: { custom_p: { name: 'P', purchase_price_thb: 1, estimated_lifespan_hours: 1, base_power_draw_watts: 1, supports_multi_color: true, maintenance_components: [{ id: 'c', name: 'Nozzle', replacement_cost_thb: 5, replacement_lifespan_hours: 10, periodic_maintenance_cost_thb: 0, periodic_maintenance_interval_hours: 0 }, 7] } },
    });
    expect(result.printers['custom_p'].maintenance_components).toEqual([
      { id: 'c', name: 'Nozzle', replacement_cost_thb: 5, replacement_lifespan_hours: 10, periodic_maintenance_cost_thb: 0, periodic_maintenance_interval_hours: 0 },
    ]);
  });
});

describe('upsertCustomFilament', () => {
  it('creates a new entry with a prefixed id and trimmed name', () => {
    const result = upsertCustomFilament(emptyCustomProfiles(), '  My Fil  ', filamentValues);
    expect(result.id).toMatch(new RegExp(`^${CUSTOM_ID_PREFIX}`));
    expect(result.custom.filaments[result.id].name).toBe('My Fil');
  });

  it('defaults the name when blank', () => {
    const result = upsertCustomFilament(emptyCustomProfiles(), '   ', filamentValues);
    expect(result.custom.filaments[result.id].name).toBe('Custom filament');
  });

  it('updates by id, keeping the id and replacing values', () => {
    const first = upsertCustomFilament(emptyCustomProfiles(), 'Old', filamentValues);
    const changed = { ...filamentValues, price_per_kg_thb: 999 };
    const second = upsertCustomFilament(first.custom, 'New', changed, first.id);
    expect(second.id).toBe(first.id);
    expect(Object.keys(second.custom.filaments)).toHaveLength(1);
    expect(second.custom.filaments[first.id].name).toBe('New');
    expect(second.custom.filaments[first.id].price_per_kg_thb).toBe(999);
  });

  it('creates a new entry for unknown or non-custom ids', () => {
    const first = upsertCustomFilament(emptyCustomProfiles(), 'A', filamentValues);
    expect(Object.keys(upsertCustomFilament(first.custom, 'B', filamentValues, 'unknown_id').custom.filaments)).toHaveLength(2);
    expect(Object.keys(upsertCustomFilament(first.custom, 'C', filamentValues, 'mat_pla').custom.filaments)).toHaveLength(2);
  });

  it('does not mutate the input and deep-clones values', () => {
    const custom = upsertCustomFilament(emptyCustomProfiles(), 'A', filamentValues).custom;
    const snapshot = structuredClone(custom);
    const result = upsertCustomFilament(custom, 'B', filamentValues);
    expect(custom).toEqual(snapshot);
    const stored = result.custom.filaments[result.id];
    expect(stored).not.toBe(filamentValues);
  });
});

describe('removeCustomFilament', () => {
  it('removes a custom entry and ignores seed or unknown ids', () => {
    const { custom, id } = upsertCustomFilament(emptyCustomProfiles(), 'A', filamentValues);
    expect(removeCustomFilament(custom, id).filaments).toEqual({});
    expect(removeCustomFilament(custom, 'mat_pla')).toBe(custom);
    expect(removeCustomFilament(custom, 'custom_nope')).toBe(custom);
  });
});

describe('upsertCustomPrinter', () => {
  it('creates, updates and deep-clones maintenance components', () => {
    const first = upsertCustomPrinter(emptyCustomProfiles(), '  P  ', printerValues);
    expect(first.custom.printers[first.id].name).toBe('P');
    expect(first.custom.printers[first.id].maintenance_components).toHaveLength(1);
    const firstSnapshot = structuredClone(first.custom);
    const changed = { ...printerValues, purchase_price_thb: 1 };
    const second = upsertCustomPrinter(first.custom, 'Q', changed, first.id);
    expect(second.id).toBe(first.id);
    expect(first.custom).toEqual(firstSnapshot);
    expect(second.custom.printers[first.id].purchase_price_thb).toBe(1);
    expect(second.custom.printers[first.id].maintenance_components).not.toBe(printerValues.maintenance_components);
  });

  it('creates a new entry for non-custom ids', () => {
    const first = upsertCustomPrinter(emptyCustomProfiles(), 'A', printerValues);
    expect(Object.keys(upsertCustomPrinter(first.custom, 'B', printerValues, 'bambu_h2c_combo').custom.printers)).toHaveLength(2);
  });
});

describe('removeCustomPrinter', () => {
  it('removes a custom entry and ignores seed or unknown ids', () => {
    const { custom, id } = upsertCustomPrinter(emptyCustomProfiles(), 'A', printerValues);
    expect(removeCustomPrinter(custom, id).printers).toEqual({});
    expect(removeCustomPrinter(custom, 'bambu_x2d_combo')).toBe(custom);
  });
});

describe('save/load custom profiles', () => {
  let storage: ReturnType<typeof makeStorage>;

  beforeEach(() => {
    storage = makeStorage();
    vi.stubGlobal('localStorage', storage.api);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('round-trips a custom set', () => {
    const { custom } = upsertCustomPrinter(emptyCustomProfiles(), 'P', printerValues);
    saveCustomProfiles(custom);
    const envelope = JSON.parse(storage.store[CUSTOM_PROFILES_KEY]);
    expect(envelope.version).toBe(CUSTOM_PROFILES_VERSION);
    expect(loadCustomProfiles()).toEqual(custom);
  });

  it('returns empty for corrupt JSON', () => {
    storage.store[CUSTOM_PROFILES_KEY] = '{not json';
    expect(loadCustomProfiles()).toEqual(emptyCustomProfiles());
  });

  it('returns empty for a newer version', () => {
    storage.store[CUSTOM_PROFILES_KEY] = JSON.stringify({ version: 99, filaments: {}, printers: {} });
    expect(loadCustomProfiles()).toEqual(emptyCustomProfiles());
  });

  it('returns empty when nothing is stored', () => {
    expect(loadCustomProfiles()).toEqual(emptyCustomProfiles());
  });
});
