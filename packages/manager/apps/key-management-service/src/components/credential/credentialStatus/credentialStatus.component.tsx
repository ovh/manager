import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  ODS_CHIP_SIZE,
  ODS_TEXT_COLOR_INTENT,
  OdsChipAttribute,
} from '@ovhcloud/ods-components';
import { OsdsChip } from '@ovhcloud/ods-components/react';
import { OkmsCredentialStatus } from '@/types/okmsCredential.type';

export type KeyStatusProps = Omit<OdsChipAttribute, 'color'> & {
  state: OkmsCredentialStatus;
};

export const CredentialStatus = ({
  state,
  size = ODS_CHIP_SIZE.md,
  ...otherProps
}: KeyStatusProps) => {
  const { t } = useTranslation('key-management-service/credential');

  const chipPropsByState: {
    [key in OkmsCredentialStatus]: {
      translationKey: string;
      color: ODS_TEXT_COLOR_INTENT;
    };
  } = {
    [OkmsCredentialStatus.creating]: {
      translationKey: 'key_management_service_credential_status_creating',
      color: ODS_TEXT_COLOR_INTENT.primary,
    },
    [OkmsCredentialStatus.deleting]: {
      translationKey: 'key_management_service_credential_status_deleting',
      color: ODS_TEXT_COLOR_INTENT.warning,
    },
    [OkmsCredentialStatus.error]: {
      translationKey: 'key_management_service_credential_status_error',
      color: ODS_TEXT_COLOR_INTENT.error,
    },
    [OkmsCredentialStatus.expired]: {
      translationKey: 'key_management_service_credential_status_expired',
      color: ODS_TEXT_COLOR_INTENT.default,
    },
    [OkmsCredentialStatus.ready]: {
      translationKey: 'key_management_service_credential_status_ready',
      color: ODS_TEXT_COLOR_INTENT.success,
    },
  };

  const props = chipPropsByState[state];

  return (
    <OsdsChip
      size={size}
      color={props?.color || ODS_TEXT_COLOR_INTENT.default}
      {...otherProps}
    >
      {props ? t(props.translationKey) : state}
    </OsdsChip>
  );
};
