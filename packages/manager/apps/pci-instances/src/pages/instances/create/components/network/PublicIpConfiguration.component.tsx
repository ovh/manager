import { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Radio,
  RadioControl,
  RadioGroup,
  RadioLabel,
  RadioValueChangeDetail,
  Text,
  Select,
  SelectContent,
  SelectControl,
  SelectValueChangeDetail,
  FormField,
} from '@ovhcloud/ods-react';
import { useCatalogPrice } from '@ovh-ux/muk';
import {
  selectSmallGatewayConfig,
  selectFloatingIps,
  selectPublicIpPrices,
  getPublicIpAvailability,
  getGatewayAvailability,
  TPrivateNetworkData,
} from '../../view-models/networksViewModel';
import { useFormContext, useWatch } from 'react-hook-form';
import { TInstanceCreationForm } from '../../CreateInstance.schema';
import clsx from 'clsx';
import { TooltipWrapper } from '@/components/form/TooltipWrapper.component';
import { useNetworkCatalog } from '@/data/hooks/catalog/useNetworkCatalog';
import { useFloatingIps } from '@/data/hooks/configuration/useFloatingIps';
import { selectMicroRegionDeploymentMode } from '../../view-models/microRegionsViewModel';
import { useInstancesCatalogWithSelect } from '@/data/hooks/catalog/useInstancesCatalogWithSelect';

type TPublicIpTypeConfig = Record<
  'basicIp' | 'floatingIp',
  {
    floatingIpAssignment: 'createNew' | 'reuseExisting' | null;
    existingFloatingIp: null;
    assignNewGateway: boolean;
  }
>;

const disabledTextClassName = 'text-[--ods-color-text-disabled-default]';

const getDisabledTextClassName = (isDisabled: boolean): string =>
  clsx({
    [disabledTextClassName]: isDisabled,
  });

