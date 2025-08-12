import { useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import { OdsText } from '@ovhcloud/ods-components/react';

import type { DatagridColumn } from '@ovh-ux/manager-react-components';

import { DefaultListingItemType } from '@/types/Listing.type';

export function useListingColumns<
  T extends DefaultListingItemType = DefaultListingItemType,
>(): DatagridColumn<T>[] {
  const { t } = useTranslation(['common', 'status']);

  return useMemo<DatagridColumn<T>[]>(() => {
    const EMPTY = t('common:empty', '—');
    const NA = t('common:na', 'N/A');

    return [
      {
        id: 'name',
        label: 'common:name',
        isSortable: true,
        cell: (row) => <OdsText>{row.name ?? EMPTY}</OdsText>,
      },
      {
        id: 'status',
        label: 'common:status',
        isSortable: false,
        cell: (row) => <OdsText>{row.status ? t(`status:${row.status}`) : NA}</OdsText>,
      },
    ];
  }, [t]);
}
