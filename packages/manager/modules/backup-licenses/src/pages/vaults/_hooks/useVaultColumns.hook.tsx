import React from 'react';

import { useTranslation } from 'react-i18next';

import { ODS_BADGE_COLOR, ODS_BADGE_SIZE, ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import { OdsBadge, OdsSpinner } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { DataGridTextCell, DatagridColumn } from '@ovh-ux/manager-react-components';

import { BACKUP_LICENSES_NAMESPACES } from '@/BackupLicenses.translations';
import { selectIsIncludedVault } from '@/data/selectors/vaults.selectors';
import { VAULT_DEFAULT_IMMUTABILITY } from '@/module.constants';
import { VaultActionsCell } from '@/pages/vaults/_components/VaultActionsCell.component';
import { VaultRegionCell } from '@/pages/vaults/_components/VaultRegionCell.component';
import { VaultStatusCell } from '@/pages/vaults/_components/VaultStatusCell.component';
import { VaultRow } from '@/types/Vault.type';
import { isPendingVaultRow } from '@/utils/vault/pendingVaultRow';

export const useVaultColumns = (): DatagridColumn<VaultRow>[] => {
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
      cell: (vault: VaultRow) => (
        <DataGridTextCell>
          <span className="flex items-center gap-2">
            {vault.currentState.name}
            {!isPendingVaultRow(vault) && selectIsIncludedVault(vault) && (
              <OdsBadge
                color={ODS_BADGE_COLOR.success}
                size={ODS_BADGE_SIZE.sm}
                label={t('badge.included')}
              />
            )}
          </span>
        </DataGridTextCell>
      ),
    },
    {
      id: 'region',
      label: t(`${NAMESPACES.REGION}:region`),
      isSortable: false,
      cell: ({ currentState }: VaultRow) => <VaultRegionCell region={currentState.region} />,
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
      cell: (vault: VaultRow) =>
        isPendingVaultRow(vault) ? (
          <DataGridTextCell>
            <OdsSpinner size={ODS_SPINNER_SIZE.xs} />
          </DataGridTextCell>
        ) : (
          <VaultStatusCell resourceStatus={vault.resourceStatus} />
        ),
    },
    {
      id: 'actions',
      label: '',
      isSortable: false,
      cell: (vault: VaultRow) =>
        isPendingVaultRow(vault) ? <DataGridTextCell /> : <VaultActionsCell vault={vault} />,
    },
  ];
};
