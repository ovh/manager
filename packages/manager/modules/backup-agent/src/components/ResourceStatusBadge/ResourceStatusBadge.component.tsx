import { useTranslation } from 'react-i18next';

import { OdsBadge } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';

import { ResourceStatus } from '@/types/Resource.type';

import { getColorResourceStatus } from './_utils/getResourceStatusColor.utils';

export type ResourceStatusBadgeProps = {
  vaultStatus: ResourceStatus;
};

export const ResourceStatusBadge = ({ vaultStatus }: ResourceStatusBadgeProps) => {
  const { t } = useTranslation(NAMESPACES.STATUS);

  return (
    <OdsBadge
      color={getColorResourceStatus(vaultStatus)}
      label={t(vaultStatus.toLowerCase())}
      data-testid="badge"
    />
  );
};
