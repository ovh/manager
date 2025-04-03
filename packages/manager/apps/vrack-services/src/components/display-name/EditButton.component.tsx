import React from 'react';
import { OdsButton, OdsText } from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';

export type EditButtonProps = React.PropsWithChildren<{
  isDisabled?: boolean;
  onClick: () => void;
}>;

export const EditButton: React.FC<EditButtonProps> = ({
  children,
  ...props
}) => (
  <div className="flex items-center">
    <div className="grow">
      <OdsText preset={ODS_TEXT_PRESET.paragraph}>{children}</OdsText>
    </div>
    <div className="flex-none">
      <OdsButton
        {...props}
        className="ml-2"
        type="button"
        variant={ODS_BUTTON_VARIANT.ghost}
        size={ODS_BUTTON_SIZE.sm}
        label=""
        icon={ODS_ICON_NAME.pen}
      />
    </div>
  </div>
);
