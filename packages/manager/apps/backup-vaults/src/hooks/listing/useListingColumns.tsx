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
        id: 'id',
        label: 'common:id',
        isSortable: true,
        cell: (row: T): JSX.Element => <OdsText>{row.id ?? NA}</OdsText>,
      },
      {
        id: 'name',
        label: 'common:name',
        isSortable: false,
        cell: (row: T): JSX.Element => <OdsText>{row.name ?? EMPTY}</OdsText>,
      },
    ];
  }, [t]);
}
