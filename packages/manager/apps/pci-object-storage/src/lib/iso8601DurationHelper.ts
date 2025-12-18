/**
 * ISO 8601 duration units
 */
export type DurationUnit = 'D' | 'M' | 'Y';

/**
 * Duration object with value and unit
 */
export interface Duration {
  value: number;
  unit: DurationUnit;
}

/**
 * Converts an ISO 8601 duration string to a value and unit object
 * Supports Days (D), Months (M), and Years (Y)
 * @param period - ISO 8601 duration string (e.g., 'P1Y', 'P30D', 'P6M')
 * @param defaultValue - Default duration to return if parsing fails (defaults to { value: 1, unit: 'Y' })
 * @returns Object with value and unit
 * @example
 * fromISO8601('P1Y') // { value: 1, unit: 'Y' }
 * fromISO8601('P30D') // { value: 30, unit: 'D' }
 * fromISO8601('invalid') // { value: 1, unit: 'Y' }
 */
export const fromISO8601 = (
  period?: string,
  defaultValue: Duration = { value: 1, unit: 'Y' },
): Duration => {
  if (!period) return defaultValue;
  const match = period.match(/^P(\d+)([DMY])$/);
  if (!match) return defaultValue;

  const unit = match[2] as DurationUnit;
  return { value: parseInt(match[1], 10), unit };
};

/**
 * Converts a value and unit to an ISO 8601 duration string
 * @param value - Numeric duration value (must be positive)
 * @param unit - Duration unit ('D' for days, 'M' for months, 'Y' for years)
 * @returns ISO 8601 duration string (e.g., 'P1Y', 'P30D', 'P6M')
 * @throws {Error} If value is not a positive number
 * @example
 * toISO8601(1, 'Y') // 'P1Y'
 * toISO8601(30, 'D') // 'P30D'
 */
export const toISO8601 = (value: number, unit: DurationUnit): string => {
  if (value <= 0 || !Number.isInteger(value)) {
    throw new Error('Duration value must be a positive integer');
  }
  return `P${value}${unit}`;
};

/**
 * Validates if a string is a valid ISO 8601 duration
 * @param period - String to validate
 * @returns True if valid ISO 8601 duration format
 * @example
 * isValidISO8601('P1Y') // true
 * isValidISO8601('P30D') // true
 * isValidISO8601('invalid') // false
 */
export const isValidISO8601 = (period: string): boolean => {
  return /^P(\d+)([DMY])$/.test(period);
};

/**
 * Converts duration from one unit to another (approximate conversion)
 * @param duration - Duration to convert
 * @param targetUnit - Target unit to convert to
 * @returns Converted duration in target unit
 * @example
 * convertDuration({ value: 1, unit: 'Y' }, 'D') // { value: 365, unit: 'D' }
 * convertDuration({ value: 30, unit: 'D' }, 'M') // { value: 1, unit: 'M' }
 */
export const convertDuration = (
  duration: Duration,
  targetUnit: DurationUnit,
): Duration => {
  if (duration.unit === targetUnit) return duration;

  // Conversion factors (approximate)
  const daysPerMonth = 30;
  const daysPerYear = 365;

  let days: number;

  // Convert to days first
  switch (duration.unit) {
    case 'D':
      days = duration.value;
      break;
    case 'M':
      days = duration.value * daysPerMonth;
      break;
    case 'Y':
      days = duration.value * daysPerYear;
      break;
    default:
      days = duration.value;
  }

  // Convert from days to target unit
  switch (targetUnit) {
    case 'D':
      return { value: days, unit: 'D' };
    case 'M':
      return { value: Math.round(days / daysPerMonth), unit: 'M' };
    case 'Y':
      return { value: Math.round(days / daysPerYear), unit: 'Y' };
    default:
      return { value: days, unit: 'D' };
  }
};
