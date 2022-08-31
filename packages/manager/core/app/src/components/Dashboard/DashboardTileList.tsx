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

import { DashboardTileDefinition, DashboardTileDefinitionAction } from '.';

export type DashboardTileListProps = {
  definitions: DashboardTileDefinition[];
  data: unknown;
  isLoading?: boolean;
};

export default function DashboardTileList({
  definitions,
  data,
}: DashboardTileListProps): JSX.Element {
  const getActionList = (actions: DashboardTileDefinitionAction[]) => {
    if (!actions?.length) {
      return '';
    }

    const getMenuItem = (action: DashboardTileDefinitionAction) => {
      if (Object.prototype.hasOwnProperty.call(action, 'to')) {
        return (
          <MenuItem as={RouterLink} to={action.to} aria-label={action.title}>
            {action.label}
          </MenuItem>
        );
      }

      if (Object.prototype.hasOwnProperty.call(action, 'href')) {
        return (
          <MenuItem
            as={Link}
            href={action.href}
            isExternal={action.isExternal}
            aria-label={action.title}
            onClick={action.onClick}
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
          {actions.map((action: DashboardTileDefinitionAction) => (
            <Fragment key={action.name}>{getMenuItem(action)}</Fragment>
          ))}
        </MenuList>
      </Menu>
    );
  };

  return (
    <>
      {definitions.map((definition: DashboardTileDefinition) => {
        return (
          <TileSection
            key={definition.name}
            title={definition.title}
            description={
              typeof definition.description === 'function'
                ? definition.description(data)
                : definition?.description || ''
            }
            action={getActionList(
              typeof definition.actions === 'function'
                ? definition.actions(data)
                : definition.actions || [],
            )}
          ></TileSection>
        );
      })}
    </>
  );
}
