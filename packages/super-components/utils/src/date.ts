/**
 * Format date string
 */
export function formatDate(
  dateString: string,
  language: string | undefined,
): string {
  const date = new Date(dateString);
  return date.toLocaleDateString(language, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default formatDate;
