/* eslint-disable import/no-extraneous-dependencies */
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { OsdsInput, OsdsText } from '@ovhcloud/ods-components/react';
import {
  ODS_INPUT_TYPE,
  ODS_TEXT_SIZE,
  OdsInputValueChangeEventDetail,
  OsdsInputCustomEvent,
} from '@ovhcloud/ods-components';
import {
  ODS_THEME_COLOR_HUE,
  ODS_THEME_COLOR_INTENT,
} from '@ovhcloud/ods-common-theming';
import ipaddr from 'ipaddr.js';
import './translations/translations';

export enum IpType {
  ipV4 = 'ipV4',
  ipV6 = 'ipV6',
  cidr = 'cidr',
}

export interface IpsProps {
  ipType?: IpType;
  title?: string;
  inline?: boolean;
  required?: boolean;
  forbiddenValues?: string[];
  placeHolder?: string;
  onChange?: (value: string) => void;
}

export const Ips: React.FC<IpsProps> = ({
  ipType = IpType.ipV4,
  title,
  inline = false,
  forbiddenValues,
  required,
  placeHolder,
  onChange,
}) => {
  const { t } = useTranslation('ips');
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const validateForbiddenValues = (value: string): boolean => {
    return !forbiddenValues.includes(value);
  };
  const isValidCIDR = (value: string): boolean => {
    try {
      const [, prefixLength] = ipaddr.parseCIDR(value);
      return prefixLength !== null;
    } catch (e) {
      return false;
    }
  };
  const validateIP = (value: string): boolean => {
    try {
      const ip = ipaddr.parse(value);

      switch (ipType) {
        case IpType.ipV4:
          return ip.kind() === 'ipv4';
        case IpType.ipV6:
          return ip.kind() === 'ipv6';
        case IpType.cidr:
          return isValidCIDR(value);
        default:
          return false;
      }
    } catch (e) {
      return false;
    }
  };

  const handleInputChange = (
    event: OsdsInputCustomEvent<OdsInputValueChangeEventDetail>,
  ) => {
    const value = event?.detail?.value;
    let currentError: string | null = null;

    if (!validateForbiddenValues(value)) {
      currentError = t('ips_error_forbidden');
    } else if (!validateIP(value)) {
      switch (ipType) {
        case IpType.ipV4:
          currentError = t('ips_error_v4');
          break;
        case IpType.cidr:
          if (!isValidCIDR(value)) {
            currentError = t('ips_error_cidr_format');
          }
          break;
        case IpType.ipV6:
          currentError = t('ips_error_v6');
          break;
        default:
          currentError = t('ips_error_invalid');
          break;
      }
    }

    setError(currentError);

    setInputValue(value);
    if (onChange) {
      onChange(value);
    }
  };
  return (
    <div className="flex flex-col space-y-4">
      {title && (
        <OsdsText
          color={ODS_THEME_COLOR_INTENT.text}
          size={ODS_TEXT_SIZE._200}
          hue={ODS_THEME_COLOR_HUE._500}
        >
          {title}
        </OsdsText>
      )}
      <OsdsInput
        type={ODS_INPUT_TYPE.text}
        color={ODS_THEME_COLOR_INTENT.primary}
        placeholder={placeHolder}
        value={inputValue}
        aria-label="rancher-name-input"
        onOdsValueChange={handleInputChange}
        required={required}
        inline={inline}
      />
      {error && (
        <OsdsText color={ODS_THEME_COLOR_INTENT.error}>{error}</OsdsText>
      )}
    </div>
  );
};

export default Ips;
