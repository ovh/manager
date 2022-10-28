import React from 'react';
import {
  Menu,
  MenuButton,
  MenuList,
  Button,
  IconButton,
} from '@chakra-ui/react';
import { EllipsisIcon } from '@ovh-ux/manager-themes';
import ActionButton, { ActionButtonProps } from './ActionButton';

export type MenuActionButtonProps = ActionButtonProps & {
  key: string;
};

export type ActionMenuProps = {
  compact?: boolean;
  title?: string;
  disabled?: boolean;
  actions?: MenuActionButtonProps[];
};

export default function ActionMenu({
  compact = false,
  title,
  disabled = false,
  actions = [],
}: ActionMenuProps) {
  return (
    <Menu>
      <MenuButton
        as={compact ? IconButton : Button}
        icon={compact ? <EllipsisIcon /> : null}
        variant="outline"
        aria-label={title}
        isDisabled={disabled}
      ></MenuButton>
      <MenuList>
        {actions.map((action) => {
          // const { AsElement, elementAttribute } = actionButtonUtils(action);
          return (
            <ActionButton
              key={action.key}
              isMenuItem={true}
              {...action}
            ></ActionButton>
          );

          // return <MenuItem key={action.key} as={AsElement}></MenuItem>;
        })}
      </MenuList>
    </Menu>
  );
}
