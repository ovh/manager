import { fr, de, enGB, es, frCA, it, pl, pt } from 'date-fns/locale';
import { Locale, useLocale } from '@/hooks/useLocale';

export function useDateFnsLocale() {
  const locale = useLocale();
  switch (locale) {
    case Locale.fr_FR:
      return fr;
    case Locale.de_DE:
      return de;
    case Locale.en_GB:
      return enGB;
    case Locale.es_ES:
      return es;
    case Locale.fr_CA:
      return frCA;
    case Locale.it_IT:
      return it;
    case Locale.pl_PL:
      return pl;
    case Locale.pt_PT:
      return pt;
    default:
      return enGB;
  }
}
