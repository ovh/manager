import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  ODS_CHIP_SIZE,
  ODS_TEXT_COLOR_INTENT,
  OdsChipAttribute,
} from '@ovhcloud/ods-components';
import { OsdsChip } from '@ovhcloud/ods-components/react';
import { OkmsServiceKeyState } from '@/types/okmsServiceKey.type';

export type KeyStatusProps = Omit<OdsChipAttribute, 'color'> & {
  // eslint-disable-next-line @typescript-eslint/ban-types
  state: OkmsServiceKeyState | (string & {});
};

export const ServiceKeyStatus = ({ state, ...props }: KeyStatusProps) => {
  const { t } = useTranslation('key-management-service/serviceKeys');

  const { size, ...otherProps } = props;

  let label = '';
  let color: OdsChipAttribute['color'];

  switch (state) {
    case 'ACTIVE':
      label = t(
        'key_management_service_service-keys_dashboard_field_state_active',
      );
      color = ODS_TEXT_COLOR_INTENT.success;
      break;

    case 'COMPROMISED':
      label = t(
        'key_management_service_service-keys_dashboard_field_state_compromised',
      );
      color = ODS_TEXT_COLOR_INTENT.warning;
      break;

    case 'DEACTIVATED':
      label = t(
        'key_management_service_service-keys_dashboard_field_state_deactivated',
      );
      color = ODS_TEXT_COLOR_INTENT.warning;
      break;

    case 'DESTROYED':
      label = t(
        'key_management_service_service-keys_dashboard_field_state_destroyed',
      );
      color = ODS_TEXT_COLOR_INTENT.error;
      break;

    case 'DESTROYED_COMPROMISED':
      label = t(
        'key_management_service_service-keys_dashboard_field_state_destroyed_compromised',
      );
      color = ODS_TEXT_COLOR_INTENT.error;
      break;

    case 'PRE_ACTIVE':
      label = t(
        'key_management_service_service-keys_dashboard_field_state_pre_active',
      );
      color = ODS_TEXT_COLOR_INTENT.info;
      break;

    default:
      label = state;
      color = ODS_TEXT_COLOR_INTENT.default;
      break;
  }

  return (
    <OsdsChip size={size || ODS_CHIP_SIZE.md} color={color} {...otherProps}>
      {label}
    </OsdsChip>
  );
};
