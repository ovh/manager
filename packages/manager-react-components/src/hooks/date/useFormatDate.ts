import { useCallback } from 'react';
import { format as formatDateFns, isValid } from 'date-fns';
import { useDateFnsLocale } from './useDateFnsLocale';

export const DEFAULT_UNKNOWN_DATE_LABEL = 'N/A';

/**
 * Format options for date strings
 *
 * @param P - Long localized date (e.g. 04/29/1453)
 * @param PP - Long localized date with abbreviated month (e.g. Apr 29, 1453)
 * @param PPP - Long localized date with full month (e.g. April 29th, 1453)
 * @param PPPP - Full localized date with day of week (e.g. Friday, April 29th, 1453)
 * @param p - Long localized time (e.g. 12:00 AM)
 * @param pp - Long localized time with seconds (e.g. 12:00:00 AM)
 * @param ppp - Long localized time with timezone (e.g. 12:00:00 AM GMT+2)
 * @param pppp - Long localized time with full timezone (e.g. 12:00:00 AM GMT+02:00)
 * @param Pp - Combined date and time (e.g. 04/29/1453, 12:00 AM)
 * @param PPpp - Combined date and time with abbreviated month (e.g. Apr 29, 1453, 12:00:00 AM)
 * @param PPPppp - Combined date and time with full month (e.g. April 29th, 1453 at ...)
 * @param PPPPpppp - Full combined date and time (e.g. Friday, April 29th, 1453 at ...)
 *
 * @see https://date-fns.org/v4.1.0/docs/format
 */
export type FormatDateOptions = {
  date?: string | Date;
  format?: string; // See : https://date-fns.org/v4.1.0/docs/format
  invalidDateDisplayLabel?: string;
};

export const useFormatDate = ({
  invalidDateDisplayLabel = DEFAULT_UNKNOWN_DATE_LABEL,
}: { invalidDateDisplayLabel?: string } = {}) => {
  const locale = useDateFnsLocale();

  const formatDate = useCallback(
    ({ date, format = 'PP' }: FormatDateOptions): string => {
      const parsedDate = typeof date === 'string' ? new Date(date) : date;

      if (!parsedDate || !isValid(parsedDate)) {
        return invalidDateDisplayLabel;
      }

      try {
        return formatDateFns(parsedDate, format, { locale });
      } catch (_e) {
        return invalidDateDisplayLabel;
      }
    },
    [locale, invalidDateDisplayLabel],
  );

  return formatDate;
};
