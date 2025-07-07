import { Meta, StoryObj } from '@storybook/react';
import Wrap from '../../../../../manager-react-components/src/components/wrap/Wrap.component';
import { WrapPreset } from '../../../../../manager-react-components/src/components/wrap/Wrap.props';

const meta: Meta<typeof Wrap> = {
  title: 'Manager React Components/Components/Wrap',
  component: Wrap,
  parameters: {
    docs: {
      description: {
        component:
          'A wrapper component that provides consistent text styling with different presets. It wraps the ODS Text component with predefined styling options.',
      },
    },
  },
  argTypes: {
    preset: {
      control: { type: 'select' },
      options: Object.values(WrapPreset),
      description: 'The preset style to apply to the text',
    },
    children: {
      control: { type: 'text' },
      description: 'The content to display inside the wrap component',
    },
    className: {
      control: { type: 'text' },
      description: 'Additional CSS classes to apply',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Default story
export const Default: Story = {
  args: {
    children: 'This is a default wrap component with title preset',
    preset: WrapPreset.title,
  },
};

// Title preset story
export const Title: Story = {
  args: {
    children: 'This is a title wrap component',
    preset: WrapPreset.title,
  },
  parameters: {
    docs: {
      description: {
        story: 'Uses the title preset which applies heading-1 styling.',
      },
    },
  },
};

// Subtitle preset story
export const Subtitle: Story = {
  args: {
    children: 'This is a subtitle wrap component',
    preset: WrapPreset.subtitle,
  },
  parameters: {
    docs: {
      description: {
        story: 'Uses the subtitle preset which applies heading-3 styling.',
      },
    },
  },
};

// With custom className
export const WithCustomClass: Story = {
  args: {
    children: 'This wrap component has custom styling',
    preset: WrapPreset.title,
    className: 'text-blue-600 font-italic',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates how to apply custom CSS classes to the wrap component.',
      },
    },
  },
};
