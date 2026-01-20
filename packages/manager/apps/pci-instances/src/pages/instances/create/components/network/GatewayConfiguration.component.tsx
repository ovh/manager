import { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, Toggle, ToggleControl, ToggleLabel } from '@ovhcloud/ods-react';
import { useCatalogPrice } from '@ovh-ux/muk';
import { selectGatewayConfiguration } from '../../view-models/networksViewModel';
import { useFormContext, useWatch } from 'react-hook-form';
import { TInstanceCreationForm } from '../../CreateInstance.schema';
import clsx from 'clsx';

const disabledClassname = 'text-[--ods-color-text-disabled-default]';

const GatewayConfiguration: FC = () => {
  const { t } = useTranslation('creation');
  const { control } = useFormContext<TInstanceCreationForm>();
  const [networkId, microRegion] = useWatch({
    control,
    name: ['networkId', 'microRegion'],
  });
  const gatewayConfiguration = useMemo(
    () => selectGatewayConfiguration(networkId, microRegion),
    [networkId, microRegion],
  );
  const { getFormattedHourlyCatalogPrice } = useCatalogPrice(4);

  if (!gatewayConfiguration) return null;

  return (
    <div className="mt-4">
      <Text preset="heading-4">
        {t('creation:pci_instance_creation_network_gateway_title')}
      </Text>
      <Toggle
        disabled={gatewayConfiguration.isDisabled}
        withLabels
        className="mt-6"
      >
        <ToggleControl />
        <ToggleLabel className="flex items-center">
          <Text
            className={clsx({
              [disabledClassname]: gatewayConfiguration.isDisabled,
            })}
          >
            {t('creation:pci_instance_creation_network_gateway_toggle_label')}
          </Text>
          <span className="mx-2">-</span>
          <Text
            className={clsx('font-semibold', {
              [disabledClassname]: gatewayConfiguration.isDisabled,
            })}
          >
            {t('creation:pci_instance_creation_network_gateway_price_label', {
              size: gatewayConfiguration.size,
              price: getFormattedHourlyCatalogPrice(gatewayConfiguration.price),
            })}
          </Text>
        </ToggleLabel>
      </Toggle>
    </div>
  );
};

export default GatewayConfiguration;
