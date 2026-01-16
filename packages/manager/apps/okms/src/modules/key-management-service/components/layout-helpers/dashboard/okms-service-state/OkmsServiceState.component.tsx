import { useTranslation } from 'react-i18next';

import { Badge, BadgeProp } from '@ovhcloud/ods-react';

import { ResourceStatus } from '@ovh-ux/manager-react-components';

export type OkmsStateProps = {
  size?: BadgeProp['size'];
  state: ResourceStatus;
  'data-testid'?: string;
} & Record<string, string>;

export const OkmsServiceState = ({ state, ...props }: OkmsStateProps) => {
  const { t } = useTranslation('key-management-service/dashboard');

  const { size, ...otherProps } = props;

  let label = '';
  let color: BadgeProp['color'];

  switch (state) {
    case 'active':
      label = t('key_management_service_dashboard_dashboard_field_state_active');
      color = 'success';
      break;
    case 'deleted':
      label = t('key_management_service_dashboard_dashboard_field_state_deleted');
      color = 'critical';
      break;
    case 'suspended':
      label = t('key_management_service_dashboard_dashboard_field_state_suspended');
      color = 'warning';
      break;
    case 'toActivate':
      label = t('key_management_service_dashboard_dashboard_field_state_toActivate');
      color = 'information';
      break;
    case 'toDelete':
      label = t('key_management_service_dashboard_dashboard_field_state_toDelete');
      color = 'neutral';
      break;
    case 'toSuspend':
      label = t('key_management_service_dashboard_dashboard_field_state_toSuspend');
      color = 'neutral';
      break;
    default:
      label = state;
      color = 'neutral';
      break;
  }

  return (
    <Badge size={size || 'md'} color={color} {...otherProps}>
      {label}
    </Badge>
  );
};
