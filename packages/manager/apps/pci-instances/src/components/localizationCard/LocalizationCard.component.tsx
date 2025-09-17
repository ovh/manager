import { Card, Radio, RadioControl, Text } from '@ovhcloud/ods-react';
import clsx from 'clsx';
import { Controller, useFormContext } from 'react-hook-form';
import { Flag } from '../flag/Flag';
import { TCountryIsoCode } from '../flag/country-iso-code';
import { TDeploymentMode } from '@/types/instance/common.type';
import { DeploymentModeBadge } from '../deploymentModeBadge/DeploymentModeBadge.component';

export type TLocalizationCardProps = {
  title: string;
  region: string;
  countryCode: TCountryIsoCode;
  deploymentMode: TDeploymentMode;
  onSelect?: (region: string) => void;
};

export const LocalizationCard = ({
  title,
  region,
  countryCode,
  deploymentMode,
  onSelect,
}: TLocalizationCardProps) => {
  const { control } = useFormContext<{ region: string }>();

  return (
    <Controller
      name="region"
      control={control}
      render={({ field }) => {
        const isSelected = field.value === region;
        const handleSelectChange = () => {
          field.onChange(region);
          onSelect?.(region);
        };

        return (
          <Radio value={region} className="w-full">
            <Card
              color={isSelected ? 'primary' : 'neutral'}
              className={clsx('px-6 py-4 hover:cursor-pointer w-full', {
                'bg-[--ods-color-information-050]': isSelected,
              })}
              onClick={handleSelectChange}
            >
              <div className="flex gap-5">
                <RadioControl />
                <Flag isoCode={countryCode} />
                <Text preset="heading-6" className="text-nowrap">
                  {title}
                </Text>
              </div>
              <div className="flex justify-between gap-4">
                <Text className="text-[--ods-color-heading] text-nowrap">
                  {region}
                </Text>
                <DeploymentModeBadge mode={deploymentMode} />
              </div>
            </Card>
          </Radio>
        );
      }}
    />
  );
};
