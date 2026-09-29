import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  STORAGE_KEY,
  SCHEMA_VERSION,
  createDefaultState,
  sanitizeState,
  loadState,
  saveState,
  clearState,
} from './persistence';

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

  it('fills missing material multipliers from the filament preset', () => {
    const result = sanitizeState({
      ...createDefaultState(),
      jobMaterials: [{ id: 'x', filamentId: 'mat_pa_cf', weight_g: 10, role: 'Part' }],
    });
    expect(result?.jobMaterials[0].price_per_kg_thb).toBe(1600);
    expect(result?.jobMaterials[0].hardware_wear_multiplier).toBe(5);
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
