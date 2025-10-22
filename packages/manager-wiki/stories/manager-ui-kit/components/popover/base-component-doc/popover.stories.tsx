import { type Meta, type StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import {
  Button,
  BUTTON_COLOR,
  BUTTON_VARIANT,
  Divider,
  Icon,
  ICON_NAME,
  Popover,
  POPOVER_POSITIONS,
  PopoverContent,
  type PopoverContentProp,
  type PopoverProp,
  PopoverTrigger,
} from '@ovhcloud/ods-react';
import { CONTROL_CATEGORY } from '../../../base-documents/constants/controls';
import {
  excludeFromDemoControls,
  orderControls,
} from '../../../base-documents/helpers/controls';
import { staticSourceRenderConfig } from '../../../base-documents/helpers/source';

type Story = StoryObj<PopoverProp>;
type DemoArg = Partial<PopoverProp> & Partial<PopoverContentProp> & {
  content?: string,
};

const meta: Meta<PopoverProp> = {
  argTypes: excludeFromDemoControls(['autoFocus', 'onOpenChange', 'onPositionChange', 'open', 'triggerId']),
  component: Popover,
  subcomponents: { PopoverContent, PopoverTrigger },
  title: 'Manager UI Kit/Components/Popover/Base',
};

export default meta;

export const Demo: StoryObj = {
  parameters: {
    layout: 'centered',
  },
  render: (arg: DemoArg) => (
    <Popover
      gutter={ arg.gutter }
      position={ arg.position }
      sameWidth={ arg.sameWidth }>
      <PopoverTrigger>
        Show popover
      </PopoverTrigger>

      <PopoverContent withArrow={ arg.withArrow }>
        { arg.content }
      </PopoverContent>
    </Popover>
  ),
  argTypes: orderControls({
    content: {
      table: {
        category: CONTROL_CATEGORY.slot,
      },
      control: 'text',
    },
    gutter: {
      table: {
        category: CONTROL_CATEGORY.design,
        type: { summary: 'number' }
      },
      control: 'number',
    },
    position: {
      table: {
        category: CONTROL_CATEGORY.general,
        type: { summary: 'POPOVER_POSITION' }
      },
      control: { type: 'select' },
      options: POPOVER_POSITIONS,
    },
    sameWidth: {
      table: {
        category: CONTROL_CATEGORY.design,
      },
      control: { type: 'boolean' },
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
    content: 'My popover content',
  },
};

export const Controlled: Story = {
  decorators: [(story) => <div style={{ display: 'flex', flexFlow: 'row', gap: '8px', alignItems: 'center' }}>{ story() }</div>],
  globals: {
    imports: `import { ICON_NAME, Button, Icon, Popover, PopoverContent, PopoverTrigger } from '@ovhcloud/ods-react';
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

    function togglePopover() {
      setIsOpen((isOpen) => !isOpen);
    }

    return (
      <>
        <Button onClick={ togglePopover }>
          Toggle popover
        </Button>

        <Popover open={ isOpen }>
          <PopoverTrigger asChild>
            <Icon name={ ICON_NAME.cog } />
          </PopoverTrigger>

          <PopoverContent withArrow>
            This is the popover content
          </PopoverContent>
        </Popover>
      </>
    );
  },
};

export const CustomTrigger: Story = {
  globals: {
    imports: `import { Button, Popover, PopoverContent, PopoverTrigger } from '@ovhcloud/ods-react';`,
  },
tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <Popover>
      <PopoverTrigger asChild>
        <Button>
          Custom Trigger
        </Button>
      </PopoverTrigger>

      <PopoverContent>
        This is the popover content
      </PopoverContent>
    </Popover>
  ),
};

export const Default: Story = {
  globals: {
    imports: `import { Popover, PopoverContent, PopoverTrigger } from '@ovhcloud/ods-react';`,
  },
tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <Popover>
      <PopoverTrigger>
        Show popover
      </PopoverTrigger>

      <PopoverContent>
        This is the popover content
      </PopoverContent>
    </Popover>
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
    imports: `import { Popover, PopoverContent, PopoverTrigger } from '@ovhcloud/ods-react';`,
  },
tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <>
      <Popover position="top-start">
        <PopoverTrigger>
          Top Left
        </PopoverTrigger>
        <PopoverContent withArrow>
          Top Left popover
        </PopoverContent>
      </Popover>

      <Popover position="top">
        <PopoverTrigger>
          Top
        </PopoverTrigger>
        <PopoverContent withArrow>
          Top popover
        </PopoverContent>
      </Popover>

      <Popover position="top-end">
        <PopoverTrigger>
          Top Right
        </PopoverTrigger>
        <PopoverContent withArrow>
          Top Right popover
        </PopoverContent>
      </Popover>

      <Popover position="left">
        <PopoverTrigger>
          Middle Left
        </PopoverTrigger>
        <PopoverContent withArrow>
          Middle Left popover
        </PopoverContent>
      </Popover>

      <div />

      <Popover position="right">
        <PopoverTrigger>
          Middle Right
        </PopoverTrigger>
        <PopoverContent withArrow>
          Middle Right popover
        </PopoverContent>
      </Popover>

      <Popover position="bottom-start">
        <PopoverTrigger>
          Bottom Left
        </PopoverTrigger>
        <PopoverContent withArrow>
          Bottom Left popover
        </PopoverContent>
      </Popover>

      <Popover position="bottom">
        <PopoverTrigger>
          Bottom
        </PopoverTrigger>
        <PopoverContent withArrow>
          Bottom popover
        </PopoverContent>
      </Popover>

      <Popover position="bottom-end">
        <PopoverTrigger>
          Bottom Right
        </PopoverTrigger>
        <PopoverContent withArrow>
          Bottom Right popover
        </PopoverContent>
      </Popover>
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
    <Popover>
      <PopoverTrigger asChild>
        <Button>
          Show popover
        </Button>
      </PopoverTrigger>

      <PopoverContent>
        This is the popover content
      </PopoverContent>
    </Popover>
  ),
};

export const AccessibilityWithMenu: Story = {
  globals: {
    imports: `import { BUTTON_COLOR, BUTTON_VARIANT, ICON_NAME, Button, Divider, Icon, Popover, PopoverContent, PopoverTrigger } from '@ovhcloud/ods-react';`,
  },
tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <Popover>
      <PopoverTrigger
        aria-haspopup="menu"
        asChild>
        <Button>
          <Icon name={ ICON_NAME.ellipsisVertical } />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        aria-label="Profile menu"
        withArrow>
        <div
          role="menu"
          style={{ display: 'flex', flexDirection: 'column' }}>
          <Button
            role="menuitem"
            variant={ BUTTON_VARIANT.ghost }>
            Information
          </Button>

          <Button
            role="menuitem"
            variant={ BUTTON_VARIANT.ghost }>
            Notifications
          </Button>

          <Divider style={{ width: '100%' }} />

          <Button
            color={ BUTTON_COLOR.critical }
            role="menuitem"
            variant={ BUTTON_VARIANT.ghost }>
            Sign out
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  ),
};

export const SameWidth: Story = {
  globals: {
    imports: `import { Popover, PopoverContent, PopoverTrigger } from '@ovhcloud/ods-react';`,
  },
tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <Popover sameWidth>
      <PopoverTrigger>
        Show popover that will take this width as reference
      </PopoverTrigger>

      <PopoverContent>
        The popover content
      </PopoverContent>
    </Popover>
  ),
};
