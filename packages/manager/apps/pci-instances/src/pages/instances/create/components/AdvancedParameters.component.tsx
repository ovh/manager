import { useTranslation } from 'react-i18next';
import { Text } from '@ovhcloud/ods-react';

export const AdvancedParameters = () => {
  const { t } = useTranslation('creation');

  return (
    <section>
      <hr className={'my-8 h-px w-full border-0 bg-gray-200'} />
      <Text preset="heading-2">
        {t('pci_instances_creation_advanced_parameters')}
      </Text>
    </section>
  );
};
