import React from 'react';

import { useTranslation } from 'react-i18next';

import { ODS_BADGE_COLOR, ODS_BADGE_SIZE } from '@ovhcloud/ods-components';
import { OdsBadge } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { DataGridTextCell, DatagridColumn } from '@ovh-ux/manager-react-components';

import { BACKUP_LICENSES_NAMESPACES } from '@/BackupLicenses.translations';
import { selectIsIncludedVault } from '@/data/selectors/vaults.selectors';
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
      cell: (vault: VaultResource) => (
        <DataGridTextCell>
          <span className="flex items-center gap-2">
            {vault.currentState.name}
            {selectIsIncludedVault(vault) && (
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
