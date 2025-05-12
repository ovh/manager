import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { OdsText } from '@ovhcloud/ods-components/react';
import { StepComponent } from '@ovh-ux/manager-react-components';

const meta: Meta = {
  title: 'Core/manager-react-components/Components/Step',
  component: StepComponent,
  parameters: {
    docs: {
      description: {
        component: 'This is an interactive step component.',
      },
    },
  },
};

export default meta;

const Template: any = (args) => (
  <StepComponent {...args}>
    <OdsText preset="span">Hello world</OdsText>
  </StepComponent>
);

export const Demo = Template.bind({});

Demo.args = {
  order: 1,
  title: 'Title',
  subtitle: '',
  isOpen: true,
  isChecked: false,
  isLocked: false,
  next: {
    action: (_id: string) => {},
    label: 'Next',
    isDisabled: false,
  },
  edit: {
    action: (_id: string) => {},
    label: 'Edit',
    isDisabled: false,
  },
};
