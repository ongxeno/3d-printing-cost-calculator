export const clampValue = (value: number, min?: number, max?: number): number => {
  let v = value;
  if (min !== undefined && v < min) v = min;
  if (max !== undefined && v > max) v = max;
  return v;
};
