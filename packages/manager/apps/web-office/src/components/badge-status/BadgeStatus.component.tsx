import React, { useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import { ODS_BADGE_COLOR } from '@ovhcloud/ods-components';
import { OdsBadge } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';

import { UserStateEnum } from '@/data/api/ApiType';

export type BadgeStatusProps = {
  itemStatus: UserStateEnum;
  'data-testid'?: string;
};

const getStatusColor = (status: UserStateEnum) => {
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
  const { t } = useTranslation(['dashboard/users', NAMESPACES.STATUS]);
  const statusColor = useMemo(() => getStatusColor(props.itemStatus), [props.itemStatus]);

  const labelKey =
    props.itemStatus === UserStateEnum.OK
      ? `dashboard_users_status_${props.itemStatus}`
      : `${NAMESPACES.STATUS}:${props.itemStatus}`;

  return <OdsBadge data-testid={props['data-testid']} color={statusColor} label={t(labelKey)} />;
};
