import {
  frFR,
  deDE,
  enUS,
  esES,
  itIT,
  plPL,
  ptBR,
} from '@mui/x-date-pickers/locales';
import { Locale, useLocale } from '@/hooks/useLocale';

// available locales do not exactly match, but should be close enough
export function useMuiLocale() {
  const locale = useLocale();
  switch (locale) {
    case Locale.fr_FR:
      return frFR;
    case Locale.de_DE:
      return deDE;
    case Locale.en_GB:
      return enUS;
    case Locale.es_ES:
      return esES;
    case Locale.fr_CA:
      return frFR;
    case Locale.it_IT:
      return itIT;
    case Locale.pl_PL:
      return plPL;
    case Locale.pt_PT:
      return ptBR;
    default:
      return enUS;
  }
}
