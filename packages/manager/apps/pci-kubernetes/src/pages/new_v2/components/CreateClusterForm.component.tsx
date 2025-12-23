import { useTranslation } from 'react-i18next';

import { Text } from '@ovhcloud/ods-react';

export const CreateClusterForm = () => {
  const { t } = useTranslation('add');

  return <Text preset="heading-2">{t('kubernetes_add')}</Text>;
};
