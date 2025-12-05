import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FormField,
  FormFieldLabel,
  Select,
  SelectControl,
  SelectContent,
  Text,
} from '@ovhcloud/ods-react';
import NetworkHelper from './network/NetworkHelper.component';
import { mockedPrivateNetworks } from '@/__mocks__/instance/constants';

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
      <FormField className="my-4 max-w-[32%]">
        <FormFieldLabel>
          {t('creation:pci_instance_creation_select_network_dropdown_label')}
        </FormFieldLabel>
        <Select
          items={mockedPrivateNetworks}
          value={
            mockedPrivateNetworks[0] ? [mockedPrivateNetworks[0].value] : []
          }
        >
          <SelectControl />
          <SelectContent />
        </Select>
      </FormField>
    </section>
  );
};

export default Network;
