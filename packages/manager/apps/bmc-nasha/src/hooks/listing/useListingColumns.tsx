import { useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import { OdsText } from '@ovhcloud/ods-components/react';

import { DatagridColumn } from '@ovh-ux/manager-react-components';

import { DefaultListingItemType } from '@/types/Listing.type';

/**
 * Custom hook for NASHA listing columns configuration
 * Provides columns matching the original AngularJS directory page
 * @returns Array of DatagridColumn configurations
 */
export function useListingColumns<
  T extends DefaultListingItemType = DefaultListingItemType
>(): DatagridColumn<T>[] {
  const { t } = useTranslation(['common', 'status', 'listing']);

  return useMemo<DatagridColumn<T>[]>(() => {
    const EMPTY = t('common:empty', '—');
    const NA = t('common:na', 'N/A');

    // Format bytes to human readable format
    const formatBytes = (bytes?: number): string => {
      if (!bytes || bytes === 0) return EMPTY;

      const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
      const i = Math.floor(Math.log(bytes) / Math.log(1024));
      return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
    };

    // Columns in the same order as the original AngularJS directory page
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
      {
        id: 'zpoolCapacity',
        label: 'listing:zpoolCapacity',
        isSortable: false,
        cell: (row: T): JSX.Element => (
          <OdsText>{formatBytes(row.zpoolCapacity)}</OdsText>
        ),
      },
      {
        id: 'zpoolSize',
        label: 'listing:zpoolSize',
        isSortable: false,
        cell: (row: T): JSX.Element => (
          <OdsText>{formatBytes(row.zpoolSize)}</OdsText>
        ),
      },
    ];
  }, [t]);
}
