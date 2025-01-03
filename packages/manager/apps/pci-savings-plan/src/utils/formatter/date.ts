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
