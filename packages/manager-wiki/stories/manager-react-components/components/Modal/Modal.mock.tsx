import React from 'react';

export const basic = {
  heading: 'Example of modal',
  step: { current: 1, total: 5 },
  children: <div>Example of content</div>,
};

export const actions = {
  primaryLabel: 'Confirm',
  isPrimaryButtonLoading: false,
  isPrimaryButtonDisabled: false,
  onPrimaryButtonClick: () => 'onPrimaryButtonClick',
  secondaryLabel: 'Cancel',
  isSecondaryButtonDisabled: false,
  isSecondaryButtonLoading: false,
  onSecondaryButtonClick: () => 'onSecondaryButtonClick',
  onDismiss: () => 'onDismiss',
};

export const type = {
  type: 'warning',
};

export const loading = {
  isLoading: true,
};

export const other = {
  isOpen: true,
};
