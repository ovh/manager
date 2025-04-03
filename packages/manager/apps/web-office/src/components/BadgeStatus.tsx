import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { OdsBadge } from '@ovhcloud/ods-components/react';
import { ODS_BADGE_COLOR } from '@ovhcloud/ods-components';
import { UserStateEnum } from '@/api/api.type';

export type BadgeStatusProps = {
  itemStatus: string;
  'data-testid'?: string;
};

const getStatusColor = (status: string) => {
  switch (status) {
    case UserStateEnum.OK:
      return ODS_BADGE_COLOR.success;
    case UserStateEnum.UNCONFIGURED:
      return ODS_BADGE_COLOR.warning;
    case UserStateEnum.DELETING:
      return ODS_BADGE_COLOR.critical;
    default:
      return ODS_BADGE_COLOR.information;
  }
};

export const BadgeStatus: React.FC<BadgeStatusProps> = (props) => {
  const { t } = useTranslation('dashboard/users');
  const statusColor = useMemo(() => getStatusColor(props.itemStatus), [
    props.itemStatus,
  ]);

  return (
    <OdsBadge
      data-testid={props['data-testid']}
      color={statusColor}
      label={t(`dashboard_users_status_${props.itemStatus}`)}
    />
  );
};
