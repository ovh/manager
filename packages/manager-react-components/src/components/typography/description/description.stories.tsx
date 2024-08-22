import React from 'react';
import { Meta } from '@storybook/react';
import { Description, DescriptionProps } from './description.component';

export const description: DescriptionProps = {
  children: 'Lorem ipsum',
};

const meta: Meta<DescriptionProps> = {
  title: 'Typography/Texts',
  decorators: [(story) => <div>{story()}</div>],
  component: Description,
  argTypes: {},
  args: description,
};

export default meta;
