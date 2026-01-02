import { Duration, Locale, formatDuration as formatDurationFns } from 'date-fns';
import { parse } from 'duration-fns';

export type ObservabilityDurationUnit = 'ns' | 'us' | 'µs' | 'ms' | 's' | 'm' | 'h' | 'd';

export type ObservabilityDurationParsed = {
  value: number;
  unit: ObservabilityDurationUnit;
};

type ObservabilityDurationComponents = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
  microseconds: number;
  nanoseconds: number;
};

/**
 * Parses an Observability duration string (e.g., "1h30m", "2h45m0s", "7d") into its components.
 * This format is used by Observability services like Mimir.
 *
 * Valid time units are: d, h, m, s, ms, us (or µs), ns
 *
 * @param durationString - Observability duration string (e.g., "7d", "1h30m", "168h", "2h45m30s")
 * @returns Object containing days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds
 *
 * @example
 * parseObservabilityDuration("7d") // { days: 7, hours: 0, minutes: 0, seconds: 0, ... }
 * parseObservabilityDuration("1h30m") // { days: 0, hours: 1, minutes: 30, seconds: 0, ... }
 * parseObservabilityDuration("168h") // { days: 0, hours: 168, minutes: 0, seconds: 0, ... }
 */
export const parseObservabilityDuration = (
  durationString: string,
): ObservabilityDurationComponents => {
  const result: ObservabilityDurationComponents = {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    milliseconds: 0,
    microseconds: 0,
    nanoseconds: 0,
  };

  if (!durationString || durationString === '0' || durationString === '0s') {
    return result;
  }

  // Match all duration components: number followed by unit
  // Units: d, h, m, s, ms, us, µs, ns
  const regex = /(-?\d+(?:\.\d+)?)(ns|us|µs|ms|s|m|h|d)/g;
  let match;

  while ((match = regex.exec(durationString)) !== null) {
    const value = parseFloat(match[1] ?? '0');
    const unit = match[2];

    switch (unit) {
      case 'd':
        result.days += value;
        break;
      case 'h':
        result.hours += value;
        break;
      case 'm':
        result.minutes += value;
        break;
      case 's':
        result.seconds += value;
        break;
      case 'ms':
        result.milliseconds += value;
        break;
      case 'us':
      case 'µs':
        result.microseconds += value;
        break;
      case 'ns':
        result.nanoseconds += value;
        break;
    }
  }

  return result;
};

/**
 * Parses an Observability duration string and returns the value converted to the most appropriate unit.
 * Converts hours to days when applicable (e.g., "168h" → { value: 7, unit: 'd' }).
 *
 * @param durationString - Observability duration string (e.g., "168h", "7d", "1h30m")
 * @returns Object containing the numeric value and unit
 *
 * @example
 * parseObservabilityDurationValue("7d") // { value: 7, unit: 'd' }
 * parseObservabilityDurationValue("168h") // { value: 7, unit: 'd' }
 * parseObservabilityDurationValue("12h") // { value: 12, unit: 'h' }
 * parseObservabilityDurationValue("30m") // { value: 30, unit: 'm' }
 */
export const parseObservabilityDurationValue = (
  durationString: string,
): ObservabilityDurationParsed => {
  const parsed = parseObservabilityDuration(durationString);

  // Return days if present
  if (parsed.days > 0) {
    return { value: parsed.days, unit: 'd' };
  }

  // Convert hours to days if divisible by 24
  if (parsed.hours > 0 && parsed.hours % 24 === 0 && parsed.minutes === 0 && parsed.seconds === 0) {
    return { value: parsed.hours / 24, unit: 'd' };
  }

  // Return the most significant non-zero unit
  if (parsed.hours > 0) {
    return { value: parsed.hours, unit: 'h' };
  }
  if (parsed.minutes > 0) {
    return { value: parsed.minutes, unit: 'm' };
  }
  if (parsed.seconds > 0) {
    return { value: parsed.seconds, unit: 's' };
  }
  if (parsed.milliseconds > 0) {
    return { value: parsed.milliseconds, unit: 'ms' };
  }
  if (parsed.microseconds > 0) {
    return { value: parsed.microseconds, unit: 'us' };
  }
  if (parsed.nanoseconds > 0) {
    return { value: parsed.nanoseconds, unit: 'ns' };
  }

  return { value: 0, unit: 's' };
};

/**
 * Formats an Observability duration string (e.g., "7d", "1h30m", "168h") into a human-readable format
 * using date-fns with proper internationalization support.
 *
 * @param durationString - Observability duration string (e.g., "7d", "1h30m", "168h")
 * @param locale - date-fns Locale object for internationalization
 * @returns Formatted duration string in the specified locale
 *
 * @example
 * formatObservabilityDuration("7d", fr) // "7 jours"
 * formatObservabilityDuration("168h", fr) // "7 jours"
 * formatObservabilityDuration("1h30m", enGB) // "1 hour 30 minutes"
 * formatObservabilityDuration("2h45m30s", es) // "2 horas 45 minutos 30 segundos"
 */
export const formatObservabilityDuration = (durationString: string, locale: Locale): string => {
  try {
    const parsed = parseObservabilityDuration(durationString);

    // Convert hours to days if >= 24
    const totalHours = parsed.hours;
    const additionalDays = Math.floor(totalHours / 24);
    const remainingHours = totalHours % 24;

    const duration: Duration = {
      days: parsed.days + additionalDays,
      hours: remainingHours,
      minutes: parsed.minutes,
      seconds: parsed.seconds,
    };

    return formatDurationFns(duration, {
      locale,
      delimiter: ' ',
    });
  } catch (error) {
    console.error('Failed to parse Observability duration:', durationString, error);
    return durationString;
  }
};

/**
 * Formats an ISO 8601 duration string (e.g., "P1M", "P3M", "P6M") into a human-readable format
 * using date-fns with proper internationalization support
 *
 * @param durationString - ISO 8601 duration string (e.g., "P1M" for 1 month)
 * @param locale - date-fns Locale object for internationalization
 * @returns Formatted duration string in the specified locale
 *
 * @example
 * formatDuration("P1M", fr) // "1 mois"
 * formatDuration("P3M", enGB) // "3 months"
 * formatDuration("P6M", es) // "6 meses"
 */
export const formatDuration = (durationString: string, locale: Locale): string => {
  try {
    // Parse the ISO 8601 duration string into a Duration object
    const parsedDuration = parse(durationString);

    // Format the duration using date-fns with the provided locale
    return formatDurationFns(parsedDuration, {
      locale,
      delimiter: ' ',
    });
  } catch (error) {
    // Fallback: return the original string if parsing fails
    console.error('Failed to parse duration:', durationString, error);
    return durationString;
  }
};
