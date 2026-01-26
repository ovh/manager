import React from 'react';

import { useTranslation } from 'react-i18next';

import {
  Select,
  Spinner,
  SPINNER_SIZE,
  SelectContent,
  SelectControl,
  SelectValueChangeDetail,
} from '@ovhcloud/ods-react';

export type CountrySelectorProps = {
  name: string;
  countryCodeList: string[];
  onValueChange?: (event: SelectValueChangeDetail) => void;
  value?: string;
  disabled?: boolean;
  loading?: boolean;
  readOnly?: boolean;
  onBlur?: () => void;
  className?: string;
};

export const CountrySelector: React.FC<CountrySelectorProps> = ({
  countryCodeList = [],
  onValueChange,
  className,
  loading,
  value,
  ...props
}) => {
  const { t } = useTranslation('region-selector');

  if (loading) {
    return (
      <div>
        <Spinner size={SPINNER_SIZE.sm} />
      </div>
    );
  }

  return (
    <Select
      key={countryCodeList.join('-')}
      className={`block w-full ${className}`}
      onValueChange={onValueChange}
      value={[value]}
      {...props}
      items={countryCodeList.map((country) => ({
        label: t(`region-selector-country-name_${country.toUpperCase()}`),
        value: country,
      }))}
    >
      <SelectContent />
      <SelectControl
        customItemRenderer={(arg: { value: string; label: string }) => (
          <div className="flex gap-2 items-center">
            <span
              className="w-[22px] h-[16px] bg-cover"
              style={{
                backgroundImage: `url('flags/${arg.value?.toLowerCase() ||
                  ''}.svg')`,
              }}
            />
            <span>{arg.text}</span>
          </div>
        )}
      />
    </Select>
  );
};
