import React from 'react';
import { useTranslation } from 'react-i18next';
import { ODS_BADGE_SIZE, ODS_BADGE_COLOR } from '@ovhcloud/ods-components';
import { OdsBadge } from '@ovhcloud/ods-components/react';
import { OkmsServiceKeyState } from '@/types/okmsServiceKey.type';

export type KeyStatusProps = {
  size?: ODS_BADGE_SIZE;
  state: OkmsServiceKeyState;
} & Record<string, string>;

export const ServiceKeyStatus = ({
  state,
  size = ODS_BADGE_SIZE.md,
  ...props
}: KeyStatusProps) => {
  const { t } = useTranslation('key-management-service/serviceKeys');

  let label = '';
  let color: ODS_BADGE_COLOR;

  switch (state) {
    case OkmsServiceKeyState.active:
      label = t(
        'key_management_service_service-keys_dashboard_field_state_active',
      );
      color = ODS_BADGE_COLOR.success;
      break;

    case OkmsServiceKeyState.compromised:
      label = t(
        'key_management_service_service-keys_dashboard_field_state_compromised',
      );
      color = ODS_BADGE_COLOR.warning;
      break;

    case OkmsServiceKeyState.deactivated:
      label = t(
        'key_management_service_service-keys_dashboard_field_state_deactivated',
      );
      color = ODS_BADGE_COLOR.warning;
      break;

    case OkmsServiceKeyState.destroyed:
      label = t(
        'key_management_service_service-keys_dashboard_field_state_destroyed',
      );
      color = ODS_BADGE_COLOR.critical;
      break;

    case OkmsServiceKeyState.destroyed_compromised:
      label = t(
        'key_management_service_service-keys_dashboard_field_state_destroyed_compromised',
      );
      color = ODS_BADGE_COLOR.critical;
      break;

    case OkmsServiceKeyState.pre_active:
      label = t(
        'key_management_service_service-keys_dashboard_field_state_pre_active',
      );
      color = ODS_BADGE_COLOR.information;
      break;

    default:
      label = state;
      color = ODS_BADGE_COLOR.neutral;
      break;
  }

  return <OdsBadge size={size} color={color} label={label} {...props} />;
};
