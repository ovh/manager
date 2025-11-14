import { FC, useMemo } from 'react';
import { mockedDistributionImageList } from '@/__mocks__/instance/constants';
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
import { Controller, useFormContext, useWatch } from 'react-hook-form';
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
  const [distributionImageType, selectedDistributionImageName] = useWatch({
    control,
    name: ['distributionImageType', 'distributionImageName'],
  });
  const { trackClick } = useOvhTracking();

  // TODO: will be handle by a view-models
  const distributions = useMemo(
    () =>
      mockedDistributionImageList.filter(
        ({ type }) => distributionImageType === type,
      ),
    [distributionImageType],
  );

  const handleSelectImage = (distributionImage: string | null) => {
    if (!distributionImage) return;

    setValue('distributionImageName', distributionImage);

    trackClick({
      location: PageLocation.funnel,
      buttonType: ButtonType.tile,
      actionType: 'action',
      actions: ['add_instance', 'select_image', distributionImage],
    });
  };

  if (!selectedDistributionImageName) return null;

  return (
    <Controller
      control={control}
      name="distributionImageName"
      render={() => (
        <RadioGroup
          className={clsx(
            'grid gap-6 mt-10',
            getGridColumnClassname(distributions.length),
          )}
          value={selectedDistributionImageName}
          onValueChange={({ value }) => handleSelectImage(value)}
        >
          {distributions.map((distribution) => (
            <PciCard
              key={distribution.id}
              selectable
              className="justify-center p-5"
              selected={selectedDistributionImageName === distribution.id}
              onClick={() => handleSelectImage(distribution.id)}
            >
              <PciCard.Header>
                <Radio value={distribution.id}>
                  <RadioControl />
                  <RadioLabel
                    className={clsx(
                      'font-bold text-lg text-[--ods-color-heading]',
                      getLabelMaxWidthClassname(distributions.length),
                    )}
                  >
                    <DistributionImageLabel name={distribution.name}>
                      <span className="flex-1 max-w-full pr-8">
                        {distribution.label}
                        {distribution.price && (
                          <Text className="text-sm font-medium text-[--ods-color-success-500]">
                            {distribution.price}
                          </Text>
                        )}
                      </span>
                    </DistributionImageLabel>
                  </RadioLabel>
                </Radio>
              </PciCard.Header>
            </PciCard>
          ))}
        </RadioGroup>
      )}
    />
  );
};

export default DistributionImageList;
