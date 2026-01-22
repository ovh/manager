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
import { selectPublicNetworkConfig } from '../../view-models/networksViewModel';
import { useFormContext, useWatch } from 'react-hook-form';
import { TInstanceCreationForm } from '../../CreateInstance.schema';
import clsx from 'clsx';
import { TooltipWrapper } from '@/components/form/TooltipWrapper.component';

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

const PublicIpConfiguration: FC = () => {
  const { t } = useTranslation('creation');
  const { control, setValue } = useFormContext<TInstanceCreationForm>();
  const [
    networkId,
    microRegion,
    ipPublicType,
    floatingIpAssignment,
    existingFloatingIp,
  ] = useWatch({
    control,
    name: [
      'networkId',
      'microRegion',
      'ipPublicType',
      'floatingIpAssignment',
      'existingFloatingIp',
    ],
  });
  const configurations = useMemo(
    () => selectPublicNetworkConfig(networkId, microRegion),
    [networkId, microRegion],
  );
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
        assignNewGateway: !configurations?.gateway.isDisabled,
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
      setValue(
        'existingFloatingIp',
        configurations?.floatingIp.existingFloatingIps[0]?.value ?? null,
      );
  };

  const handleSelectExistingFloatingIp = ({
    value,
  }: SelectValueChangeDetail) => {
    setValue('existingFloatingIp', value[0] ?? null);
  };

  if (!configurations) return null;

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
          disabled={configurations.basicPublicIp.isDisabled}
        >
          <RadioControl />
          <RadioLabel className="flex flex-col">
            <Text
              className={getDisabledTextClassName(
                configurations.basicPublicIp.isDisabled,
              )}
            >
              {t(
                'creation:pci_instance_creation_network_add_public_connectivity.basic_ip_label',
                {
                  price: getFormattedHourlyCatalogPrice(
                    configurations.basicPublicIp.price,
                  ),
                },
              )}
            </Text>
            <Text
              className={getDisabledTextClassName(
                configurations.basicPublicIp.isDisabled,
              )}
            >
              {t(
                'creation:pci_instance_creation_network_add_public_connectivity.basic_ip_description',
              )}
            </Text>
            {configurations.gateway.isDisabled && (
              <Text
                className={`font-semibold ${getDisabledTextClassName(
                  configurations.basicPublicIp.isDisabled,
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
          {...(configurations.floatingIp.warningMessage && {
            content: t(configurations.floatingIp.warningMessage),
          })}
        >
          <Radio
            className="mt-4 w-auto items-baseline"
            value="floatingIp"
            disabled={configurations.floatingIp.isDisabled}
          >
            <RadioControl />
            <RadioLabel className="flex flex-col">
              <Text
                className={getDisabledTextClassName(
                  configurations.floatingIp.isDisabled,
                )}
              >
                {t(
                  'creation:pci_instance_creation_network_add_public_connectivity.floating_ip_label',
                  {
                    price: getFormattedHourlyCatalogPrice(
                      configurations.floatingIp.price,
                    ),
                  },
                )}
              </Text>
              <Text
                className={getDisabledTextClassName(
                  configurations.floatingIp.isDisabled,
                )}
              >
                {t(
                  'creation:pci_instance_creation_network_add_public_connectivity.floating_ip_description',
                )}
              </Text>
              {!configurations.gateway.isDisabled && (
                <Text className="font-semibold">
                  {t(
                    'creation:pci_instance_creation_network_add_public_connectivity.floating_ip_warning',
                    {
                      size: configurations.gateway.size,
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
                      price: getFormattedHourlyCatalogPrice(
                        configurations.floatingIp.price,
                      ),
                    },
                  )}
                </Text>
              </RadioLabel>
            </Radio>
            {configurations.floatingIp.existingFloatingIps.length > 0 && (
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
              items={configurations.floatingIp.existingFloatingIps}
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
