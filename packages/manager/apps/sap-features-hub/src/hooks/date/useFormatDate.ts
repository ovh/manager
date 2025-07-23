import { useCallback } from 'react';
import { format as formatDateFns, isValid, Locale } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { enGB, fr, de, es, it, pl, pt } from 'date-fns/locale';

export const DEFAULT_UNKNOWN_DATE_LABEL = 'N/A';

const localeMap: Record<string, Locale> = {
  en_GB: enGB,
  fr_FR: fr,
  fr_CA: fr,
  de_DE: de,
  es_ES: es,
  it_IT: it,
  pl_PL: pl,
  pt_PT: pt,
};

export const useDateFnsLocale = () => {
  const { i18n } = useTranslation();
  const language = i18n?.language || 'en_GB';
  return localeMap[language] || enGB;
};

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
type FormatDateOptions = {
  date?: string | Date;
  format?: string; // See : https://date-fns.org/v4.1.0/docs/format
  unknownDateLabel?: string;
};

export const useFormatDate = ({
  defaultUnknownLabel = DEFAULT_UNKNOWN_DATE_LABEL,
}: { defaultUnknownLabel?: string } = {}) => {
  const locale = useDateFnsLocale();
  const { i18n } = useTranslation();

  const formatDate = useCallback(
    ({
      date,
      format = 'PP',
      unknownDateLabel = defaultUnknownLabel,
    }: FormatDateOptions): string => {
      const parsedDate = typeof date === 'string' ? new Date(date) : date;

      if (!parsedDate || !isValid(parsedDate)) {
        return unknownDateLabel;
      }

      return formatDateFns(parsedDate, format, { locale });
    },
    [locale, defaultUnknownLabel, i18n.language],
  );

  return formatDate;
};
