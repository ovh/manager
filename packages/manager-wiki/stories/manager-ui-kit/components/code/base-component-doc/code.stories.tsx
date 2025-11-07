import { type Meta, type StoryObj } from '@storybook/react';
import React from 'react';
import { Code, type CodeProp } from '@ovhcloud/ods-react';
import { CONTROL_CATEGORY } from '../../../base-documents/constants/controls';
import {
  excludeFromDemoControls,
  orderControls,
} from '../../../base-documents/helpers/controls';
import { staticSourceRenderConfig } from '../../../base-documents/helpers/source';
import docgenMap from '../../../base-documents/constants/ods-docgen-map.json';

type Story = StoryObj<CodeProp>;

(Code as any).__docgenInfo = docgenMap.code;

const meta: Meta<CodeProp> = {
  argTypes: excludeFromDemoControls(['onCopy']),
  component: Code,
  title: 'Manager UI Kit/Components/Code/Base',
};

export default meta;

export const Demo: Story = {
  argTypes: orderControls({
    canCopy: {
      table: {
        category: CONTROL_CATEGORY.general,
      },
      control: 'boolean',
    },
    children: {
      table: {
        category: CONTROL_CATEGORY.general,
      },
      control: 'text',
    },
    labelCopy: {
      table: {
        category: CONTROL_CATEGORY.general,
        defaultValue: { summary: 'Copy to clipboard' },
      },
      control: 'text',
    },
    labelCopySuccess: {
      table: {
        category: CONTROL_CATEGORY.general,
        defaultValue: { summary: 'Copied' },
      },
      control: 'text',
    },
  }),
  args: {
    children: `import { Text } from '@ovhcloud/ods-react';`,
  },
};

export const Default: Story = {
  globals: {
    imports: `import { Code } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <Code>
      console.log('Hello world');
    </Code>
  ),
};

export const Overview: Story = {
  tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
    layout: 'centered',
  },
  render: ({}) => (
    <Code canCopy>
      { `import { Text } from '@ovhcloud/ods-react';` }
    </Code>
  ),
};

export const CanCopy: Story = {
  globals: {
    imports: `import { Code } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <Code canCopy>
      { `import { Text } from '@ovhcloud/ods-react';` }
    </Code>
  ),
};

export const CustomLabels: Story = {
  globals: {
    imports: `import { Code } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <Code
      canCopy
      labelCopy="Click to copy"
      labelCopySuccess="Successfully copied">
      console.log('Hello world');
    </Code>
  ),
};

export const Multiline: Story = {
  globals: {
    imports: `import { Code } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <Code>
      { `function isTargetInElement(event, element) {
  if (!element) {
    return false;
  }

    return element.contains(event.target) || event.composedPath().includes(element);
  }` }
    </Code>
  ),
};
