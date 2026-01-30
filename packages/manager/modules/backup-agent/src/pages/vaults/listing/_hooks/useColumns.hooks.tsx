import { useTranslation } from 'react-i18next';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';

import { BACKUP_AGENT_NAMESPACES } from '@/BackupAgent.translations';
import { ResourceLocationCell } from '@/components/CommonCells/ResourceLocationCell/ResourceLocationCell.component';
import { ResourceRegionCell } from '@/components/CommonCells/ResourceRegionCell/ResourceRegionCell.component';
import { ResourceStatusCell } from '@/components/CommonCells/ResourceStatusCell/ResourceStatusCell.component';
import { VaultReferenceCell } from '@/pages/vaults/listing/_components/VaultReferenceCell.component';
import { Resource } from '@/types/Resource.type';
import { Vault } from '@/types/Vault.type';

import { VaultActionCell } from '../_components/VaultActionCell.component';
import { VaultIdCell } from '../_components/VaultIdCell.component';

export const useColumns = () => {
  const { t } = useTranslation([BACKUP_AGENT_NAMESPACES.VAULT_LISTING, NAMESPACES.DASHBOARD]);

  return [
    {
      id: 'id',
      cell: ({ id, currentState: { name } }: Resource<Vault>) => (
        <VaultIdCell id={id} name={name} />
      ),
      label: t('resource_name_label'),
    },
    {
      id: 'currentState.resourceName',
      cell: VaultReferenceCell,
      label: t(`${NAMESPACES.DASHBOARD}:reference`),
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
      id: 'resourceStatus',
      cell: ({ resourceStatus }: Resource<Vault>) => (
        <ResourceStatusCell resourceStatus={resourceStatus} />
      ),
      label: t('status_label'),
    },
    {
      id: 'vaultActions',
      cell: ({ id }: Resource<Vault>) => <VaultActionCell id={id} />,
      label: '',
    },
  ];
};
