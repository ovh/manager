import { getDateFnsLocale } from '@ovh-ux/manager-core-utils';
import { format } from 'date-fns';
import * as dateFnsLocales from 'date-fns/locale';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export const useFormattedDate = (date: string | null, formatStr = 'PPpp') => {
  const { i18n } = useTranslation();

  const locales = useMemo(() => ({ ...dateFnsLocales }), []);

  return useMemo(() => {
    if (!date) {
      return '';
    }

    const userLocale = getDateFnsLocale(i18n.language);
    const locale =
      locales[userLocale as keyof typeof dateFnsLocales] ?? locales.fr;

    return format(new Date(date), formatStr, {
      locale,
    });
  }, [date, formatStr, locales, i18n]);
};
