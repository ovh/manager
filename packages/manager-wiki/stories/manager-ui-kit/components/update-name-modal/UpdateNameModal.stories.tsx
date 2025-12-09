import React, { useState, useCallback } from 'react';
import { Meta } from '@storybook/react';
import {
  UpdateNameModal as UpdateNameModalComponent,
  UpdateNameModalProps,
  Button,
} from '@ovh-ux/muk';

export const UpdateNameModalDefault = (props: UpdateNameModalProps) => {
  const [isOpen, setIsOpen] = useState(props.isOpen);
  const handleOpenChange = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);
  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <UpdateNameModalComponent
        {...props}
        isOpen={isOpen}
        onClose={handleOpenChange}
        onOpenChange={handleOpenChange}
      />
    </>
  );
};

UpdateNameModalDefault.parameters = {
  args: {
    isOpen: false,
  },
  argTypes: {
    isOpen: { control: 'boolean' },
  },
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
  const [isOpen, setIsOpen] = useState(props.isOpen);
  const handleOpenChange = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);
  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <UpdateNameModalComponent
        {...props}
        isOpen={isOpen}
        onClose={handleOpenChange}
        onOpenChange={handleOpenChange}
        error="Message error update name"
      />
    </>
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
    isOpen: false,
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
