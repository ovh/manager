import * as dateFnsLocales from 'date-fns/locale';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { DataGridTextCell } from '@ovh-ux/manager-react-components';
import { getDateFnsLocale } from '@ovh-ux/manager-core-utils';
import { format } from 'date-fns';

export default function CreationDate({ date }: { date: string | null }) {
  const { i18n } = useTranslation('common');

  const locales = useRef({ ...dateFnsLocales }).current;

  let displayDate = '';

  if (date) {
    const userLocale = getDateFnsLocale(i18n.language);

    if (userLocale in locales) {
      const localeId = userLocale as keyof typeof locales;
      displayDate = format(new Date(date), 'PPpp', {
        locale: locales[localeId],
      });
    } else {
      displayDate = format(new Date(date), 'PPpp', {
        locale: locales.fr,
      });
    }
  }

  return <DataGridTextCell>{displayDate}</DataGridTextCell>;
}
