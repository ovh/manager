import React from 'react';
import { Meta, Story } from '@storybook/react';

import Price from './price.component';
import { PriceProps } from './price.utils';
import { OvhSubsidiary } from '../../../enumTypes';

export default {
  title: 'Components/Price',
  component: Price,
  parameters: {
    docs: {
      description: {
        component: 'This is an interactive Price component.',
      },
    },
  },
} as Meta;

const Template: Story<PriceProps> = (args) => <Price {...args} />;

export const Demo = Template.bind({});
Demo.args = {
  value: 3948000000,
  ovhSubsidiary: OvhSubsidiary.FR,
  tax: 789600000,
};
