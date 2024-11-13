import { Meta, StoryObj } from '@storybook/react';
import { Clipboard } from './clipboard.component';

const meta: Meta<typeof Clipboard> = {
  title: 'Components/Clipboard',
  component: Clipboard,
};

type Story = StoryObj<typeof Clipboard>;

export const regular: Story = {
  args: {
    value: 'Value to copy to clipboard',
  },
};

export const disabled: Story = {
  args: {
    value: 'Disabled clipboard',
    isDisabled: true,
  },
};

export default meta;
