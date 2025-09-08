import { Badge, Card, Radio, RadioControl, Text } from '@ovhcloud/ods-react';
import clsx from 'clsx';
import { Flag } from '../flag/Flag';
import { TCountryIsoCode } from '../flag/country-iso-code';
import { TDeploymentMode } from '@/types/instance/common.type';
import { Controller, useFormContext } from 'react-hook-form';

export type TLocalizationCardProps = {
  title: string;
  region: string;
  countryCode: TCountryIsoCode;
  deploymentMode: TDeploymentMode;
  onSelect?: (region: string) => void;
};

const getBadgeClassName = (mode: TDeploymentMode) => {
  switch (mode) {
    case '1AZ':
      return 'bg-[--ods-color-information-400] text-[--ods-color-information-000]';
    case '3AZ':
      return 'bg-[--ods-color-information-700] text-[--ods-color-information-000]';
    case 'LZ':
      return 'bg-[--ods-color-information-100] text-[--ods-color-information-700]';
  }
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
                <Badge className={getBadgeClassName(deploymentMode)}>
                  {deploymentMode}
                </Badge>
              </div>
            </Card>
          </Radio>
        );
      }}
    />
  );
};
