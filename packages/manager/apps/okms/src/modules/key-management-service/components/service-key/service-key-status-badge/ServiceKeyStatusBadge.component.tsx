import { OkmsServiceKeyState } from '@key-management-service/types/okmsServiceKey.type';
import { useTranslation } from 'react-i18next';

import { Badge, BadgeColor, BadgeProp } from '@ovhcloud/ods-react';

const colors: Record<OkmsServiceKeyState, BadgeColor> = {
  ACTIVE: 'success',
  COMPROMISED: 'warning',
  DEACTIVATED: 'warning',
  DESTROYED: 'critical',
  DESTROYED_COMPROMISED: 'critical',
  PRE_ACTIVE: 'information',
};

export type KeyStatusProps = {
  state: OkmsServiceKeyState;
} & Omit<BadgeProp, 'color' | 'children'>;

export const ServiceKeyStatus = ({ state, size = 'md', ...rest }: KeyStatusProps) => {
  const { t } = useTranslation('key-management-service/serviceKeys');

  const labels: Record<OkmsServiceKeyState, string> = {
    ACTIVE: t('key_management_service_service-keys_dashboard_field_state_active'),
    COMPROMISED: t('key_management_service_service-keys_dashboard_field_state_compromised'),
    DEACTIVATED: t('key_management_service_service-keys_dashboard_field_state_deactivated'),
    DESTROYED: t('key_management_service_service-keys_dashboard_field_state_destroyed'),
    DESTROYED_COMPROMISED: t(
      'key_management_service_service-keys_dashboard_field_state_destroyed_compromised',
    ),
    PRE_ACTIVE: t('key_management_service_service-keys_dashboard_field_state_pre_active'),
  };

  return (
    <Badge size={size} color={colors[state] || 'neutral'} {...rest}>
      {labels[state] || state}
    </Badge>
  );
};
