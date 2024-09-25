import { PaginationState } from '@ovh-ux/manager-react-components';
import { ColumnSort } from '@tanstack/react-table';
import { format } from 'date-fns';
import * as dateFnsLocales from 'date-fns/locale';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { getDateFnsLocale } from '@ovh-ux/manager-core-utils';
import { TLoadBalancer } from '@/api/data/load-balancer';

export const paginateResults = <T>(
  items: T[],
  pagination: PaginationState,
) => ({
  rows: items.slice(
    pagination.pageIndex * pagination.pageSize,
    (pagination.pageIndex + 1) * pagination.pageSize,
  ),
  pageCount: Math.ceil(items.length / pagination.pageSize),
  totalRows: items.length,
});

export const sortResults = (items: TLoadBalancer[], sorting: ColumnSort) => {
  let data: TLoadBalancer[];
  switch (sorting?.id) {
    default:
      data = [...items].sort((a, b) =>
        a[sorting?.id] > b[sorting?.id] ? 1 : 0,
      );
      break;
  }
  if (sorting) {
    const { desc } = sorting;

    if (desc) {
      data.reverse();
    }
  }
  return data;
};

export const getFormattedDate = (date: string | null, formatStr = 'PPpp') => {
  const { i18n } = useTranslation('common');

  const locales = useRef({ ...dateFnsLocales }).current;

  let displayDate = '';

  if (date) {
    const userLocale = getDateFnsLocale(i18n.language);

    if (userLocale in locales) {
      const localeId = userLocale as keyof typeof locales;
      displayDate = format(new Date(date), formatStr, {
        locale: locales[localeId],
      });
    } else {
      displayDate = format(new Date(date), formatStr, {
        locale: locales.fr,
      });
    }
  }

  return displayDate;
};
