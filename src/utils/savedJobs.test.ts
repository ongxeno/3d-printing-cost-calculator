import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  SAVED_JOBS_KEY,
  SAVED_JOBS_VERSION,
  addSavedJob,
  renameSavedJob,
  deleteSavedJob,
  duplicateSavedJob,
  loadSavedJobs,
  persistSavedJobs,
} from './savedJobs';
import type { SavedJob } from './savedJobs';
import { createDefaultState } from './persistence';
import { seedProfiles } from './profiles';
import type { ProfileSet } from './profiles';

const now = new Date('2026-01-02T03:04:05.000Z');

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

const makeJob = (id: string, name = 'Job'): SavedJob => ({
  id,
  name,
  savedAt: '2026-01-01T00:00:00.000Z',
  state: createDefaultState(),
});

describe('addSavedJob', () => {
  it('prepends a new job with trimmed name, generated id and ISO savedAt', () => {
    const existing = makeJob('a', 'Old');
    const result = addSavedJob([existing], '  My Job  ', createDefaultState(), now);
    expect(result).toHaveLength(2);
    expect(result[0].id).not.toBe('a');
    expect(result[0].name).toBe('My Job');
    expect(result[0].savedAt).toBe(now.toISOString());
    expect(result[1]).toEqual(existing);
  });

  it('falls back to "Untitled job" for a blank name', () => {
    const result = addSavedJob([], '   ', createDefaultState(), now);
    expect(result[0].name).toBe('Untitled job');
  });

  it('deep-clones the state (later mutation of the original is not reflected)', () => {
    const state = createDefaultState();
    const result = addSavedJob([], 'Job', state, now);
    state.laborRate = 999;
    state.jobMaterials.push({
      id: 'x',
      filamentId: 'mat_pla',
      weight_g: 10,
      role: 'Part',
      price_per_kg_thb: 1000,
      power_draw_multiplier: 1,
      hardware_wear_multiplier: 1,
      waste_g: 0,
    });
    expect(result[0].state.laborRate).toBe(150);
    expect(result[0].state.jobMaterials).toHaveLength(0);
  });

  it('does not mutate the input array', () => {
    const existing = makeJob('a');
    const input = [existing];
    addSavedJob(input, 'New', createDefaultState(), now);
    expect(input).toHaveLength(1);
    expect(input[0]).toEqual(existing);
  });
});

describe('renameSavedJob', () => {
  it('renames the matching job with a trimmed name', () => {
    const existing = makeJob('a', 'Old');
    const result = renameSavedJob([existing], 'a', '  New  ');
    expect(result[0].id).toBe('a');
    expect(result[0].name).toBe('New');
  });

  it('ignores a blank name', () => {
    const existing = makeJob('a');
    expect(renameSavedJob([existing], 'a', '   ')).toEqual([existing]);
  });

  it('leaves an unknown id unchanged', () => {
    const existing = makeJob('a');
    expect(renameSavedJob([existing], 'nope', 'New')).toEqual([existing]);
  });

  it('does not mutate the original job', () => {
    const existing = makeJob('a', 'Old');
    renameSavedJob([existing], 'a', 'New');
    expect(existing.name).toBe('Old');
  });
});

describe('deleteSavedJob', () => {
  it('removes the job with the given id', () => {
    const a = makeJob('a');
    const b = makeJob('b');
    const result = deleteSavedJob([a, b], 'a');
    expect(result).toEqual([b]);
  });

  it('returns the same contents for an unknown id', () => {
    const a = makeJob('a');
    expect(deleteSavedJob([a], 'nope')).toEqual([a]);
  });
});

describe('duplicateSavedJob', () => {
  it('inserts a copy directly after the original with a new id and (copy) name', () => {
    const a = makeJob('a', 'First');
    const b = makeJob('b', 'Second');
    const result = duplicateSavedJob([a, b], 'a', now);
    expect(result).toHaveLength(3);
    expect(result[0].id).toBe('a');
    expect(result[1].id).not.toBe('a');
    expect(result[1].name).toBe('First (copy)');
    expect(result[1].savedAt).toBe(now.toISOString());
    expect(result[2].id).toBe('b');
  });

  it('deep-clones the duplicated state', () => {
    const a = makeJob('a', 'First');
    const result = duplicateSavedJob([a], 'a', now);
    result[1].state.laborRate = 777;
    expect(a.state.laborRate).toBe(150);
  });

  it('leaves an unknown id unchanged', () => {
    const a = makeJob('a');
    expect(duplicateSavedJob([a], 'nope', now)).toEqual([a]);
  });

  it('does not mutate the input array', () => {
    const a = makeJob('a');
    const input = [a];
    duplicateSavedJob(input, 'a', now);
    expect(input).toHaveLength(1);
  });
});

