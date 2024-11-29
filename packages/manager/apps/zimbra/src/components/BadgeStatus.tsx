import React, { useMemo } from 'react';
import { OdsBadge } from '@ovhcloud/ods-components/react';
import { ODS_BADGE_COLOR } from '@ovhcloud/ods-components';
import { ResourceStatus } from '@/api/api.type';

export type BadgeStatusProps = {
  itemStatus: string;
  'data-testid'?: string;
};

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

export const BadgeStatus: React.FC<BadgeStatusProps> = (props) => {
  const statusColor = useMemo(() => getStatusColor(props.itemStatus), [
    props.itemStatus,
  ]);

  return (
    <OdsBadge
      data-testid={props['data-testid']}
      color={statusColor}
      label={props.itemStatus}
    />
  );
};
