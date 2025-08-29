import { getDateFnsLocale } from '@ovh-ux/manager-core-utils';
import { enGB } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import { LocaleKey, LOCALE_MAP } from './useDataFnsLocale.type';

export const useDateFnsLocale = () => {
  const { i18n } = useTranslation();
  const language = getDateFnsLocale(i18n?.language);
  return (
    (LOCALE_MAP as Record<LocaleKey, typeof enGB>)[language as LocaleKey] ||
    enGB
  );
};
