import React from 'react';
import { vi } from 'vitest';
import { render } from '@testing-library/react';
import { Modal } from '../Modal.component';

export const heading = 'Example Heading';

export const ModalContent = () => (
  <div>
    <p>
      Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus
      ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus
      duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar
      vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl
      malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class
      aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos
      himenaeos.
    </p>
    <label htmlFor="test-input">Test Input</label>
    <input type="text" id="test-input" data-testid="test-input" />
  </div>
);

export const actions = {
  primaryButton: {
    label: 'Confirm',
    loading: false,
    disabled: false,
    onClick: vi.fn(),
  },
  secondaryButton: {
    label: 'Cancel',
    loading: false,
    disabled: false,
    onClick: vi.fn(),
  },
};

export const renderModal = ({ children, ...props }) =>
  render(<Modal {...props}>{children}</Modal>);