const PublicIpConfiguration: FC<{
  privateNetworks: TPrivateNetworkData[];
}> = ({ privateNetworks }) => {
  const { t } = useTranslation('creation');
  const { control, setValue } = useFormContext<TInstanceCreationForm>();
  const [
    privateNetworkId,
    microRegion,
    ipPublicType,
    floatingIpAssignment,
    existingFloatingIp,
  ] = useWatch({
    control,
    name: [
      'privateNetworkId',
      'microRegion',
      'ipPublicType',
      'floatingIpAssignment',
      'existingFloatingIp',
    ],
  });

  const { data: prices } = useNetworkCatalog({
    select: selectPublicIpPrices(microRegion),
  });

  const { data: gatewayConfigurations } = useNetworkCatalog({
    select: selectSmallGatewayConfig(microRegion),
  });

  const { data: deploymentMode } = useInstancesCatalogWithSelect({
    select: selectMicroRegionDeploymentMode(microRegion),
  });

  const publicIpAvailability = useMemo(
    () =>
      getPublicIpAvailability({
        deploymentMode,
        privateNetworks,
        privateNetworkId,
      }),
    [deploymentMode, privateNetworkId, privateNetworks],
  );

  const gatewayAvailability = useMemo(
    () =>
      getGatewayAvailability({
        deploymentMode,
        privateNetworks,
        privateNetworkId,
      }),
    [deploymentMode, privateNetworkId, privateNetworks],
  );

  const { data: floatingIps = [] } = useFloatingIps({
    regionName: microRegion,
    select: selectFloatingIps,
  });

  const { getFormattedHourlyCatalogPrice } = useCatalogPrice(4);

  const handleSelectIpType = ({ value }: RadioValueChangeDetail) => {
    const newValue = value as 'basicIp' | 'floatingIp' | null;

    setValue('ipPublicType', newValue);

    if (!newValue) return;

    const config: TPublicIpTypeConfig = {
      basicIp: {
        floatingIpAssignment: null,
        existingFloatingIp: null,
        assignNewGateway: false,
      },
      floatingIp: {
        floatingIpAssignment: 'createNew',
        existingFloatingIp: null,
        assignNewGateway: !gatewayAvailability?.isDisabled,
      },
    };

    Object.entries(config[newValue]).forEach(([key, val]) => {
      setValue(key as keyof TPublicIpTypeConfig[typeof newValue], val);
    });
  };

  const handleSelectFloatingIpAssignment = ({
    value,
  }: RadioValueChangeDetail) => {
    const newValue = value as 'createNew' | 'reuseExisting' | null;

    setValue('floatingIpAssignment', newValue);

    if (newValue === 'createNew') setValue('existingFloatingIp', null);
    else if (newValue === 'reuseExisting')
      setValue('existingFloatingIp', floatingIps[0]?.value ?? null);
  };

  const handleSelectExistingFloatingIp = ({
    value,
  }: SelectValueChangeDetail) => {
    setValue('existingFloatingIp', value[0] ?? null);
  };

  if (!publicIpAvailability || !prices) return null;

  return (
    <>
      <RadioGroup
        className="ml-12 mt-4"
        {...(!!ipPublicType && { value: ipPublicType })}
        onValueChange={handleSelectIpType}
      >
        <Radio
          className="w-auto items-baseline"
          value="basicIp"
          disabled={publicIpAvailability.basicPublicIp.isDisabled}
        >
          <RadioControl />
          <RadioLabel className="flex flex-col">
            <Text
              className={getDisabledTextClassName(
                publicIpAvailability.basicPublicIp.isDisabled,
              )}
            >
              {t(
                'creation:pci_instance_creation_network_add_public_connectivity.basic_ip_label',
                {
                  price: getFormattedHourlyCatalogPrice(prices.basicPublicIp),
                },
              )}
            </Text>
            <Text
              className={getDisabledTextClassName(
                publicIpAvailability.basicPublicIp.isDisabled,
              )}
            >
              {t(
                'creation:pci_instance_creation_network_add_public_connectivity.basic_ip_description',
              )}
            </Text>
            {gatewayAvailability?.isDisabled && (
              <Text
                className={`font-semibold ${getDisabledTextClassName(
                  publicIpAvailability.basicPublicIp.isDisabled,
                )}`}
              >
                {t(
                  'creation:pci_instance_creation_network_add_public_connectivity.basic_ip_warning',
                )}
              </Text>
            )}
          </RadioLabel>
        </Radio>
        <TooltipWrapper
          {...(publicIpAvailability.floatingIp.unavailableReason && {
            content: t(publicIpAvailability.floatingIp.unavailableReason),
          })}
        >
          <Radio
            className="mt-4 w-auto items-baseline"
            value="floatingIp"
            disabled={publicIpAvailability.floatingIp.isDisabled}
          >
            <RadioControl />
            <RadioLabel className="flex flex-col">
              <Text
                className={getDisabledTextClassName(
                  publicIpAvailability.floatingIp.isDisabled,
                )}
              >
                {t(
                  'creation:pci_instance_creation_network_add_public_connectivity.floating_ip_label',
                  {
                    price: getFormattedHourlyCatalogPrice(prices.floatingIp),
                  },
                )}
              </Text>
              <Text
                className={getDisabledTextClassName(
                  publicIpAvailability.floatingIp.isDisabled,
                )}
              >
                {t(
                  'creation:pci_instance_creation_network_add_public_connectivity.floating_ip_description',
                )}
              </Text>
              {gatewayAvailability && !gatewayAvailability.isDisabled && (
                <Text className="font-semibold">
                  {t(
                    'creation:pci_instance_creation_network_add_public_connectivity.floating_ip_warning',
                    {
                      size: gatewayConfigurations?.size,
                    },
                  )}
                </Text>
              )}
            </RadioLabel>
          </Radio>
        </TooltipWrapper>
      </RadioGroup>
      {ipPublicType === 'floatingIp' && (
        <div className="ml-12 mt-4">
          <RadioGroup
            className="ml-8"
            {...(!!floatingIpAssignment && { value: floatingIpAssignment })}
            onValueChange={handleSelectFloatingIpAssignment}
          >
            <Radio className="mt-4" value="createNew">
              <RadioControl />
              <RadioLabel>
                <Text>
                  {t(
                    'creation:pci_instance_creation_network_add_public_connectivity.floating_ip_create_new_label',
                    {
                      price: getFormattedHourlyCatalogPrice(prices.floatingIp),
                    },
                  )}
                </Text>
              </RadioLabel>
            </Radio>
            {floatingIps.length > 0 && (
              <Radio className="mt-4" value="reuseExisting">
                <RadioControl />
                <RadioLabel>
                  <Text>
                    {t(
                      'creation:pci_instance_creation_network_add_public_connectivity.floating_ip_reuse_existing_label',
                    )}
                  </Text>
                </RadioLabel>
              </Radio>
            )}
          </RadioGroup>
        </div>
      )}
      {floatingIpAssignment === 'reuseExisting' && (
        <div className="ml-12 mt-4">
          <FormField className="ml-12 max-w-[32%]">
            <Select
              items={floatingIps}
              value={!!existingFloatingIp ? [existingFloatingIp] : []}
              onValueChange={handleSelectExistingFloatingIp}
            >
              <SelectControl />
              <SelectContent />
            </Select>
          </FormField>
        </div>
      )}
    </>
  );
};

export default PublicIpConfiguration;
