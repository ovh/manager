import {
  ODS_DATEPICKER_LOCALE,
  OdsDatepickerLocale,
} from '@ovhcloud/ods-components';

export const formatDate = (date: Date) => date.toISOString().split('T')[0];

export const getDatepickerLocale = (locale: string): OdsDatepickerLocale => {
  const language = locale?.split(/[-_]/)[0]?.toLowerCase();
  return (
    (ODS_DATEPICKER_LOCALE as Record<string, OdsDatepickerLocale>)[language] ??
    ODS_DATEPICKER_LOCALE.en
  );
};

export const toMonthYear = (date: Date, locale: string) =>
  new Intl.DateTimeFormat(locale.replace('_', '-'), {
    month: 'long',
    year: 'numeric',
  }).format(date);

export const toLocalDateUTC = (date: string, locale: string) =>
  new Date(date).toLocaleString(locale.replace('_', '-'), {
    timeZone: 'UTC',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  });

export const toUsDateUTC = (date: string | Date) =>
  new Date(date)
    .toLocaleDateString('en-US', {
      timeZone: 'UTC',
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    })
    .replace(/\//g, '-');

export const toUsDateTimeUTC = (date: string | Date) =>
  new Date(date)
    .toLocaleString('en-US', {
      timeZone: 'UTC',
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZoneName: 'short',
    })
    .replace(/^(\d{2})\/(\d{2})\/(\d{4})/, '$1-$2-$3');

const DEFAULT_MONTHS = 6;

export const getLastXMonths = (nbrMonths: number = DEFAULT_MONTHS) => {
  const months: string[] = new Array(nbrMonths);
  const date = new Date();
  date.setDate(1); // Set to the first day of the current month

  for (let i = 0; i < nbrMonths; i += 1) {
    months[i] = new Date(date).toString(); // Store a copy of the current date
    date.setMonth(date.getMonth() - 1); // Move to the previous month
  }

  return months;
};

export const toIsoDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
