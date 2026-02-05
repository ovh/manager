import { useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import { OdsText } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';

import { BACKUP_AGENT_NAMESPACES } from '@/BackupAgent.translations';
import { ResourceLocationCell } from '@/components/CommonCells/ResourceLocationCell/ResourceLocationCell.component';
import { ResourceRegionCell } from '@/components/CommonCells/ResourceRegionCell/ResourceRegionCell.component';
import { ResourceStatusCell } from '@/components/CommonCells/ResourceStatusCell/ResourceStatusCell.component';
import { LABELS } from '@/module.constants';
import { Resource } from '@/types/Resource.type';
import { Tenant } from '@/types/Tenant.type';
import { WithRegion } from '@/types/Utils.type';
import { VSPCTenant } from '@/types/VspcTenant.type';

import { TenantActionCell } from '../_components/TenantActionCell.component';
import { TenantNameCell } from '../_components/TenantNameCell.component';
import { TenantReferenceCell } from '../_components/TenantReferenceCell.component';

export function useTenantListingColumns() {
  const { t } = useTranslation([NAMESPACES.DASHBOARD, NAMESPACES.REGION, NAMESPACES.STATUS]);
  return useMemo(
    () => [
      {
        id: 'name',
        label: t(`${NAMESPACES.DASHBOARD}:name`),
        isSortable: false,
        cell: TenantNameCell,
      },
      {
        id: 'agents',
        label: t(`${BACKUP_AGENT_NAMESPACES.COMMON}:agents`),
        isSortable: false,
        cell: (tenantResource: Resource<VSPCTenant>) => (
          <OdsText className="w-full text-center">
            {tenantResource?.currentState?.backupAgents?.length || 0}
          </OdsText>
        ),
      },
      {
        id: 'vaults',
        label: LABELS.VAULTS,
        isSortable: false,
        cell: (tenantResource: Resource<VSPCTenant>) => (
          <OdsText className="w-full text-center">
            {tenantResource?.currentState?.vaults?.length || 0}
          </OdsText>
        ),
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
        cell: ({ resourceStatus }) => <ResourceStatusCell resourceStatus={resourceStatus} />,
      },
      {
        id: 'action',
        label: '',
        isSortable: false,
        cell: ({ id }: Resource<VSPCTenant>) => <TenantActionCell id={id} />,
      },
    ],
    [t],
  );
}
