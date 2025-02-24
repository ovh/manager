import { format } from 'date-fns';
import { fr, enGB, it, de, es, pl, pt, frCA } from 'date-fns/locale';

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

export const formatDate = (date: string, locale: string) => {
  let formatDatePattern = 'dd/MM/yyyy';
  let lang;

  switch (locale) {
    case 'fr_FR':
      lang = fr;
      break;
    case 'fr_CA':
      lang = frCA;
      formatDatePattern = 'MM/dd/yyyy';
      break;
    case 'en_GB':
      lang = enGB;
      formatDatePattern = 'MM/dd/yyyy';
      break;
    case 'it':
      lang = it;
      break;
    case 'de_DE':
      lang = de;
      break;
    case 'es_ES':
      lang = es;
      break;
    case 'pl_PL':
      lang = pl;
      break;
    case 'pt_PT':
      lang = pt;
      break;
    default:
      lang = fr;
      break;
  }

  return format(date, formatDatePattern, {
    locale: lang,
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
