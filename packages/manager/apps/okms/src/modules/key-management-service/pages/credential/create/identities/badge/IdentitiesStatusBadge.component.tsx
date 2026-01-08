import { IdentityStatus } from '@key-management-service/types/identity.type';
import { useTranslation } from 'react-i18next';

import { Badge, BadgeColor, BadgeProp } from '@ovhcloud/ods-react';

const colors: Record<IdentityStatus, BadgeColor> = {
  PASSWORD_CHANGE_REQUIRED: 'warning',
  DISABLED: 'critical',
  OK: 'success',
};

type IdentitiesStatusBadgeProps = {
  status: IdentityStatus;
} & Omit<BadgeProp, 'color' | 'children'>;

const IdentitiesStatusBadge = ({ status, size = 'md', ...rest }: IdentitiesStatusBadgeProps) => {
  const { t } = useTranslation('key-management-service/credential');

  const labels: Record<IdentityStatus, string> = {
    PASSWORD_CHANGE_REQUIRED: t(
      'key_management_service_credential_identity_status_password_change_required',
    ),
    DISABLED: t('key_management_service_credential_identity_status_disabled'),
    OK: t('key_management_service_credential_identity_status_ok'),
  };

  return (
    <Badge size={size} color={colors[status] || 'neutral'} {...rest}>
      {labels[status]}
    </Badge>
  );
};

export default IdentitiesStatusBadge;
