export const formatDate = (date: string, locale: string) => {
  return new Date(date).toLocaleString(locale.replace('_', '-'), {
    timeZone: 'UTC',
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const removeString = (comment: string) => {
  if (
    comment &&
    comment[0].startsWith('"') &&
    comment.slice(-1).endsWith('"')
  ) {
    return comment.replace(/"/g, '');
  }
  return comment;
};
