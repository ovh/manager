import { useTranslation } from 'react-i18next';

import { OdsBadge } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { DataGridTextCell } from '@ovh-ux/manager-react-components';

import { Tenant } from '@/types/Tenant.type';
import { getStatusBadgeColor } from '@/utils/getStatusBadgeColor';

export const TenantStatusCell = (tenant: Tenant) => {
  const { t } = useTranslation(NAMESPACES.STATUS);

  return (
    <DataGridTextCell>
      <OdsBadge
        color={getStatusBadgeColor(tenant.resourceStatus)}
        label={t(`${tenant.resourceStatus.toLowerCase()}`)}
      />
    </DataGridTextCell>
  );
};
