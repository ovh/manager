import { Locale, formatDuration as formatDurationFns } from 'date-fns';
import { parse } from 'duration-fns';

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
