import { FC, useCallback, useEffect } from 'react';
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
import { selectPrivateNetworks } from '../view-models/networksViewModel';
import AddNetworkForm from './network/AddNetworkForm.component';
import GatewayConfiguration from './network/GatewayConfiguration.component';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { TInstanceCreationForm } from '../CreateInstance.schema';
import AddPublicNetworkConfiguration from './network/AddPublicNetworkConfiguration.component';
import { usePrivateNetworks } from '@/data/hooks/configuration/usePrivateNetworks';

const Network: FC = () => {
  const { t } = useTranslation('creation');
  const { control, setValue } = useFormContext<TInstanceCreationForm>();
  const [privateNetworkId, microRegion] = useWatch({
    control,
    name: ['privateNetworkId', 'microRegion'],
  });

  const { data: networks, isPending } = usePrivateNetworks({
    select: selectPrivateNetworks(microRegion),
  });

  const { trackClick } = useOvhTracking();

  const handleSelectNetwork = ({ value }: SelectValueChangeDetail) => {
    const id = value[0];

    if (!id) return;

    setValue('privateNetworkId', id);

    trackClick({
      location: PageLocation.funnel,
      buttonType: ButtonType.select,
      actionType: 'action',
      actions: ['add_instance', 'associate_existing_private_network'],
    });
  };

  const handleOpenCreateNetwork = () => {
    setValue('privateNetworkId', null);

    trackClick({
      location: PageLocation.funnel,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: ['add_instance', 'create_private_network'],
    });
  };

  const initializePrivateNetworkFields = useCallback(() => {
    setValue('privateNetworkId', networks?.[0]?.value ?? null);
    setValue('newPrivateNetwork', null);
  }, [networks, setValue]);

  useEffect(() => {
    initializePrivateNetworkFields();
  }, [networks, initializePrivateNetworkFields]);

  if (isPending || !networks) return null;

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
      {!privateNetworkId ? (
        <>
          <Text className="font-semibold" preset="paragraph">
            {t('creation:pci_instance_creation_network_add_new_warning')}
          </Text>
          <AddNetworkForm />
          {networks.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="mt-6"
              onClick={initializePrivateNetworkFields}
            >
              {t(`${NAMESPACES.ACTIONS}:cancel`)}
            </Button>
          )}
        </>
      ) : (
        <>
          <FormField className="my-4 max-w-[32%]">
            <FormFieldLabel>
              {t(
                'creation:pci_instance_creation_select_network_dropdown_label',
              )}
            </FormFieldLabel>
            <Select
              items={networks}
              value={[privateNetworkId]}
              onValueChange={handleSelectNetwork}
            >
              <SelectControl />
              <SelectContent />
            </Select>
          </FormField>
          <Button variant="ghost" onClick={handleOpenCreateNetwork}>
            <Icon name="plus" />
            {t('creation:pci_instance_creation_network_add_new')}
          </Button>
        </>
      )}
      <GatewayConfiguration privateNetworks={networks} />
      <AddPublicNetworkConfiguration privateNetworks={networks} />
    </section>
  );
};

export default Network;
