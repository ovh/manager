import { useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { DatagridColumn } from '@ovh-ux/manager-react-components';

import { Tenant } from '@/types/Tenant.type';

import {
  TenantActionCell,
  TenantLocationCell,
  TenantNameCell,
  TenantReferenceCell,
  TenantRegionCell,
  TenantStatusCell,
} from '../_components';

export function useListingColumns(): DatagridColumn<Tenant>[] {
  const { t } = useTranslation([NAMESPACES.DASHBOARD, NAMESPACES.REGION, NAMESPACES.STATUS]);

  return useMemo<DatagridColumn<Tenant>[]>(() => {
    return [
      {
        id: 'name',
        label: t(`${NAMESPACES.DASHBOARD}:name`),
        isSortable: false,
        cell: TenantNameCell,
      },
      {
        id: 'location',
        label: t(`${NAMESPACES.REGION}:localisation`),
        isSortable: false,
        cell: TenantLocationCell,
      },
      {
        id: 'region',
        label: t(`${NAMESPACES.REGION}:region`),
        isSortable: false,
        cell: TenantRegionCell,
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
