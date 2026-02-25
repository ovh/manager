/**
 * Clamps a value between a minimum and maximum value.
 * If the value is not a valid number, returns the minimum value.
 *
 * @param value - The value to clamp
 * @param min - The minimum allowed value
 * @param max - The maximum allowed value
 * @returns The clamped value
 */
export const clamp = (value: number | undefined, min: number, max: number): number => {
  if (typeof value !== 'number' || Number.isNaN(value)) return min;
  return Math.min(Math.max(value, min), max);
};
