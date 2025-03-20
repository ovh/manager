import React from 'react';
import { OdsButton, OdsText } from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_TEXT_PRESET,
  ODS_BUTTON_COLOR,
} from '@ovhcloud/ods-components';
import { handleClick } from '@ovh-ux/manager-react-components';

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
      <OdsText preset={ODS_TEXT_PRESET.paragraph}>{children}</OdsText>
    </div>
    <div className="flex-none">
      <OdsButton
        className="ml-2"
        color={ODS_BUTTON_COLOR.primary}
        variant={ODS_BUTTON_VARIANT.outline}
        type="button"
        size={ODS_BUTTON_SIZE.sm}
        {...handleClick(onClick)}
        isDisabled={disabled}
        data-testid="edit-button"
        label=""
        icon={ODS_ICON_NAME.pen}
      />
    </div>
  </div>
);
