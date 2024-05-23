import React from 'react';
import { OsdsButton, OsdsIcon, OsdsText } from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_TYPE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_TEXT_SIZE,
  ODS_TEXT_LEVEL,
} from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { handleClick } from '@/utils/ods-utils';

export type EditButtonProps = React.PropsWithChildren<{
  disabled?: boolean;
  onClick: () => void;
}>;

export const EditButton: React.FC<EditButtonProps> = ({
  children,
  disabled,
  onClick,
}) => (
  <div className="flex items-center">
    <div className="grow">
      <OsdsText
        level={ODS_TEXT_LEVEL.body}
        size={children ? ODS_TEXT_SIZE._800 : ODS_TEXT_SIZE._300}
        color={ODS_THEME_COLOR_INTENT.text}
      >
        {children}
      </OsdsText>
    </div>
    <div className="flex-none">
      <OsdsButton
        className="ml-2"
        inline
        circle
        color={ODS_THEME_COLOR_INTENT.primary}
        variant={ODS_BUTTON_VARIANT.stroked}
        type={ODS_BUTTON_TYPE.button}
        size={ODS_BUTTON_SIZE.sm}
        {...handleClick(onClick)}
        disabled={disabled || undefined}
      >
        <OsdsIcon
          color={ODS_THEME_COLOR_INTENT.primary}
          name={ODS_ICON_NAME.PEN}
          size={ODS_ICON_SIZE.xs}
        />
      </OsdsButton>
    </div>
  </div>
);
