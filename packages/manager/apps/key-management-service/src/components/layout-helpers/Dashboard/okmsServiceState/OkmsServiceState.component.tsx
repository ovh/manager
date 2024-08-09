import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  ODS_CHIP_SIZE,
  ODS_TEXT_COLOR_INTENT,
  OdsChipAttribute,
} from '@ovhcloud/ods-components';
import { OsdsChip } from '@ovhcloud/ods-components/react';
import { OkmsState } from '@/types/okmsService.type';

export type OkmsStateProps = Omit<OdsChipAttribute, 'color'> & {
  state: OkmsState | string;
};

export const OkmsServiceState = ({ state, ...props }: OkmsStateProps) => {
  const { t } = useTranslation('key-management-service/dashboard');

  const { size, ...otherProps } = props;

  let label = '';
  let color: OdsChipAttribute['color'];

  switch (state) {
    case OkmsState.Active:
      label = t(
        'key_management_service_dashboard_dashboard_field_state_active',
      );
      color = ODS_TEXT_COLOR_INTENT.success;
      break;
    case OkmsState.Deleted:
      label = t(
        'key_management_service_dashboard_dashboard_field_state_deleted',
      );
      color = ODS_TEXT_COLOR_INTENT.error;
      break;
    case OkmsState.Suspended:
      label = t(
        'key_management_service_dashboard_dashboard_field_state_suspended',
      );
      color = ODS_TEXT_COLOR_INTENT.warning;
      break;
    case OkmsState.ToActivate:
      label = t(
        'key_management_service_dashboard_dashboard_field_state_toActivate',
      );
      color = ODS_TEXT_COLOR_INTENT.info;
      break;
    case OkmsState.ToDelete:
      label = t(
        'key_management_service_dashboard_dashboard_field_state_toDelete',
      );
      color = ODS_TEXT_COLOR_INTENT.default;
      break;
    case OkmsState.ToSuspend:
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
