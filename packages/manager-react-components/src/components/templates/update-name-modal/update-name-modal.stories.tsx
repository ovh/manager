import React from 'react';
import { Meta } from '@storybook/react';
import {
  UpdateNameModal as UpdateNameModalComponent,
  UpdateNameModalProps,
} from './update-name-modal.component';

export const UpdateNameModal = (props: UpdateNameModalProps) => (
  <UpdateNameModalComponent {...props} />
);

const meta: Meta = {
  title: 'Templates/Update Name Modal',
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
  },
  args: {
    closeModal: () => console.log('close'),
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
