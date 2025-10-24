import { useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { DatagridColumn } from '@ovh-ux/manager-react-components';

import { ResourceLocationCell } from '@/components/CommonCells/ResourceLocationCell/ResourceLocationCell.component';
import { ResourceRegionCell } from '@/components/CommonCells/ResourceRegionCell/ResourceRegionCell.component';
import { ResourceStatusCell } from '@/components/CommonCells/ResourceStatusCell/ResourceStatusCell.component';
import { VSPCTenant } from '@/types/VspcTenant.type';

import { TenantActionCell, TenantReferenceCell, VSPCTenantNameCell } from '../_components';

export function useVspcListingColumns(): DatagridColumn<VSPCTenant>[] {
  const { t } = useTranslation([NAMESPACES.DASHBOARD, NAMESPACES.REGION, NAMESPACES.STATUS]);

  return useMemo<DatagridColumn<VSPCTenant>[]>(() => {
    return [
      {
        id: 'name',
        label: t(`${NAMESPACES.DASHBOARD}:name`),
        isSortable: false,
        cell: VSPCTenantNameCell,
      },
      {
        id: 'location',
        label: t(`${NAMESPACES.REGION}:localisation`),
        isSortable: false,
        cell: ResourceLocationCell,
      },
      {
        id: 'region',
        label: t(`${NAMESPACES.REGION}:region`),
        isSortable: false,
        cell: ResourceRegionCell,
      },
      {
        id: 'reference',
        label: t(`${NAMESPACES.DASHBOARD}:reference`),
        isSortable: false,
        cell: TenantReferenceCell,
      },
      {
        id: 'status',
        label: t(`${NAMESPACES.STATUS}:status`),
        isSortable: false,
        cell: ResourceStatusCell,
      },
      {
        id: 'action',
        label: '',
        isSortable: false,
        cell: TenantActionCell,
      },
    ];
  }, [t]);
}
