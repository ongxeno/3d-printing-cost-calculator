import { describe, it, expect } from 'vitest';
import { computeCosts } from './formulas';
import type { CalculatorState } from './formulas';
import { createDefaultState } from './persistence';
import { formatMoney, toPlainText, toCsv } from './exportQuote';

const state: CalculatorState = {
  ...createDefaultState(),
  printerId: 'bambu_x2d_combo',
  printTimeHours: 2,
  printTimeMins: 30,
  printerPrice: 0,
  maintenanceParts: [],
  basePowerDraw: 0,
  prepTime: 0,
  setupTime: 0,
  postTime: 0,
  failureRate: 0,
  markupPercent: 30,
  jobMaterials: [{
    id: 'a',
    filamentId: 'mat_pla',
    weight_g: 100,
    waste_g: 10,
    role: 'Part',
    price_per_kg_thb: 450,
    power_draw_multiplier: 1,
    hardware_wear_multiplier: 1,
  }],
};
const costs = computeCosts(state);
const printerName = 'Bambu Lab X2D Combo';

describe('formatMoney', () => {
  it('formats with two decimals', () => {
    expect(formatMoney(0)).toBe('0.00');
    expect(formatMoney(64.35)).toBe('64.35');
  });
});

describe('toPlainText', () => {
  it('renders the full quote', () => {
    const expected = [
      'TrueCost Quote',
      'Printer: Bambu Lab X2D Combo',
      'Print time: 2h 30m',
      '',
      'Materials',
      '- Part: PLA (Standard) 100 g (+10 g waste)',
      '',
      'Cost breakdown (THB)',
      'Material: 49.50',
      'Energy: 0.00',
      'Labor: 0.00',
      'Hardware depreciation: 0.00',
      'Maintenance wear: 0.00',
      'Base cost: 49.50',
      'Failure risk buffer: 0.00',
      'Total cost: 49.50',
      'Markup (30%): 14.85',
      'Suggested price: 64.35',
    ].join('\n');
    expect(toPlainText(state, costs, printerName)).toBe(expected);
  });

  it('omits the waste suffix when waste is zero', () => {
    const noWaste: CalculatorState = {
      ...state,
      jobMaterials: [{ ...state.jobMaterials[0], waste_g: 0 }],
    };
    const text = toPlainText(noWaste, computeCosts(noWaste), printerName);
    expect(text).toContain('- Part: PLA (Standard) 100 g\n');
    expect(text).not.toContain('g waste');
  });

  it('prints a single "- (none)" line when there are no materials', () => {
    const empty: CalculatorState = { ...state, jobMaterials: [] };
    const lines = toPlainText(empty, computeCosts(empty), printerName).split('\n');
    expect(lines[lines.indexOf('Materials') + 1]).toBe('- (none)');
  });

  it('falls back to the raw filament id for unknown filaments', () => {
    const unknown: CalculatorState = {
      ...state,
      jobMaterials: [{ ...state.jobMaterials[0], filamentId: 'mat_unknown' }],
    };
    const text = toPlainText(unknown, computeCosts(unknown), printerName);
    expect(text).toContain('- Part: mat_unknown 100 g (+10 g waste)');
  });

  it('resolves custom filament names from a passed catalog', () => {
    const customState: CalculatorState = {
      ...state,
      jobMaterials: [{ ...state.jobMaterials[0], filamentId: 'custom_gold' }],
    };
    const filaments = {
      custom_gold: { id: 'custom_gold', name: 'Silk Gold', price_per_kg_thb: 888, power_draw_multiplier: 1, hardware_wear_multiplier: 1 },
    };
    const text = toPlainText(customState, computeCosts(customState), printerName, filaments);
    expect(text).toContain('- Part: Silk Gold 100 g (+10 g waste)');
  });

  it('labels a removed custom filament instead of printing its raw id', () => {
    const removed: CalculatorState = {
      ...state,
      jobMaterials: [{ ...state.jobMaterials[0], filamentId: 'custom_deleted' }],
    };
    const text = toPlainText(removed, computeCosts(removed), printerName);
    expect(text).toContain('- Part: Custom filament (removed) 100 g (+10 g waste)');
  });

  it('adds quantity and per-unit lines when quantity is 4', () => {
    const qtyState: CalculatorState = { ...state, quantity: 4, postTime: 5 };
    const qtyCosts = computeCosts(qtyState);
    const text = toPlainText(qtyState, qtyCosts, printerName);
    const lines = text.split('\n');
    expect(lines[lines.indexOf('Print time: 2h 30m') + 1]).toBe('Quantity: 4');
    expect(lines[lines.length - 1]).toBe(`Price per unit: ${formatMoney(qtyCosts.unitSellingPrice)}`);
    expect(lines[lines.length - 2]).toBe(`Cost per unit: ${formatMoney(qtyCosts.unitCost)}`);
  });
});

describe('toCsv', () => {
  it('renders the full csv', () => {
    const expected = [
      'Section,Item,Amount (THB)',
      'Material by role,Part,49.50',
      'Cost,Material,49.50',
      'Cost,Energy,0.00',
      'Cost,Labor,0.00',
      'Cost,Hardware depreciation,0.00',
      'Cost,Maintenance wear,0.00',
      'Cost,Base cost,49.50',
      'Cost,Failure risk buffer,0.00',
      'Cost,Total cost,49.50',
      'Price,Suggested price,64.35',
      'Price,Profit,14.85',
    ].join('\n');
    expect(toCsv(state, costs)).toBe(expected);
  });

  it('appends per-unit rows when quantity is 4', () => {
    const qtyState: CalculatorState = { ...state, quantity: 4, postTime: 5 };
    const qtyCosts = computeCosts(qtyState);
    const lines = toCsv(qtyState, qtyCosts).split('\n');
    expect(lines[lines.length - 1]).toBe(`Per unit,Price per unit,${formatMoney(qtyCosts.unitSellingPrice)}`);
    expect(lines[lines.length - 2]).toBe(`Per unit,Cost per unit,${formatMoney(qtyCosts.unitCost)}`);
  });

  it('escapes names containing commas or quotes', () => {
    const wearState: CalculatorState = {
      ...state,
      maintenanceParts: [{
        id: 'nozzle',
        name: 'Nozzle, hardened "0.4"',
        replacement_cost_thb: 100,
        replacement_lifespan_hours: 100,
        periodic_maintenance_cost_thb: 0,
        periodic_maintenance_interval_hours: 0,
      }],
    };
    const lines = toCsv(wearState, computeCosts(wearState)).split('\n');
    const wearLine = lines.find(line => line.startsWith('Wear detail,'));
    expect(wearLine).toBeDefined();
    expect(wearLine).toBe('Wear detail,"Nozzle, hardened ""0.4""",2.50');
  });
});
