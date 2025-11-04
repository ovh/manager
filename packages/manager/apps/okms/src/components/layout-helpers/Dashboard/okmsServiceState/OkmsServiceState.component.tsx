import React from 'react';
import { useTranslation } from 'react-i18next';
import { ODS_BADGE_COLOR, ODS_BADGE_SIZE } from '@ovhcloud/ods-components';
import { OdsBadge } from '@ovhcloud/ods-components/react';
import { ResourceStatus } from '@ovh-ux/manager-react-components';

export type OkmsStateProps = {
  size?: ODS_BADGE_SIZE;
  state: ResourceStatus;
  'data-testid'?: string;
} & Record<string, string>;

export const OkmsServiceState = ({ state, ...props }: OkmsStateProps) => {
  const { t } = useTranslation('key-management-service/dashboard');

  const { size, ...otherProps } = props;

  let label = '';
  let color: ODS_BADGE_COLOR;

  switch (state) {
    case 'active':
      label = t(
        'key_management_service_dashboard_dashboard_field_state_active',
      );
      color = ODS_BADGE_COLOR.success;
      break;
    case 'deleted':
      label = t(
        'key_management_service_dashboard_dashboard_field_state_deleted',
      );
      color = ODS_BADGE_COLOR.critical;
      break;
    case 'suspended':
      label = t(
        'key_management_service_dashboard_dashboard_field_state_suspended',
      );
      color = ODS_BADGE_COLOR.warning;
      break;
    case 'toActivate':
      label = t(
        'key_management_service_dashboard_dashboard_field_state_toActivate',
      );
      color = ODS_BADGE_COLOR.information;
      break;
    case 'toDelete':
      label = t(
        'key_management_service_dashboard_dashboard_field_state_toDelete',
      );
      color = ODS_BADGE_COLOR.neutral;
      break;
    case 'toSuspend':
      label = t(
        'key_management_service_dashboard_dashboard_field_state_toSuspend',
      );
      color = ODS_BADGE_COLOR.neutral;
      break;
    default:
      label = state;
      color = ODS_BADGE_COLOR.neutral;
      break;
  }

  return (
    <OdsBadge
      size={size || ODS_BADGE_SIZE.md}
      color={color}
      label={label}
      {...otherProps}
    />
  );
};
