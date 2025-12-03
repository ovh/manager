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
import { TInstanceCreationForm } from '../../CreateInstance.page';
import { TImageOption } from '../../view-models/imagesViewModel';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useCatalogPrice } from '@ovh-ux/manager-react-components';

type TDistributionvariants = {
  variants: TImageOption[];
};

const Distributionvariants = ({ variants }: TDistributionvariants) => {
  const { t } = useTranslation('creation');
  const { getTextPrice } = useCatalogPrice(4);
  const { control, setValue } = useFormContext<TInstanceCreationForm>();
  const [selectedImageVariantId, distributionImageType] = useWatch({
    control,
    name: ['distributionImageVariantId', 'distributionImageType'],
  });
  const { trackClick } = useOvhTracking();

  const handleSelectImage = (
    field: ControllerRenderProps<
      TInstanceCreationForm,
      'distributionImageVariantId'
    >,
    value?: string,
    windowsId?: string,
  ) => () => {
    if (!value) return;

    field.onChange(value);

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

  useEffect(() => {
    const foundVariant = variants.find(
      (variant) =>
        variant.value === selectedImageVariantId && variant.available,
    );
    if (!foundVariant) {
      const firstAvailableVariant = variants.find(
        (variant) => variant.available,
      );
      setValue(
        'distributionImageVariantId',
        firstAvailableVariant?.value ?? null,
      );

      if (distributionImageType === 'windows')
        setValue('distributionImageVersion', {
          distributionImageVersionId: firstAvailableVariant?.windowsId ?? null,
          distributionImageVersionName: firstAvailableVariant?.label ?? null,
        });
    }
  }, [distributionImageType, selectedImageVariantId, setValue, variants]);

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
          onValueChange={handleSelectImage(field)}
        >
          {variants.map(
            ({ label, available, value, windowsHourlyPrice, windowsId }) => {
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
                  onClick={handleSelectImage(field, value, windowsId)}
                  {...props}
                >
                  <PciCard.Header>
                    <Radio disabled={!available} value={value}>
                      <RadioControl />
                      <RadioLabel className={imageLabelClassname}>
                        <DistributionImageLabel
                          name={getImageLabelForIcon(value)}
                        >
                          <span className="flex-1 max-w-full pr-8">
                            {label}
                            {windowsHourlyPrice && (
                              <Text className="text-sm font-medium text-[--ods-color-success-500]">
                                {t(
                                  'creation:pci_instance_creation_windows_image_hourly_price',
                                  { price: getTextPrice(windowsHourlyPrice) },
                                )}
                              </Text>
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
                    className="px-6 max-w-[220px] text-center"
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

export default Distributionvariants;
