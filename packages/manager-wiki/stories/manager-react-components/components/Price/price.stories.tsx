import React from 'react';
import { Meta } from '@storybook/react';

import { Price, OvhSubsidiary } from '@ovh-ux/manager-react-components';

const meta = {
  title: 'Manager React Components/Components/Price',
  component: Price,
  parameters: {
    docs: {
      description: {
        component: 'This is an interactive Price component.',
      },
    },
  },
} as Meta;

export default meta;

const Template = (args) => <Price {...args} />;

export const Demo = Template.bind({});
Demo.args = {
  value: 3948000000,
  ovhSubsidiary: OvhSubsidiary.FR,
  tax: 789600000,
};