describe('persistSavedJobs / loadSavedJobs', () => {
  let storage: ReturnType<typeof makeStorage>;

  beforeEach(() => {
    storage = makeStorage();
    vi.stubGlobal('localStorage', storage.api);
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('round-trips jobs through the versioned envelope', () => {
    const jobs: SavedJob[] = [
      makeJob('a', 'One'),
      { ...makeJob('b', 'Two'), state: { ...createDefaultState(), laborRate: 222 } },
    ];
    persistSavedJobs(jobs);
    const envelope = JSON.parse(storage.store[SAVED_JOBS_KEY]);
    expect(envelope.version).toBe(SAVED_JOBS_VERSION);
    expect(loadSavedJobs()).toEqual(jobs);
  });

  it('returns [] when nothing is stored', () => {
    expect(loadSavedJobs()).toEqual([]);
  });

  it('returns [] for corrupt JSON', () => {
    storage.store[SAVED_JOBS_KEY] = '{not json';
    expect(loadSavedJobs()).toEqual([]);
  });

  it('returns [] for wrong shapes', () => {
    storage.store[SAVED_JOBS_KEY] = JSON.stringify([makeJob('a')]);
    expect(loadSavedJobs()).toEqual([]);
    storage.store[SAVED_JOBS_KEY] = JSON.stringify({ version: SAVED_JOBS_VERSION });
    expect(loadSavedJobs()).toEqual([]);
    storage.store[SAVED_JOBS_KEY] = JSON.stringify({ jobs: [makeJob('a')] });
    expect(loadSavedJobs()).toEqual([]);
  });

  it('returns [] for a newer version (99)', () => {
    storage.store[SAVED_JOBS_KEY] = JSON.stringify({ version: 99, jobs: [makeJob('a')] });
    expect(loadSavedJobs()).toEqual([]);
  });

  it('keeps an item whose state.printerId is an unknown string on the default printer, preserving its numbers', () => {
    storage.store[SAVED_JOBS_KEY] = JSON.stringify({
      version: SAVED_JOBS_VERSION,
      jobs: [
        { ...makeJob('bad'), state: { ...createDefaultState(), printerId: 'nope', printerPrice: 12345 } },
        makeJob('good', 'Good'),
      ],
    });
    const result = loadSavedJobs();
    expect(result).toHaveLength(2);
    expect(result[0].id).toBe('bad');
    expect(result[0].state.printerId).toBe('bambu_x2d_combo');
    expect(result[0].state.printerPrice).toBe(12345);
    expect(result[1].id).toBe('good');
  });

  it('still drops items whose state is not an object or whose printerId is not a string', () => {
    storage.store[SAVED_JOBS_KEY] = JSON.stringify({
      version: SAVED_JOBS_VERSION,
      jobs: [
        { ...makeJob('nostate'), state: 42 },
        { ...makeJob('badtype'), state: { ...createDefaultState(), printerId: 42 } },
        makeJob('good', 'Good'),
      ],
    });
    const result = loadSavedJobs();
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('good');
  });

  it('loads a job that references a custom printer when the catalog contains it', () => {
    const catalog: ProfileSet = {
      ...seedProfiles,
      printers: {
        ...seedProfiles.printers,
        custom_p1: {
          id: 'custom_p1',
          name: 'Custom Printer 1',
          purchase_price_thb: 11111,
          estimated_lifespan_hours: 5000,
          base_power_draw_watts: 300,
          supports_multi_color: false,
          maintenance_components: [],
        },
      },
    };
    storage.store[SAVED_JOBS_KEY] = JSON.stringify({
      version: SAVED_JOBS_VERSION,
      jobs: [{ ...makeJob('a'), state: { ...createDefaultState(), printerId: 'custom_p1' } }],
    });
    const result = loadSavedJobs(catalog);
    expect(result).toHaveLength(1);
    expect(result[0].state.printerId).toBe('custom_p1');
  });

  it('loads the same job with the default catalog on the default printer, numbers intact', () => {
    storage.store[SAVED_JOBS_KEY] = JSON.stringify({
      version: SAVED_JOBS_VERSION,
      jobs: [
        {
          ...makeJob('a'),
          state: { ...createDefaultState(), printerId: 'custom_p1', printerPrice: 99999, printerLifespan: 7777 },
        },
      ],
    });
    const result = loadSavedJobs();
    expect(result).toHaveLength(1);
    expect(result[0].state.printerId).toBe('bambu_x2d_combo');
    expect(result[0].state.printerPrice).toBe(99999);
    expect(result[0].state.printerLifespan).toBe(7777);
  });

  it('sanitizes a legacy-shaped state inside a saved job (negative laborRate becomes 150)', () => {
    storage.store[SAVED_JOBS_KEY] = JSON.stringify({
      version: SAVED_JOBS_VERSION,
      jobs: [{ ...makeJob('a', 'Legacy'), state: { ...createDefaultState(), laborRate: -5 } }],
    });
    const result = loadSavedJobs();
    expect(result).toHaveLength(1);
    expect(result[0].state.laborRate).toBe(150);
  });

  it('skips items without a string id and defaults missing name/savedAt', () => {
    storage.store[SAVED_JOBS_KEY] = JSON.stringify({
      version: SAVED_JOBS_VERSION,
      jobs: [
        { name: 'No id', savedAt: now.toISOString(), state: createDefaultState() },
        { id: 'ok', state: createDefaultState() },
      ],
    });
    const result = loadSavedJobs();
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('ok');
    expect(result[0].name).toBe('Untitled job');
    expect(result[0].savedAt).toBe(new Date(0).toISOString());
  });
});
