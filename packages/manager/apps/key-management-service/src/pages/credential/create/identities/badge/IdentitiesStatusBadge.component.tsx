import React from 'react';
import { OdsBadge } from '@ovhcloud/ods-components/react';
import { ODS_BADGE_COLOR, ODS_BADGE_SIZE } from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import { IdentityStatus } from '@/types/identity.type';

const chipPropsByStatus: {
  [key in IdentityStatus]: {
    translationKey: string;
    color: ODS_BADGE_COLOR;
  };
} = {
  [IdentityStatus.password_change_required]: {
    translationKey:
      'key_management_service_credential_identity_status_password_change_required',
    color: ODS_BADGE_COLOR.warning,
  },
  [IdentityStatus.disabled]: {
    translationKey:
      'key_management_service_credential_identity_status_disabled',
    color: ODS_BADGE_COLOR.critical,
  },
  [IdentityStatus.ok]: {
    translationKey: 'key_management_service_credential_identity_status_ok',
    color: ODS_BADGE_COLOR.success,
  },
};

type IdentitiesStatusBadgeProps = {
  size?: ODS_BADGE_SIZE;
  status: IdentityStatus;
} & Record<string, string>;

const IdentitiesStatusBadge = ({
  status,
  size = ODS_BADGE_SIZE.md,
  ...otherProps
}: IdentitiesStatusBadgeProps) => {
  const { t } = useTranslation('key-management-service/credential');
  const props = chipPropsByStatus[status];

  return (
    <OdsBadge
      size={size}
      color={props?.color || ODS_BADGE_COLOR.neutral}
      {...otherProps}
      label={props ? t(props.translationKey) : status}
    />
  );
};

export default IdentitiesStatusBadge;
