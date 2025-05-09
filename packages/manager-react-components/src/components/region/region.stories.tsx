import React from 'react';
import { StoryObj } from '@storybook/react';
import { Region } from './region.component';

const managerRegion = {
  title: 'Core/Manager React Components/Components/Region',
  component: Region,
};

type Story = StoryObj<typeof managerRegion>;

export const DemoRegion: Story = {
  args: {
    mode: 'region',
    name: 'ca-east-bhs',
  },
};

export const DemoDatacenter: Story = {
  args: {
    mode: 'datacenter',
    name: 'RBX',
    micro: 2,
  },
};

export default managerRegion;
