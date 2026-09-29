import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  STORAGE_KEY,
  SCHEMA_VERSION,
  createDefaultState,
  sanitizeState,
  sanitizeStateOrFallbackPrinter,
  loadState,
  saveState,
  clearState,
} from './persistence';
import { seedProfiles } from './profiles';

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

describe('sanitizeState', () => {
  it('rejects non-objects and unknown printers', () => {
    expect(sanitizeState(null)).toBeNull();
    expect(sanitizeState([])).toBeNull();
    expect(sanitizeState('x')).toBeNull();
    expect(sanitizeState({ ...createDefaultState(), printerId: 'nope' })).toBeNull();
  });

  it('keeps valid values', () => {
    const state = { ...createDefaultState(), laborRate: 222 };
    expect(sanitizeState(state)?.laborRate).toBe(222);
  });

  it('repairs invalid numbers, non-array collections and junk entries', () => {
    const result = sanitizeState({
      ...createDefaultState(),
      elecRate: -3,
      laborRate: 'x',
      printTimeHours: null,
      jobMaterials: 'zzz',
      maintenanceParts: [1, null, { name: 5 }],
    });
    expect(result?.elecRate).toBe(5);
    expect(result?.laborRate).toBe(150);
    expect(result?.printTimeHours).toBe(0);
    expect(result?.jobMaterials).toEqual([]);
    expect(result?.maintenanceParts).toHaveLength(1);
    expect(result?.maintenanceParts[0].name).toBe('Component');
  });

  it('handles a legacy state missing markupPercent', () => {
    const { markupPercent: _markup, ...legacy } = createDefaultState();
    expect(sanitizeState(legacy)?.markupPercent).toBe(30);
  });

  it('preserves a valid saved markupPercent and rejects negatives', () => {
    expect(sanitizeState({ ...createDefaultState(), markupPercent: 45 })?.markupPercent).toBe(45);
    expect(sanitizeState({ ...createDefaultState(), markupPercent: -5 })?.markupPercent).toBe(30);
  });

  it('fills missing material multipliers from the filament preset', () => {
    const result = sanitizeState({
      ...createDefaultState(),
      jobMaterials: [{ id: 'x', filamentId: 'mat_pa_cf', weight_g: 10, role: 'Part' }],
    });
    expect(result?.jobMaterials[0].price_per_kg_thb).toBe(1600);
    expect(result?.jobMaterials[0].hardware_wear_multiplier).toBe(5);
  });

  it('defaults legacy materials without waste_g to 0', () => {
    const result = sanitizeState({
      ...createDefaultState(),
      jobMaterials: [{ id: 'x', filamentId: 'mat_pla', weight_g: 10, role: 'Part' }],
    });
    expect(result?.jobMaterials[0].waste_g).toBe(0);
  });

  it('keeps a valid material waste_g', () => {
    const result = sanitizeState({
      ...createDefaultState(),
      jobMaterials: [{ id: 'x', filamentId: 'mat_pla', weight_g: 10, role: 'Part', waste_g: 7 }],
    });
    expect(result?.jobMaterials[0].waste_g).toBe(7);
  });

  it('defaults quantity for legacy states and invalid values', () => {
    const { quantity: _quantity, ...legacy } = createDefaultState();
    expect(sanitizeState(legacy)?.quantity).toBe(1);
    expect(sanitizeState({ ...createDefaultState(), quantity: 6.9 })?.quantity).toBe(6);
    expect(sanitizeState({ ...createDefaultState(), quantity: 0 })?.quantity).toBe(1);
    expect(sanitizeState({ ...createDefaultState(), quantity: -2 })?.quantity).toBe(1);
    expect(sanitizeState({ ...createDefaultState(), quantity: 'x' as unknown })?.quantity).toBe(1);
  });

  it('falls back to 0 for a negative material waste_g', () => {
    const result = sanitizeState({
      ...createDefaultState(),
      jobMaterials: [{ id: 'x', filamentId: 'mat_pla', weight_g: 10, role: 'Part', waste_g: -3 }],
    });
    expect(result?.jobMaterials[0].waste_g).toBe(0);
  });

  it('accepts a custom printer id when the catalog contains it, rejects it otherwise', () => {
    const customPrinter = {
      id: 'custom_p1',
      name: 'Custom Printer',
      purchase_price_thb: 1,
      estimated_lifespan_hours: 1,
      base_power_draw_watts: 1,
      supports_multi_color: false,
      maintenance_components: [],
    };
    const catalog = {
      filaments: { ...seedProfiles.filaments },
      printers: { ...seedProfiles.printers, custom_p1: customPrinter },
    };
    const accepted = sanitizeState({ ...createDefaultState(catalog), printerId: 'custom_p1', printerPrice: 7, printerLifespan: 8, basePowerDraw: 9 }, catalog);
    expect(accepted?.printerId).toBe('custom_p1');
    expect(accepted?.printerPrice).toBe(7);
    expect(sanitizeState({ ...createDefaultState(), printerId: 'custom_p1' })).toBeNull();
  });

  it('createDefaultState(catalog) still picks bambu_x2d_combo', () => {
    const catalog = {
      filaments: { ...seedProfiles.filaments },
      printers: { ...seedProfiles.printers, custom_p1: { id: 'custom_p1', name: 'C', purchase_price_thb: 1, estimated_lifespan_hours: 1, base_power_draw_watts: 1, supports_multi_color: false, maintenance_components: [] } },
    };
    expect(createDefaultState(catalog).printerId).toBe('bambu_x2d_combo');
  });
});

