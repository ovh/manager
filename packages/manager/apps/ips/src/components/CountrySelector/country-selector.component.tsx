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
import { CountryOption } from './CountryOption';

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
      {...props}
      className={`block w-full ${className}`}
      onValueChange={onValueChange}
      value={[value]}
      items={countryCodeList.map((country) => ({
        label: t(`region-selector-country-name_${country.toUpperCase()}`),
        value: country,
        customRendererData: {
          country,
        },
      }))}
    >
      <SelectContent
        customOptionRenderer={(arg) => (
          <CountryOption
            countryName={arg.label}
            countryCode={arg.customData?.country || ''}
          />
        )}
      />
      <SelectControl
        customItemRenderer={(arg) => (
          <CountryOption
            countryName={arg.text}
            countryCode={arg.values?.[0]?.toLowerCase() || ''}
          />
        )}
      />
    </Select>
  );
};
