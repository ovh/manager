import React from 'react';

import { useTranslation } from 'react-i18next';

import { BADGE_COLOR, BADGE_SIZE, Badge } from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';

import { ServiceStateEnum, UserStateEnum } from '@/data/api/ApiType';
import { StateEnum } from '@/data/api/service-infos/type';

export type OfficeStateProps = {
  size?: BADGE_SIZE;
  state: StateEnum | UserStateEnum | ServiceStateEnum;
} & Record<string, string>;

export const OfficeServiceState: React.FC<OfficeStateProps> = ({ state, ...props }) => {
  const { t } = useTranslation(NAMESPACES.STATUS);

  const { size, ...otherProps } = props;

  let label = '';
  let color: BADGE_COLOR;

  switch (state) {
    case StateEnum.OK:
    case UserStateEnum.OK:
      label = t('ok');
      color = BADGE_COLOR.success;
      break;
    case StateEnum.AUTO_RENEW_IN_PROGRESS:
      label = t('autorenewInProgress');
      color = BADGE_COLOR.information;
      break;
    case StateEnum.EXPIRED:
      label = t('expired');
      color = BADGE_COLOR.critical;
      break;
    case StateEnum.IN_CREATION:
    case UserStateEnum.CREATING:
      label = t('inCreation');
      color = BADGE_COLOR.information;
      break;
    case UserStateEnum.IN_MAINTENANCE:
      label = t('inMaintenance');
      color = BADGE_COLOR.information;
      break;
    case StateEnum.UNPAID:
      label = t('unPaid');
      color = BADGE_COLOR.critical;
      break;
    case UserStateEnum.SUSPENDED:
      label = t('suspended');
      color = BADGE_COLOR.critical;
      break;
    case UserStateEnum.SUSPENDING:
      label = t('suspending');
      color = BADGE_COLOR.critical;
      break;
    case UserStateEnum.DELETING:
      label = t('deleting');
      color = BADGE_COLOR.critical;
      break;
    case StateEnum.PENDING_DEBT:
      label = t('pendingDebt');
      color = BADGE_COLOR.information;
      break;
    default:
      label = state;
      color = BADGE_COLOR.neutral;
      break;
  }

  return (
    <Badge data-testid="badge-status" size={size || BADGE_SIZE.md} color={color} {...otherProps}>
      {label}
    </Badge>
  );
};
