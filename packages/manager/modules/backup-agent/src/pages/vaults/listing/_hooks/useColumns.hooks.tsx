import { useTranslation } from 'react-i18next';

import { BACKUP_AGENT_NAMESPACES } from '@/BackupAgent.translations';
import { ResourceLocationCell } from '@/components/CommonCells/ResourceLocationCell/ResourceLocationCell.component';
import { ResourceRegionCell } from '@/components/CommonCells/ResourceRegionCell/ResourceRegionCell.component';
import { ResourceStatusCell } from '@/components/CommonCells/ResourceStatusCell/ResourceStatusCell.component';

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
      id: 'currentState.azName',
      cell: ResourceLocationCell,
      label: t('location_label'),
    },
    {
      id: 'region',
      cell: ResourceRegionCell,
      label: t('region_label'),
    },
    {
      id: 'currentState.vspc',
      cell: VaultBucketsCell,
      label: t('buckets_label'),
    },
    {
      id: 'resourceStatus',
      cell: ResourceStatusCell,
      label: t('status_label'),
    },
    {
      id: 'vaultActions',
      cell: VaultActionCell,
      label: '',
    },
  ];
};
