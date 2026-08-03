import React from 'react';

import { useTranslation } from 'react-i18next';

import { ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import { OdsBadge, OdsSpinner } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { DataGridTextCell } from '@ovh-ux/manager-react-components';

import {
  getVaultStatusBadgeColor,
  getVaultStatusLabel,
  getVaultStatusTranslationKey,
} from '@/utils/vault/vaultStatus';

export type VaultStatusCellProps = {
  resourceStatus: string;
};

export const VaultStatusCell = ({ resourceStatus }: VaultStatusCellProps) => {
  const { t } = useTranslation(NAMESPACES.STATUS);
  const isCreating = getVaultStatusLabel(resourceStatus) === 'creating';

  return (
    <DataGridTextCell>
      <span className="flex items-center gap-2">
        {isCreating && (
          <span aria-hidden="true">
            <OdsSpinner size={ODS_SPINNER_SIZE.xs} />
          </span>
        )}
        <OdsBadge
          color={getVaultStatusBadgeColor(resourceStatus)}
          label={t(getVaultStatusTranslationKey(resourceStatus))}
        />
      </span>
    </DataGridTextCell>
  );
};
