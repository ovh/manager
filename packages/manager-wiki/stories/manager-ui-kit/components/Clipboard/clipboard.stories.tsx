import { Meta, StoryObj } from '@storybook/react';
import { Clipboard } from '@ovh-ux/muk';

const meta: Meta<typeof Clipboard> = {
  title: 'Manager UI Kit/Components/Clipboard',
  component: Clipboard,
  tags: ['autodocs'],
};

type Story = StoryObj<typeof Clipboard>;

export const regular: Story = {
  args: {
    value: 'Value to copy to clipboard',
    disabled: false,
    loading: false,
    masked: false,
  },
  parameters: {
    docs: {
      source: {
        code: `<Clipboard value="Value to copy to clipboard" />`,
      },
    },
  },
};

export const disabled: Story = {
  args: {
    value: 'Disabled clipboard',
    disabled: true,
  },
  parameters: {
    docs: {
      source: {
        code: `<Clipboard 
  value="Disabled clipboard" 
  disabled={true} 
/>`,
      },
    },
  },
};

export const loading: Story = {
  args: {
    value: '',
    loading: true,
  },
  parameters: {
    docs: {
      source: {
        code: `<Clipboard 
  value="" 
  loading={true} 
/>`,
      },
    },
  },
};

export const masked: Story = {
  args: {
    value: 'Secret Data',
    masked: true,
  },
  parameters: {
    docs: {
      source: {
        code: `<Clipboard 
  value="Secret Data" 
  masked={true} 
/>`,
      },
    },
  },
};

export default meta;
