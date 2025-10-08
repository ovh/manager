import { useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { DatagridColumn } from '@ovh-ux/manager-react-components';

import { VSPCTenant } from '@/types/VspcTenant.type';

import {
  TenantActionCell,
  TenantReferenceCell,
  TenantStatusCell,
  VSPCTenantLocationCell,
  VSPCTenantNameCell,
  VSPCTenantRegionCell,
} from '../_components';

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
        cell: VSPCTenantLocationCell,
      },
      {
        id: 'region',
        label: t(`${NAMESPACES.REGION}:region`),
        isSortable: false,
        cell: VSPCTenantRegionCell,
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
        cell: TenantStatusCell,
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
