import React from 'react';
import { Meta } from '@storybook/react';
import { useArgs } from '@storybook/preview-api';
import {
  DrawerCollapsibleComposed,
  DrawerComposedProps,
} from './mocks/DrawerComposed.component';
import { Content } from './mocks/Content.component';

const meta: Meta<typeof DrawerCollapsibleComposed> = {
  title: 'Manager React Components/Components/Drawer',
  component: DrawerCollapsibleComposed,
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
      <DrawerCollapsibleComposed
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

export const Collapsible: Meta<DrawerComposedProps> = {
  args: {
    title: 'Collapsible Drawer',
    isOpen: true,
  },
};
