import { OkmsCredentialStatus } from '@key-management-service/types/okmsCredential.type';
import { useTranslation } from 'react-i18next';

import { Badge, BadgeProp } from '@ovhcloud/ods-react';

export type CredentialStatusProps = Omit<BadgeProp, 'color' | 'size' | 'children'> & {
  state: OkmsCredentialStatus;
  size?: BadgeProp['size'];
};

export const CredentialStatus = ({ state, size = 'md', ...otherProps }: CredentialStatusProps) => {
  const { t } = useTranslation('key-management-service/credential');

  const chipPropsByState: {
    [key in OkmsCredentialStatus]: {
      translationKey: string;
      color: BadgeProp['color'];
    };
  } = {
    [OkmsCredentialStatus.creating]: {
      translationKey: 'key_management_service_credential_status_creating',
      color: 'information',
    },
    [OkmsCredentialStatus.deleting]: {
      translationKey: 'key_management_service_credential_status_deleting',
      color: 'warning',
    },
    [OkmsCredentialStatus.error]: {
      translationKey: 'key_management_service_credential_status_error',
      color: 'critical',
    },
    [OkmsCredentialStatus.expired]: {
      translationKey: 'key_management_service_credential_status_expired',
      color: 'neutral',
    },
    [OkmsCredentialStatus.ready]: {
      translationKey: 'key_management_service_credential_status_ready',
      color: 'success',
    },
  };

  const props = chipPropsByState[state];

  return (
    <Badge size={size} color={props?.color || 'neutral'} {...otherProps}>
      {props ? t(props.translationKey) : state}
    </Badge>
  );
};
