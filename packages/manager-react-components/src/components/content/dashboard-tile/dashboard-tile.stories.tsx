import React from 'react';
import { Meta } from '@storybook/react';
import { OsdsSkeleton } from '@ovhcloud/ods-components/react';
import {
  DashboardTile,
  DashboardTileBlockItem,
} from './dashboard-tile.component';
import ActionMenu from '../../navigation/menus/action/action.component';

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
    value: <span>Test</span>,
  },
  {
    id: 'loading-component-example',
    label: 'Loading',
    value: <OsdsSkeleton />,
  },
  {
    id: 'text-directly',
    label: 'Text Directly',
    value: 'Text example',
  },
  {
    id: 'menu-example',
    label: 'Menu Example',
    value: (
      <div className="flex">
        <div className="mr-auto">Test value</div>
        <ActionMenu isCompact items={actionItems} />
      </div>
    ),
  },
];

export const WithTitle = () => <DashboardTile title="Title" items={items} />;

export const NoTitle = () => <DashboardTile items={items} />;

const meta: Meta = {
  title: 'Content/Dashboard Tile',
  component: DashboardTile,
  argTypes: {},
  args: {
    title: 'Titre',
    items,
  },
};

export default meta;
