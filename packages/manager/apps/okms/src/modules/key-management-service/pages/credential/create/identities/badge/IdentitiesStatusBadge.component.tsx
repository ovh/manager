import { IdentityStatus } from '@key-management-service/types/identity.type';
import { useTranslation } from 'react-i18next';

import { Badge, BadgeProp } from '@ovhcloud/ods-react';

const chipPropsByStatus: {
  [key in IdentityStatus]: {
    translationKey: string;
    color: BadgeProp['color'];
  };
} = {
  [IdentityStatus.password_change_required]: {
    translationKey: 'key_management_service_credential_identity_status_password_change_required',
    color: 'warning',
  },
  [IdentityStatus.disabled]: {
    translationKey: 'key_management_service_credential_identity_status_disabled',
    color: 'critical',
  },
  [IdentityStatus.ok]: {
    translationKey: 'key_management_service_credential_identity_status_ok',
    color: 'success',
  },
};

type IdentitiesStatusBadgeProps = {
  size?: BadgeProp['size'];
  status: IdentityStatus;
} & Record<string, string>;

const IdentitiesStatusBadge = ({
  status,
  size = 'md',
  ...otherProps
}: IdentitiesStatusBadgeProps) => {
  const { t } = useTranslation('key-management-service/credential');
  const props = chipPropsByStatus[status];

  return (
    <Badge size={size} color={props?.color || 'neutral'} {...otherProps}>
      {props ? t(props.translationKey) : status}
    </Badge>
  );
};

export default IdentitiesStatusBadge;
