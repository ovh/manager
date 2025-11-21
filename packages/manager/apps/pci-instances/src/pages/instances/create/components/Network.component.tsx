import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Text } from '@ovhcloud/ods-react';
import NetworkHelper from './network/NetworkHelper.component';

const Network: FC = () => {
  const { t } = useTranslation('creation');

  return (
    <section>
      <div className="flex items-center space-x-4">
        <Text preset="heading-3">
          {t('creation:pci_instance_creation_network_setting_title')}
        </Text>
        <NetworkHelper />
      </div>
      <Text preset="heading-4" className="mt-4">
        {t(
          'creation:pci_instance_creation_network_private_network_setting_title',
        )}
      </Text>
      <Text className="mt-4" preset="paragraph">
        {t(
          'creation:pci_instance_creation_network_private_network_setting_description',
        )}
      </Text>
    </section>
  );
};

export default Network;
