import {
  OsdsButton,
  OsdsIcon,
  OsdsInput,
  OsdsQuantity,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_INPUT_TYPE,
} from '@ovhcloud/ods-components';

interface PciNumberInputProps {
  value: number;
  label: string;
  description?: string;
  onChange: (value: number) => void;
  minValue?: number;
  maxValue?: number;
}

// @TODO export to pci common
export function PciNumberInput({
  value,
  label,
  description,
  onChange,
  minValue = 0,
  maxValue = 99999,
}: Readonly<PciNumberInputProps>) {
  return (
    <>
      <OsdsText
        level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
        size={ODS_THEME_TYPOGRAPHY_SIZE._200}
        color={ODS_THEME_COLOR_INTENT.text}
      >
        <span className="font-bold">{label}</span>
      </OsdsText>
      <OsdsQuantity>
        <OsdsButton
          slot="minus"
          variant={ODS_BUTTON_VARIANT.flat}
          color={ODS_THEME_COLOR_INTENT.primary}
          data-testid="pciNumberInput-minus"
          size={ODS_BUTTON_SIZE.sm}
          text-align="center"
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
          data-testid="pciNumberInput-input"
          color={ODS_THEME_COLOR_INTENT.primary}
          onOdsValueChange={(event) => {
            let newValue = Number(event.detail.value);
            if (newValue < minValue) newValue = minValue;
            if (newValue > maxValue) newValue = maxValue;
            if (Number.isNaN(newValue)) newValue = minValue;
            onChange(newValue);
          }}
          min={minValue}
          max={maxValue}
        />
        <OsdsButton
          slot="plus"
          variant={ODS_BUTTON_VARIANT.flat}
          color={ODS_THEME_COLOR_INTENT.primary}
          data-testid="pciNumberInput-plus"
          size={ODS_BUTTON_SIZE.sm}
          text-align="center"
        >
          <OsdsIcon
            className="mr-2 bg-white"
            name={ODS_ICON_NAME.PLUS}
            size={ODS_ICON_SIZE.xs}
          />
        </OsdsButton>
      </OsdsQuantity>
      {description && (
        <OsdsText
          level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
          size={ODS_THEME_TYPOGRAPHY_SIZE._100}
          color={ODS_THEME_COLOR_INTENT.text}
        >
          {description}
        </OsdsText>
      )}
    </>
  );
}
