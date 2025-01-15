export const formatDate = (date: Date) => date.toISOString().split('T')[0];

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
