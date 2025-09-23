import React from 'react';
import { Meta } from '@storybook/react';
import { useArgs } from '@storybook/preview-api';
import { Content } from './mocks/Content.component';
import {
  DrawerComposed,
  DrawerComposedProps,
} from './mocks/DrawerComposed.component';

const meta: Meta<typeof DrawerComposed> = {
  title: 'Manager React Components/Components/Drawer',
  component: DrawerComposed,
  args: {
    title: 'Drawer Title',
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
    content: <Content size="short" />,
  },
  argTypes: {
    title: {
      description: 'Header title of the drawer',
    },
  },
  parameters: {
    controls: {
      exclude: ['content'],
    },
  },
  render: function Render(args) {
    const [{ isOpen }, updateArgs] = useArgs();

    const onDismiss = () => updateArgs({ isOpen: !isOpen });

    return (
      <DrawerComposed
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

export const Default: Meta<DrawerComposedProps> = {
  args: {
    title: 'Classic Drawer',
    isOpen: true,
  },
};

export const ScrollableContent: Meta<DrawerComposedProps> = {
  args: {
    title: 'Scrollable Content',
    isOpen: true,
    content: <Content size="long" />,
  },
};
