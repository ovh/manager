import {
  Badge,
  Card,
  Checkbox,
  CheckboxCheckedChangeDetail,
  CheckboxCheckedState,
  CheckboxControl,
  Text,
} from '@ovhcloud/ods-react';
import { useState } from 'react';
import clsx from 'clsx';
import { Flag } from '../flag/Flag';
import { TCountryIsoCode } from '../flag/country-iso-code';
import { TDeploymentMode } from '@/types/instance/common.type';

export type TLocalizationCardProps = {
  title: string;
  subtitle: string;
  countryCode: TCountryIsoCode;
  deploymentMode: TDeploymentMode;
  onSelect?: (countryCode: TCountryIsoCode) => void;
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
  subtitle,
  countryCode,
  deploymentMode,
  onSelect,
}: TLocalizationCardProps) => {
  const [isSelected, setIsSelected] = useState<CheckboxCheckedState>(false);

  const handleCheckChange = (value: CheckboxCheckedChangeDetail) => {
    setIsSelected(value.checked);
    onSelect?.(countryCode);
  };

  return (
    <Card
      color={isSelected ? 'primary' : 'neutral'}
      className={clsx('px-6 py-4', {
        'bg-[--ods-color-information-050]': isSelected,
      })}
    >
      <div className="flex gap-5">
        <Checkbox onCheckedChange={handleCheckChange}>
          <CheckboxControl />
        </Checkbox>
        <Flag isoCode={countryCode} />
        <Text preset="heading-6" className="text-nowrap">
          {title}
        </Text>
      </div>
      <div className="flex justify-between gap-4">
        <Text className="text-[--ods-color-heading] text-nowrap">
          {subtitle}
        </Text>
        <Badge className={getBadgeClassName(deploymentMode)}>
          {deploymentMode}
        </Badge>
      </div>
    </Card>
  );
};
