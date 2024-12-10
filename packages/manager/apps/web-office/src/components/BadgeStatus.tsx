import React, { useMemo } from 'react';
import { OdsBadge } from '@ovhcloud/ods-components/react';
import { ODS_BADGE_COLOR } from '@ovhcloud/ods-components';
import { UserStateEnum } from '@/api/api.type';

export type BadgeStatusProps = {
  itemStatus: string;
  t: any;
  translationPrefixKey: string;
  'data-testid'?: string;
};

const getStatusColor = (status: string) => {
  switch (status) {
    case UserStateEnum.OK:
      return ODS_BADGE_COLOR.success;
    case UserStateEnum.DELETING:
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
      label={props.t(`${props.translationPrefixKey}${props.itemStatus}`)}
    />
  );
};
