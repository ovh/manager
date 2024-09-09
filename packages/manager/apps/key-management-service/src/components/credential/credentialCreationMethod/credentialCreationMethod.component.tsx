import React from 'react';
import { useTranslation } from 'react-i18next';
import { TileValue } from '@/components/dashboard/tile-value/tileValue.component';
import { OkmsCredential } from '@/types/okmsCredential.type';

type TCredentialCreationMethod = Pick<OkmsCredential, 'fromCSR'>;

const CredentialCreationMethod = ({ fromCSR }: TCredentialCreationMethod) => {
  const { t } = useTranslation('key-management-service/credential');

  return (
    <TileValue
      value={
        fromCSR
          ? t('key_management_service_credential_created_with_csr')
          : t('key_management_service_credential_created_without_csr')
      }
    />
  );
};

export default CredentialCreationMethod;
