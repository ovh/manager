import { Duration, Locale, formatDuration as formatDurationFns } from 'date-fns';

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
const parseObservabilityDuration = (durationString: string): ObservabilityDurationComponents => {
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
