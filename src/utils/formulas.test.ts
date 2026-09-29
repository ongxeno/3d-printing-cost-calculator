import { describe, it, expect } from 'vitest';
import {
  calculateTotalTime,
  calculateMaterialCost,
  getActiveMultipliers,
  calculateEnergyCost,
  calculateLaborCost,
  calculateBaseHardwareDepreciation,
  calculateComponentWear,
  calculateTotalComponentWear,
} from './formulas';
import type { JobMaterial } from './formulas';
import type { MaintenanceComponent } from '../data/seedData';

const mat = (overrides: Partial<JobMaterial> = {}): JobMaterial => ({
  id: 'm1',
  filamentId: 'mat_pla',
  weight_g: 100,
  role: 'Part',
  price_per_kg_thb: 450,
  power_draw_multiplier: 1,
  hardware_wear_multiplier: 1,
  ...overrides,
});

describe('calculateTotalTime', () => {
  it('converts hours and minutes to decimal hours', () => {
    expect(calculateTotalTime(2, 30)).toBeCloseTo(2.5, 6);
  });

  it('returns 0 for empty time', () => {
    expect(calculateTotalTime(0, 0)).toBeCloseTo(0, 6);
  });

  it('converts 1h15m to 1.25h', () => {
    expect(calculateTotalTime(1, 15)).toBeCloseTo(1.25, 6);
  });
});

describe('calculateMaterialCost', () => {
  it('returns 0 for no materials', () => {
    expect(calculateMaterialCost([])).toBeCloseTo(0, 6);
  });

  it('computes cost for a single material', () => {
    const items = [mat({ weight_g: 100, price_per_kg_thb: 450 })];
    expect(calculateMaterialCost(items)).toBeCloseTo(45, 6);
  });

  it('sums cost across multiple materials', () => {
    const items = [
      mat({ id: 'm1', weight_g: 100, price_per_kg_thb: 450 }),
      mat({ id: 'm2', weight_g: 50, price_per_kg_thb: 1600 }),
    ];
    expect(calculateMaterialCost(items)).toBeCloseTo(125, 6);
  });

  it('returns 0 for zero weight', () => {
    const items = [mat({ weight_g: 0 })];
    expect(calculateMaterialCost(items)).toBeCloseTo(0, 6);
  });
});

describe('getActiveMultipliers', () => {
  it('defaults to 1/1 with no materials', () => {
    expect(getActiveMultipliers([])).toEqual({ power: 1, wear: 1 });
  });

  it('takes the max multiplier across materials', () => {
    const items = [
      mat({ id: 'm1', power_draw_multiplier: 1.0, hardware_wear_multiplier: 1.0 }),
      mat({ id: 'm2', power_draw_multiplier: 1.2, hardware_wear_multiplier: 5.0 }),
    ];
    expect(getActiveMultipliers(items)).toEqual({ power: 1.2, wear: 5 });
  });

  it('floors multipliers at 1', () => {
    const items = [mat({ power_draw_multiplier: 0.85, hardware_wear_multiplier: 1.0 })];
    expect(getActiveMultipliers(items)).toEqual({ power: 1, wear: 1 });
  });
});

describe('calculateEnergyCost', () => {
  it('computes energy cost from wattage, multiplier, time and rate', () => {
    expect(calculateEnergyCost(250, 1.36, 2, 5)).toBeCloseTo(3.4, 6);
  });

  it('returns 0 for zero wattage', () => {
    expect(calculateEnergyCost(0, 1, 5, 5)).toBeCloseTo(0, 6);
  });
});

describe('calculateLaborCost', () => {
  it('computes labor cost from total minutes and rate', () => {
    expect(calculateLaborCost(5, 5, 5, 150)).toBeCloseTo(37.5, 6);
  });
});

describe('calculateBaseHardwareDepreciation', () => {
  it('prorates printer price over lifespan', () => {
    expect(calculateBaseHardwareDepreciation(97900, 10000, 2)).toBeCloseTo(19.58, 6);
  });

  it('returns 0 for zero lifespan', () => {
    expect(calculateBaseHardwareDepreciation(97900, 0, 2)).toBeCloseTo(0, 6);
  });

  it('returns 0 for negative lifespan', () => {
    expect(calculateBaseHardwareDepreciation(97900, -5, 2)).toBeCloseTo(0, 6);
  });
});

describe('calculateComponentWear', () => {
  const part: MaintenanceComponent = {
    id: 'p',
    name: 'x',
    replacement_cost_thb: 600,
    replacement_lifespan_hours: 300,
    periodic_maintenance_cost_thb: 100,
    periodic_maintenance_interval_hours: 50,
  };

  it('computes replacement plus periodic cost scaled by time and multiplier', () => {
    expect(calculateComponentWear(part, 3, 1)).toBeCloseTo(12, 6);
  });

  it('scales by the active wear multiplier', () => {
    expect(calculateComponentWear(part, 3, 5)).toBeCloseTo(60, 6);
  });

  it('returns 0 when both intervals are zero', () => {
    const zeroPart = { ...part, replacement_cost_thb: 0, replacement_lifespan_hours: 0, periodic_maintenance_cost_thb: 0, periodic_maintenance_interval_hours: 0 };
    expect(calculateComponentWear(zeroPart, 3, 1)).toBeCloseTo(0, 6);
  });

  it('computes periodic-only parts', () => {
    const periodicPart = { ...part, replacement_cost_thb: 0, replacement_lifespan_hours: 0 };
    expect(calculateComponentWear(periodicPart, 3, 1)).toBeCloseTo(6, 6);
  });
});

describe('calculateTotalComponentWear', () => {
  it('returns 0 for no parts', () => {
    expect(calculateTotalComponentWear([], 3, 1)).toBeCloseTo(0, 6);
  });

  it('sums the wear of each part', () => {
    const partA: MaintenanceComponent = {
      id: 'a',
      name: 'a',
      replacement_cost_thb: 600,
      replacement_lifespan_hours: 300,
      periodic_maintenance_cost_thb: 100,
      periodic_maintenance_interval_hours: 50,
    };
    const partB: MaintenanceComponent = {
      id: 'b',
      name: 'b',
      replacement_cost_thb: 400,
      replacement_lifespan_hours: 200,
      periodic_maintenance_cost_thb: 50,
      periodic_maintenance_interval_hours: 25,
    };
    const expected = calculateComponentWear(partA, 3, 2) + calculateComponentWear(partB, 3, 2);
    expect(calculateTotalComponentWear([partA, partB], 3, 2)).toBeCloseTo(expected, 6);
  });
});
