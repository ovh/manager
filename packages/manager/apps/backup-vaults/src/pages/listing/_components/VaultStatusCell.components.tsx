import React from 'react';

import { useTranslation } from 'react-i18next';

import { ODS_BADGE_COLOR } from '@ovhcloud/ods-components';
import { OdsBadge } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { DataGridTextCell } from '@ovh-ux/manager-react-components';

import { ResourceStatus, VaultResource } from '@/types/Vault.type';

const VaultStatusColor: Record<ResourceStatus, ODS_BADGE_COLOR> = {
  CREATING: ODS_BADGE_COLOR.information,
  DELETING: ODS_BADGE_COLOR.critical,
  ERROR: ODS_BADGE_COLOR.critical,
  READY: ODS_BADGE_COLOR.success,
  SUSPENDED: ODS_BADGE_COLOR.warning,
  UPDATING: ODS_BADGE_COLOR.information,
};

const getColorVaultStatus = (status: ResourceStatus) =>
  VaultStatusColor[status] ?? ODS_BADGE_COLOR.information;

export const VaultStatusCell = (vaultResource: VaultResource) => {
  const { t } = useTranslation(NAMESPACES.STATUS);
  return (
    <DataGridTextCell>
      <OdsBadge
        color={getColorVaultStatus(vaultResource.resourceStatus)}
        label={t(vaultResource.resourceStatus.toLowerCase())}
      />
    </DataGridTextCell>
  );
};
