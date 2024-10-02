import React, { SetStateAction } from 'react';
import { Subtitle, Description } from '@ovh-ux/manager-react-components';
import {
  OsdsButton,
  OsdsIcon,
  OsdsInput,
  OsdsQuantity,
} from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_VARIANT,
  ODS_BUTTON_SIZE,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_INPUT_TYPE,
} from '@ovhcloud/ods-components';

type QuantitySelectorProps = {
  quantity: number;
  setQuantity: React.Dispatch<SetStateAction<number>>;
  isValid: boolean;
  min?: number;
  max?: number;
  title?: string;
  label?: string;
};

export const QuantitySelector = ({
  quantity,
  setQuantity,
  isValid,
  min = 1,
  max = 100,
  title,
  label,
}: QuantitySelectorProps) => (
  <React.Fragment>
    {title && <Subtitle>{title}</Subtitle>}
    {label && <Description className="my-4">{label}</Description>}
    <OsdsQuantity>
      <OsdsButton
        slot="minus"
        variant={ODS_BUTTON_VARIANT.stroked}
        color={ODS_THEME_COLOR_INTENT.primary}
        size={ODS_BUTTON_SIZE.sm}
        text-align="center"
        className="rounded-none"
      >
        <OsdsIcon
          name={ODS_ICON_NAME.MINUS}
          size={ODS_ICON_SIZE.sm}
          color={ODS_THEME_COLOR_INTENT.primary}
        />
      </OsdsButton>
      <OsdsInput
        type={ODS_INPUT_TYPE.number}
        value={quantity}
        color={
          isValid
            ? ODS_THEME_COLOR_INTENT.primary
            : ODS_THEME_COLOR_INTENT.error
        }
        onOdsValueChange={(event) => setQuantity(Number(event.detail.value))}
        min={min}
        max={max}
      />
      <OsdsButton
        slot="plus"
        variant={ODS_BUTTON_VARIANT.stroked}
        color={ODS_THEME_COLOR_INTENT.primary}
        size={ODS_BUTTON_SIZE.sm}
        text-align="center"
      >
        <OsdsIcon
          name={ODS_ICON_NAME.PLUS}
          size={ODS_ICON_SIZE.xs}
          color={ODS_THEME_COLOR_INTENT.primary}
        />
      </OsdsButton>
    </OsdsQuantity>
  </React.Fragment>
);
