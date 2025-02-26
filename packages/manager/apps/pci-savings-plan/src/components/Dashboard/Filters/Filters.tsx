import { OdsSkeleton, OdsText } from '@ovhcloud/ods-components/react';
import { TFunction } from 'i18next';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/Select/Select';

import { InstanceTechnicalName } from '@/types/CreatePlan.type';
import { toMonthYear } from '@/utils/formatter/date';

export type Option = { label: string; value: string; prefix?: string };

const getSelectText = (value: string, options: Option[], t: TFunction) => {
  if (options.length === 0) {
    return t('dashboard_select_no_service');
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
  className,
  formatter,
}: {
  label: string;
  options: Option[];
  name: string;
  onChange: (value: T) => void;
  value: T;
  isLoading?: boolean;
  isDisabled?: boolean;
  className?: string;
  formatter?: (value: T) => string;
}) => {
  const { t } = useTranslation(['dashboard']);
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
        <SelectTrigger
          className={`text-foreground ${className} whitespace-nowrap overflow-hidden text-ellipsis`}
          id={name}
        >
          {getSelectText(formatter ? formatter(value) : value, options, t)}
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              <div className="flex flex-col items-start">
                <div>
                  <OdsText className={`text-bold text-l ${className}`}>
                    {option.label}
                  </OdsText>
                </div>

                {option.prefix && (
                  <div>
                    <OdsText>{option.prefix}</OdsText>
                  </div>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

interface FiltersProps {
  locale: string;
  period: string;
  flavor: string;
  setFlavor: (f: InstanceTechnicalName) => void;
  setPeriod: (p: string) => void;
  isLoading: boolean;
  periodOptions: Option[];
  flavorOptions: Option[];
}

const Filters = ({
  locale,
  period,
  flavor,
  setFlavor,
  setPeriod,
  isLoading,
  flavorOptions,
  periodOptions,
}: FiltersProps) => {
  const { t } = useTranslation(['dashboard', 'listing', 'create']);
  const { trackClick } = useOvhTracking();
  const formatterDate = (date: string) => toMonthYear(new Date(date), locale);

  const handleTrackClick = useCallback(() => {
    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.select,
      actionType: 'action',
      actions: [
        `see_savings_plan_consumption_details`,
        `select_model`,
        `${flavor}_${period}`,
      ],
    });
  }, [trackClick, flavor, period]);

  return (
    <div className="flex flex-row gap-4">
      <SelectWithLabel
        label={t('dashboard_select_label_period')}
        options={periodOptions}
        name="period"
        formatter={formatterDate}
        value={period}
        onChange={(value) => {
          setPeriod(value);
          handleTrackClick();
        }}
        className="capitalize"
      />

      <SelectWithLabel
        isDisabled={flavorOptions.length === 0}
        isLoading={isLoading}
        label={t('dashboard_select_label_service')}
        options={flavorOptions}
        name="flavor"
        value={flavor}
        key="flavor"
        onChange={(value: InstanceTechnicalName) => {
          setFlavor(value);
          handleTrackClick();
        }}
      />
    </div>
  );
};

export default Filters;
