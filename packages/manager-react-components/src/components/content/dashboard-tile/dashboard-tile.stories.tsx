import React from 'react';
import { Meta } from '@storybook/react';
import { OdsSkeleton, OdsText } from '@ovhcloud/ods-components/react';
import {
  DashboardTile,
  DashboardTileBlockItem,
} from './dashboard-tile.component';
import ActionMenu from '../../navigation/menus/action/action.component';
import { Clipboard } from '../../clipboard/clipboard.component';

const actionItems = [
  {
    id: 1,
    href: 'https://ovhcloud.com',
    label: 'Action 1',
  },
  {
    id: 2,
    onClick: () => window.open('https://ovhcloud.com', '_blank', 'noopener'),
    label: 'Action 2',
  },
];

const items: DashboardTileBlockItem[] = [
  {
    id: 'component-example',
    label: 'Component Example',
    value: <OdsText preset="span">Test Value</OdsText>,
  },
  {
    id: 'long-text',
    label: 'Long Text',
    value: (
      <OdsText preset="paragraph">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat.
      </OdsText>
    ),
  },
  {
    id: 'loading-component-example',
    label: 'Loading',
    value: <OdsSkeleton />,
  },
  {
    id: 'clipboard',
    label: 'Clipboard',
    value: <Clipboard className="w-full" value="example value" />,
  },
  {
    id: 'menu-example',
    label: 'Menu Example',
    value: (
      <div className="flex items-center justify-between">
        <OdsText preset="span">Test Value</OdsText>
        <ActionMenu isCompact items={actionItems} id={'action-menu-story'} />
      </div>
    ),
  },
  {
    id: 'without-label',
    value: <OdsText preset="span">Without label</OdsText>,
  },
];

export const WithTitle = () => <DashboardTile title="Title" items={items} />;

export const NoTitle = () => <DashboardTile items={items} />;

const meta: Meta = {
  title: 'Core/Manager React Components/Content/Dashboard Tile',
  component: DashboardTile,
  argTypes: {},
  args: {
    title: 'Titre',
    items,
  },
};

export default meta;
