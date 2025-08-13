/**
 * @deprecated Use useFormatDate with date fns format instead
 */
import { useTranslation } from 'react-i18next';

/**
 * @deprecated Use useFormatDate with date fns format instead
 */
export const defaultUnknownDateLabel = 'N/A';

/**
 * @deprecated Use useFormatDate with date fns format instead
 */
export enum DateFormat {
  /**
   * dd/MM/YYYY
   */
  compact = 'compact',
  /**
   * dd abbreviated month YYYY
   */
  display = 'display',
  /**
   * dd month YYYY
   */
  fullDisplay = 'fullDisplay',
}

export type FormattedDateProps = {
  dateString: string;
  unknownDateLabel?: string;
  defaultLocale?: string;
  format?: DateFormat;
};

/**
 * @deprecated Use useFormatDate with date fns format instead
 */
export const useFormattedDate = ({
  dateString,
  defaultLocale = 'FR-fr',
  unknownDateLabel = defaultUnknownDateLabel,
  format = DateFormat.display,
}: FormattedDateProps) => {
  const { i18n } = useTranslation();
  const date = new Date(dateString);
  const locale = i18n?.language?.replace('_', '-') || defaultLocale;

  if (date.toString() === 'Invalid Date') {
    return unknownDateLabel;
  }

  return format === DateFormat.compact
    ? date.toLocaleDateString(locale)
    : date.toLocaleString(locale, {
        day: 'numeric',
        month: format === DateFormat.fullDisplay ? 'long' : 'short',
        year: 'numeric',
      });
};
