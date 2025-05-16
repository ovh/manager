import React from 'react';
import { StoryFn } from '@storybook/react';
import { Region } from './region.component';

const managerRegion = {
  title: 'Components/Region',
  component: Region,
};

const Template: StoryFn<any> = (args) => <Region {...args} />;

export const DemoRegion = Template.bind({});

DemoRegion.args = {
  mode: 'region',
  name: 'ca-east-bhs',
};

export const DemoDatacenter = Template.bind({});

DemoDatacenter.args = {
  mode: 'datacenter',
  name: 'RBX',
  micro: 2,
};

export default managerRegion;
