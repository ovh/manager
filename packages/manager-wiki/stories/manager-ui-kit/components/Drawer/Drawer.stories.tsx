import React, { useState } from 'react';
import { Meta } from '@storybook/react';
import { Button } from '@ovh-ux/muk';
import { DrawerBase } from '@ovh-ux/muk/src/components/drawer/drawer-base/DrawerBase.component';
import { DrawerContent } from './DrawerContent.component';
import { Content } from './mocks/Content.component';
import {
  DrawerCollapsibleComposed,
  DrawerComposed,
  DrawerComposedProps,
} from './mocks/DrawerComposed.component';

const meta = {
  title: 'Manager UI Kit/Components/Drawer',
  component: DrawerBase,
  tags: ['autodocs'],
  args: {
    isOpen: false,
    isLoading: false,
    primaryButton: {
      label: 'Confirm',
      isLoading: false,
      isDisabled: false,
      onClick: () => {},
    },
    secondaryButton: {
      label: 'Cancel',
      isLoading: false,
      isDisabled: false,
      onClick: () => {},
    },
    onDismiss: () => {},
    content: <Content size="short" />,
  },
  argTypes: {
    title: {
      description: 'Header title of the drawer',
    },
  },
  render: function Render(args) {
    const [isOpen, setIsOpen] = useState(args.isOpen);
    const triggerDrawer = () => setIsOpen(!isOpen);

    const title = args.title as string;
    return (
      <>
        {!title.includes('Collapsible') && (
          <Button onClick={triggerDrawer}>Open Drawer</Button>
        )}
        {title.includes('Collapsible') ? (
          <DrawerCollapsibleComposed
            {...args}
            isOpen={isOpen}
            onDismiss={() => {
              // Dismiss action
            }}
            primaryButton={{
              ...args.primaryButton,
              onClick: triggerDrawer,
            }}
            secondaryButton={{
              ...args.secondaryButton,
              onClick: triggerDrawer,
            }}
          />
        ) : (
          <DrawerComposed
            {...args}
            isOpen={isOpen}
            onDismiss={triggerDrawer}
            primaryButton={{
              ...args.primaryButton,
              onClick: triggerDrawer,
            }}
            secondaryButton={{
              ...args.secondaryButton,
              onClick: triggerDrawer,
            }}
          />
        )}
      </>
    );
  },
};

export default meta;

export const Default: Meta<DrawerComposedProps> = {
  args: {
    title: 'Classic Drawer',
    isOpen: true,
    children: <div>Children drawer story</div>,
    content: <DrawerContent size="short" />,
  },
  parameters: {
    docs: {
      source: {
        code: `<Drawer.Root
  isOpen={isOpen}
  onDismiss={handleDismiss}
>
  <Drawer.Header title="Classic Drawer" />
  <Drawer.Content>
    <div>Your drawer content here</div>
  </Drawer.Content>
  <Drawer.Footer
    primaryButton={{
      label: 'Confirm',
      onClick: handleConfirm,
    }}
    secondaryButton={{
      label: 'Cancel',
      onClick: handleCancel,
    }}
  />
</Drawer.Root>`,
      },
    },
  },
};

export const ScrollableContent: Meta<DrawerComposedProps> = {
  args: {
    title: 'Scrollable Content',
    isOpen: true,
    children: <div>Children scrollable drawer story</div>,
    content: <DrawerContent size="long" />,
  },
  parameters: {
    docs: {
      source: {
        code: `<Drawer.Root
  isOpen={isOpen}
  onDismiss={handleDismiss}
>
  <Drawer.Header title="Scrollable Content" />
  <Drawer.Content>
    <div>Long scrollable content here...</div>
  </Drawer.Content>
  <Drawer.Footer
    primaryButton={{
      label: 'Confirm',
      onClick: handleConfirm,
    }}
    secondaryButton={{
      label: 'Cancel',
      onClick: handleCancel,
    }}
  />
</Drawer.Root>`,
      },
    },
  },
};

export const Collapsible: Meta<DrawerComposedProps> = {
  args: {
    title: 'Collapsible Drawer',
    isOpen: true,
    children: <div>Children Collapsible drawer story</div>,
    content: <DrawerContent size="short" />,
  },
  parameters: {
    docs: {
      source: {
        code: `<Drawer.RootCollapsible
  isOpen={isOpen}
  onDismiss={handleDismiss}
>
  <Drawer.Header title="Collapsible Drawer" />
  <Drawer.Content>
    <div>Your drawer content here</div>
  </Drawer.Content>
  <Drawer.Footer
    primaryButton={{
      label: 'Confirm',
      onClick: handleConfirm,
    }}
    secondaryButton={{
      label: 'Cancel',
      onClick: handleCancel,
    }}
  />
</Drawer.RootCollapsible>`,
      },
    },
  },
};
