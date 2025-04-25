import { getDateFnsLocale } from '@ovh-ux/manager-core-utils';
import { enGB, fr, frCA, de, es, it, pl, pt } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';

const localeMap = {
  enGB,
  fr,
  frCA,
  de,
  es,
  it,
  pl,
  pt,
} as const;

export const useDateFnsLocale = () => {
  const { i18n } = useTranslation();
  const language = getDateFnsLocale(i18n?.language);
  return localeMap[language] || enGB;
};
