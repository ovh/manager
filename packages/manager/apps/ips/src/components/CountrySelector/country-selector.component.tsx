import React from 'react';
import { useTranslation } from 'react-i18next';
import { OdsSelect, OdsSpinner } from '@ovhcloud/ods-components/react';
import {
  OdsSelectCustomEvent,
  OdsSelectChangeEventDetail,
  ODS_SPINNER_SIZE,
} from '@ovhcloud/ods-components';

export type CountrySelectorProps = {
  name: string;
  countryCodeList: string[];
  onChange?: (event: OdsSelectCustomEvent<OdsSelectChangeEventDetail>) => void;
  value?: string;
  isDisabled?: boolean;
  isLoading?: boolean;
  isReadyOnly?: boolean;
  onBlur?: () => void;
  className?: string;
};

export const CountrySelector: React.FC<CountrySelectorProps> = ({
  countryCodeList = [],
  onChange,
  className,
  isLoading,
  isReadyOnly,
  onBlur,
  ...props
}) => {
  const { t } = useTranslation('region-selector');

  if (isLoading) {
    return (
      <div>
        <OdsSpinner size={ODS_SPINNER_SIZE.sm} />
      </div>
    );
  }

  return (
    <OdsSelect
      key={countryCodeList.join('-')}
      className={`block w-full ${className}`}
      onOdsChange={onChange}
      onOdsBlur={onBlur}
      isReadonly={isReadyOnly}
      customRenderer={{
        option: (data) => `<div style="display: flex">
            <span>${t(
              `region-selector-country-name_${data.value.toUpperCase()}`,
            )}</span>
            <span style="width: 32px; height: 24px; margin: auto 15px auto auto; background-image: url('flags/${data.value.toLowerCase()}.svg')"></span>
          </div>`,
      }}
      {...props}
    >
      {countryCodeList.map((country) => (
        <option key={country} value={country}>
          {t(`region-selector-country-name_${country.toUpperCase()}`)}
        </option>
      ))}
    </OdsSelect>
  );
};
