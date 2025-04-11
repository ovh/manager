import { useTranslation } from 'react-i18next';
import { ODS_BADGE_COLOR, ODS_BADGE_SIZE } from '@ovhcloud/ods-components';
import { OdsBadge } from '@ovhcloud/ods-components/react';
import { StateEnum } from '@/api/serviceInfos';
import { UserStateEnum } from '@/api/api.type';

export type OfficeStateProps = {
  size?: ODS_BADGE_SIZE;
  state: StateEnum | UserStateEnum;
} & Record<string, string>;

export const OfficeServiceState = ({ state, ...props }: OfficeStateProps) => {
  const { t } = useTranslation('common');

  const { size, ...otherProps } = props;

  let label = '';
  let color: ODS_BADGE_COLOR;

  switch (state) {
    case StateEnum.OK:
    case UserStateEnum.OK:
      label = t('state_ok');
      color = ODS_BADGE_COLOR.success;
      break;
    case StateEnum.AUTO_RENEW_IN_PROGRESS:
      label = t('state_autorenewInProgress');
      color = ODS_BADGE_COLOR.information;
      break;
    case StateEnum.EXPIRED:
      label = t('state_expired');
      color = ODS_BADGE_COLOR.critical;
      break;
    case StateEnum.IN_CREATION:
    case UserStateEnum.CREATING:
      label = t('state_inCreation');
      color = ODS_BADGE_COLOR.information;
      break;
    case UserStateEnum.IN_MAINTENANCE:
      label = t('state_inMaintenance');
      color = ODS_BADGE_COLOR.information;
      break;
    case StateEnum.UNPAID:
      label = t('state_unPaid');
      color = ODS_BADGE_COLOR.critical;
      break;
    case UserStateEnum.SUSPENDED:
      label = t('state_suspended');
      color = ODS_BADGE_COLOR.critical;
      break;
    case UserStateEnum.SUSPENDING:
      label = t('state_suspending');
      color = ODS_BADGE_COLOR.critical;
      break;
    case UserStateEnum.DELETING:
      label = t('state_deleting');
      color = ODS_BADGE_COLOR.critical;
      break;
    case StateEnum.PENDING_DEBT:
      label = t('state_pendingDebt');
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
