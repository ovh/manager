import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { OdsText } from '@ovhcloud/ods-components/react';
import { Step, StepProps } from '@ovh-ux/manager-ui-kit';

const renderComponent = ({
  order,
  title,
  subtitle,
  open,
  checked,
  locked,
  next,
  edit,
  skip,
}) => {
  return (
    <Step
      order={order}
      title={title}
      subtitle={subtitle}
      open={open}
      checked={checked}
      locked={locked}
      next={next}
      edit={edit}
      skip={skip}
    >
      <OdsText preset="span">Hello world!!!!</OdsText>
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
      action: (_id: string) => {},
      label: 'Next',
      disabled: false,
    },
    edit: {
      action: (_id: string) => {},
      label: 'Edit',
      disabled: false,
    },
  },
};

const StepStory: Meta<StepProps> = {
  title: 'Manager UI Kit/Components/Step',
  render: renderComponent,
};

export const Checked: Meta<StepProps> = {
  title: 'Manager UI Kit/Components/Step',
  render: renderComponent,
  args: {
    ...Default.args,
    checked: true,
  },
};

export const CheckedAndLocked: Meta<StepProps> = {
  title: 'Manager UI Kit/Components/Step',
  render: renderComponent,
  args: {
    ...Default.args,
    checked: true,
    locked: true,
  },
};

export const CheckedAndLockedWithoutEdit: Meta<StepProps> = {
  title: 'Manager UI Kit/Components/Step',
  render: renderComponent,
  args: {
    ...Default.args,
    checked: true,
    locked: true,
    edit: {
      action: (_id: string) => {},
      label: 'Edit',
      disabled: true,
    },
  },
};

export const Closed: Meta<StepProps> = {
  title: 'Manager UI Kit/Components/Step',
  render: renderComponent,
  args: {
    ...Default.args,
    checked: true,
    open: false,
    locked: true,
  },
};

export const UncheckedAndClosed: Meta<StepProps> = {
  title: 'Manager UI Kit/Components/Step',
  render: renderComponent,
  args: {
    ...Default.args,
    checked: false,
    open: false,
    locked: true,
  },
};

export const NextButtonDisabled: Meta<StepProps> = {
  title: 'Manager UI Kit/Components/Step',
  render: renderComponent,
  args: {
    ...Default.args,
    next: {
      action: (_id: string) => {},
      label: 'Next',
      disabled: true,
    },
  },
};

export const Skip: Meta<StepProps> = {
  title: 'Manager UI Kit/Components/Step',
  render: renderComponent,
  args: {
    ...Default.args,
    skip: {
      action: (_id: string) => {},
      label: 'Skip',
      disabled: false,
      hint: '(Optional)',
    },
  },
};

export default StepStory;
