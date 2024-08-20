import {
  OsdsButton,
  OsdsFormField,
  OsdsIcon,
  OsdsInput,
  OsdsQuantity,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_INPUT_TYPE,
} from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import React, { useEffect, useState } from 'react';

import '../../translations/quantity-selector';

export interface QuantitySelectorProps {
  label?: string;
  value: number;
  onValueChange: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
}

export function QuantitySelector({
  label,
  value,
  onValueChange,
  min,
  max,
  className,
}: Readonly<QuantitySelectorProps>) {
  const { t } = useTranslation('pci-quantity-selector');
  const [, setCounter] = useState(0);
  const error = {
    min: min !== undefined && value < min,
    max: max !== undefined && value > max,
    nan: Number.isNaN(value),
  };
  const isValid = !error.min && !error.max && !error.nan;
  const forceRedraw = () => setCounter((i) => i + 1);

  // forced redraw to fix ODS quantity not refreshing
  useEffect(forceRedraw, [min, max]);

  return (
    <OsdsFormField className={className} inline>
      {label && (
        <OsdsText
          color={ODS_THEME_COLOR_INTENT.text}
          size={ODS_THEME_TYPOGRAPHY_SIZE._200}
          slot="label"
        >
          {label}
        </OsdsText>
      )}
      <OsdsQuantity>
        <OsdsButton
          slot="minus"
          variant={ODS_BUTTON_VARIANT.flat}
          color={ODS_THEME_COLOR_INTENT.primary}
          size={ODS_BUTTON_SIZE.sm}
          text-align="center"
          data-testid="quantity-button-minus"
          disabled={min !== undefined && value - 1 < min ? true : undefined}
        >
          <OsdsIcon
            name={ODS_ICON_NAME.MINUS}
            size={ODS_ICON_SIZE.sm}
            className="mr-2 bg-white"
          />
        </OsdsButton>
        <OsdsInput
          type={ODS_INPUT_TYPE.number}
          value={value}
          data-testid="quantity-input"
          color={
            isValid
              ? ODS_THEME_COLOR_INTENT.primary
              : ODS_THEME_COLOR_INTENT.error
          }
          onOdsValueChange={(event) => {
            forceRedraw();
            onValueChange(Number(event.detail.value));
          }}
          min={min}
          max={max}
        />
        <OsdsButton
          slot="plus"
          variant={ODS_BUTTON_VARIANT.flat}
          color={ODS_THEME_COLOR_INTENT.primary}
          size={ODS_BUTTON_SIZE.sm}
          text-align="center"
          data-testid="quantity-button-plus"
          disabled={max !== undefined && value + 1 > max ? true : undefined}
        >
          <OsdsIcon
            className="mr-2 bg-white"
            name={ODS_ICON_NAME.PLUS}
            size={ODS_ICON_SIZE.xs}
          />
        </OsdsButton>
      </OsdsQuantity>
      {error.min && (
        <OsdsText color={ODS_THEME_COLOR_INTENT.error} slot="helper">
          {t('common_field_error_min', { min })}
        </OsdsText>
      )}
      {error.max && (
        <OsdsText color={ODS_THEME_COLOR_INTENT.error} slot="helper">
          {t('common_field_error_max', { max })}
        </OsdsText>
      )}
      {error.nan && (
        <OsdsText color={ODS_THEME_COLOR_INTENT.error} slot="helper">
          {t('common_field_error_number')}
        </OsdsText>
      )}
    </OsdsFormField>
  );
}
