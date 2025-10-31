import React from 'react';
import { OdsMessage } from '@ovhcloud/ods-components/react';
import { SecretVersionState } from '@secret-manager/types/secret.type';
import { useTranslation } from 'react-i18next';

export const VersionStatusMessage = ({
  state,
}: {
  state: SecretVersionState;
}) => {
  const { t } = useTranslation('secret-manager');

  if (state === 'ACTIVE') return null;

  return (
    <OdsMessage color="warning" className="mb-4" isDismissible={false}>
      {t('add_new_version_no_value_message')}
    </OdsMessage>
  );
};
