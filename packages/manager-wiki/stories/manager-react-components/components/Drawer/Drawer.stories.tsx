import React from 'react';
import { Drawer, DrawerProps } from '@ovh-ux/manager-react-components';
import { Meta } from '@storybook/react';
import { useArgs } from '@storybook/preview-api';
import { DrawerContent } from './DrawerContent.component';

const meta: Meta<typeof Drawer> = {
  title: 'Manager React Components/Components/Drawer',
  component: Drawer,
  args: {
    heading: 'Drawer Title',
    isOpen: true,
    isLoading: false,
    primaryButtonLabel: 'Confirm',
    onPrimaryButtonClick: () => {},
    secondaryButtonLabel: 'Cancel',
    onSecondaryButtonClick: () => {},
    onDismiss: () => {},
    isPrimaryButtonLoading: false,
    isPrimaryButtonDisabled: false,
    isSecondaryButtonLoading: false,
    isSecondaryButtonDisabled: false,
    children: <DrawerContent size="short" />,
  },
  argTypes: {
    heading: {
      description: 'Header title of the drawer',
    },
  },
  parameters: {
    controls: {
      exclude: ['children'],
    },
  },
  render: function Render(args) {
    const [{ isOpen }, updateArgs] = useArgs();

    const onDismiss = () => updateArgs({ isOpen: !isOpen });

    return (
      <Drawer
        {...args}
        isOpen={isOpen}
        onDismiss={onDismiss}
        onPrimaryButtonClick={onDismiss}
        onSecondaryButtonClick={onDismiss}
      />
    );
  },
};

export default meta;

export const Default: Meta<DrawerProps> = {
  args: {
    heading: 'Classic Drawer',
    isOpen: true,
  },
};

export const ScrollableContent: Meta<DrawerProps> = {
  args: {
    heading: 'Scrollable Content',
    isOpen: true,
    children: <DrawerContent size="long" />,
  },
};
