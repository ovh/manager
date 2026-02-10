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
  const [subnetId, microRegion, willGatewayBeAttached] = useWatch({
    control,
    name: ['subnetId', 'microRegion', 'willGatewayBeAttached'],
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
        subnetId,
      }),
    [deploymentMode, subnetId, privateNetworks],
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
    field: ControllerRenderProps<
      TInstanceCreationForm,
      'willGatewayBeAttached'
    >,
  ) => ({ checked }: ToggleCheckedChangeDetail) => {
    field.onChange(checked);

    if (checked) updatePublicIpFields('floatingIp', 'createNew');
    else updatePublicIpFields('basicIp', null);
  };

  useEffect(() => {
    const selectedPrivateNetwork = privateNetworks.find(
      (network) => network.value === subnetId,
    );
    if (selectedPrivateNetwork?.customRendererData?.hasGateway)
      setValue('willGatewayBeAttached', true);
  }, [privateNetworks, setValue, subnetId]);

  if (isPending || !gatewayAvailability || !configurations) return null;

  return (
    <div>
      <Controller
        name="willGatewayBeAttached"
        control={control}
        render={({ field }) => (
          <Toggle
            disabled={gatewayAvailability.isDisabled}
            withLabels
            className="mt-6"
            checked={willGatewayBeAttached}
            onCheckedChange={handleAssignNewGateway(field)}
          >
            <ToggleControl />
            <TooltipWrapper
              {...(gatewayAvailability.unavailableReason && {
                content: t(gatewayAvailability.unavailableReason),
              })}
            >
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
                      price: getFormattedHourlyCatalogPrice(
                        configurations.price,
                      ),
                    },
                  )}
                </Text>
              </ToggleLabel>
            </TooltipWrapper>
          </Toggle>
        )}
      />
    </div>
  );
};

export default GatewayConfiguration;
