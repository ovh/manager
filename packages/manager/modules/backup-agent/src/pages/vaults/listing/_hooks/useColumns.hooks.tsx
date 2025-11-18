import { useTranslation } from 'react-i18next';

import { BACKUP_AGENT_NAMESPACES } from '@/BackupAgent.translations';
import { ResourceLocationCell } from '@/components/CommonCells/ResourceLocationCell/ResourceLocationCell.components';
import { ResourceRegionCell } from '@/components/CommonCells/ResourceRegionCell/ResourceRegionCell.components';
import { ResourceStatusCell } from '@/components/CommonCells/ResourceStatusCell/ResourceStatusCell.components';
import { Resource } from '@/types/Resource.type';
import { Vault, VaultResource } from '@/types/Vault.type';

import { VaultBucketsCell, VaultIdCell, VaultReferenceCell } from '../_components';
import { VaultActionCell } from '../_components/VaultActionCell.component';

export const ID_LABEL = 'ID';

export const useColumns = () => {
  const { t } = useTranslation(BACKUP_AGENT_NAMESPACES.VAULT_LISTING);

  return [
    {
      id: 'id',
      cell: VaultIdCell,
      label: ID_LABEL,
    },
    {
      id: 'currentState.resourceName',
      cell: VaultReferenceCell,
      label: t('resource_name_label'),
    },
    {
      id: 'currentState.region',
      cell: (vaultResource: Resource<Vault>) => (
        <ResourceLocationCell region={vaultResource.currentState.region} />
      ),
      label: t('location_label'),
    },
    {
      id: 'region',
      cell: (vaultResource: Resource<Vault>) => (
        <ResourceRegionCell region={vaultResource.currentState.region} />
      ),
      label: t('region_label'),
    },
    {
      id: 'currentState.buckets',
      cell: VaultBucketsCell,
      label: t('buckets_label'),
    },
    {
      id: 'resourceStatus',
      cell: (vaultResource: Resource<Vault>) => (
        <ResourceStatusCell resourceStatus={vaultResource.resourceStatus} />
      ),
      label: t('status_label'),
    },
    {
      id: 'vaultActions',
      cell: VaultActionCell,
      label: '',
    },
  ];
};
