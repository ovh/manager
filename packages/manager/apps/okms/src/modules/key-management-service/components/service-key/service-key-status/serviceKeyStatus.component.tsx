import { OkmsServiceKeyState } from '@key-management-service/types/okmsServiceKey.type';
import { useTranslation } from 'react-i18next';

import { Badge, BadgeProp } from '@ovhcloud/ods-react';

export type KeyStatusProps = {
  size?: BadgeProp['size'];
  state: OkmsServiceKeyState;
} & Record<string, string>;

export const ServiceKeyStatus = ({ state, size = 'md', ...props }: KeyStatusProps) => {
  const { t } = useTranslation('key-management-service/serviceKeys');

  let label = '';
  let color: BadgeProp['color'];

  switch (state) {
    case OkmsServiceKeyState.active:
      label = t('key_management_service_service-keys_dashboard_field_state_active');
      color = 'success';
      break;

    case OkmsServiceKeyState.compromised:
      label = t('key_management_service_service-keys_dashboard_field_state_compromised');
      color = 'warning';
      break;

    case OkmsServiceKeyState.deactivated:
      label = t('key_management_service_service-keys_dashboard_field_state_deactivated');
      color = 'warning';
      break;

    case OkmsServiceKeyState.destroyed:
      label = t('key_management_service_service-keys_dashboard_field_state_destroyed');
      color = 'critical';
      break;

    case OkmsServiceKeyState.destroyed_compromised:
      label = t('key_management_service_service-keys_dashboard_field_state_destroyed_compromised');
      color = 'critical';
      break;

    case OkmsServiceKeyState.pre_active:
      label = t('key_management_service_service-keys_dashboard_field_state_pre_active');
      color = 'information';
      break;

    default:
      label = state;
      color = 'neutral';
      break;
  }

  return (
    <Badge size={size} color={color} {...props}>
      {label}
    </Badge>
  );
};