describe('load/save/clear', () => {
  let storage: ReturnType<typeof makeStorage>;

  beforeEach(() => {
    storage = makeStorage();
    vi.stubGlobal('localStorage', storage.api);
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('returns defaults when nothing is stored', () => {
    expect(loadState()).toEqual(createDefaultState());
  });

  it('returns defaults for corrupt JSON', () => {
    storage.store[STORAGE_KEY] = '{not json';
    expect(loadState()).toEqual(createDefaultState());
  });

  it('loads the legacy bare-state format', () => {
    storage.store[STORAGE_KEY] = JSON.stringify({ ...createDefaultState(), laborRate: 222 });
    expect(loadState().laborRate).toBe(222);
  });

  it('round-trips through the versioned envelope', () => {
    saveState({ ...createDefaultState(), laborRate: 99 });
    expect(JSON.parse(storage.store[STORAGE_KEY]).schemaVersion).toBe(SCHEMA_VERSION);
    expect(loadState().laborRate).toBe(99);
  });

  it('ignores a newer schema version', () => {
    storage.store[STORAGE_KEY] = JSON.stringify({ schemaVersion: SCHEMA_VERSION + 1, state: { ...createDefaultState(), laborRate: 1 } });
    expect(loadState().laborRate).toBe(150);
  });

  it('clearState removes the entry', () => {
    saveState(createDefaultState());
    clearState();
    expect(STORAGE_KEY in storage.store).toBe(false);
  });
});

describe('sanitizeStateOrFallbackPrinter', () => {
  it('returns the same result as sanitizeState for a known printer', () => {
    const state = { ...createDefaultState(), laborRate: 222 };
    expect(sanitizeStateOrFallbackPrinter(state)).toEqual(sanitizeState(state));
  });

  it('falls back to the default printer for an unknown printer id, keeping the job numbers', () => {
    const result = sanitizeStateOrFallbackPrinter({
      ...createDefaultState(),
      printerId: 'custom_gone',
      printerPrice: 12345,
      laborRate: 222,
      quantity: 3,
    });
    expect(result?.printerId).toBe('bambu_x2d_combo');
    expect(result?.printerPrice).toBe(12345);
    expect(result?.laborRate).toBe(222);
    expect(result?.quantity).toBe(3);
  });

  it('still rejects non-objects and non-string printer ids', () => {
    expect(sanitizeStateOrFallbackPrinter(null)).toBeNull();
    expect(sanitizeStateOrFallbackPrinter(42)).toBeNull();
    expect(sanitizeStateOrFallbackPrinter({ ...createDefaultState(), printerId: 42 })).toBeNull();
  });
});
