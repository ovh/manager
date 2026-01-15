import { useTranslation } from 'react-i18next';

import { Message } from '@ovhcloud/ods-react';

export const KeyValuesErrorMessage = () => {
  const { t } = useTranslation(['secret-manager']);
  return (
    <Message color="information" dismissible={false}>
      {t('error_key_value_conversion')}
    </Message>
  );
};
