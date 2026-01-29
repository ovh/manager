import { PciCard } from '@/components/pciCard/PciCard.component';
import {
  Radio,
  RadioControl,
  RadioGroup,
  RadioLabel,
  Text,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@ovhcloud/ods-react';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { DistributionImageLabel } from '@/components/distributionImageLabel/DistributionImageLabel.component';
import {
  Controller,
  ControllerRenderProps,
  useFormContext,
  useWatch,
} from 'react-hook-form';
import { TImageOption, TImageOsType } from '../../view-models/imagesViewModel';
import React, { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useCatalogPrice } from '@ovh-ux/muk';
import { TInstanceCreationForm } from '../../CreateInstance.schema';
import { BILLING_TYPE } from '@/types/instance/common.type';

type DistributionImageVariants = {
  variants: TImageOption[];
};

type TSelectImageArgs = {
  field: ControllerRenderProps<
    TInstanceCreationForm,
    'distributionImageVariantId'
  >;
  osType: TImageOsType;
  value?: string;
  windowsId?: string;
};

type TWindowsPriceProps = {
  price: number;
  billingType: BILLING_TYPE;
};

const DistributionImageVariants = ({ variants }: DistributionImageVariants) => {
  console.log('🚀 ~ Distributionvariants ~ variants:', variants);
  const { t } = useTranslation('creation');
  const { getTextPrice } = useCatalogPrice(4);
  const { control, setValue } = useFormContext<TInstanceCreationForm>();
  const [selectedImageVariantId, distributionImageType] = useWatch({
    control,
    name: ['distributionImageVariantId', 'distributionImageType'],
  });
  const { trackClick } = useOvhTracking();

  // eslint-disable-next-line react/no-multi-comp
  const WindowsPrice = ({ price, billingType }: TWindowsPriceProps) => (
    <Text className="text-sm font-medium text-[--ods-color-success-500]">
      {t(
        `creation:pci_instance_creation_windows_image_${billingType}_license_price`,
        {
          price: getTextPrice(price),
        },
      )}
    </Text>
  );

  const handleSelectImage = ({
    field,
    osType,
    value,
    windowsId,
  }: TSelectImageArgs) => () => {
    if (!value) return;

    field.onChange(value);
    setValue('distributionImageOsType', osType);

    if (windowsId)
      setValue('distributionImageVersion', {
        distributionImageVersionId: windowsId,
        distributionImageVersionName: value,
      });

    trackClick({
      location: PageLocation.funnel,
      buttonType: ButtonType.tile,
      actionType: 'action',
      actions: ['add_instance', 'select_image', value],
    });
  };

  const updateVersionAndSshKey = useCallback(
    (firstAvailableVariant?: TImageOption) => {
      setValue('distributionImageVersion', {
        distributionImageVersionId: firstAvailableVariant?.windowsId ?? null,
        distributionImageVersionName: firstAvailableVariant?.label ?? null,
      });
      setValue('sshKeyId', null);
    },
    [setValue],
  );

  const selectFirstAvailableVariant = useCallback(
    (firstAvailableVariant?: TImageOption) => {
      setValue(
        'distributionImageVariantId',
        firstAvailableVariant?.value ?? null,
      );
      setValue(
        'distributionImageOsType',
        firstAvailableVariant?.osType ?? null,
      );
    },
    [setValue],
  );

  useEffect(() => {
    const previousSelectedVariantAvailable = variants.find(
      (variant) =>
        variant.value === selectedImageVariantId && variant.available,
    );

    const firstAvailableVariant = variants.find((variant) => variant.available);

    if (!previousSelectedVariantAvailable)
      selectFirstAvailableVariant(firstAvailableVariant);

    if (
      !previousSelectedVariantAvailable &&
      distributionImageType === 'windows'
    )
      updateVersionAndSshKey(firstAvailableVariant);
  }, [
    distributionImageType,
    updateVersionAndSshKey,
    selectFirstAvailableVariant,
    selectedImageVariantId,
    setValue,
    variants,
  ]);

  const getImageLabelForIcon = (value: string) =>
    value.toLowerCase().includes('windows') ? 'windows' : value;

  const cardsContainerClassname = `grid gap-6 mt-8 grid-cols-${
    distributionImageType === 'windows' ? 2 : 3
  }`;

  const imageLabelClassname = `font-bold text-lg text-[--ods-color-heading] ${
    distributionImageType === 'windows' ? 'max-w-[300px]' : 'max-w-[200px]'
  }`;

  return (
    <Controller
      control={control}
      name="distributionImageVariantId"
      render={({ field }) => (
        <RadioGroup
          className={cardsContainerClassname}
          {...(selectedImageVariantId && { value: selectedImageVariantId })}
        >
          {variants.map(
            ({
              label,
              available,
              value,
              osType,
              windowsHourlyLicensePrice,
              windowsMonthlyLicensePrice,
              windowsId,
            }) => {
              // eslint-disable-next-line react/no-multi-comp
              const Card = React.forwardRef<
                HTMLDivElement,
                React.ComponentProps<typeof PciCard>
              >((props, ref) => (
                <PciCard
                  ref={ref}
                  selectable
                  disabled={!available}
                  className="justify-center p-5"
                  selected={selectedImageVariantId === value}
                  onClick={handleSelectImage({
                    field,
                    osType,
                    value,
                    windowsId,
                  })}
                  {...props}
                >
                  <PciCard.Header>
                    <Radio disabled={!available} value={value}>
                      <RadioControl />
                      <RadioLabel className={imageLabelClassname}>
                        <DistributionImageLabel
                          name={getImageLabelForIcon(value)}
                        >
                          <span className="max-w-full flex-1 pr-8">
                            {label}

                            {windowsHourlyLicensePrice && (
                              <WindowsPrice
                                price={windowsHourlyLicensePrice}
                                billingType={BILLING_TYPE.Hourly}
                              />
                            )}
                            {windowsMonthlyLicensePrice && (
                              <WindowsPrice
                                price={windowsMonthlyLicensePrice}
                                billingType={BILLING_TYPE.Monthly}
                              />
                            )}
                          </span>
                        </DistributionImageLabel>
                      </RadioLabel>
                    </Radio>
                  </PciCard.Header>
                </PciCard>
              ));

              Card.displayName = `DistributionVariantCard_${value}`;

              if (available) return <Card key={value} />;

              return (
                <Tooltip key={value}>
                  <TooltipTrigger asChild>
                    <Card />
                  </TooltipTrigger>
                  <TooltipContent
                    withArrow
                    className="max-w-[220px] px-6 text-center"
                  >
                    <Text>
                      {t(
                        'creation:pci_instance_creation_image_available_on_other_models',
                      )}
                    </Text>
                  </TooltipContent>
                </Tooltip>
              );
            },
          )}
        </RadioGroup>
      )}
    />
  );
};

export default DistributionImageVariants;
