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
import {
  getGatewayAvailability,
  selectSmallGatewayConfig,
} from '../../view-models/networksViewModel';
import { TooltipWrapper } from '@/components/form/TooltipWrapper.component';
import {
  Controller,
  ControllerRenderProps,
  useFormContext,
  useWatch,
} from 'react-hook-form';
import { TInstanceCreationForm } from '../../CreateInstance.schema';
import clsx from 'clsx';
import { useNetworkCatalog } from '@/data/hooks/catalog/useNetworkCatalog';
import { TPrivateNetworkData } from '../../view-models/networksViewModel';
import { useInstancesCatalogWithSelect } from '@/data/hooks/catalog/useInstancesCatalogWithSelect';
import { selectMicroRegionDeploymentMode } from '../../view-models/microRegionsViewModel';

const disabledClassname = 'text-[--ods-color-text-disabled-default]';

const GatewayConfiguration: FC<{ privateNetworks: TPrivateNetworkData[] }> = ({
  privateNetworks,
}) => {
  const { t } = useTranslation('creation');
  const { control, setValue } = useFormContext<TInstanceCreationForm>();
  const [privateNetworkId, microRegion, assignNewGateway] = useWatch({
    control,
    name: ['privateNetworkId', 'microRegion', 'assignNewGateway'],
  });

  const { data: configurations, isPending } = useNetworkCatalog({
    select: selectSmallGatewayConfig(microRegion),
  });

  const { data: deploymentMode } = useInstancesCatalogWithSelect({
    select: selectMicroRegionDeploymentMode(microRegion),
  });

  const gatewayAvailability = useMemo(
    () =>
      getGatewayAvailability({
        deploymentMode,
        privateNetworks,
        privateNetworkId,
      }),
    [deploymentMode, privateNetworkId, privateNetworks],
  );

  const { getFormattedHourlyCatalogPrice } = useCatalogPrice(4);

  const updatePublicIpFields = (
    ipPublicType: 'basicIp' | 'floatingIp',
    floatingIpAssignment: 'createNew' | 'reuseExisting' | null,
  ) => {
    setValue('ipPublicType', ipPublicType);
    setValue('floatingIpAssignment', floatingIpAssignment);
  };

  const handleAssignNewGateway = (
    field: ControllerRenderProps<TInstanceCreationForm, 'assignNewGateway'>,
  ) => ({ checked }: ToggleCheckedChangeDetail) => {
    field.onChange(checked);

    if (checked) updatePublicIpFields('floatingIp', 'createNew');
    else updatePublicIpFields('basicIp', null);
  };

  useEffect(() => {
    if (gatewayAvailability?.isDisabled) setValue('assignNewGateway', false);
  }, [gatewayAvailability, setValue]);

  if (isPending || !gatewayAvailability || !configurations) return null;

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
            disabled={gatewayAvailability.isDisabled}
            withLabels
            className="mt-6"
            checked={assignNewGateway}
            onCheckedChange={handleAssignNewGateway(field)}
          >
            <TooltipWrapper
              {...(gatewayAvailability.unavailableReason && {
                content: t(gatewayAvailability.unavailableReason),
              })}
            >
              <ToggleControl />
            </TooltipWrapper>
            <ToggleLabel className="flex items-center">
              <Text
                className={clsx({
                  [disabledClassname]: gatewayAvailability.isDisabled,
                })}
              >
                {t(
                  'creation:pci_instance_creation_network_gateway_toggle_label',
                )}
              </Text>
              <span className="mx-2">-</span>
              <Text
                className={clsx('font-semibold', {
                  [disabledClassname]: gatewayAvailability.isDisabled,
                })}
              >
                {t(
                  'creation:pci_instance_creation_network_gateway_price_label',
                  {
                    size: configurations.size,
                    price: getFormattedHourlyCatalogPrice(configurations.price),
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
