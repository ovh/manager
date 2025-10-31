import React from 'react';
import { useTranslation } from 'react-i18next';
import { OdsMessage } from '@ovhcloud/ods-components/react';

export const KeyValuesEditorErrorMessage = () => {
  const { t } = useTranslation(['secret-manager']);
  return (
    <OdsMessage color="danger" isDismissible={false}>
      {t('error_key_value_conversion')}
    </OdsMessage>
  );
};
