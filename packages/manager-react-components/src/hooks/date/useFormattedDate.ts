import { useMemo } from 'react';
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

export enum TimeFormat {
  /**
   * No time
   */
  hidden = 'hidden',
  /**
   * HH:MM
   */
  hourAndMinute = 'hourAndMinute',
  /**
   * HH:MM:ss
   */
  fullDisplay = 'fullDisplay',
}

export type FormattedDateProps = {
  dateString: string;
  unknownDateLabel?: string;
  defaultLocale?: string;
  format?: DateFormat;
};

//
// @deprecated This hook is deprecated and will be removed in the next major version.
// Use directly the component useFormatDate instead to be more readable
//
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

const DATE_FORMAT_LIST = {
  [DateFormat.compact]: {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  },
  [DateFormat.display]: {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  },
  [DateFormat.fullDisplay]: {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  },
} as const;

const TIME_FORMAT_LIST = {
  [TimeFormat.hidden]: {},
  [TimeFormat.hourAndMinute]: {
    hour: '2-digit',
    minute: '2-digit',
  },
  [TimeFormat.fullDisplay]: {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  },
} as const;

class ManagerDateFormatter {
  constructor(
    private readonly locale: string,
    private readonly unknownDateLabelDefault: string,
  ) {
    this.locale = locale;
    this.unknownDateLabelDefault = unknownDateLabelDefault;
  }

  formatDate({
    date,
    format = DateFormat.display,
    timeFormat = TimeFormat.hidden,
    unknownDateLabel = this.unknownDateLabelDefault,
  }: {
    date?: Date | string;
    format?: DateFormat;
    timeFormat?: TimeFormat;
    unknownDateLabel?: string;
  }) {
    const newDate = typeof date === 'string' ? new Date(date) : date;

    if (!newDate || newDate?.toString() === 'Invalid Date') {
      return unknownDateLabel;
    }

    return newDate.toLocaleString(this.locale, {
      ...ManagerDateFormatter.formatDateParams(format),
      ...ManagerDateFormatter.formatTimeParams(timeFormat),
    });
  }

  static formatDateParams(dateFormat: DateFormat) {
    return DATE_FORMAT_LIST[dateFormat] ?? DATE_FORMAT_LIST[DateFormat.display];
  }

  static formatTimeParams(timeFormat: TimeFormat) {
    return TIME_FORMAT_LIST[timeFormat] ?? TIME_FORMAT_LIST[TimeFormat.hidden];
  }
}

export type FormatDateProps = {
  unknownDateLabelDefault?: string;
  defaultLocale?: string;
};

export const useFormatDate = ({
  defaultLocale = 'FR-fr',
  unknownDateLabelDefault = defaultUnknownDateLabel,
}: FormatDateProps = {}) => {
  const { i18n } = useTranslation();
  const locale = i18n?.language?.replace('_', '-') || defaultLocale;

  const managerDateFormatter = useMemo(
    () => new ManagerDateFormatter(locale, unknownDateLabelDefault),
    [locale, unknownDateLabelDefault],
  );

  return managerDateFormatter;
};
