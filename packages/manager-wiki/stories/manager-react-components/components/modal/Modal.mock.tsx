import React from 'react';

export const basic = {
  heading: 'Example of modal',
  children: <div>Example of content</div>,
};

export const actions = {
  primaryButton: {
    label: 'Confirm',
    loading: false,
    onClick: () => 'onPrimaryButtonClick',
    disabled: false,
  },
  secondaryButton: {
    label: 'Cancel',
    loading: false,
    onClick: () => 'onSecondaryButtonClick',
    disabled: false,
  },
  onOpenChange: () => 'onOpenChange',
};

export const type = {
  type: 'warning',
};

export const loading = {
  loading: true,
};

export const other = {
  open: true,
};
