import React from 'react';
import { DrawerCollapsible, DrawerCollapsibleProps } from '@ovh-ux/muk';
import { Meta } from '@storybook/react';
import { useArgs } from '@storybook/preview-api';
import { DrawerContent } from './DrawerContent.component';

const meta: Meta<typeof DrawerCollapsible> = {
  title: 'Manager UI Kit/Components/Drawer',
  component: DrawerCollapsible,
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
      <DrawerCollapsible
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

export const Collapsible: Meta<DrawerCollapsibleProps> = {
  args: {
    heading: 'Collapsible Drawer',
    isOpen: true,
  },
};
