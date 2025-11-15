import React from 'react';
import { useTranslation } from 'react-i18next';
import { OdsSelect, OdsSpinner } from '@ovhcloud/ods-components/react';
import {
  OdsSelectCustomEvent,
  OdsSelectChangeEventDetail,
  ODS_SPINNER_SIZE,
  OdsSelectCustomRendererData,
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

  const optionRenderingFunction = (data: OdsSelectCustomRendererData) => `
  <div style="display:flex; gap: 8px; align-items: center;">
    <span style="width: 22px; height: 16px; background-size: cover; background-image: url('flags/${data.value.toLowerCase()}.svg')"></span>
    <span>${t(
      `region-selector-country-name_${data.value.toUpperCase()}`,
    )}</span>
  </div>
  `;

  return (
    <OdsSelect
      key={countryCodeList.join('-')}
      className={`block w-full ${className}`}
      onOdsChange={onChange}
      onOdsBlur={onBlur}
      isReadonly={isReadyOnly}
      customRenderer={{
        item: optionRenderingFunction,
        option: optionRenderingFunction,
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
