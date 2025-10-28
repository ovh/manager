import { enGB } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';

import { getDateFnsLocale } from '@ovh-ux/manager-core-utils';

import { LOCALE_MAP, LocaleKey } from './useDateFnsLocale.type';

export const useDateFnsLocale = () => {
  const { i18n } = useTranslation();
  const language = getDateFnsLocale(i18n?.language);
  return (LOCALE_MAP as Record<LocaleKey, typeof enGB>)[language as LocaleKey] || enGB;
};
