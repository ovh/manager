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
 * ISO 8601 date-part duration (years, months, weeks, days), e.g. 'P1Y', 'P2W', 'P1Y6M'
 */
const ISO8601_DURATION_REGEX =
  /^P(?=\d)(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)W)?(?:(\d+)D)?$/;

const DAYS_PER_WEEK = 7;
const DAYS_PER_MONTH = 30;
const DAYS_PER_YEAR = 365;

/**
 * Converts an ISO 8601 duration string to a value and unit object
 * The API may return any ISO 8601 duration (e.g. 'P2W' for 14 days), while the
 * object lock form only handles years and days: a duration made only of years
 * stays in years, anything else is converted to days.
 * @param period - ISO 8601 duration string (e.g., 'P1Y', 'P30D', 'P2W')
 * @param defaultValue - Default duration to return if parsing fails (defaults to { value: 1, unit: 'Y' })
 * @returns Object with value and unit
 * @example
 * fromISO8601('P1Y') // { value: 1, unit: 'Y' }
 * fromISO8601('P30D') // { value: 30, unit: 'D' }
 * fromISO8601('P2W') // { value: 14, unit: 'D' }
 * fromISO8601('invalid') // { value: 1, unit: 'Y' }
 */
export const fromISO8601 = (
  period?: string,
  defaultValue: Duration = { value: 1, unit: 'Y' },
): Duration => {
  const match = period?.match(ISO8601_DURATION_REGEX);
  if (!match) return defaultValue;

  const [years, months, weeks, days] = match
    .slice(1)
    .map((part) => (part ? parseInt(part, 10) : 0));

  if (years > 0 && months === 0 && weeks === 0 && days === 0) {
    return { value: years, unit: 'Y' };
  }

  const totalDays =
    years * DAYS_PER_YEAR +
    months * DAYS_PER_MONTH +
    weeks * DAYS_PER_WEEK +
    days;
  if (totalDays <= 0) return defaultValue;

  return { value: totalDays, unit: 'D' };
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
 * isValidISO8601('P2W') // true
 * isValidISO8601('invalid') // false
 */
export const isValidISO8601 = (period: string): boolean => {
  return ISO8601_DURATION_REGEX.test(period);
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
