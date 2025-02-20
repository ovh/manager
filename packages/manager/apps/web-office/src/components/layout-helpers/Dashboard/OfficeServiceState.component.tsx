import { useTranslation } from 'react-i18next';
import { ODS_BADGE_COLOR, ODS_BADGE_SIZE } from '@ovhcloud/ods-components';
import { OdsBadge } from '@ovhcloud/ods-components/react';
import { StateEnum } from '@/api/serviceInfos';

export type OfficeStateProps = {
  size?: ODS_BADGE_SIZE;
  state: StateEnum;
} & Record<string, string>;

export const OfficeServiceState = ({ state, ...props }: OfficeStateProps) => {
  const { t } = useTranslation('common');

  const { size, ...otherProps } = props;

  let label = '';
  let color: ODS_BADGE_COLOR;

  switch (state) {
    case StateEnum.Ok:
      label = t('state_ok');
      color = ODS_BADGE_COLOR.success;
      break;
    case StateEnum.AutoRenewInProgress:
      label = t('state_autorenewInProgress');
      color = ODS_BADGE_COLOR.information;
      break;
    case StateEnum.Expired:
      label = t('state_expired');
      color = ODS_BADGE_COLOR.critical;
      break;
    case StateEnum.InCreation:
      label = t('state_inCreation');
      color = ODS_BADGE_COLOR.information;
      break;
    case StateEnum.UnPaid:
      label = t('state_unPaid');
      color = ODS_BADGE_COLOR.critical;
      break;
    case StateEnum.PendingDebt:
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
