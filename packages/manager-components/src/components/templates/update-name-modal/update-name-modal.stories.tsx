import React from 'react';
import { Meta } from '@storybook/react';
import { UpdateNameModal as UpdateNameModalComponent } from './update-name-modal.component';

export const UpdateNameModal = (props) => (
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
    updateDisplayName: (name) => console.log('updateDisplayName', name),
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
    patternMessage:
      "Le nom du service doit comporter entre 3 et 63 caractères , doit commencer et se terminer par des caractères alphanumériques minuscules (de a à z et de 0 à 9) et peut comporter les signes de ponctuation suivants : '_', '.' et '-'.",
  },
};

export default meta;
