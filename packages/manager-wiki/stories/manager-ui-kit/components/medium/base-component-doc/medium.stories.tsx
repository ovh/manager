import { type Meta, type StoryObj } from '@storybook/react';
import React from 'react';
import {
  Medium,
  type MediumProp,
  Text,
  TEXT_PRESET,
} from '@ovhcloud/ods-react';
import { CONTROL_CATEGORY } from '../../../base-documents/constants/controls';
import { orderControls } from '../../../base-documents/helpers/controls';

type Story = StoryObj<MediumProp>;

const meta: Meta<MediumProp> = {
  component: Medium,
  title: 'Manager UI Kit/Components/Medium/Base',
};

export default meta;

export const Demo: Story = {
  argTypes: orderControls({
    height: {
      table: {
        category: CONTROL_CATEGORY.general,
        type: { summary: 'number' }
      },
      control: 'number',
    },
    src: {
      table: {
        category: CONTROL_CATEGORY.general,
        type: { summary: 'string' }
      },
      control: 'text',
    },
    width: {
      table: {
        category: CONTROL_CATEGORY.general,
        type: { summary: 'number' }
      },
      control: 'number',
    },
  }),
  args: {
    src: 'https://images.crunchbase.com/image/upload/c_pad,w_256,f_auto,q_auto:eco,dpr_1/ayzwkdawmlyzvuummuf4',
  },
};

export const Caption: Story = {
  globals: {
    imports: `import { TEXT_PRESET, Medium, Text } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  render: ({}) => (
    <figure>
      <Medium
        alt="OVHcloud logo"
        src="https://images.crunchbase.com/image/upload/c_pad,w_256,f_auto,q_auto:eco,dpr_1/ayzwkdawmlyzvuummuf4" />

      <figcaption>
        <Text preset={ TEXT_PRESET.caption }>
          © Copyright 1999-2025 OVH SA
        </Text>
      </figcaption>
    </figure>
  ),
};

export const Default: Story = {
  globals: {
    imports: `import { Medium } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  render: ({}) => (
    <Medium
      alt="OVHcloud logo"
      src="https://images.crunchbase.com/image/upload/c_pad,w_256,f_auto,q_auto:eco,dpr_1/ayzwkdawmlyzvuummuf4" />
  ),
};

export const Overview: Story = {
  tags: ['!dev'],
  parameters: {
    layout: 'centered',
  },
  render: ({}) => (
    <Medium
      alt="OVHcloud logo"
      src="https://images.crunchbase.com/image/upload/c_pad,w_256,f_auto,q_auto:eco,dpr_1/ayzwkdawmlyzvuummuf4" />
  ),
};

export const Height: Story = {
  globals: {
    imports: `import { Medium } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  render: ({}) => (
    <Medium
      alt="OVHcloud logo"
      height={ 20 }
      src="https://images.crunchbase.com/image/upload/c_pad,w_256,f_auto,q_auto:eco,dpr_1/ayzwkdawmlyzvuummuf4" />
  ),
};

export const Width: Story = {
  globals: {
    imports: `import { Medium } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  render: ({}) => (
    <Medium
      alt="OVHcloud logo"
      src="https://images.crunchbase.com/image/upload/c_pad,w_256,f_auto,q_auto:eco,dpr_1/ayzwkdawmlyzvuummuf4"
      width={ 300 } />
  ),
};
