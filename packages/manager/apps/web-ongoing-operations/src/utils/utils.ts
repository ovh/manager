export const formatDatagridDate = (date: string, locale: string) => {
  const formattedDate = new Date(date);
  return formattedDate.toLocaleString(locale.replace('_', '-'), {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const removeQuotes = (comment: string) => {
  if (
    comment &&
    comment[0].startsWith('"') &&
    comment.slice(-1).endsWith('"')
  ) {
    return comment.replace(/"/g, '');
  }
  return comment;
};

export function getNicParams(fields: string[]): string {
  if (!fields || fields.length === 0) {
    return '';
  }
  const params = new URLSearchParams({ fields: fields.join(',') });
  return `?${params.toString()}`;
}
