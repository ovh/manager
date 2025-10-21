import { type Meta, type StoryObj } from '@storybook/react';
import React from 'react';
import {
  Badge,
  BADGE_COLOR,
  BADGE_COLORS,
  BADGE_SIZE,
  BADGE_SIZES,
  type BadgeProp,
  Icon,
  ICON_NAME,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@ovhcloud/ods-react';
import { CONTROL_CATEGORY } from '../../../base-documents/constants/controls';
import { orderControls } from '../../../base-documents/helpers/controls';

type Story = StoryObj<BadgeProp>;

const meta: Meta<BadgeProp> = {
  component: Badge,
  title: 'Manager UI Kit/Components/Badge/Base',
};

export default meta;

export const Demo: Story = {
  argTypes: orderControls({
    children: {
      table: {
        category: CONTROL_CATEGORY.slot,
      },
      control: 'text',
    },
    color: {
      table: {
        category: CONTROL_CATEGORY.design,
        type: { summary: 'BADGE_COLOR' }
      },
      control: { type: 'select' },
      options: BADGE_COLORS,
    },
    size: {
      table: {
        category: CONTROL_CATEGORY.design,
        type: { summary: 'BADGE_SIZE' }
      },
      control: { type: 'select' },
      options: BADGE_SIZES,
    },
  }),
  args: {
    children: 'My badge',
  },
};

export const Color: Story = {
  decorators: [(story) => <div style={{ display: 'flex', flexFlow: 'row', gap: '8px', alignItems: 'center' }}>{ story() }</div>],
  globals: {
    imports: `import { BADGE_COLOR, Badge } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  render: ({}) => (
    <>
      <Badge color={ BADGE_COLOR.alpha }>Alpha</Badge>
      <Badge color={ BADGE_COLOR.beta }>Beta</Badge>
      <Badge color={ BADGE_COLOR.critical }>Critical</Badge>
      <Badge color={ BADGE_COLOR.information }>Information</Badge>
      <Badge color={ BADGE_COLOR.neutral }>Neutral</Badge>
      <Badge color={ BADGE_COLOR.new }>New</Badge>
      <Badge color={ BADGE_COLOR.primary }>Primary</Badge>
      <Badge color={ BADGE_COLOR.promotion }>Promotion</Badge>
      <Badge color={ BADGE_COLOR.success }>Success</Badge>
      <Badge color={ BADGE_COLOR.warning }>Warning</Badge>
    </>
  ),
};

export const Default: Story = {
  globals: {
    imports: `import { Badge } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  render: ({}) => (
    <Badge>
      My badge
    </Badge>
  ),
};

export const Overview: Story = {
  tags: ['!dev'],
  parameters: {
    layout: 'centered',
  },
  render: ({}) => (
    <Badge>
      Badge
    </Badge>
  ),
};

export const Size: Story = {
  globals: {
    imports: `import { BADGE_SIZE, Badge } from '@ovhcloud/ods-react';`,
  },
  decorators: [(story) => <div style={{ display: 'flex', flexFlow: 'row', gap: '8px', alignItems: 'center' }}>{ story() }</div>],
  tags: ['!dev'],
  render: ({}) => (
    <>
      <Badge size={ BADGE_SIZE.sm }>SM badge</Badge>
      <Badge size={ BADGE_SIZE.md }>MD badge</Badge>
      <Badge size={ BADGE_SIZE.lg }>LG badge</Badge>
    </>
  ),
};

export const AccessibilityAriaLabel: Story = {
  globals: {
    imports: `import { ICON_NAME, Badge, Icon } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  render: ({}) => (
    <Badge>
      <Icon
        aria-label="Promotion"
        name={ ICON_NAME.tag }
        role="img" />
    </Badge>
  ),
};

export const AccessibilityWithTooltip: Story = {
  globals: {
    imports: `import { BADGE_COLOR, ICON_NAME, Badge, Icon, Tooltip, TooltipContent, TooltipTrigger } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  render: ({}) => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge
          aria-labelledby="tooltip-a11y"
          color={ BADGE_COLOR.promotion }>
          <Icon name={ ICON_NAME.tag } />
        </Badge>
      </TooltipTrigger>

      <TooltipContent id="tooltip-a11y">
        Promotion valid from November 22 to 26
      </TooltipContent>
    </Tooltip>
  ),
};

export const AccessibilityGrouping: Story = {
  globals: {
    imports: `import { Badge } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  render: ({}) => (
    <ul style={{ display: 'flex', flexFlow: 'row', gap: '8px', margin: 0, padding: 0, listStyle: 'none' }}>
      <li>
        <Badge>
          Item 1
        </Badge>
      </li>
      <li>
        <Badge>
          Item 2
        </Badge>
      </li>
    </ul>
  ),
};

export const AccessibilityAlternativeGrouping: Story = {
  globals: {
    imports: `import { Badge } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  render: ({}) => (
    <div
      role="list"
      style={{ display: 'flex', flexFlow: 'row', gap: '8px', alignItems: 'center' }}>
      <Badge role="listitem">
        Item 1
      </Badge>
      <Badge role="listitem">
        Item 2
      </Badge>
    </div>
  ),
};
