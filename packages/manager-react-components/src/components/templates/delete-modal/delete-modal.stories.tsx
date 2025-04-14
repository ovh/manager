import React from 'react';
import { Meta } from '@storybook/react';
import {
  DeleteModal as DeleteModalComponent,
  DeleteModalProps,
} from './delete-modal.component';

export const DeleteModal = (props: DeleteModalProps) => (
  <DeleteModalComponent {...props} />
);

const meta: Meta = {
  title: 'Templates/Delete Modal',
  component: DeleteModalComponent,
  argTypes: {
    serviceTypeName: { control: 'text' },
    isLoading: { control: 'boolean' },
    error: { control: 'text' },
  },
  args: {
    closeModal: () => console.log('close'),
    onConfirmDelete: () => console.log('onDelete'),
    serviceTypeName: 'SQL Server',
    isLoading: false,
    error: '',
  },
};

export default meta;
