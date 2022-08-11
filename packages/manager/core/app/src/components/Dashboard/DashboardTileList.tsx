import React from 'react';
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { EllipsisIcon, TileSection } from '@ovh-ux/manager-themes';

export default function DashboardTileList({ items, data }: any): JSX.Element {
  const getActionList = (actions: any) => {
    if (!actions?.length) {
      return '';
    }

    return (
      <Menu>
        <MenuButton
          as={IconButton}
          isRound
          variant="outline"
          icon={<EllipsisIcon />}
        />
        <MenuList>
          {actions.map((action) =>
            Object.prototype.hasOwnProperty.call(action, 'to') ? (
              <MenuItem
                as={RouterLink}
                to={action.to}
                key={action.name}
                aria-label={action.title}
              >
                {action.label}
              </MenuItem>
            ) : (
              <MenuItem
                key={action.name}
                aria-label={action.title}
                onClick={action?.onClick.bind(null, data)}
              >
                {action.label}
              </MenuItem>
            ),
          )}
        </MenuList>
      </Menu>
    );
  };

  return (
    <>
      {items.map((item: any) => {
        return (
          <TileSection
            key={item.name}
            title={item.title}
            description={item.getDescription(data) || ''}
            action={getActionList(item.actions)}
          ></TileSection>
        );
      })}
    </>
  );
}
