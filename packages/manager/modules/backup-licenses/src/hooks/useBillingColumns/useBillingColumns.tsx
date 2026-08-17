import React, { useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { DataGridTextCell, DatagridColumn } from '@ovh-ux/manager-react-components';

import LicensePriceCell from '@/components/billing/LicensePriceCell/LicensePriceCell.component';
import VaultPriceCell from '@/components/billing/VaultPriceCell/VaultPriceCell.component';
import VaultUsageCell from '@/components/billing/VaultUsageCell/VaultUsageCell.component';
import { BACKUP_LICENSES_NAMESPACES } from '@/module.constants';
import { VaultConsumptionRow } from '@/types/VaultConsumption.type';

/**
 * Colonnes du tableau « Facturation », dans l'ordre imposé par le ticket (§7 de la spec
 * BKP-1225). Toutes non triables : sans `sorting`/`onSortChange` passés au `Datagrid`,
 * un en-tête cliquable ne trierait rien — même décision que `useLinkedServersColumns`.
 */
export const useBillingColumns = (): DatagridColumn<VaultConsumptionRow>[] => {
  const { t } = useTranslation([NAMESPACES.DASHBOARD, BACKUP_LICENSES_NAMESPACES.BILLING]);

  return useMemo(
    () => [
      {
        id: 'name',
        label: t(`${NAMESPACES.DASHBOARD}:name`),
        isSortable: false,
        cell: (row: VaultConsumptionRow) => <DataGridTextCell>{row.name}</DataGridTextCell>,
      },
      {
        id: 'consumption',
        label: t(`${NAMESPACES.DASHBOARD}:consumption`),
        isSortable: false,
        cell: (row: VaultConsumptionRow) => (
          <VaultUsageCell quantityGb={row.quantityGb} includedStorageGb={row.includedStorageGb} />
        ),
      },
      {
        id: 'licensePrice',
        label: t(`${BACKUP_LICENSES_NAMESPACES.BILLING}:column.license_price`),
        isSortable: false,
        cell: (row: VaultConsumptionRow) => (
          <LicensePriceCell licensePriceText={row.licensePriceText} />
        ),
      },
      {
        id: 'storagePrice',
        label: t(`${BACKUP_LICENSES_NAMESPACES.BILLING}:column.storage_price`),
        isSortable: false,
        cell: (row: VaultConsumptionRow) => (
          <VaultPriceCell
            storagePriceValue={row.storagePriceValue}
            storagePriceText={row.storagePriceText}
          />
        ),
      },
    ],
    [t],
  );
};
