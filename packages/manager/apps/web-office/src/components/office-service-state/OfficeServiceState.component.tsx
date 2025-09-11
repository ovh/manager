import React from 'react';

import { useTranslation } from 'react-i18next';

import { ODS_BADGE_COLOR, ODS_BADGE_SIZE } from '@ovhcloud/ods-components';
import { OdsBadge } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';

import { ServiceStateEnum, UserStateEnum } from '@/data/api/ApiType';
import { StateEnum } from '@/data/api/service-infos/type';

export type OfficeStateProps = {
  size?: ODS_BADGE_SIZE;
  state: StateEnum | UserStateEnum | ServiceStateEnum;
} & Record<string, string>;

export const OfficeServiceState: React.FC<OfficeStateProps> = ({ state, ...props }) => {
  const { t } = useTranslation(NAMESPACES.STATUS);

  const { size, ...otherProps } = props;

  let label = '';
  let color: ODS_BADGE_COLOR;

  switch (state) {
    case StateEnum.OK:
    case UserStateEnum.OK:
      label = t('ok');
      color = ODS_BADGE_COLOR.success;
      break;
    case StateEnum.AUTO_RENEW_IN_PROGRESS:
      label = t('autorenewInProgress');
      color = ODS_BADGE_COLOR.information;
      break;
    case StateEnum.EXPIRED:
      label = t('expired');
      color = ODS_BADGE_COLOR.critical;
      break;
    case StateEnum.IN_CREATION:
    case UserStateEnum.CREATING:
      label = t('inCreation');
      color = ODS_BADGE_COLOR.information;
      break;
    case UserStateEnum.IN_MAINTENANCE:
      label = t('inMaintenance');
      color = ODS_BADGE_COLOR.information;
      break;
    case StateEnum.UNPAID:
      label = t('unPaid');
      color = ODS_BADGE_COLOR.critical;
      break;
    case UserStateEnum.SUSPENDED:
      label = t('suspended');
      color = ODS_BADGE_COLOR.critical;
      break;
    case UserStateEnum.SUSPENDING:
      label = t('suspending');
      color = ODS_BADGE_COLOR.critical;
      break;
    case UserStateEnum.DELETING:
      label = t('deleting');
      color = ODS_BADGE_COLOR.critical;
      break;
    case StateEnum.PENDING_DEBT:
      label = t('pendingDebt');
      color = ODS_BADGE_COLOR.information;
      break;
    default:
      label = state;
      color = ODS_BADGE_COLOR.neutral;
      break;
  }

  return (
    <OdsBadge
      data-testid="badge-status"
      size={size || ODS_BADGE_SIZE.md}
      color={color}
      label={label}
      {...otherProps}
    />
  );
};
