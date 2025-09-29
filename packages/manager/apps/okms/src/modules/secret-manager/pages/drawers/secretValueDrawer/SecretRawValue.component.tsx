import React from 'react';
import {
  OdsCode,
  OdsMessage,
  OdsSpinner,
} from '@ovhcloud/ods-components/react';
import { useSecretVersionWithData } from '@secret-manager/data/hooks/useSecretVersion';
import { SecretVersion } from '@secret-manager/types/secret.type';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useTranslation } from 'react-i18next';
import { decodeSecretPath } from '@secret-manager/utils/secretPath';
import { SECRET_RAW_VALUE_TEST_ID } from './SecretRawValue.contants';

type SecretValueParams = {
  okmsId: string;
  secretPath: string;
  version: SecretVersion;
};

export const SecretRawValue = ({
  okmsId,
  secretPath,
  version,
}: SecretValueParams) => {
  const secretPathDecoded = decodeSecretPath(secretPath);

  const { t } = useTranslation([NAMESPACES.ERROR]);
  const { data: secretVersion, isPending, error } = useSecretVersionWithData(
    okmsId,
    secretPathDecoded,
    version.id,
  );

  if (isPending)
    return (
      <div className="flex justify-center">
        <OdsSpinner />
      </div>
    );

  if (error)
    return (
      <OdsMessage className="mt-4" color="critical">
        {t('error_message', { message: error.message, ns: NAMESPACES.ERROR })}
      </OdsMessage>
    );

  return (
    <OdsCode className="block break-all" data-testid={SECRET_RAW_VALUE_TEST_ID}>
      {JSON.stringify(secretVersion.data, null, 2)}
    </OdsCode>
  );
};
