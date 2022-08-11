import React, { Fragment } from 'react';
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Link,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { EllipsisIcon, TileSection } from '@ovh-ux/manager-themes';

export default function DashboardTileList({ items, data }: any): JSX.Element {
  const getActionList = (actions: any) => {
    if (!actions?.length) {
      return '';
    }

    const getMenuItem = (action: any) => {
      if (Object.prototype.hasOwnProperty.call(action, 'to')) {
        return (
          <MenuItem as={RouterLink} to={action.to} aria-label={action.title}>
            {action.label}
          </MenuItem>
        );
      }

      if (action.href) {
        return (
          <MenuItem
            as={Link}
            href={action.href}
            isExternal={action.isExternal}
            aria-label={action.title}
          >
            {action.label}
          </MenuItem>
        );
      }

      return (
        <MenuItem
          aria-label={action.title}
          onClick={action?.onClick.bind(null, data)}
        >
          {action.label}
        </MenuItem>
      );
    };
    return (
      <Menu>
        <MenuButton
          as={IconButton}
          isRound
          variant="outline"
          icon={<EllipsisIcon />}
        />
        <MenuList>
          {actions.map((action) => (
            <Fragment key={action.name}>{getMenuItem(action)}</Fragment>
          ))}
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
