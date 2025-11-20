import { PciCard } from '@/components/pciCard/PciCard.component';
import {
  Radio,
  RadioControl,
  RadioGroup,
  RadioLabel,
  Text,
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
import { useEffect } from 'react';

type TDistributionvariants = {
  variants: TImageOption[];
};

const Distributionvariants = ({ variants }: TDistributionvariants) => {
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
            ({ label, available, value, windowsHourlyPrice, windowsId }) => (
              <PciCard
                key={value}
                selectable
                disabled={!available}
                className="justify-center p-5"
                selected={selectedImageVariantId === value}
                onClick={handleSelectImage(field, value, windowsId)}
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
                              {windowsHourlyPrice}
                            </Text>
                          )}
                        </span>
                      </DistributionImageLabel>
                    </RadioLabel>
                  </Radio>
                </PciCard.Header>
              </PciCard>
            ),
          )}
        </RadioGroup>
      )}
    />
  );
};

export default Distributionvariants;
