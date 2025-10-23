import React, { useState } from 'react';
import { Meta } from '@storybook/react';
import {
  UpdateNameModal as UpdateNameModalComponent,
  UpdateNameModalProps,
} from '@ovh-ux/muk';

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

UpdateNameModalDefault.parameters = {
  docs: {
    source: {
      code: `<UpdateNameModal 
  isOpen={isOpen}
  onClose={handleClose}
  updateDisplayName={(name) => console.log('updateDisplayName', name)}
  headline="Update Resource Name"
  description="Do you really want to update the display name of this resource?"
  inputLabel="New display name"
  defaultValue="oldDisplayName"
  cancelButtonLabel="Cancel"
  confirmButtonLabel="Confirm"
/>`,
    },
  },
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
  title: 'Manager UI Kit/Components/Update Name Modal',
  component: UpdateNameModalComponent,
  tags: ['autodocs'],
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
    onClose: () => {
      // Handle close
    },
    updateDisplayName: () => {
      // Handle update display name
    },
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
