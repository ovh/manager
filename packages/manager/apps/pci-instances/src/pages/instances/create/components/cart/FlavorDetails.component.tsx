import { FC } from 'react';
import { Text } from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';
import { useBytes } from '@ovh-ux/manager-pci-common';
import { formatBandwidthDisplay } from '@/utils';
import { formatDiskDisplay } from '../../view-models/mappers/diskMapper';
import { TSelectFlavorDetails } from '../../view-models/cartViewModel';

type TFlavorDetails = {
  quantity: number;
  flavor: TSelectFlavorDetails;
};

export const FlavorDetails: FC<TFlavorDetails> = ({ quantity, flavor }) => {
  const { t } = useTranslation('creation');
  const { formatBytes } = useBytes();

  const formatBandwidth = (value: number, unit: string) => {
    const {
      value: valueFormatted,
      unit: unitFormatted,
    } = formatBandwidthDisplay(value, unit);
    return `${valueFormatted} ${t(
      `pci_instance_creation_bandwidth_${unitFormatted}`,
    )}`;
  };

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
        <div className="flex flex-col">
          {flavor.disks.map((disk) => (
            <Text
              key={disk.id}
              className="font-semibold text-[--ods-color-heading]"
            >
              {formatDiskDisplay(disk, formatBytes)}
            </Text>
          ))}
        </div>
        <Text className="font-semibold text-[--ods-color-heading]">
          {formatBandwidth(
            flavor.bandwidthPrivate,
            flavor.bandwidthPrivateUnit,
          )}{' '}
          {t('pci_instance_creation_cart_flavor_bandwidthPrivate')}
        </Text>
        <Text className="font-semibold text-[--ods-color-heading]">
          {formatBandwidth(flavor.bandwidthPublic, flavor.bandwidthPublicUnit)}{' '}
          {t('pci_instance_creation_cart_flavor_bandwidthPublic')}
        </Text>
      </div>
    </div>
  );
};
