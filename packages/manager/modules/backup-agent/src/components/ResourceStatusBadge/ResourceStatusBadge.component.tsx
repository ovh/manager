import { useTranslation } from 'react-i18next';

import { OdsBadge } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';

import { AgentStatus, ResourceStatus } from '@/types/Resource.type';

import { getColorResourceStatus } from './_utils/getResourceStatusColor.utils';

export type ResourceStatusBadgeProps = {
  resourceStatus: ResourceStatus | AgentStatus;
};

export const ResourceStatusBadge = ({ resourceStatus }: ResourceStatusBadgeProps) => {
  const { t } = useTranslation(NAMESPACES.STATUS);

  return (
    <OdsBadge
      color={getColorResourceStatus(resourceStatus)}
      label={t(resourceStatus.toLowerCase())}
    />
  );
};
