import { useTranslation } from 'react-i18next';

import { OdsMessage } from '@ovhcloud/ods-components/react';

export const KeyValuesErrorMessage = () => {
  const { t } = useTranslation(['secret-manager']);
  return (
    <OdsMessage color="information" isDismissible={false}>
      {t('error_key_value_conversion')}
    </OdsMessage>
  );
};
