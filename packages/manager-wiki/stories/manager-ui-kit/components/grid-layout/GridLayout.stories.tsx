import React from 'react';
import { Meta } from '@storybook/react';
import { GridLayout, Text, Tile } from '@ovh-ux/muk';

const meta: Meta<typeof GridLayout> = {
  title: 'Manager UI Kit/Components/GridLayout',
  component: GridLayout,
  tags: ['autodocs'],
  decorators: [(story) => <div>{story()}</div>],
};

export default meta;

const DashboardTiles = [
  {
    title: 'General Informations',
    label: 'Sample Term',
    description: 'Sample Description',
  },
  {
    title: 'Second child',
    label: 'Second child',
    description: 'Sample Description',
  },
  {
    title: 'Third child',
    label: 'Third child',
    description: 'Sample Description',
  },
];

export const Default = () => (
  <GridLayout>
    {DashboardTiles.map((element) => (
      <Tile.Root title={element.title}>
        <Tile.Item.Root>
          <Tile.Item.Term label={element.label}></Tile.Item.Term>
          <Tile.Item.Description>
            <Text>{element.description}</Text>
          </Tile.Item.Description>
        </Tile.Item.Root>
        <Tile.Item.Root>
          <Tile.Item.Term label={element.label}></Tile.Item.Term>
          <Tile.Item.Description>
            <Text>{element.description}</Text>
          </Tile.Item.Description>
        </Tile.Item.Root>
      </Tile.Root>
    ))}
  </GridLayout>
);
