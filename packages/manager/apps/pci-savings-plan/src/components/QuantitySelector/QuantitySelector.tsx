import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_TYPE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_INPUT_SIZE,
  ODS_INPUT_TYPE,
} from '@ovhcloud/ods-components';
import {
  OsdsButton,
  OsdsIcon,
  OsdsInput,
  OsdsQuantity,
} from '@ovhcloud/ods-components/react';
import React from 'react';

type QuantitySelectorProps = {
  quantity: number;
  onMinusClick: () => void;
  onPlusClick: () => void;
};

const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  onMinusClick,
  onPlusClick,
}) => {
  // TODO: test change value on input
  return (
    <OsdsQuantity>
      <OsdsButton
        onClick={onMinusClick}
        slot="minus"
        size={ODS_BUTTON_SIZE.sm}
        color={ODS_THEME_COLOR_INTENT.primary}
        type={ODS_BUTTON_TYPE.button}
        variant={ODS_BUTTON_VARIANT.flat}
        text-align="center"
      >
        <OsdsIcon
          size={ODS_ICON_SIZE.sm}
          name={ODS_ICON_NAME.MINUS}
          color={ODS_THEME_COLOR_INTENT.default}
        />
      </OsdsButton>
      <OsdsInput
        type={ODS_INPUT_TYPE.number}
        color={ODS_THEME_COLOR_INTENT.primary}
        min={1}
        step={1}
        value={quantity}
        size={ODS_INPUT_SIZE.md}
      ></OsdsInput>
      <OsdsButton
        onClick={onPlusClick}
        slot="plus"
        size={ODS_BUTTON_SIZE.sm}
        color={ODS_THEME_COLOR_INTENT.primary}
        type={ODS_BUTTON_TYPE.button}
        variant={ODS_BUTTON_VARIANT.flat}
        text-align="center"
      >
        <OsdsIcon
          size={ODS_ICON_SIZE.sm}
          name={ODS_ICON_NAME.PLUS}
          color={ODS_THEME_COLOR_INTENT.default}
        ></OsdsIcon>
      </OsdsButton>
    </OsdsQuantity>
  );
};

export default QuantitySelector;
