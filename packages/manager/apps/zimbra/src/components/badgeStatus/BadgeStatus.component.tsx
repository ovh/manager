import React, { useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import { ODS_BADGE_COLOR } from '@ovhcloud/ods-components';
import { OdsBadge } from '@ovhcloud/ods-components/react';

import { ResourceStatus } from '@/data/api';

export type BadgeStatusProps = {
  status: keyof typeof ResourceStatus;
  'data-testid'?: string;
};

const ResourceStatusLabels: Record<keyof typeof ResourceStatus, string> = {
  [ResourceStatus.CREATING]: 'service_state_creating',
  [ResourceStatus.DELETING]: 'service_state_deleting',
  [ResourceStatus.ERROR]: 'service_state_error',
  [ResourceStatus.READY]: 'service_state_ready',
  [ResourceStatus.SUSPENDED]: 'service_state_suspended',
  [ResourceStatus.UPDATING]: 'service_state_updating',
};

const getStatusColor = (status: keyof typeof ResourceStatus) => {
  switch (status) {
    case ResourceStatus.READY:
      return ODS_BADGE_COLOR.success;
    case ResourceStatus.ERROR:
      return ODS_BADGE_COLOR.critical;
    default:
      return ODS_BADGE_COLOR.information;
  }
};

export const BadgeStatus: React.FC<BadgeStatusProps> = (props) => {
  const { t } = useTranslation();
  const statusColor = useMemo(() => getStatusColor(props.status), [props.status]);

  return (
    <OdsBadge
      data-testid={props['data-testid']}
      color={statusColor}
      className="capitalize"
      label={t(ResourceStatusLabels[props.status]) ?? props.status}
    />
  );
};

export default BadgeStatus;
