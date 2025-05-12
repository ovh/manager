import { Meta, StoryObj } from '@storybook/react';
import { Clipboard } from '@ovh-ux/manager-react-components';

const meta: Meta<typeof Clipboard> = {
  title: 'Core/manager-react-components/Components/Clipboard',
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
