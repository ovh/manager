import { de, enGB, es, fr, frCA, it, pl, pt } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';

export function useDateFnsLocale() {
  const { i18n } = useTranslation();
  const { language } = i18n;

  switch (language) {
    case 'fr_FR':
      return fr;
    case 'de_DE':
      return de;
    case 'en_GB':
      return enGB;
    case 'es_ES':
      return es;
    case 'fr-CA':
      return frCA;
    case 'it_IT':
      return it;
    case 'pl_PL':
      return pl;
    case 'pt_PT':
      return pt;
    default:
      return enGB;
  }
}
