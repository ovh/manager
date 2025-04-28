import React from 'react';
import { useTranslation } from 'react-i18next';
import { OdsSelect } from '@ovhcloud/ods-components/react';
import {
  OdsSelectCustomEvent,
  OdsSelectChangeEventDetail,
} from '@ovhcloud/ods-components';

export type CountrySelectorProps = {
  name: string;
  countryCodeList: string[];
  onChange?: (event: OdsSelectCustomEvent<OdsSelectChangeEventDetail>) => void;
  value?: string;
  isDisabled?: boolean;
  className?: string;
};

export const CountrySelector: React.FC<CountrySelectorProps> = ({
  countryCodeList = [],
  onChange,
  className,
  ...props
}) => {
  const { t } = useTranslation('region-selector');

  return (
    <OdsSelect
      key={countryCodeList.join('-')}
      className={`block w-full ${className}`}
      onOdsChange={onChange}
      customRenderer={{
        option: (data) => `<div style="display: flex">
            <span>${t(`region-selector-country-name_${data.value}`)}</span>
            <span style="width: 32px; height: 24px; margin: auto 15px auto auto; background-image: url('flags/${
              data.value
            }.svg')"></span>
          </div>`,
      }}
      {...props}
    >
      {countryCodeList.map((country) => (
        <option key={country} value={country}>
          {t(`region-selector-country-name_${country}`)}
        </option>
      ))}
    </OdsSelect>
  );
};
