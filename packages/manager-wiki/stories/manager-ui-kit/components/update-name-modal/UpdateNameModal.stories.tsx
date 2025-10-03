import React, { useState } from 'react';
import { Meta } from '@storybook/react';
import {
  UpdateNameModal as UpdateNameModalComponent,
  UpdateNameModalProps,
} from '@ovh-ux/manager-react-components';

export const UpdateNameModalDefault = (props: UpdateNameModalProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const handleClose = () => {
    setIsOpen(false);
  };
  return (
    <UpdateNameModalComponent
      {...props}
      isOpen={isOpen}
      onClose={handleClose}
    />
  );
};

export const UpdateNameModalWithError = (props: UpdateNameModalProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const handleClose = () => {
    setIsOpen(false);
  };
  return (
    <UpdateNameModalComponent
      {...props}
      isOpen={isOpen}
      onClose={handleClose}
      error="Message error update name"
    />
  );
};

const meta: Meta = {
  title: 'Manager React Components/Components/Update Name Modal',
  component: UpdateNameModalComponent,
  argTypes: {
    isLoading: { control: 'boolean' },
    error: { control: 'text' },
    headline: { control: 'text' },
    description: { control: 'text' },
    inputLabel: { control: 'text' },
    defaultValue: { control: 'text' },
    cancelButtonLabel: { control: 'text' },
    confirmButtonLabel: { control: 'text' },
    pattern: { control: 'text' },
    patternMessage: { control: 'text' },
    isOpen: { control: 'text' },
  },
  args: {
    isOpen: true,
    onClose: () => console.log('close'),
    updateDisplayName: (name: string) => console.log('updateDisplayName', name),
    headline: 'headline',
    description:
      'Do you really want to update the display name of this resource ?',
    inputLabel: 'New display name',
    isLoading: false,
    defaultValue: 'oldDisplayName',
    cancelButtonLabel: 'Cancel',
    confirmButtonLabel: 'Confirm',
    error: '',
    pattern: '^[a-zA-Z0-9-_s]*$',
    patternMessage: 'put your pattern message here',
  },
};

export default meta;
