import { SecretVersionState } from '@secret-manager/types/secret.type';
import { useTranslation } from 'react-i18next';

import { Message } from '@ovhcloud/ods-react';

export const VersionStatusMessage = ({ state }: { state: SecretVersionState }) => {
  const { t } = useTranslation('secret-manager');

  if (state === 'ACTIVE') return null;

  return (
    <Message color="warning" className="mb-4" dismissible={false}>
      {t('add_new_version_no_value_message')}
    </Message>
  );
};
