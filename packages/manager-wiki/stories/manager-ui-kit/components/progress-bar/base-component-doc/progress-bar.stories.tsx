import { type Meta, type StoryObj } from '@storybook/react';
import React from 'react';
import { ProgressBar, type ProgressBarProp } from '@ovhcloud/ods-react';
import { CONTROL_CATEGORY } from '../../../base-documents/constants/controls';
import { orderControls } from '../../../base-documents/helpers/controls';
import { staticSourceRenderConfig } from '../../../base-documents/helpers/source';
import docgenMap from '../../../base-documents/constants/ods-docgen-map.json';

type Story = StoryObj<ProgressBarProp>;

(ProgressBar as any).__docgenInfo = docgenMap.progressBar;

const meta: Meta<ProgressBarProp> = {
  component: ProgressBar,
  title: 'Manager UI Kit/Components/Progress Bar/Base',
};

export default meta;

export const Demo: Story = {
  argTypes: orderControls({
    max: {
      table: {
        category: CONTROL_CATEGORY.general,
        type: { summary: 'number' },
      },
      control: 'number',
    },
    value: {
      table: {
        category: CONTROL_CATEGORY.general,
        type: { summary: 'number' },
      },
      control: 'number',
    },
  }),
};

export const Default: Story = {
  globals: {
    imports: `import { ProgressBar } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <ProgressBar />
  ),
};

export const Max: StoryObj = {
  globals: {
    imports: `import { ProgressBar } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <ProgressBar
      max="500"
      value="50" />
  ),
};

export const Overview: Story = {
  tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <ProgressBar value="50" />
  ),
};

export const Value: StoryObj = {
  globals: {
    imports: `import { ProgressBar } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <ProgressBar value="50" />
  ),
};

export const AccessibilityLabel: Story = {
  globals: {
    imports: `import { ProgressBar } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <ProgressBar aria-label="Converting" />
  ),
};
