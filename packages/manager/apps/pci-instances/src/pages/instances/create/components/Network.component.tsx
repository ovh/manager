import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  FormField,
  FormFieldLabel,
  Icon,
  Select,
  SelectContent,
  SelectControl,
  SelectValueChangeDetail,
  Text,
} from '@ovhcloud/ods-react';
import NetworkHelper from './network/NetworkHelper.component';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { useFormContext, useWatch } from 'react-hook-form';
import { TInstanceCreationForm } from '../CreateInstance.page';
import { selectPrivateNetworks } from '../view-models/networksViewModel';

const Network: FC = () => {
  const { t } = useTranslation('creation');
  const { control, setValue } = useFormContext<TInstanceCreationForm>();
  const networkId = useWatch({
    control,
    name: 'networkId',
  });

  const networks = selectPrivateNetworks();

  const { trackClick } = useOvhTracking();

  const handleSelectNetwork = ({ value }: SelectValueChangeDetail) => {
    const id = value[0];

    if (!id) return;

    setValue('networkId', id);
    trackClick({
      location: PageLocation.funnel,
      buttonType: ButtonType.select,
      actionType: 'action',
      actions: ['add_instance', 'associate_existing_private_network'],
    });
  };

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
      {networks.length !== 0 && (
        <>
          <FormField className="my-4 max-w-[32%]">
            <FormFieldLabel>
              {t(
                'creation:pci_instance_creation_select_network_dropdown_label',
              )}
            </FormFieldLabel>
            <Select
              items={networks}
              value={networkId ? [networkId] : []}
              onValueChange={handleSelectNetwork}
            >
              <SelectControl />
              <SelectContent />
            </Select>
          </FormField>
          <Button variant="ghost">
            <Icon name="plus" />
            {t('creation:pci_instance_creation_network_add_new')}
          </Button>
        </>
      )}
    </section>
  );
};

export default Network;
