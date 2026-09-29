import type { CalculatorState, CostBreakdown } from './formulas';
import { filamentPresets } from '../data/seedData';
import type { FilamentPreset } from '../data/seedData';
import { isCustomId } from './profiles';

export const formatMoney = (value: number): string => value.toFixed(2);

export const toPlainText = (
  state: CalculatorState,
  costs: CostBreakdown,
  printerName: string,
  filaments: Record<string, FilamentPreset> = filamentPresets
): string => {
  const lines: string[] = [
    'TrueCost Quote',
    `Printer: ${printerName}`,
    `Print time: ${state.printTimeHours}h ${state.printTimeMins}m`,
  ];
  if (costs.quantity > 1) {
    lines.push(`Quantity: ${costs.quantity}`);
  }
  lines.push('', 'Materials');
  if (state.jobMaterials.length === 0) {
    lines.push('- (none)');
  } else {
    state.jobMaterials.forEach(mat => {
      const filamentName = filaments[mat.filamentId]?.name
        ?? (isCustomId(mat.filamentId) ? 'Custom filament (removed)' : mat.filamentId);
      const wasteSuffix = mat.waste_g > 0 ? ` (+${mat.waste_g} g waste)` : '';
      lines.push(`- ${mat.role}: ${filamentName} ${mat.weight_g} g${wasteSuffix}`);
    });
  }
  lines.push(
    '',
    'Cost breakdown (THB)',
    `Material: ${formatMoney(costs.materialCost)}`,
    `Energy: ${formatMoney(costs.energyCost)}`,
    `Labor: ${formatMoney(costs.laborCost)}`,
    `Hardware depreciation: ${formatMoney(costs.baseHardwareDepreciation)}`,
    `Maintenance wear: ${formatMoney(costs.totalComponentWear)}`,
    `Base cost: ${formatMoney(costs.baseCost)}`,
    `Failure risk buffer: ${formatMoney(costs.failureBufferCost)}`,
    `Total cost: ${formatMoney(costs.grandTotal)}`,
    `Markup (${state.markupPercent}%): ${formatMoney(costs.profit)}`,
    `Suggested price: ${formatMoney(costs.sellingPrice)}`,
  );
  if (costs.quantity > 1) {
    lines.push(
      `Cost per unit: ${formatMoney(costs.unitCost)}`,
      `Price per unit: ${formatMoney(costs.unitSellingPrice)}`,
    );
  }
  return lines.join('\n');
};

const csvEscape = (value: string): string => {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
};

export const toCsv = (_state: CalculatorState, costs: CostBreakdown): string => {
  const rows: string[] = ['Section,Item,Amount (THB)'];
  Object.entries(costs.materialsByRole).forEach(([role, cost]) => {
    rows.push(`Material by role,${csvEscape(role)},${formatMoney(cost)}`);
  });
  costs.componentWearDetails.forEach(detail => {
    rows.push(`Wear detail,${csvEscape(detail.name)},${formatMoney(detail.cost)}`);
  });
  rows.push(`Cost,Material,${formatMoney(costs.materialCost)}`);
  rows.push(`Cost,Energy,${formatMoney(costs.energyCost)}`);
  rows.push(`Cost,Labor,${formatMoney(costs.laborCost)}`);
  rows.push(`Cost,Hardware depreciation,${formatMoney(costs.baseHardwareDepreciation)}`);
  rows.push(`Cost,Maintenance wear,${formatMoney(costs.totalComponentWear)}`);
  rows.push(`Cost,Base cost,${formatMoney(costs.baseCost)}`);
  rows.push(`Cost,Failure risk buffer,${formatMoney(costs.failureBufferCost)}`);
  rows.push(`Cost,Total cost,${formatMoney(costs.grandTotal)}`);
  rows.push(`Price,Suggested price,${formatMoney(costs.sellingPrice)}`);
  rows.push(`Price,Profit,${formatMoney(costs.profit)}`);
  if (costs.quantity > 1) {
    rows.push(`Per unit,Cost per unit,${formatMoney(costs.unitCost)}`);
    rows.push(`Per unit,Price per unit,${formatMoney(costs.unitSellingPrice)}`);
  }
  return rows.join('\n');
};

export const downloadTextFile = (filename: string, content: string, mime: string): void => {
  const blob = new Blob(['\uFEFF' + content], { type: mime });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
