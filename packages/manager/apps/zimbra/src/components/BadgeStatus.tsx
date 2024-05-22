import React from 'react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { OsdsChip } from '@ovhcloud/ods-components/react';
import { ResourceStatus } from '@/api/api.type';

export type BadgeStatusProps = {
  itemStatus: string;
};

export const BadgeStatus: React.FC<BadgeStatusProps> = ({ itemStatus }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case ResourceStatus.READY:
        return ODS_THEME_COLOR_INTENT.success;
      case ResourceStatus.ERROR:
        return ODS_THEME_COLOR_INTENT.error;
      default:
        return ODS_THEME_COLOR_INTENT.primary;
    }
  };

  const statusColor = getStatusColor(itemStatus);

  return (
    <OsdsChip inline color={statusColor}>
      {itemStatus}
    </OsdsChip>
  );
};
