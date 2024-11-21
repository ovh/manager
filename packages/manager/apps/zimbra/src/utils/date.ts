export function makeDateFromDDMMYYYY(dateString: string) {
  const [day, month, year] = dateString.split('/').map(Number);
  return new Date(year, month - 1, day);
}

export function formatDateToLocaleFormat(locale: string, date: Date) {
  return new Intl.DateTimeFormat(locale, {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  }).format(date);
}
