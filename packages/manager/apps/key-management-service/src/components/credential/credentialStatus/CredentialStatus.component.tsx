import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  ODS_BADGE_COLOR,
  ODS_BADGE_SIZE,
  OdsBadge as OdsBadgeType,
} from '@ovhcloud/ods-components';
import { OdsBadge } from '@ovhcloud/ods-components/react';
import { OkmsCredentialStatus } from '@/types/okmsCredential.type';

export type KeyStatusProps = Omit<
  OdsBadgeType,
  'render' | 'color' | 'label' | 'size'
> & {
  state: OkmsCredentialStatus;
  size?: ODS_BADGE_SIZE;
};

export const CredentialStatus = ({
  state,
  size = ODS_BADGE_SIZE.md,
  ...otherProps
}: KeyStatusProps) => {
  const { t } = useTranslation('key-management-service/credential');

  const chipPropsByState: {
    [key in OkmsCredentialStatus]: {
      translationKey: string;
      color: ODS_BADGE_COLOR;
    };
  } = {
    [OkmsCredentialStatus.creating]: {
      translationKey: 'key_management_service_credential_status_creating',
      color: ODS_BADGE_COLOR.information,
    },
    [OkmsCredentialStatus.deleting]: {
      translationKey: 'key_management_service_credential_status_deleting',
      color: ODS_BADGE_COLOR.warning,
    },
    [OkmsCredentialStatus.error]: {
      translationKey: 'key_management_service_credential_status_error',
      color: ODS_BADGE_COLOR.critical,
    },
    [OkmsCredentialStatus.expired]: {
      translationKey: 'key_management_service_credential_status_expired',
      color: ODS_BADGE_COLOR.neutral,
    },
    [OkmsCredentialStatus.ready]: {
      translationKey: 'key_management_service_credential_status_ready',
      color: ODS_BADGE_COLOR.success,
    },
  };

  const props = chipPropsByState[state];

  return (
    <OdsBadge
      label={props ? t(props.translationKey) : state}
      size={size}
      color={props?.color || ODS_BADGE_COLOR.neutral}
      {...otherProps}
    />
  );
};
