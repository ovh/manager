import { type Meta, type StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import {
  Button,
  Drawer,
  DRAWER_POSITION,
  DRAWER_POSITIONS,
  DrawerBody,
  DrawerContent,
  DrawerContentProp,
  type DrawerOpenChangeDetail,
  type DrawerProp,
  DrawerTrigger,
} from '@ovhcloud/ods-react';
import { CONTROL_CATEGORY } from '../../../base-documents/constants/controls';
import {
  excludeFromDemoControls,
  orderControls,
} from '../../../base-documents/helpers/controls';
import { staticSourceRenderConfig } from '../../../base-documents/helpers/source';
import docgenMap from '../../../base-documents/constants/ods-docgen-map.json';

type Story = StoryObj<DrawerProp>;

(Drawer as any).__docgenInfo = docgenMap.drawer;
(DrawerBody as any).__docgenInfo = docgenMap.drawerBody;
(DrawerContent as any).__docgenInfo = docgenMap.drawerContent;
(DrawerTrigger as any).__docgenInfo = docgenMap.drawerTrigger;

type DemoArg = Partial<DrawerProp> & Partial<DrawerContentProp> & {
  content?: string;
}

const meta: Meta<DrawerProp> = {
  argTypes: excludeFromDemoControls(['defaultOpen', 'onOpenChange', 'open']),
  component: Drawer,
  subcomponents: { DrawerBody, DrawerContent, DrawerTrigger },
  title: 'Manager UI Kit/Components/Drawer/Base',
};

export default meta;

export const Demo: StoryObj = {
  render: (arg: DemoArg) => (
    <Drawer closeOnEscape={arg.closeOnEscape} closeOnInteractOutside={arg.closeOnInteractOutside}>
      <DrawerTrigger asChild>
        <Button>
          Trigger Drawer
        </Button>
      </DrawerTrigger>

      <DrawerContent position={arg.position}>
        <DrawerBody>
          { arg.content }
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  ),
  argTypes: orderControls({
    closeOnEscape: {
      table: {
        category: CONTROL_CATEGORY.general,
      },
      control: { type: 'boolean' },
    },
    closeOnInteractOutside: {
      table: {
        category: CONTROL_CATEGORY.general,
      },
      control: { type: 'boolean' },
    },
    content: {
      table: {
        category: CONTROL_CATEGORY.slot,
      },
      control: 'text',
    },
    position: {
      table: {
        category: CONTROL_CATEGORY.general,
        type: { summary: 'DRAWER_POSITION' },
      },
      control: { type: 'select' },
      options: DRAWER_POSITIONS
    }
  }),
  args: {
    content: 'My drawer content',
  },
};

export const Controlled: Story = {
  globals: {
    imports: `import { Button, Drawer, DrawerBody, DrawerContent } from '@ovhcloud/ods-react';
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

    function onOpenChange({ open }: DrawerOpenChangeDetail) {
      setIsOpen(open);
    }

    function openDrawer() {
      setIsOpen(true);
    }

    return (
      <>
        <Button onClick={ openDrawer }>
          Trigger Drawer
        </Button>

        <Drawer
          onOpenChange={ onOpenChange }
          open={ isOpen }>
          <DrawerContent>
            <DrawerBody>
              Content
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </>
    );
  },
};

export const Default: Story = {
  globals: {
    imports: `import { Button, Drawer, DrawerBody, DrawerContent, DrawerTrigger } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button>
          Trigger Drawer
        </Button>
      </DrawerTrigger>

      <DrawerContent>
        <DrawerBody>
          My drawer content
        </DrawerBody>
      </DrawerContent>
    </Drawer>
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
    <Drawer>
      <DrawerTrigger asChild>
        <Button>
          Trigger Drawer
        </Button>
      </DrawerTrigger>

      <DrawerContent position={ DRAWER_POSITION.left}>
        <DrawerBody>
          My drawer content
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  ),
};

export const Position: Story = {
  decorators: [(story) =>
    <div style={{ display: 'flex', flexFlow: 'row', alignItems: 'center', gap: '8px' }}>{ story() }</div>],
  globals: {
    imports: `import { DRAWER_POSITION, Button, Drawer, DrawerBody, DrawerContent, DrawerTrigger } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <>
    <Drawer>
      <DrawerTrigger asChild>
        <Button>
          Top drawer
        </Button>
      </DrawerTrigger>

      <DrawerContent position={ DRAWER_POSITION.top }>
        <DrawerBody>
          Top drawer content
        </DrawerBody>
      </DrawerContent>
    </Drawer>

   <Drawer>
      <DrawerTrigger asChild>
        <Button>
          Left drawer
        </Button>
      </DrawerTrigger>

      <DrawerContent position={ DRAWER_POSITION.left }>
        <DrawerBody>
          Left drawer content
        </DrawerBody>
      </DrawerContent>
    </Drawer>

   <Drawer>
      <DrawerTrigger asChild>
        <Button>
          Right Drawer
        </Button>
      </DrawerTrigger>

      <DrawerContent position={ DRAWER_POSITION.right }>
        <DrawerBody>
          Right drawer content
        </DrawerBody>
      </DrawerContent>
    </Drawer>

   <Drawer>
      <DrawerTrigger asChild>
        <Button>
          Bottom Drawer
        </Button>
      </DrawerTrigger>

      <DrawerContent position={ DRAWER_POSITION.bottom }>
        <DrawerBody>
          Bottom drawer content
        </DrawerBody>
      </DrawerContent>
    </Drawer>
    </>
  ),
}


export const AccessibilityAriaLabelledBy: Story = {
  globals: {
    imports: `import { Button, Drawer, DrawerBody, DrawerContent, DrawerTrigger } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button>
          Trigger Drawer
        </Button>
      </DrawerTrigger>

      <DrawerContent
        aria-describedby="drawer-content"
        aria-labelledby="drawer-title">
        <DrawerBody>
          <h2 id="drawer-title">
            My drawer
          </h2>

          <p id="drawer-content">
            The drawer content
          </p>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  ),
};

export const AccessibilityAriaLabel: Story = {
  globals: {
    imports: `import { Button, Drawer, DrawerBody, DrawerContent, DrawerTrigger } from '@ovhcloud/ods-react';`,
  },
  tags: ['!dev'],
  parameters: {
    docs: {
      source: { ...staticSourceRenderConfig() },
    },
  },
  render: ({}) => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button>
          Trigger Drawer
        </Button>
      </DrawerTrigger>

      <DrawerContent
        aria-describedby="drawer-content"
        aria-label="My drawer">
        <DrawerBody id="drawer-content">
          The drawer content
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  ),
};
