import { useTranslation } from 'react-i18next';

export const defaultUnknownDateLabel = 'N/A';

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

export const useFormattedDate = ({
  dateString,
  defaultLocale = 'FR-fr',
  unknownDateLabel = defaultUnknownDateLabel,
  format = DateFormat.display,
}: {
  dateString: string;
  unknownDateLabel?: string;
  defaultLocale?: string;
  format?: DateFormat;
}) => {
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
