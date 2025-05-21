import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Region } from '@ovh-ux/manager-react-components';

const ManagerRegion = {
  title: 'Manager React Components/Components/Region',
  component: Region,
} as Meta;

type Story = StoryObj<typeof ManagerRegion>;

export default ManagerRegion;

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
