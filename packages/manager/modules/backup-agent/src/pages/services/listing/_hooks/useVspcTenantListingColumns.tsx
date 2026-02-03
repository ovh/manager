import { useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';

import { ResourceLocationCell } from '@/components/CommonCells/ResourceLocationCell/ResourceLocationCell.component';
import { ResourceRegionCell } from '@/components/CommonCells/ResourceRegionCell/ResourceRegionCell.component';
import { ResourceStatusCell } from '@/components/CommonCells/ResourceStatusCell/ResourceStatusCell.component';
import { Resource } from '@/types/Resource.type';
import { Tenant } from '@/types/Tenant.type';
import { WithRegion } from '@/types/Utils.type';
import { VSPCTenant } from '@/types/VspcTenant.type';

import { TenantActionCell, TenantReferenceCell, VSPCTenantNameCell } from '../_components';

export function useTenantListingColumns() {
  const { t } = useTranslation([NAMESPACES.DASHBOARD, NAMESPACES.REGION, NAMESPACES.STATUS]);

  return useMemo(
    () => [
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
        cell: (tenantResource: Resource<WithRegion<Tenant | VSPCTenant>>) => (
          <ResourceLocationCell region={tenantResource.currentState.region} />
        ),
      },
      {
        id: 'region',
        label: t(`${NAMESPACES.REGION}:region`),
        isSortable: false,
        cell: (tenantResource: Resource<WithRegion<Tenant | VSPCTenant>>) => (
          <ResourceRegionCell region={tenantResource.currentState.region} />
        ),
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
        cell: (tenantResource) => (
          <ResourceStatusCell resourceStatus={tenantResource.resourceStatus} />
        ),
      },
      {
        id: 'action',
        label: '',
        isSortable: false,
        cell: TenantActionCell,
      },
    ],
    [t],
  );
}
