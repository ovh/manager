import { OkmsCredentialStatus } from '@key-management-service/types/okmsCredential.type';
import { useTranslation } from 'react-i18next';

import { Badge, BadgeColor, BadgeProp } from '@ovhcloud/ods-react';

const colors: Record<OkmsCredentialStatus, BadgeColor> = {
  CREATING: 'information',
  DELETING: 'warning',
  ERROR: 'critical',
  EXPIRED: 'neutral',
  READY: 'success',
};

export type CredentialStatusProps = {
  state: OkmsCredentialStatus;
} & Omit<BadgeProp, 'color' | 'children'>;

export const CredentialStatus = ({ state, size = 'md', ...rest }: CredentialStatusProps) => {
  const { t } = useTranslation('key-management-service/credential');

  const labels: Record<OkmsCredentialStatus, string> = {
    CREATING: t('key_management_service_credential_status_creating'),
    DELETING: t('key_management_service_credential_status_deleting'),
    ERROR: t('key_management_service_credential_status_error'),
    EXPIRED: t('key_management_service_credential_status_expired'),
    READY: t('key_management_service_credential_status_ready'),
  };

  return (
    <Badge size={size} color={colors[state] || 'neutral'} {...rest}>
      {labels[state] || state}
    </Badge>
  );
};
