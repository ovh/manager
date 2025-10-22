import { type Meta, type StoryObj } from '@storybook/react';
import React from 'react';
import {
  Card,
  CARD_COLOR,
  CARD_COLORS,
  type CardProp,
} from '@ovhcloud/ods-react';
import { CONTROL_CATEGORY } from '../../../base-documents/constants/controls';
import { orderControls } from '../../../base-documents/helpers/controls';
import { staticSourceRenderConfig } from '../../../base-documents/helpers/source';

type Story = StoryObj<CardProp>;

const meta: Meta<CardProp> = {
  component: Card,
  title: 'Manager UI Kit/Components/Card/Base',
};

export default meta;

export const Demo: Story = {
  argTypes: orderControls({
    color: {
      table: {
        category: CONTROL_CATEGORY.design,
        type: { summary: 'CARD_COLOR' },
      },
      control: 'select',
      options: CARD_COLORS,
    },
    children: {
      table: {
        category: CONTROL_CATEGORY.slot,
      },
      control: 'text',
    },
  }),
  args: {
    children: 'Hello, world!',
  },
};

export const Color: Story = {
  decorators: [(story) => <div style={{ display: 'flex', gap: '16px' }}>{ story() }</div>],
  globals: {
    imports: `import { CARD_COLOR, Card } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <>
      <Card color={ CARD_COLOR.critical }>
        <p>Critical</p>
      </Card>

      <Card color={ CARD_COLOR.information }>
        <p>Information</p>
      </Card>

      <Card color={ CARD_COLOR.neutral }>
        <p>Neutral</p>
      </Card>

      <Card color={ CARD_COLOR.primary }>
        <p>Primary</p>
      </Card>

      <Card color={ CARD_COLOR.success }>
        <p>Success</p>
      </Card>

      <Card color={ CARD_COLOR.warning }>
        <p>Warning</p>
      </Card>
    </>
  ),
};

export const Default: Story = {
  globals: {
    imports: `import { Card } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <Card>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.<br />Interdum et malesuada fames ac ante ipsum primis in faucibus.</p>
    </Card>
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
    <Card style={{ padding: '8px' }}>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit.<br />
      Interdum et malesuada fames ac ante ipsum primis in faucibus.
    </Card>
  ),
};

export const AccessibilityGrouping: Story = {
  globals: {
    imports: `import { Card } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  parameters: {
    layout: 'centered',
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <ul style={{ display: 'flex', gap: '16px', padding: 0, margin: 0, listStyleType: 'none' }}>
      <li>
        <Card style={{ padding: '8px' }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.<br/>
          Interdum et malesuada fames ac ante ipsum primis in faucibus.
        </Card>
      </li>
      <li>
        <Card style={{ padding: '8px' }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.<br/>
          Interdum et malesuada fames ac ante ipsum primis in faucibus.
        </Card>
      </li>
    </ul>
  ),
};

export const AccessibilityAlternativeGrouping: Story = {
  globals: {
    imports: `import { Card } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  parameters: {
    layout: 'centered',
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <div role="list" style={{ display: 'flex', gap: '16px' }}>
      <Card role="listitem" style={{ padding: '8px' }}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.<br/>
        Interdum et malesuada fames ac ante ipsum primis in faucibus.
      </Card>
      <Card role="listitem" style={{ padding: '8px' }}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.<br/>
        Interdum et malesuada fames ac ante ipsum primis in faucibus.
      </Card>
    </div>
  ),
};
