import type { CalculatorState } from './formulas';
import { generateId } from './id';
import { sanitizeState } from './persistence';

export interface SavedJob {
  id: string;
  name: string;
  savedAt: string; // ISO string
  state: CalculatorState;
}

export const SAVED_JOBS_KEY = '3dprint_saved_jobs';
export const SAVED_JOBS_VERSION = 1;

export const addSavedJob = (
  jobs: SavedJob[],
  name: string,
  state: CalculatorState,
  now: Date = new Date()
): SavedJob[] => {
  const job: SavedJob = {
    id: generateId(),
    name: name.trim() || 'Untitled job',
    savedAt: now.toISOString(),
    state: structuredClone(state),
  };
  return [job, ...jobs];
};

export const renameSavedJob = (jobs: SavedJob[], id: string, name: string): SavedJob[] => {
  const trimmed = name.trim();
  if (!trimmed) return jobs;
  return jobs.map(job => (job.id === id ? { ...job, name: trimmed } : job));
};

export const deleteSavedJob = (jobs: SavedJob[], id: string): SavedJob[] =>
  jobs.filter(job => job.id !== id);

export const duplicateSavedJob = (
  jobs: SavedJob[],
  id: string,
  now: Date = new Date()
): SavedJob[] => {
  const index = jobs.findIndex(job => job.id === id);
  if (index === -1) return jobs;
  const orig = jobs[index];
  const copy: SavedJob = {
    id: generateId(),
    name: `${orig.name} (copy)`,
    savedAt: now.toISOString(),
    state: structuredClone(orig.state),
  };
  return [...jobs.slice(0, index + 1), copy, ...jobs.slice(index + 1)];
};

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

export const persistSavedJobs = (jobs: SavedJob[]): void => {
  try {
    localStorage.setItem(SAVED_JOBS_KEY, JSON.stringify({ version: SAVED_JOBS_VERSION, jobs }));
  } catch (e) {
    console.error('Failed to save saved jobs', e);
  }
};

export const loadSavedJobs = (): SavedJob[] => {
  try {
    const saved = localStorage.getItem(SAVED_JOBS_KEY);
    if (saved === null) return [];
    const parsed: unknown = JSON.parse(saved);
    if (!isPlainObject(parsed)) return [];
    if (typeof parsed.version !== 'number' || parsed.version > SAVED_JOBS_VERSION) return [];
    if (!Array.isArray(parsed.jobs)) return [];
    const jobs: SavedJob[] = [];
    for (const item of parsed.jobs) {
      if (!isPlainObject(item)) continue;
      if (typeof item.id !== 'string') continue;
      const name = typeof item.name === 'string' ? item.name : 'Untitled job';
      const savedAt = typeof item.savedAt === 'string' ? item.savedAt : new Date(0).toISOString();
      const state = sanitizeState(item.state);
      if (state === null) continue;
      jobs.push({ id: item.id, name, savedAt, state });
    }
    return jobs;
  } catch (e) {
    console.error('Failed to load saved jobs', e);
    return [];
  }
};
