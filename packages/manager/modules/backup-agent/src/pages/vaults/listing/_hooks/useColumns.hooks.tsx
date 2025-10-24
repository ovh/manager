import { useTranslation } from 'react-i18next';

import {
  VaultBucketsCell,
  VaultIdCell,
  VaultLocationCell,
  VaultReferenceCell,
  VaultRegionCell,
  VaultStatusCell,
} from '../_components';
import {BACKUP_AGENT_NAMESPACES, NAMESPACE_PREFIX, VAULTS_NAMESPACE_PREFIX} from "@/BackupAgent.translations";

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
      cell: VaultLocationCell,
      label: t('location_label'),
    },
    {
      id: 'region',
      cell: VaultRegionCell,
      label: t('region_label'),
    },
    {
      id: 'currentState.vspc',
      cell: VaultBucketsCell,
      label: t('buckets_label'),
    },
    {
      id: 'resourceStatus',
      cell: VaultStatusCell,
      label: t('status_label'),
    },
  ];
};
