import { type Meta, type StoryObj } from '@storybook/react';
import React from 'react';
import {
  Spinner,
  SPINNER_COLOR,
  SPINNER_COLORS,
  SPINNER_SIZE,
  SPINNER_SIZES,
  type SpinnerProp,
} from '@ovhcloud/ods-react';
import { CONTROL_CATEGORY } from '../../../base-documents/constants/controls';
import { orderControls } from '../../../base-documents/helpers/controls';
import { staticSourceRenderConfig } from '../../../base-documents/helpers/source';
import docgenMap from '../../../base-documents/constants/ods-docgen-map.json';

type Story = StoryObj<SpinnerProp>;

(Spinner as any).__docgenInfo = docgenMap.spinner;

const meta: Meta<SpinnerProp> = {
  component: Spinner,
  title: 'Manager UI Kit/Components/Spinner/Base',
};

export default meta;

export const Demo: Story = {
  argTypes: orderControls({
    color: {
      table: {
        category: CONTROL_CATEGORY.design,
        type: { summary: 'SPINNER_COLOR' }
      },
      control: { type: 'select' },
      options: SPINNER_COLORS,
    },
    size: {
      table: {
        category: CONTROL_CATEGORY.design,
        type: { summary: 'SPINNER_SIZE' }
      },
      control: { type: 'select' },
      options: SPINNER_SIZES,
    },
  }),
};

export const Color: Story = {
  globals: {
    imports: `import { SPINNER_COLOR, Spinner } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <>
      <Spinner color={ SPINNER_COLOR.neutral } />
      <Spinner color={ SPINNER_COLOR.primary } />
    </>
  ),
};

export const Default: Story = {
  globals: {
    imports: `import { Spinner } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <Spinner />
  ),
};

export const Overview: Story = {
  tags: ['!dev'],
  parameters: {
    layout: 'centered',
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <Spinner />
  ),
};

export const Size: Story = {
  globals: {
    imports: `import { SPINNER_SIZE, Spinner } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <>
      <Spinner size={ SPINNER_SIZE.xs } />
      <Spinner size={ SPINNER_SIZE.sm } />
      <Spinner size={ SPINNER_SIZE.md } />
      <Spinner size={ SPINNER_SIZE.lg } />
    </>
  ),
};

export const AccessibilityAriaBusyAriaLive: Story = {
  globals: {
    imports: `import { Spinner } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <div
      aria-busy="true"
      aria-live="polite">
      <Spinner />
    </div>
  ),
};

export const AccessibilityAriaLabel: Story = {
  globals: {
    imports: `import { Spinner } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <Spinner aria-label="Loading user profile" />
  ),
};

export const AccessibilityAriaLabelledBy: Story = {
  globals: {
    imports: `import { Spinner } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <div>
      <span id="loading-text">
        Loading user profile
      </span>

      <Spinner aria-labelledby="loading-text" />
    </div>
  ),
};
