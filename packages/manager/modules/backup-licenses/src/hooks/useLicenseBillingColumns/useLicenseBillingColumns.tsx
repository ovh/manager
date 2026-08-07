import React, { useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { DataGridTextCell, DatagridColumn } from '@ovh-ux/manager-react-components';

import LicensePriceCell from '@/components/billing/LicensePriceCell/LicensePriceCell.component';
import { BACKUP_LICENSES_NAMESPACES } from '@/module.constants';
import { LicenseConsumptionRow } from '@/types/VaultConsumption.type';

/** Colonnes du tableau « Licences » de l'onglet Facturation. */
export const useLicenseBillingColumns = (): DatagridColumn<LicenseConsumptionRow>[] => {
  const { t } = useTranslation([NAMESPACES.DASHBOARD, BACKUP_LICENSES_NAMESPACES.BILLING]);

  return useMemo(
    () => [
      {
        id: 'name',
        label: t(`${NAMESPACES.DASHBOARD}:name`),
        isSortable: false,
        cell: (row: LicenseConsumptionRow) => <DataGridTextCell>{row.name}</DataGridTextCell>,
      },
      {
        id: 'licensePrice',
        label: t(`${BACKUP_LICENSES_NAMESPACES.BILLING}:licenses.column.price`),
        isSortable: false,
        cell: (row: LicenseConsumptionRow) => (
          <LicensePriceCell licensePriceText={row.licensePriceText} />
        ),
      },
    ],
    [t],
  );
};
