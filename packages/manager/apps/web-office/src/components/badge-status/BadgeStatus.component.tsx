import React, { useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import { BADGE_COLOR, Badge } from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';

import { UserStateEnum } from '@/data/api/ApiType';

export type BadgeStatusProps = {
  itemStatus: UserStateEnum;
  'data-testid'?: string;
};

const getStatusColor = (status: UserStateEnum) => {
  switch (status) {
    case UserStateEnum.OK:
      return BADGE_COLOR.success;
    case UserStateEnum.UNCONFIGURED:
      return BADGE_COLOR.warning;
    case UserStateEnum.DELETING:
      return BADGE_COLOR.critical;
    default:
      return BADGE_COLOR.information;
  }
};

export const BadgeStatus: React.FC<BadgeStatusProps> = (props) => {
  const { t } = useTranslation(['dashboard/users', NAMESPACES.STATUS]);
  const statusColor = useMemo(() => getStatusColor(props.itemStatus), [props.itemStatus]);

  const labelKey =
    props.itemStatus === UserStateEnum.OK
      ? `dashboard_users_status_${props.itemStatus}`
      : `${NAMESPACES.STATUS}:${props.itemStatus}`;

  return (
    <Badge data-testid={props['data-testid']} color={statusColor}>
      {t(labelKey)}
    </Badge>
  );
};
