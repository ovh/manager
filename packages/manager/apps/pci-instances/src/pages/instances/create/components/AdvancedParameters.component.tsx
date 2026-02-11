import { useTranslation } from 'react-i18next';
import { Divider, Text } from '@ovhcloud/ods-react';
import { FlexInstance } from './FlexInstance.component';
import PostInstallScript from './PostInstallScript.component';

export const AdvancedParameters = () => {
  const { t } = useTranslation('creation');

  return (
    <section className="pt-4">
      <Divider spacing="48" />
      <Text preset="heading-2">
        {t('pci_instances_creation_advanced_parameters')}
      </Text>
      <FlexInstance />
      <PostInstallScript />
    </section>
  );
};
