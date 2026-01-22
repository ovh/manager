import { FC, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Text,
  Toggle,
  ToggleControl,
  ToggleLabel,
  ToggleCheckedChangeDetail,
} from '@ovhcloud/ods-react';
import { useCatalogPrice } from '@ovh-ux/muk';
import { selectPublicNetworkConfig } from '../../view-models/networksViewModel';
import { TooltipWrapper } from '@/components/form/TooltipWrapper.component';
import {
  Controller,
  ControllerRenderProps,
  useFormContext,
  useWatch,
} from 'react-hook-form';
import { TInstanceCreationForm } from '../../CreateInstance.schema';
import clsx from 'clsx';

const disabledClassname = 'text-[--ods-color-text-disabled-default]';

const GatewayConfiguration: FC = () => {
  const { t } = useTranslation('creation');
  const { control, setValue } = useFormContext<TInstanceCreationForm>();
  const [networkId, microRegion, assignNewGateway] = useWatch({
    control,
    name: ['networkId', 'microRegion', 'assignNewGateway'],
  });

  const configurations = useMemo(
    () => selectPublicNetworkConfig(networkId, microRegion),
    [networkId, microRegion],
  );

  const { getFormattedHourlyCatalogPrice } = useCatalogPrice(4);

  const handleAssignNewGateway = (
    field: ControllerRenderProps<TInstanceCreationForm, 'assignNewGateway'>,
  ) => ({ checked }: ToggleCheckedChangeDetail) => {
    field.onChange(checked);

    if (checked) {
      setValue('ipPublicType', 'floatingIp');
      setValue('floatingIpAssignment', 'createNew');
    }
  };

  useEffect(() => {
    if (configurations?.gateway.isDisabled) setValue('assignNewGateway', false);
  }, [configurations, setValue]);

  if (!configurations) return null;

  return (
    <div className="mt-4">
      <Text preset="heading-4">
        {t('creation:pci_instance_creation_network_gateway_title')}
      </Text>
      <Controller
        name="assignNewGateway"
        control={control}
        render={({ field }) => (
          <Toggle
            disabled={configurations.gateway.isDisabled}
            withLabels
            className="mt-6"
            checked={assignNewGateway}
            onCheckedChange={handleAssignNewGateway(field)}
          >
            <TooltipWrapper
              {...(configurations.gateway.warningMessage && {
                content: t(configurations.gateway.warningMessage),
              })}
            >
              <ToggleControl />
            </TooltipWrapper>
            <ToggleLabel className="flex items-center">
              <Text
                className={clsx({
                  [disabledClassname]: configurations.gateway.isDisabled,
                })}
              >
                {t(
                  'creation:pci_instance_creation_network_gateway_toggle_label',
                )}
              </Text>
              <span className="mx-2">-</span>
              <Text
                className={clsx('font-semibold', {
                  [disabledClassname]: configurations.gateway.isDisabled,
                })}
              >
                {t(
                  'creation:pci_instance_creation_network_gateway_price_label',
                  {
                    size: configurations.gateway.size,
                    price: getFormattedHourlyCatalogPrice(
                      configurations.gateway.price,
                    ),
                  },
                )}
              </Text>
            </ToggleLabel>
          </Toggle>
        )}
      />
    </div>
  );
};

export default GatewayConfiguration;
