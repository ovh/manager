import React from 'react';

import { useTranslation } from 'react-i18next';

import { ODS_BADGE_COLOR, ODS_BADGE_SIZE } from '@ovhcloud/ods-components';
import { OdsBadge } from '@ovhcloud/ods-components/react';

import { DataGridTextCell } from '@ovh-ux/manager-react-components';

import { BACKUP_LICENSES_NAMESPACES, EMPTY_VALUE_PLACEHOLDER } from '@/module.constants';

interface VaultPriceCellProps {
  storagePriceValue?: number;
  storagePriceText?: string;
}

/**
 * Colonne « Prix stockage ». Le prix nul est le seul signal fiable de « rien à payer », pas
 * le type de vault : un bundle en dépassement de ses 500 Go est facturé (§7 de la spec
 * BKP-1225).
 */
export default function VaultPriceCell({ storagePriceValue, storagePriceText }: VaultPriceCellProps) {
  const { t } = useTranslation(BACKUP_LICENSES_NAMESPACES.BILLING);

  if (storagePriceValue === 0) {
    return (
      <DataGridTextCell>
        <OdsBadge
          color={ODS_BADGE_COLOR.success}
          size={ODS_BADGE_SIZE.md}
          label={t('badge.included')}
        />
      </DataGridTextCell>
    );
  }

  return <DataGridTextCell>{storagePriceText ?? EMPTY_VALUE_PLACEHOLDER}</DataGridTextCell>;
}
