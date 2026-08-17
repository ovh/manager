import React from 'react';

import { useTranslation } from 'react-i18next';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { DataGridTextCell } from '@ovh-ux/manager-react-components';

import { BACKUP_LICENSES_NAMESPACES } from '@/BackupLicenses.translations';
import { getVaultRegionI18nKey } from '@/utils/vault/vaultRegion';

export type VaultRegionCellProps = {
  region: string;
};

export const VaultRegionCell = ({ region }: VaultRegionCellProps) => {
  const { t } = useTranslation([BACKUP_LICENSES_NAMESPACES.VAULTS, NAMESPACES.REGION]);
  const datacenterKey = getVaultRegionI18nKey(region);

  if (!datacenterKey) {
    return <DataGridTextCell>{region}</DataGridTextCell>;
  }

  const datacenterCode = datacenterKey.toUpperCase();

  return (
    <DataGridTextCell>
      {t('region_single', {
        city: t(`${NAMESPACES.REGION}:region_${datacenterCode}`),
        code: datacenterCode,
      })}
    </DataGridTextCell>
  );
};
