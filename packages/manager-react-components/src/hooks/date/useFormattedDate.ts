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
  /**
   * dd/MM/YYY HH:mm
   */
  compactWithTime = 'compactWithTime',
}

export type FormattedDateProps = {
  dateString: string;
  unknownDateLabel?: string;
  defaultLocale?: string;
  format?: DateFormat;
};

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

  switch (format) {
    case DateFormat.compactWithTime:
      return date.toLocaleString(locale, {
        timeStyle: 'short',
        dateStyle: 'short',
      });
    case DateFormat.compact:
      return date.toLocaleDateString(locale);
    default:
      return date.toLocaleString(locale, {
        day: 'numeric',
        month: format === DateFormat.fullDisplay ? 'long' : 'short',
        year: 'numeric',
      });
  }
};
