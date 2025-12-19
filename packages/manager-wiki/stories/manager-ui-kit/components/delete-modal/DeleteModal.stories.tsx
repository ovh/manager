import React, { useState, useCallback } from 'react';
import { Meta } from '@storybook/react';
import { DeleteModal, DeleteModalProps, Button, } from '@ovh-ux/muk';

export const DeleteModalDefault = (props: DeleteModalProps) => {
  const [isOpen, setIsOpen] = useState(props.open);
  const onOpenChange = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);
  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <DeleteModal
        {...props}
        open={isOpen}
        onClose={onOpenChange}
        onOpenChange={onOpenChange} />
    </>
  );
};

DeleteModalDefault.parameters = {
  docs: {
    source: {
      code: `<DeleteModal 
  open={isOpen}
  onClose={handleClose}
  onConfirmDelete={() => console.log('onDelete')}
  serviceTypeName="SQL Server"
/>`,
    },
  },
};

export const DeleteModalWithError = (props: DeleteModalProps) => {
  const [isOpen, setIsOpen] = useState(props.open);
  const onOpenChange = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);
  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <DeleteModal
        {...props}
        error="Error Message"
        open={isOpen}
        onClose={onOpenChange}
        onOpenChange={onOpenChange}
      />
    </>
  );
};

export const DeleteModalIsLoading = (props: DeleteModalProps) => {
  const [isOpen, setIsOpen] = useState(props.open);
  const onOpenChange = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <DeleteModal
        {...props}
        open={isOpen}
        onClose={onOpenChange}
        onOpenChange={onOpenChange}
        isLoading={true}
      />
    </>
  );
};

const meta: Meta = {
  title: 'Manager UI Kit/Components/Delete Modal',
  component: DeleteModal,
  tags: ['autodocs'],
  argTypes: {
    isOpen: { control: 'boolean' },
    isLoading: { control: 'boolean' },
    error: { control: 'text' },
  },
  args: {
    onConfirmDelete: () => {
      // Handle delete action
    },
    serviceTypeName: 'SQL Server',
    isLoading: false,
    open: false,
  },
};

export default meta;
