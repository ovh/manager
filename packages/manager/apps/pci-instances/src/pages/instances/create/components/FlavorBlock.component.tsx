import { Text } from '@ovhcloud/ods-react';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import FlavorHelper from './flavor/FlavorHelper.component';

const FlavorBlock: FC = () => {
  const { t } = useTranslation('creation');

  return (
    <section className="flex items-center space-x-4">
      <Text preset="heading-3">
        {t('pci_instance_creation_select_flavor_title')}
      </Text>
      <FlavorHelper />
    </section>
  );
};

export default FlavorBlock;
