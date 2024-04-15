import React from 'react';
import { Meta, Story } from '@storybook/react';

import Ips, { IpsProps, IpType } from './ips.component';

export default {
  title: 'Components/Ips',
  component: Ips,
  parameters: {
    docs: {
      description: {
        component: 'This is an interactive ips validatord component.',
      },
    },
  },
} as Meta;

const Template: Story<IpsProps> = (args) => (
  <div className="w-1/6">
    <Ips {...args} />
  </div>
);

export const Demo = Template.bind({});
Demo.args = {
  ipType: IpType.ipV4,
  title: 'Your title',
  required: true,
};
