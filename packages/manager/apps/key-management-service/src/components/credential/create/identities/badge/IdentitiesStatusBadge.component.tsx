import React from 'react';
import { OsdsChip } from '@ovhcloud/ods-components/react';
import {
  ODS_CHIP_SIZE,
  ODS_TEXT_COLOR_INTENT,
  OdsChipAttribute,
} from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import { IdentityStatus } from '@/types/identity.type';

type IdentitiesStatusBadgeProps = Omit<OdsChipAttribute, 'color'> & {
  status: IdentityStatus;
};

const IdentitiesStatusBadge = ({
  status,
  size = ODS_CHIP_SIZE.md,
  ...otherProps
}: IdentitiesStatusBadgeProps) => {
  const { t } = useTranslation('key-management-service/credential');

  const chipPropsByStatus: {
    [key in IdentityStatus]: {
      translationKey: string;
      color: ODS_TEXT_COLOR_INTENT;
    };
  } = {
    [IdentityStatus.password_change_required]: {
      translationKey:
        'key_management_service_credential_identity_status_password_change_required',
      color: ODS_TEXT_COLOR_INTENT.warning,
    },
    [IdentityStatus.disabled]: {
      translationKey:
        'key_management_service_credential_identity_status_disabled',
      color: ODS_TEXT_COLOR_INTENT.error,
    },
    [IdentityStatus.ok]: {
      translationKey: 'key_management_service_credential_identity_status_ok',
      color: ODS_TEXT_COLOR_INTENT.success,
    },
  };

  const props = chipPropsByStatus[status];

  return (
    <OsdsChip
      size={size}
      color={props?.color || ODS_TEXT_COLOR_INTENT.default}
      {...otherProps}
    >
      {props ? t(props.translationKey) : status}
    </OsdsChip>
  );
};

export default IdentitiesStatusBadge;
