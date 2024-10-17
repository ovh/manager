import React from 'react';
import { OdsBadge } from '@ovhcloud/ods-components/react';
import { ODS_BADGE_COLOR } from '@ovhcloud/ods-components';
import { ResourceStatus } from '@/api/api.type';

export type BadgeStatusProps = {
  itemStatus: string;
};

export const BadgeStatus: React.FC<BadgeStatusProps> = ({ itemStatus }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case ResourceStatus.READY:
        return ODS_BADGE_COLOR.success;
      case ResourceStatus.ERROR:
        return ODS_BADGE_COLOR.critical;
      default:
        return ODS_BADGE_COLOR.information;
    }
  };

  const statusColor = getStatusColor(itemStatus);

  return <OdsBadge color={statusColor} label={itemStatus} />;
};
