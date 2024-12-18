import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_INPUT_SIZE,
  ODS_INPUT_TYPE,
} from '@ovhcloud/ods-components';
import {
  OdsButton,
  OdsIcon,
  OdsInput,
  OdsQuantity,
} from '@ovhcloud/ods-components/react';
import React from 'react';

type QuantitySelectorProps = {
  quantity: number;
  onMinusClick: () => void;
  onPlusClick: () => void;
  onChangeQuantity: (v?: number) => void;
};

export const MAX_QUANTITY = 1000;
const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  onMinusClick,
  onPlusClick,
  onChangeQuantity,
}) => {
  const isDisabledPlus = quantity >= MAX_QUANTITY;

  return (
    <OdsQuantity>
      <OdsButton
        data-testid="minus-button"
        onClick={onMinusClick}
        slot="minus"
        size={ODS_BUTTON_SIZE.sm}
        color={ODS_THEME_COLOR_INTENT.primary}
        type={ODS_BUTTON_TYPE.button}
        variant={ODS_BUTTON_VARIANT.flat}
        text-align="center"
      >
        <OdsIcon
          size={ODS_ICON_SIZE.sm}
          name={ODS_ICON_NAME.MINUS}
          contrasted
        />
      </OdsButton>
      <OdsInput
        data-testid="input-quantity"
        type={ODS_INPUT_TYPE.number}
        color={ODS_THEME_COLOR_INTENT.primary}
        min={1}
        max={MAX_QUANTITY}
        step={1}
        value={quantity}
        onOdsChange={(e) => {
          const value = Number(e.detail.value);
          if (value > 0 && value <= MAX_QUANTITY) {
            onChangeQuantity(value);
          }
        }}
        size={ODS_INPUT_SIZE.md}
      ></OdsInput>
      <OdsButton
        isDisabled={isDisabledPlus || null}
        data-testid="plus-button"
        onClick={!isDisabledPlus ? onPlusClick : null}
        slot="plus"
        size={ODS_BUTTON_SIZE.sm}
        color={ODS_THEME_COLOR_INTENT.primary}
        type={ODS_BUTTON_TYPE.button}
        variant={ODS_BUTTON_VARIANT.flat}
        text-align="center"
      >
        <OdsIcon
          size={ODS_ICON_SIZE.sm}
          name={ODS_ICON_NAME.PLUS}
          contrasted
        ></OdsIcon>
      </OdsButton>
    </OdsQuantity>
  );
};

export default QuantitySelector;
