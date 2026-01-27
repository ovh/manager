import { Locale } from 'date-fns';

/**
 * Formats a number with locale-specific separators.
 * Uses space for French (1 000 000), comma for US English (1,000,000), etc.
 *
 * @param value - The number to format
 * @param dateFnsLocale - The date-fns Locale object (e.g., fr, enUS, de)
 * @param options - Optional Intl.NumberFormatOptions for additional formatting
 * @returns The formatted number string
 *
 * @example
 * import { fr, enUS, de } from 'date-fns/locale';
 * formatNumberWithLocale(1000000, fr) // "1 000 000"
 * formatNumberWithLocale('1000000', enUS) // "1,000,000"
 * formatNumberWithLocale(1000000, de) // "1.000.000"
 */
export const formatNumberWithLocale = (
  value: number | undefined,
  dateFnsLocale: Locale,
  options?: Intl.NumberFormatOptions,
): string | undefined => {
  return value !== undefined
    ? new Intl.NumberFormat(dateFnsLocale.code, options).format(value)
    : undefined;
};
