import React, { useMemo } from 'react';
import { Badge, BADGE_COLOR } from '@ovhcloud/ods-react';
import { ResourceStatus } from '@/data/api';

export type BadgeStatusProps = {
  status: keyof typeof ResourceStatus;
  'data-testid'?: string;
};

const getStatusColor = (status: string) => {
  switch (status) {
    case ResourceStatus.READY:
      return BADGE_COLOR.success;
    case ResourceStatus.ERROR:
      return BADGE_COLOR.critical;
    default:
      return BADGE_COLOR.information;
  }
};

export const BadgeStatus: React.FC<BadgeStatusProps> = (props) => {
  const statusColor = useMemo(() => getStatusColor(props.status), [
    props.status,
  ]);

  return (
    <Badge data-testid={props['data-testid']} color={statusColor}>
      {props.status}
    </Badge>
  );
};

export default BadgeStatus;
