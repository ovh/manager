import { useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import { OdsText } from '@ovhcloud/ods-components/react';

import { DatagridColumn } from '@ovh-ux/manager-react-components';

import { DefaultListingItemType } from '@/types/Listing.type';

export function useListingColumns<
  T extends DefaultListingItemType = DefaultListingItemType
>(): DatagridColumn<T>[] {
  const { t } = useTranslation(['common', 'status', 'listing']);

  return useMemo<DatagridColumn<T>[]>(() => {
    const EMPTY = t('common:empty', '—');
    const NA = t('common:na', 'N/A');

    return [
      {
        id: 'serviceName',
        label: 'listing:serviceName',
        isSortable: true,
        cell: (row: T): JSX.Element => (
          <OdsText>{row.serviceName ?? NA}</OdsText>
        ),
      },
      {
        id: 'canCreatePartition',
        label: 'listing:canCreatePartition',
        isSortable: false,
        cell: (row: T): JSX.Element => (
          <OdsText>
            {t(`listing:canCreatePartition_${row.canCreatePartition}`)}
          </OdsText>
        ),
      },
      {
        id: 'customName',
        label: 'listing:customName',
        isSortable: false,
        cell: (row: T): JSX.Element => (
          <OdsText>{row.customName ?? EMPTY}</OdsText>
        ),
      },
      {
        id: 'datacenter',
        label: 'listing:datacenter',
        isSortable: false,
        cell: (row: T): JSX.Element => (
          <OdsText>{row.datacenter ?? NA}</OdsText>
        ),
      },
      {
        id: 'diskType',
        label: 'listing:diskType',
        isSortable: false,
        cell: (row: T): JSX.Element => <OdsText>{row.diskType ?? NA}</OdsText>,
      },
      {
        id: 'monitored',
        label: 'listing:monitored',
        isSortable: false,
        cell: (row: T): JSX.Element => (
          <OdsText>{t(`listing:monitored_${row.monitored}`)}</OdsText>
        ),
      },
    ];
  }, [t]);
}
