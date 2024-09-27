import { PaginationState } from '@ovh-ux/manager-react-components';
import { ColumnSort } from '@tanstack/react-table';
import { format } from 'date-fns';
import * as dateFnsLocales from 'date-fns/locale';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { getDateFnsLocale } from '@ovh-ux/manager-core-utils';

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

export const compareFunction = <T>(key: keyof T) => (a: T, b: T) => {
  const aValue = a[key] || '';
  const bValue = b[key] || '';

  return aValue.toString().localeCompare(bValue.toString());
};

export const sortResults = <T>(items: T[], sorting: ColumnSort): T[] => {
  const data = [...items];

  if (sorting) {
    const { id: sortKey, desc } = sorting;
    data.sort(compareFunction<T>(sortKey as keyof T));

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
