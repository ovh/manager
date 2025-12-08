import { useState } from 'react';

import { useSecretVersionWithData } from '@secret-manager/data/hooks/useSecretVersion';
import { SecretData, SecretVersion } from '@secret-manager/types/secret.type';
import { isKeyValueObject } from '@secret-manager/utils/key-value/keyValue';
import { useTranslation } from 'react-i18next';

import { OdsMessage, OdsSpinner } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';

import { SecretValueClipboards } from './SecretValueClipboards.component';
import { SecretValueRaw } from './SecretValueRaw.component';
import { SecretValueToggle, SecretValueToggleState } from './SecretValueToggle.component';

type SecretValueProps = {
  okmsId: string;
  secretPath: string;
  version: SecretVersion;
};

export const SecretValue = ({ okmsId, secretPath, version }: SecretValueProps) => {
  const { t } = useTranslation([NAMESPACES.ERROR]);
  const {
    data: secretVersion,
    isPending,
    error,
  } = useSecretVersionWithData({ okmsId, secretPath, version: version.id });

  if (isPending)
    return (
      <div className="flex h-48 items-center justify-center">
        <OdsSpinner />
      </div>
    );

  if (error)
    return (
      <OdsMessage className="mt-4" color="critical">
        {t('error_message', { message: error.response.data.message, ns: NAMESPACES.ERROR })}
      </OdsMessage>
    );

  return <SecretValueContent data={secretVersion.data} />;
};

type SecretValueContentProps = {
  data: SecretData;
};

const SecretValueContent = ({ data }: SecretValueContentProps) => {
  const [toggleState, setToggleState] = useState<SecretValueToggleState>(
    isKeyValueObject(data) ? 'key-value' : 'json',
  );

  return (
    <div className="space-y-6">
      <SecretValueToggle state={toggleState} onChange={setToggleState} />
      {toggleState === 'key-value' ? (
        <SecretValueClipboards data={data} />
      ) : (
        <SecretValueRaw data={data} />
      )}
    </div>
  );
};
