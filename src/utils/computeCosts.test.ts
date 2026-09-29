import { describe, it, expect } from 'vitest';
import { computeCosts } from './formulas';
import type { CalculatorState, JobMaterial } from './formulas';
import { createDefaultState } from './persistence';

const mat = (overrides: Partial<JobMaterial> = {}): JobMaterial => ({
  id: 'm1',
  filamentId: 'mat_pla',
  weight_g: 100,
  role: 'Part',
  price_per_kg_thb: 450,
  power_draw_multiplier: 1,
  hardware_wear_multiplier: 1,
  waste_g: 0,
  ...overrides,
});

// State with every cost except material zeroed out, so expectations are hand-checkable.
const bareState = (overrides: Partial<CalculatorState> = {}): CalculatorState => ({
  ...createDefaultState(),
  printerPrice: 0,
  maintenanceParts: [],
  basePowerDraw: 0,
  prepTime: 0,
  setupTime: 0,
  postTime: 0,
  failureRate: 0,
  ...overrides,
});

describe('computeCosts', () => {
  it('prices a single material with no other costs', () => {
    const result = computeCosts(bareState({ jobMaterials: [mat()] }));
    expect(result.materialCost).toBeCloseTo(45, 6);
    expect(result.baseCost).toBeCloseTo(45, 6);
    expect(result.failureBufferCost).toBeCloseTo(0, 6);
    expect(result.grandTotal).toBeCloseTo(45, 6);
  });

  it('includes purge waste in the material cost and exposes it separately', () => {
    const result = computeCosts(bareState({ jobMaterials: [mat({ weight_g: 100, waste_g: 20, price_per_kg_thb: 450 })] }));
    expect(result.materialCost).toBeCloseTo(54, 6);
    expect(result.wasteCost).toBeCloseTo(9, 6);
    expect(result.grandTotal).toBeCloseTo(54, 6);
  });

  it('applies the failure buffer on top of the base cost', () => {
    const result = computeCosts(bareState({ failureRate: 10, jobMaterials: [mat()] }));
    expect(result.failureBufferCost).toBeCloseTo(4.5, 6);
    expect(result.grandTotal).toBeCloseTo(49.5, 6);
  });

  it('applies the markup on top of the grand total', () => {
    const result = computeCosts(bareState({ markupPercent: 30, jobMaterials: [mat()] }));
    expect(result.grandTotal).toBeCloseTo(45, 6);
    expect(result.sellingPrice).toBeCloseTo(58.5, 6);
    expect(result.profit).toBeCloseTo(13.5, 6);
  });

  it('returns zero profit at zero markup', () => {
    const result = computeCosts(bareState({ markupPercent: 0, jobMaterials: [mat()] }));
    expect(result.sellingPrice).toBeCloseTo(result.grandTotal, 6);
    expect(result.profit).toBeCloseTo(0, 6);
  });

  it('groups material cost by role', () => {
    const result = computeCosts(bareState({
      jobMaterials: [
        mat({ id: 'a', role: 'Part', weight_g: 100 }),
        mat({ id: 'b', role: 'Support Base', weight_g: 20, price_per_kg_thb: 1000 }),
        mat({ id: 'c', role: 'Part', weight_g: 50 }),
      ],
    }));
    expect(result.materialsByRole['Part']).toBeCloseTo(67.5, 6);
    expect(result.materialsByRole['Support Base']).toBeCloseTo(20, 6);
  });

  it('sums every cost component for a full job', () => {
    const state = bareState({
      printTimeHours: 2,
      printTimeMins: 0,
      basePowerDraw: 250,
      elecRate: 5,
      printerPrice: 100000,
      printerLifespan: 10000,
      prepTime: 5,
      setupTime: 5,
      postTime: 5,
      laborRate: 150,
      failureRate: 10,
      jobMaterials: [mat({ power_draw_multiplier: 1.36 })],
      maintenanceParts: [{
        id: 'p', name: 'Nozzle',
        replacement_cost_thb: 600, replacement_lifespan_hours: 300,
        periodic_maintenance_cost_thb: 100, periodic_maintenance_interval_hours: 50,
      }],
    });
    const result = computeCosts(state);
    // material 45 + energy 3.4 + labor 37.5 + depreciation 20 + wear (2+2)*2 = 8
    expect(result.energyCost).toBeCloseTo(3.4, 6);
    expect(result.baseHardwareDepreciation).toBeCloseTo(20, 6);
    expect(result.totalComponentWear).toBeCloseTo(8, 6);
    expect(result.baseCost).toBeCloseTo(113.9, 6);
    expect(result.grandTotal).toBeCloseTo(125.29, 6);
    expect(result.componentWearDetails).toEqual([{ name: 'Nozzle', cost: expect.closeTo(8, 6) }]);
    expect(result.effectiveDrawWatts).toBeCloseTo(340, 6);
  });
});
