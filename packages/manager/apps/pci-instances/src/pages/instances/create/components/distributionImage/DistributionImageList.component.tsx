import { FC, useEffect, useMemo } from 'react';
import { mockedDistributionImageList } from '@/__mocks__/instance/constants';
import { PciCard } from '@/components/pciCard/PciCard.component';
import {
  Radio,
  RadioControl,
  RadioGroup,
  RadioLabel,
  RadioValueChangeDetail,
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
import clsx from 'clsx';
import { isEven } from '@/utils';

const getGridColumnClassname = (nbItems: number) =>
  nbItems > 1 ? `grid-cols-${isEven(nbItems) ? 2 : 3}` : null;

const getLabelMaxWidthClassname = (nbItems: number) => {
  if (nbItems === 1) return null;

  return isEven(nbItems) ? 'max-w-[300px]' : 'max-w-[200px]';
};

const DistributionImageList: FC = () => {
  const { control, setValue } = useFormContext<TInstanceCreationForm>();
  const [distributionImageType, selectedImageId] = useWatch({
    control,
    name: ['distributionImageType', 'distributionImageId'],
  });
  const { trackClick } = useOvhTracking();

  // TODO: will be handle by a view-models
  const distributions = useMemo(
    () =>
      mockedDistributionImageList.filter(
        ({ category }) => distributionImageType === category,
      ),
    [distributionImageType],
  );

  const handleSelectImage = (
    field: ControllerRenderProps<TInstanceCreationForm, 'distributionImageId'>,
  ) => ({ value }: RadioValueChangeDetail) => {
    if (!value) return;

    field.onChange(value);

    trackClick({
      location: PageLocation.funnel,
      buttonType: ButtonType.tile,
      actionType: 'action',
      actions: ['add_instance', 'select_image', value],
    });
  };

  useEffect(() => {
    const distributionImage = distributions.find(
      ({ category, unavailable }) =>
        distributionImageType === category && !unavailable,
    );

    setValue('distributionImageId', distributionImage?.imageId ?? null);
  }, [distributionImageType, distributions, setValue]);

  return (
    <Controller
      control={control}
      name="distributionImageId"
      render={({ field }) => (
        <RadioGroup
          className={clsx(
            'grid gap-6 mt-8',
            getGridColumnClassname(distributions.length),
          )}
          {...(selectedImageId && { value: selectedImageId })}
          onValueChange={handleSelectImage(field)}
        >
          {distributions.map(
            ({ subCategory, label, pricing, unavailable, imageId }) => (
              <PciCard
                key={imageId}
                selectable
                disabled={!!unavailable}
                className="justify-center p-5"
                selected={selectedImageId === imageId}
                onClick={() => handleSelectImage(field)({ value: imageId })}
              >
                <PciCard.Header>
                  <Radio disabled={!!unavailable} value={imageId}>
                    <RadioControl />
                    <RadioLabel
                      className={clsx(
                        'font-bold text-lg text-[--ods-color-heading]',
                        getLabelMaxWidthClassname(distributions.length),
                      )}
                    >
                      <DistributionImageLabel name={subCategory}>
                        <span className="flex-1 max-w-full pr-8">
                          {label}
                          {pricing && (
                            <Text className="text-sm font-medium text-[--ods-color-success-500]">
                              {pricing}
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

export default DistributionImageList;
