import React from 'react';

import { useTranslation } from 'react-i18next';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { DataGridTextCell, DatagridColumn } from '@ovh-ux/manager-react-components';

import { BACKUP_LICENSES_NAMESPACES } from '@/BackupLicenses.translations';
import { VAULT_DEFAULT_IMMUTABILITY } from '@/module.constants';
import { VaultActionsCell } from '@/pages/vaults/_components/VaultActionsCell.component';
import { VaultRegionCell } from '@/pages/vaults/_components/VaultRegionCell.component';
import { VaultStatusCell } from '@/pages/vaults/_components/VaultStatusCell.component';
import { VaultResource } from '@/types/Vault.type';

export const useVaultColumns = (): DatagridColumn<VaultResource>[] => {
  const { t } = useTranslation([
    BACKUP_LICENSES_NAMESPACES.VAULTS,
    NAMESPACES.DASHBOARD,
    NAMESPACES.REGION,
    NAMESPACES.STATUS,
  ]);

  return [
    {
      id: 'name',
      label: t(`${NAMESPACES.DASHBOARD}:name`),
      isSortable: false,
      cell: ({ currentState }: VaultResource) => (
        <DataGridTextCell>{currentState.name}</DataGridTextCell>
      ),
    },
    {
      id: 'region',
      label: t(`${NAMESPACES.REGION}:region`),
      isSortable: false,
      cell: ({ currentState }: VaultResource) => <VaultRegionCell region={currentState.region} />,
    },
    {
      id: 'immutability',
      label: t('column.immutability'),
      isSortable: false,
      cell: () => (
        <DataGridTextCell>
          {t('immutability_value', { count: VAULT_DEFAULT_IMMUTABILITY.duration })}
        </DataGridTextCell>
      ),
    },
    {
      id: 'encryption',
      label: t('column.encryption'),
      isSortable: false,
      cell: () => <DataGridTextCell>{t('encryption_value')}</DataGridTextCell>,
    },
    {
      id: 'status',
      label: t(`${NAMESPACES.STATUS}:status`),
      isSortable: false,
      cell: ({ resourceStatus }: VaultResource) => (
        <VaultStatusCell resourceStatus={resourceStatus} />
      ),
    },
    {
      id: 'actions',
      label: '',
      isSortable: false,
      cell: (vault: VaultResource) => <VaultActionsCell vault={vault} />,
    },
  ];
};
