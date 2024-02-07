import { format } from 'date-fns';
import * as dateFnsLocales from 'date-fns/locale';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import DataGridTextCell from '../../datagrid/DataGridTextCell';
import getLocale from '@/data/date';

export default function Validity({ date }: { date: string | null }) {
  const { i18n } = useTranslation('common');

  const locales = useRef({ ...dateFnsLocales }).current;

  let displayDate = '';

  if (date) {
    const userLocale = getLocale(i18n.language);

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
