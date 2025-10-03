import React, { useState } from 'react';
import { Meta } from '@storybook/react';
import { DeleteModal, DeleteModalProps } from '@ovh-ux/manager-ui-kit';

export const DeleteModalDefault = (props: DeleteModalProps) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
  };

  return <DeleteModal {...props} open={isOpen} onClose={handleClose} />;
};

export const DeleteModalWithError = (props: DeleteModalProps) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <DeleteModal
      {...props}
      error="Error Message"
      open={isOpen}
      onClose={handleClose}
    />
  );
};

export const DeleteModalIsLoading = (props: DeleteModalProps) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <DeleteModal
      {...props}
      open={isOpen}
      onClose={handleClose}
      isLoading={true}
    />
  );
};

const meta: Meta = {
  title: 'Manager UI Kit/Components/Delete Modal',
  component: DeleteModal,
  argTypes: {
    isOpen: { control: 'boolean' },
    isLoading: { control: 'boolean' },
    error: { control: 'text' },
  },
  args: {
    onConfirmDelete: () => console.log('onDelete'),
    serviceTypeName: 'SQL Server',
    isLoading: false,
  },
};

export default meta;
