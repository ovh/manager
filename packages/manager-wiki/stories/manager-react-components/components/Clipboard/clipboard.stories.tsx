import { Meta, StoryObj } from '@storybook/react';
import { Clipboard } from '@ovh-ux/manager-react-components';

const meta: Meta<typeof Clipboard> = {
  title: 'Manager React Components/Components/Clipboard',
  component: Clipboard,
};

type Story = StoryObj<typeof Clipboard>;

export const regular: Story = {
  args: {
    value: 'Value to copy to clipboard',
    disabled: false,
    loading: false,
    masked: false,
  },
};

export const disabled: Story = {
  args: {
    value: 'Disabled clipboard',
    disabled: true,
  },
};

export const loading: Story = {
  args: {
    value: '',
    loading: true,
  },
};

export const masked: Story = {
  args: {
    value: 'Secret Data',
    masked: true,
  },
};

export default meta;
