import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  ODS_CHIP_SIZE,
  ODS_TEXT_COLOR_INTENT,
  OdsChipAttribute,
} from '@ovhcloud/ods-components';
import { OsdsChip } from '@ovhcloud/ods-components/react';
import { ResourceStatus } from '@ovh-ux/manager-react-components';

export type OkmsStateProps = Omit<OdsChipAttribute, 'color'> & {
  state: ResourceStatus;
};

export const OkmsServiceState = ({ state, ...props }: OkmsStateProps) => {
  const { t } = useTranslation('key-management-service/dashboard');

  const { size, ...otherProps } = props;

  let label = '';
  let color: OdsChipAttribute['color'];

  switch (state) {
    case 'active':
      label = t(
        'key_management_service_dashboard_dashboard_field_state_active',
      );
      color = ODS_TEXT_COLOR_INTENT.success;
      break;
    case 'deleted':
      label = t(
        'key_management_service_dashboard_dashboard_field_state_deleted',
      );
      color = ODS_TEXT_COLOR_INTENT.error;
      break;
    case 'suspended':
      label = t(
        'key_management_service_dashboard_dashboard_field_state_suspended',
      );
      color = ODS_TEXT_COLOR_INTENT.warning;
      break;
    case 'toActivate':
      label = t(
        'key_management_service_dashboard_dashboard_field_state_toActivate',
      );
      color = ODS_TEXT_COLOR_INTENT.info;
      break;
    case 'toDelete':
      label = t(
        'key_management_service_dashboard_dashboard_field_state_toDelete',
      );
      color = ODS_TEXT_COLOR_INTENT.default;
      break;
    case 'toSuspend':
      label = t(
        'key_management_service_dashboard_dashboard_field_state_toSuspend',
      );
      color = ODS_TEXT_COLOR_INTENT.default;
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
