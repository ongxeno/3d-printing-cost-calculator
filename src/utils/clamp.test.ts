import { describe, it, expect } from 'vitest';
import { clampValue } from './clamp';

describe('clampValue', () => {
  it('clamps below min to min', () => {
    expect(clampValue(-5, 0)).toBe(0);
  });

  it('clamps above max to max', () => {
    expect(clampValue(150, 0, 100)).toBe(100);
  });

  it('returns values within range unchanged', () => {
    expect(clampValue(5, 0, 100)).toBe(5);
  });

  it('returns value unchanged when no bounds', () => {
    expect(clampValue(5)).toBe(5);
  });

  it('returns min when value equals min', () => {
    expect(clampValue(0, 0)).toBe(0);
  });
});
