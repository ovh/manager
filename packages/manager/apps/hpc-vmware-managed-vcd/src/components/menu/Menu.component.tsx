import { OdsButtonColor, OdsButtonSize } from '@ovhcloud/ods-components';
import { OdsButton, OdsPopover } from '@ovhcloud/ods-components/react';
import React from 'react';

type MenuProps = {
  items: {
    label: string;
    onClick: () => void;
    color?: OdsButtonColor;
  }[];
  name?: string;
  label?: string;
  size?: OdsButtonSize;
  withArrow?: boolean;
};

export const Menu = ({
  items,
  name,
  label,
  size = 'md',
  withArrow = false,
}: MenuProps) => {
  const menuName = name || 'menu';

  return (
    <div>
      <OdsButton
        label={label}
        id={`trigger-${menuName}`}
        icon="ellipsis-vertical"
        variant="outline"
        size={size}
      />
      <OdsPopover triggerId={`trigger-${menuName}`} withArrow={withArrow}>
        {items.map((item, i) => (
          <OdsButton
            key={`${menuName}-item-${i}`}
            label={item.label}
            className="my-button"
            variant="ghost"
            color={item.color || 'neutral'}
            onClick={item.onClick}
          ></OdsButton>
        ))}
      </OdsPopover>
    </div>
  );
};
