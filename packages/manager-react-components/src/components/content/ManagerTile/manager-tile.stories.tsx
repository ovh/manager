import React, { useId } from 'react';
import { Meta } from '@storybook/react';
import { OdsSkeleton } from '@ovhcloud/ods-components/react';
import { ManagerTile } from './manager-tile.component';
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

export const CompleteExample = () => {
  const id = useId();
  return (
    <ManagerTile>
      <ManagerTile.Title>Complete example</ManagerTile.Title>
      <ManagerTile.Divider />
      <ManagerTile.Item>
        <ManagerTile.Item.Label>Component Example</ManagerTile.Item.Label>
        <ManagerTile.Item.Description>
          <span>Test</span>
        </ManagerTile.Item.Description>
      </ManagerTile.Item>
      <ManagerTile.Divider />
      <ManagerTile.Item>
        <ManagerTile.Item.Label>Loading</ManagerTile.Item.Label>
        <ManagerTile.Item.Description>
          <OdsSkeleton />
        </ManagerTile.Item.Description>
      </ManagerTile.Item>
      <ManagerTile.Divider />
      <ManagerTile.Item>
        <ManagerTile.Item.Label>Text Directly</ManagerTile.Item.Label>
        <ManagerTile.Item.Description>
          Text example
        </ManagerTile.Item.Description>
      </ManagerTile.Item>
      <ManagerTile.Divider />
      <ManagerTile.Item>
        <ManagerTile.Item.Label>Menu Example</ManagerTile.Item.Label>
        <ManagerTile.Item.Description>
          <span>
            <div className="flex">
              <div className="mr-auto">Test value</div>
              <ActionMenu isCompact items={actionItems} id={id} />
            </div>
          </span>
        </ManagerTile.Item.Description>
      </ManagerTile.Item>
      <ManagerTile.Divider />
      <ManagerTile.Item>
        <ManagerTile.Item.Label>Component Example</ManagerTile.Item.Label>
        <ManagerTile.Item.Description>
          <span>Test</span>
        </ManagerTile.Item.Description>
      </ManagerTile.Item>
    </ManagerTile>
  );
};

export const SimpleExampleWithTitle = () => (
  <ManagerTile>
    <ManagerTile.Title>Sample example with title</ManagerTile.Title>
    <ManagerTile.Divider />
    <ManagerTile.Item>
      <ManagerTile.Item.Label>Component Example</ManagerTile.Item.Label>
      <ManagerTile.Item.Description>Test</ManagerTile.Item.Description>
    </ManagerTile.Item>
    <ManagerTile.Divider />
    <ManagerTile.Item>
      <ManagerTile.Item.Label>Loading</ManagerTile.Item.Label>
      <ManagerTile.Item.Description>
        <OdsSkeleton />
      </ManagerTile.Item.Description>
    </ManagerTile.Item>
  </ManagerTile>
);

export const NoTitle = () => (
  <ManagerTile>
    <ManagerTile.Item>
      <ManagerTile.Item.Label>Component Example</ManagerTile.Item.Label>
      <ManagerTile.Item.Description>Test</ManagerTile.Item.Description>
    </ManagerTile.Item>
    <ManagerTile.Divider />
    <ManagerTile.Item>
      <ManagerTile.Item.Label>Loading</ManagerTile.Item.Label>
      <ManagerTile.Item.Description>
        <OdsSkeleton />
      </ManagerTile.Item.Description>
    </ManagerTile.Item>
  </ManagerTile>
);

const meta: Meta = {
  title: 'Content/Manager Tile',
  component: ManagerTile,
  argTypes: {},
  args: {},
};

export default meta;
