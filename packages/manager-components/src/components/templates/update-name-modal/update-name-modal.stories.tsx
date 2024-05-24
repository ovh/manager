import React from 'react';
import { Meta } from '@storybook/react';
import { UpdateNameModal } from './update-name-modal.component';
UpdateNameModal;

export const Delete = (props) => <UpdateNameModal {...props} />;

const meta: Meta = {
  title: 'Templates/Update Modal',
  component: UpdateNameModal,
  argTypes: {
    isLoading: { control: 'boolean' },
    error: { control: 'text' },
    headline: { control: 'text' },
    description: { control: 'text' },
    deleteInputLabel: { control: 'text' },
    cancelButtonLabel: { control: 'text' },
    confirmButtonLabel: { control: 'text' },
  },
  args: {
    closeModal: () => console.log('close'),
    onConfirmDelete: () => console.log('onDelete'),
    headline: 'headline',
    description: 'Do you really want to delete this resource ?',
    deleteInputLabel: 'Type TERMINATE to delete the resource',
    isLoading: false,
    cancelButtonLabel: 'Cancel',
    confirmButtonLabel: 'Delete',
  },
};

export default meta;
