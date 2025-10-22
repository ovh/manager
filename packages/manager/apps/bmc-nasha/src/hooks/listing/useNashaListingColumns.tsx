import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { OdsText } from '@ovhcloud/ods-components/react';
import { DatagridColumn } from '@ovh-ux/manager-react-components';

export function useNashaListingColumns(): DatagridColumn<any>[] {
  const { t } = useTranslation(['common', 'listing']);

  return useMemo<DatagridColumn<any>[]>(() => {
    const EMPTY = t('common:empty', '—');
    const NA = t('common:na', 'N/A');

    return [
      {
        id: 'serviceName',
        label: 'listing:nasha_service_name',
        isSortable: true,
        cell: (row: any): JSX.Element => (
          <OdsText>{row.serviceName ?? NA}</OdsText>
        ),
      },
      {
        id: 'displayName',
        label: 'listing:nasha_display_name',
        isSortable: false,
        cell: (row: any): JSX.Element => (
          <OdsText>{row.displayName || row.customName || EMPTY}</OdsText>
        ),
      },
      {
        id: 'datacenter',
        label: 'listing:nasha_datacenter',
        isSortable: true,
        cell: (row: any): JSX.Element => (
          <OdsText>{row.localeDatacenter || row.datacenter || NA}</OdsText>
        ),
      },
      {
        id: 'diskType',
        label: 'listing:nasha_disk_type',
        isSortable: false,
        cell: (row: any): JSX.Element => (
          <OdsText>{row.diskType || NA}</OdsText>
        ),
      },
      {
        id: 'size',
        label: 'listing:nasha_size',
        isSortable: true,
        cell: (row: any): JSX.Element => (
          <OdsText>{row.diskSize || `${row.size} GB` || NA}</OdsText>
        ),
      },
      {
        id: 'status',
        label: 'listing:nasha_status',
        isSortable: false,
        cell: (row: any): JSX.Element => (
          <OdsText>{row.serviceInfos?.status || NA}</OdsText>
        ),
      },
    ];
  }, [t]);
}
