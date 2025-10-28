import { type Meta, type StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import {
  Button,
  Icon,
  ICON_NAME,
  Tooltip,
  TOOLTIP_POSITIONS,
  TooltipContent,
  type TooltipContentProp,
  type TooltipProp,
  TooltipTrigger,
} from '@ovhcloud/ods-react';
import { CONTROL_CATEGORY } from '../../../base-documents/constants/controls';
import {
  excludeFromDemoControls,
  orderControls,
} from '../../../base-documents/helpers/controls';
import { staticSourceRenderConfig } from '../../../base-documents/helpers/source';
import docgenMap from '../../../base-documents/constants/ods-docgen-map.json';

type Story = StoryObj<TooltipProp>;

(Tooltip as any).__docgenInfo = docgenMap.tooltip;
(TooltipContent as any).__docgenInfo = docgenMap.tooltipContent;
(TooltipTrigger as any).__docgenInfo = docgenMap.tooltipTrigger;

type DemoArg = Partial<TooltipProp> & Partial<TooltipContentProp> & {
  content?: string,
};

const meta: Meta<TooltipProp> = {
  argTypes: excludeFromDemoControls(['onOpenChange', 'open']),
  component: Tooltip,
  subcomponents: { TooltipContent, TooltipTrigger },
  title: 'Manager UI Kit/Components/Tooltip/Base',
};

export default meta;

export const Demo: StoryObj = {
  parameters: {
    layout: 'centered',
  },
  render: (arg: DemoArg) => (
    <Tooltip
      closeDelay={ arg.closeDelay }
      openDelay={ arg.openDelay }
      position={ arg.position }>
      <TooltipTrigger asChild>
        <Icon
          name={ ICON_NAME.circleQuestion }
          style={{ fontSize: '24px' }} />
      </TooltipTrigger>

      <TooltipContent withArrow={ arg.withArrow }>
        { arg.content }
      </TooltipContent>
    </Tooltip>
  ),
  argTypes: orderControls({
    closeDelay: {
      table: {
        category: CONTROL_CATEGORY.general,
      },
      control: 'number',
    },
    content: {
      table: {
        category: CONTROL_CATEGORY.slot,
      },
      control: 'text',
    },
    openDelay: {
      table: {
        category: CONTROL_CATEGORY.general,
      },
      control: 'number',
    },
    position: {
      table: {
        category: CONTROL_CATEGORY.general,
        type: { summary: 'TOOLTIP_POSITION' }
      },
      control: { type: 'select' },
      options: TOOLTIP_POSITIONS,
    },
    withArrow: {
      table: {
        category: CONTROL_CATEGORY.design,
        defaultValue: { summary: false },
        type: { summary: 'boolean' }
      },
      control: { type: 'boolean' },
    },
  }),
  args: {
    content: 'My tooltip content',
  },
};

export const Controlled: Story = {
  decorators: [(story) => <div style={{ display: 'flex', flexFlow: 'row', gap: '8px', alignItems: 'center' }}>{ story() }</div>],
  globals: {
    imports: `import { ICON_NAME, Button, Icon, Tooltip, TooltipContent, TooltipTrigger } from '@ovhcloud/ods-react';
import { useState } from 'react';`,
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => {
    const [isOpen, setIsOpen] = useState(false);

    function toggleTooltip() {
      setIsOpen((isOpen) => !isOpen);
    }

    return (
      <>
        <Button onClick={ toggleTooltip }>
          Toggle tooltip
        </Button>

        <Tooltip open={ isOpen }>
          <TooltipTrigger asChild>
            <Icon
              name={ ICON_NAME.circleQuestion }
              style={{ fontSize: '24px' }} />
          </TooltipTrigger>

          <TooltipContent withArrow>
            This is the tooltip content
          </TooltipContent>
        </Tooltip>
      </>
    );
  },
};

export const CustomTrigger: Story = {
  globals: {
    imports: `import { ICON_NAME, Icon, Tooltip, TooltipContent, TooltipTrigger } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Icon
          name={ ICON_NAME.circleQuestion }
          style={{ fontSize: '24px' }} />
      </TooltipTrigger>

      <TooltipContent>
        This is the tooltip content
      </TooltipContent>
    </Tooltip>
  ),
};

export const Default: Story = {
  globals: {
    imports: `import { Tooltip, TooltipContent, TooltipTrigger } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <Tooltip>
      <TooltipTrigger>
        Show tooltip
      </TooltipTrigger>

      <TooltipContent>
        This is the tooltip content
      </TooltipContent>
    </Tooltip>
  ),
};

export const Grid: StoryObj = {
  decorators: [(story) => (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gridTemplateRows: 'repeat(3, 1fr)',
      gap: '20px',
      padding: '50px 150px',
    }}>
      { story() }
    </div>
  )],
  globals: {
    imports: `import { Tooltip, TooltipContent, TooltipTrigger } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <>
      <Tooltip position="top-start">
        <TooltipTrigger>
          Top Left
        </TooltipTrigger>
        <TooltipContent withArrow>
          Top Left tooltip
        </TooltipContent>
      </Tooltip>

      <Tooltip position="top">
        <TooltipTrigger>
          Top
        </TooltipTrigger>
        <TooltipContent withArrow>
          Top tooltip
        </TooltipContent>
      </Tooltip>

      <Tooltip position="top-end">
        <TooltipTrigger>
          Top Right
        </TooltipTrigger>
        <TooltipContent withArrow>
          Top Right tooltip
        </TooltipContent>
      </Tooltip>

      <Tooltip position="left">
        <TooltipTrigger>
          Middle Left
        </TooltipTrigger>
        <TooltipContent withArrow>
          Middle Left tooltip
        </TooltipContent>
      </Tooltip>

      <div />

      <Tooltip position="right">
        <TooltipTrigger>
          Middle Right
        </TooltipTrigger>
        <TooltipContent withArrow>
          Middle Right tooltip
        </TooltipContent>
      </Tooltip>

      <Tooltip position="bottom-start">
        <TooltipTrigger>
          Bottom Left
        </TooltipTrigger>
        <TooltipContent withArrow>
          Bottom Left tooltip
        </TooltipContent>
      </Tooltip>

      <Tooltip position="bottom">
        <TooltipTrigger>
          Bottom
        </TooltipTrigger>
        <TooltipContent withArrow>
          Bottom tooltip
        </TooltipContent>
      </Tooltip>

      <Tooltip position="bottom-end">
        <TooltipTrigger>
          Bottom Right
        </TooltipTrigger>
        <TooltipContent withArrow>
          Bottom Right tooltip
        </TooltipContent>
      </Tooltip>
    </>
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
    <Tooltip>
      <TooltipTrigger asChild>
        <Icon
          name={ ICON_NAME.circleQuestion }
          style={{ fontSize: '24px' }} />
      </TooltipTrigger>

      <TooltipContent>
        This is the tooltip content
      </TooltipContent>
    </Tooltip>
  ),
};

export const AccessibilityTooltip: Story = {
  globals: {
    imports: `import { ICON_NAME, Icon, Tooltip, TooltipContent, TooltipTrigger } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Icon
          aria-label="Open tooltip"
          name={ ICON_NAME.circleInfo }
          role="img"
          style={{ fontSize: '24px' }} />
      </TooltipTrigger>

      <TooltipContent>
        Some additional context.
      </TooltipContent>
    </Tooltip>
  ),
};
