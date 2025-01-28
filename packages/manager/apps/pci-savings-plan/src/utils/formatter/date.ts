export const formatDate = (date: Date) => date.toISOString().split('T')[0];

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

const MONTHS_IN_YEAR = 12;

export const getLastTwelveMonths = (locale: string) => {
  const months = new Array(MONTHS_IN_YEAR);
  const date = new Date();
  const formatter = new Intl.DateTimeFormat(locale.replace('_', '-'), {
    month: 'long',
    year: 'numeric',
  });
  for (let i = 0; i < MONTHS_IN_YEAR; i += 1) {
    months[i] = formatter.format(date);
    date.setMonth(date.getMonth() - 1);
  }
  return months;
};
