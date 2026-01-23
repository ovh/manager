import React from 'react';

import {
  BUTTON_SIZE,
  BUTTON_VARIANT,
  Button,
  ICON_NAME,
  Icon,
  TEXT_PRESET,
  Text,
} from '@ovhcloud/ods-react';

export type EditButtonProps = React.PropsWithChildren<{
  isDisabled?: boolean;
  onClick: () => void;
}>;

export const EditButton: React.FC<EditButtonProps> = ({ children, ...props }) => (
  <div className="flex items-center">
    <div className="grow">
      <Text preset={TEXT_PRESET.paragraph}>{children}</Text>
    </div>
    <div className="flex-none">
      <Button
        {...props}
        className="ml-2"
        type="button"
        variant={BUTTON_VARIANT.ghost}
        size={BUTTON_SIZE.sm}
      >
        <Icon name={ICON_NAME.pen} />
      </Button>
    </div>
  </div>
);
