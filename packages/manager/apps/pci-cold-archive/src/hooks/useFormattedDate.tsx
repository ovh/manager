import { format } from 'date-fns';
import * as dateFnsLocales from 'date-fns/locale';
import { useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { getDateFnsLocale } from '@ovh-ux/manager-core-utils';

export const useFormattedDate = (date: string | null, formatStr = 'PPpp') => {
  const { i18n } = useTranslation();
  const locales = useRef({ ...dateFnsLocales }).current;

  return useMemo(() => {
    if (date) {
      const userLocale = getDateFnsLocale(i18n.language);
      if (userLocale in locales) {
        const localeId = userLocale as keyof typeof locales;
        return format(new Date(date), formatStr, {
          locale: locales[localeId],
        });
      }
      return format(new Date(date), formatStr, {
        locale: locales.fr,
      });
    }
    return '';
  }, [date, formatStr]);
};
