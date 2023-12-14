import { Locale } from './translation';

/**
 * Format date string
 */
export function formatDate(dateString: string, locale?: Locale): string {
  const date = new Date(dateString);
  return date.toLocaleDateString(locale?.replace('_', '-'), {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default formatDate;
