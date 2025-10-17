import React from 'react';
import { Meta } from '@storybook/react';
import { Step, StepProps, Text } from '@ovh-ux/muk';

const renderComponent = (args: StepProps) => {
  return (
    <Step {...args}>
      <Text preset="span">Hello world!!!!</Text>
    </Step>
  );
};

export const Default = {
  args: {
    order: 1,
    title: 'Title',
    subtitle: '',
    open: true,
    checked: false,
    locked: false,
    next: {
      action: () => {},
      label: 'Next',
      disabled: false,
    },
    edit: {
      action: () => {},
      label: 'Edit',
      disabled: false,
    },
  },
  parameters: {
    docs: {
      source: {
        code: `<Step
  order={1}
  title="Title"
  open={true}
  checked={false}
  locked={false}
  next={{
    action: (id) => handleNext(id),
    label: 'Next',
    disabled: false,
  }}
  edit={{
    action: (id) => handleEdit(id),
    label: 'Edit',
    disabled: false,
  }}
>
  <Text preset="span">Step content here</Text>
</Step>`,
      },
    },
  },
};

const StepStory: Meta<StepProps> = {
  title: 'Manager UI Kit/Components/Step',
  component: Step,
  tags: ['autodocs'],
  render: renderComponent,
};

export const Checked: Meta<StepProps> = {
  title: 'Manager UI Kit/Components/Step',
  render: renderComponent,
  args: {
    order: 1,
    title: 'Title',
    subtitle: '',
    open: true,
    checked: true,
    locked: false,
    next: {
      action: () => {},
      label: 'Next',
      disabled: false,
    },
    edit: {
      action: () => {},
      label: 'Edit',
      disabled: false,
    },
  },
};

export const CheckedAndLocked: Meta<StepProps> = {
  title: 'Manager UI Kit/Components/Step',
  render: renderComponent,
  args: {
    order: 1,
    title: 'Title',
    subtitle: '',
    open: true,
    checked: true,
    locked: true,
    next: {
      action: () => {},
      label: 'Next',
      disabled: false,
    },
    edit: {
      action: () => {},
      label: 'Edit',
      disabled: false,
    },
  },
};

export const CheckedAndLockedWithoutEdit: Meta<StepProps> = {
  title: 'Manager UI Kit/Components/Step',
  render: renderComponent,
  args: {
    order: 1,
    title: 'Title',
    subtitle: '',
    open: true,
    checked: true,
    locked: true,
    next: {
      action: () => {},
      label: 'Next',
      disabled: false,
    },
    edit: {
      action: () => {},
      label: 'Edit',
      disabled: true,
    },
  },
};

export const Closed: Meta<StepProps> = {
  title: 'Manager UI Kit/Components/Step',
  render: renderComponent,
  args: {
    order: 1,
    title: 'Title',
    subtitle: '',
    open: false,
    checked: true,
    locked: true,
    next: {
      action: () => {},
      label: 'Next',
      disabled: false,
    },
    edit: {
      action: () => {},
      label: 'Edit',
      disabled: false,
    },
  },
};

export const UncheckedAndClosed: Meta<StepProps> = {
  title: 'Manager UI Kit/Components/Step',
  render: renderComponent,
  args: {
    order: 1,
    title: 'Title',
    subtitle: '',
    open: false,
    checked: false,
    locked: true,
    next: {
      action: () => {},
      label: 'Next',
      disabled: false,
    },
    edit: {
      action: () => {},
      label: 'Edit',
      disabled: false,
    },
  },
};

export const NextButtonDisabled: Meta<StepProps> = {
  title: 'Manager UI Kit/Components/Step',
  render: renderComponent,
  args: {
    order: 1,
    title: 'Title',
    subtitle: '',
    open: true,
    checked: false,
    locked: false,
    next: {
      action: () => {},
      label: 'Next',
      disabled: true,
    },
    edit: {
      action: () => {},
      label: 'Edit',
      disabled: false,
    },
  },
};

export const Skip: Meta<StepProps> = {
  title: 'Manager UI Kit/Components/Step',
  render: renderComponent,
  args: {
    order: 1,
    title: 'Title',
    subtitle: '',
    open: true,
    checked: false,
    locked: false,
    next: {
      action: () => {},
      label: 'Next',
      disabled: false,
    },
    edit: {
      action: () => {},
      label: 'Edit',
      disabled: false,
    },
    skip: {
      action: () => {},
      label: 'Skip',
      disabled: false,
      hint: '(Optional)',
    },
  },
};

export default StepStory;
