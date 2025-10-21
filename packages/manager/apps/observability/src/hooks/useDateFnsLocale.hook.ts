import { Locale } from 'date-fns';
import { de, enGB, es, fr, frCA, it, pl, pt } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';

/**
 * Hook to get the appropriate date-fns locale based on the current i18n language
 * Maps i18next language codes to date-fns locale objects
 */
export const useDateFnsLocale = (): Locale => {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;

  // Map i18next language codes to date-fns locales
  const localeMap: Record<string, Locale> = {
    fr_FR: fr,
    fr_CA: frCA,
    en_GB: enGB,
    de_DE: de,
    es_ES: es,
    it_IT: it,
    pl_PL: pl,
    pt_PT: pt,
  };

  return localeMap[currentLanguage] || enGB; // Default to English (GB) if locale not found
};
