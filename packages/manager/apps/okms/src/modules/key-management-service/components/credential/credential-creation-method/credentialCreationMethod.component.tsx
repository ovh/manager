import { useTranslation } from 'react-i18next';

import { Text } from '@ovhcloud/ods-react';

type CredentialCreationMethodProps = {
  fromCSR: boolean;
  'data-testid'?: string;
};

const CredentialCreationMethod = ({
  fromCSR,
  'data-testid': dataTestId,
}: CredentialCreationMethodProps) => {
  const { t } = useTranslation('key-management-service/credential');

  return (
    <Text preset="span" data-testid={dataTestId}>
      {fromCSR
        ? t('key_management_service_credential_created_with_csr')
        : t('key_management_service_credential_created_without_csr')}
    </Text>
  );
};

export default CredentialCreationMethod;
