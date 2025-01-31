import { OdsSkeleton, OdsText } from '@ovhcloud/ods-components/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/Select/Select';

import { InstanceTechnicalName } from '@/types/CreatePlan.type';

type Option = { label: string; value: string; prefix?: string };

const getSelectText = (value: string, options: Option[]) => {
  if (options.length === 0) {
    return 'No options';
  }

  const selectedOption = options.find((v) => v.value === value);
  const prefix = selectedOption?.prefix || '';
  return `${prefix}${prefix ? ' - ' : ''}${value}`;
};

const SelectWithLabel = <T extends string>({
  label,
  options,
  name,
  onChange,
  value,
  isLoading,
  isDisabled,
}: {
  label: string;
  options: Option[];
  name: string;
  onChange: (value: T) => void;
  value: T;
  isLoading?: boolean;
  isDisabled?: boolean;
}) => {
  if (isLoading) {
    return (
      <div className="flex flex-col w-64 justify-center">
        <OdsSkeleton />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-64">
      <label htmlFor={name} className="mb-1 text-sm font-medium text-[#4D5592]">
        {label}
      </label>
      <Select
        aria-label={label}
        name={name}
        onValueChange={onChange}
        value={value}
        disabled={isDisabled}
      >
        <SelectTrigger className="text-foreground" id={name}>
          <span>{getSelectText(value, options)}</span>
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              <div className="flex flex-col items-start">
                {option.prefix && (
                  <div>
                    <OdsText className="text-bold text-l">
                      {option.prefix}
                    </OdsText>
                  </div>
                )}
                <div>
                  <OdsText>{option.label}</OdsText>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

interface FiltersProps {
  period: string;
  flavor: string;
  setFlavor: (f: InstanceTechnicalName) => void;
  setPeriod: (p: string) => void;
  isLoading: boolean;
  periodOptions: Option[];
  flavorOptions: Option[];
}

const Filters = ({
  period,
  flavor,
  setFlavor,
  setPeriod,
  isLoading,
  flavorOptions,
  periodOptions,
}: FiltersProps) => {
  const { t } = useTranslation(['dashboard', 'listing', 'create']);

  return (
    <div className="flex flex-row gap-4">
      <SelectWithLabel
        label={t('dashboard_select_label_period')}
        options={periodOptions}
        name="period"
        value={period}
        onChange={setPeriod}
      />

      <SelectWithLabel
        isDisabled={flavorOptions.length === 0}
        isLoading={isLoading}
        label={t('dashboard_select_label_flavor')}
        options={flavorOptions}
        name="flavor"
        value={flavor}
        key="flavor"
        onChange={setFlavor}
      />
    </div>
  );
};

export default Filters;
