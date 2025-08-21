import { useTranslation } from 'react-i18next';
import { Text } from '@ovhcloud/ods-react';

export const AdvancedParameters = () => {
  const { t } = useTranslation('creation');

  return (
    <section>
      <hr className={'h-px my-8 bg-gray-200 border-0 w-full'} />
      <Text preset="heading-2">
        {t('pci_instances_creation_advanced_parameters')}
      </Text>
      <Text preset="paragraph">
        Lorem ipsum dolor sit amet consectetur. Tempor malesuada sit a bibendum
        sit tempus pretium imperdiet
      </Text>
    </section>
  );
};
