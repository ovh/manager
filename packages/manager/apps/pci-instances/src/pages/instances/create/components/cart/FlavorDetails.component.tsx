import { FC } from 'react';
import { Text } from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';
import { TSelectFlavorDetails } from '../../view-models/cartViewModel';

type TFlavorDetails = {
  quantity: number;
  flavor: TSelectFlavorDetails;
};

export const FlavorDetails: FC<TFlavorDetails> = ({ quantity, flavor }) => {
  const { t } = useTranslation('creation');

  return (
    <div className="flex flex-row gap-2">
      <div>
        <Text className="text-[--ods-color-heading]">
          {quantity} {'x'}
        </Text>
      </div>
      <div>
        <Text className="font-semibold text-[--ods-color-heading]">
          {flavor.name}
        </Text>
        {flavor.numberOfGpu && flavor.gpu && (
          <Text className="font-semibold text-[--ods-color-heading]">
            {flavor.numberOfGpu}{' '}
            {t('pci_instance_creation_cart_flavor_numberOfGpu')} {flavor.gpu}
          </Text>
        )}
        {flavor.vRamTotal && (
          <Text className="font-semibold text-[--ods-color-heading]">
            {flavor.vRamTotal}{' '}
            {t('pci_instance_creation_cart_flavor_vRamTotal')}
          </Text>
        )}
        <Text className="font-semibold text-[--ods-color-heading]">
          {flavor.memory} {t('pci_instance_creation_cart_flavor_memory')}
        </Text>
        <Text className="font-semibold text-[--ods-color-heading]">
          {flavor.vCore} {t('pci_instance_creation_cart_flavor_vCore')}
        </Text>
        <Text className="font-semibold text-[--ods-color-heading]">
          {flavor.bandwidthPrivate}{' '}
          {t('pci_instance_creation_cart_flavor_bandwidthPrivate')}
        </Text>
        <Text className="font-semibold text-[--ods-color-heading]">
          {flavor.bandwidthPublic}{' '}
          {t('pci_instance_creation_cart_flavor_bandwidthPublic')}
        </Text>
      </div>
    </div>
  );
};
