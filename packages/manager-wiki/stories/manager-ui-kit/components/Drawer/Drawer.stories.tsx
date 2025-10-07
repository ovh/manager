import React, { useState } from 'react';
import { Meta } from '@storybook/react';
import { Button } from '@ovh-ux/muk';
import { DrawerContent } from './DrawerContent.component';
import { Content } from './mocks/Content.component';
import {
  DrawerComposed,
  DrawerComposedProps,
  DrawerCollapsibleComposed,
} from './mocks/DrawerComposed.component';

const meta = {
  title: 'Manager UI Kit/Components/Drawer',
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

    console.info('isOpen', isOpen);
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
            onDismiss={() => alert('dismiss')}
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
};

export const ScrollableContent: Meta<DrawerComposedProps> = {
  args: {
    title: 'Scrollable Content',
    isOpen: true,
    children: <div>Children scrollable drawer story</div>,
    content: <DrawerContent size="long" />,
  },
};

export const Collapsible: Meta<DrawerComposedProps> = {
  args: {
    title: 'Collapsible Drawer',
    isOpen: true,
    children: <div>Children Collapsible drawer story</div>,
    content: <DrawerContent size="short" />,
  },
};
