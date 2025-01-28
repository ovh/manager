import { format } from 'date-fns';
import { fr, enGB, de, es, frCA, it, pl, pt } from 'date-fns/locale';

export const formatDate = (date: string, locale: string) => {
  let lang;
  let dateFormat = 'dd/MM/yyyy HH:mm';

  switch (locale) {
    case 'fr_FR':
      lang = fr;
      break;
    case 'en_GB':
      lang = enGB;
      dateFormat = 'MM/dd/yyyy HH:mm';
      break;
    case 'de_DE':
      lang = de;
      break;
    case 'es_ES':
      lang = es;
      break;
    case 'fr_CA':
      lang = frCA;
      dateFormat = 'MM/dd/yyyy HH:mm';
      break;
    case 'it_IT':
      lang = it;
      break;
    case 'pl_PL':
      lang = pl;
      break;
    case 'pt_PT':
      lang = pt;
      break;
    default:
      lang = fr;
  }

  return format(date, dateFormat, { locale: lang });
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
