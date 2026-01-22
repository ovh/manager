import { FC, useCallback, useEffect, useMemo, useState } from 'react';
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
import { TAddNetworkForm } from '../CreateInstance.schema';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import Banner from '@/components/banner/Banner.component';
import { TInstanceCreationForm } from '../CreateInstance.schema';
import AddPublicNetworkConfiguration from './network/AddPublicNetworkConfiguration.component';

type TUpdateNetworkFieldsArgs = {
  networkId: string | null;
  newPrivateNetwork: TAddNetworkForm | null;
};

const Network: FC = () => {
  const { t } = useTranslation('creation');
  const { control, setValue } = useFormContext<TInstanceCreationForm>();
  const [networkId, microRegion] = useWatch({
    control,
    name: ['networkId', 'microRegion'],
  });

  const [
    isCreationNetworkFormOpened,
    setIsCreationNetworkFormOpened,
  ] = useState(false);

  const { networks, ovhPrivateNetwork } = useMemo(
    () => selectPrivateNetworks(microRegion),
    [microRegion],
  );

  const { trackClick } = useOvhTracking();

  const handleSelectNetwork = ({ value }: SelectValueChangeDetail) => {
    const id = value[0];

    if (!id) return;

    updatePrivateNetworkFields({
      networkId: id,
      newPrivateNetwork: null,
    });

    trackClick({
      location: PageLocation.funnel,
      buttonType: ButtonType.select,
      actionType: 'action',
      actions: ['add_instance', 'associate_existing_private_network'],
    });
  };

  const handleOpenCreateNetwork = () => {
    setIsCreationNetworkFormOpened(true);

    updatePrivateNetworkFields({
      networkId: null,
      newPrivateNetwork: ovhPrivateNetwork,
    });

    trackClick({
      location: PageLocation.funnel,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: ['add_instance', 'create_private_network'],
    });
  };

  const handleCloseCreateNetwork = () => {
    setIsCreationNetworkFormOpened(false);

    updatePrivateNetworkFields({
      networkId: networks[0]?.value ?? null,
      newPrivateNetwork: null,
    });
  };

  const updatePrivateNetworkFields = useCallback(
    ({ networkId, newPrivateNetwork }: TUpdateNetworkFieldsArgs) => {
      setValue('networkId', networkId);
      setValue('newPrivateNetwork', newPrivateNetwork);
    },
    [setValue],
  );

  useEffect(() => {
    if (networks.length === 0) {
      setIsCreationNetworkFormOpened(true);

      updatePrivateNetworkFields({
        networkId: null,
        newPrivateNetwork: ovhPrivateNetwork,
      });
    }
  }, [networks.length, ovhPrivateNetwork, updatePrivateNetworkFields]);

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
      <Banner className="my-4">
        {t('creation:pci_instance_creation_network_setting_beta_warning')}
      </Banner>
      <Text className="mt-4" preset="paragraph">
        {t(
          'creation:pci_instance_creation_network_private_network_setting_description',
        )}
      </Text>
      {isCreationNetworkFormOpened ? (
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
              onClick={handleCloseCreateNetwork}
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
              value={networkId ? [networkId] : []}
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
      <GatewayConfiguration />
      <AddPublicNetworkConfiguration />
    </section>
  );
};

export default Network;
