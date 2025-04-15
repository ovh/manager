import { Mock, vitest } from 'vitest';
import React, { waitFor, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../../../utils/test.provider';
import { DeleteModal } from './delete-modal.component';
import fr_FR from './translations/Messages_fr_FR.json';
import '@testing-library/jest-dom';

export const sharedProps: {
  closeModal: Mock;
  onConfirmDelete: Mock;
  serviceTypeName: string;
  cancelButtonLabel: string;
  confirmButtonLabel: string;
  isOpen: boolean;
} = {
  closeModal: vitest.fn(),
  onConfirmDelete: vitest.fn(),
  serviceTypeName: 'serviceType',
  cancelButtonLabel: fr_FR.deleteModalCancelButton,
  confirmButtonLabel: fr_FR.deleteModalDeleteButton,
  isOpen: true,
};

// waiting for ODS FIX in (_a = this.modalDialog)?.close in ods-modal2.js
describe('Delete Modal component', () => {
  it('waiting for ods fix', async () => {
    expect(true).toBeTruthy();
  });
  it('renders correctly', async () => {
    const { container } = render(<DeleteModal {...sharedProps} />);
    await waitFor(() => {
      expect(
        screen.getByText(fr_FR.deleteModalDescription),
      ).toBeInTheDocument();
      expect(
        container.querySelector(`[label="${sharedProps.cancelButtonLabel}"]`),
      ).toBeInTheDocument();
      expect(
        container.querySelector(`[label="${sharedProps.confirmButtonLabel}"]`),
      ).toBeInTheDocument();
    });
  });
  it('renders loading modal', async () => {
    const { asFragment } = render(
      <DeleteModal
        {...sharedProps}
        isLoading
        cancelButtonLabel={undefined}
        confirmButtonLabel={undefined}
      />,
    );
    await waitFor(() => {
      expect(asFragment()).toMatchSnapshot();
    });
  });
  it('renders error message in modal', async () => {
    const errorMessage = 'Error message';
    render(<DeleteModal {...sharedProps} error={errorMessage} />);
    await waitFor(() => {
      expect(
        screen.getByText(errorMessage, { exact: false }),
      ).toBeInTheDocument();
    });
  });
  it('clicking cancel should call closeModal', async () => {
    render(<DeleteModal {...sharedProps} />);
    const button = screen.getByTestId('manager-delete-modal-cancel');
    await fireEvent.click(button);
    await waitFor(() => {
      expect(sharedProps.closeModal).toHaveBeenCalled();
    });
  });
  it('clicking confirm should call closeModal', async () => {
    render(<DeleteModal {...sharedProps} />);
    const button = screen.getByTestId('manager-delete-modal-confirm');

    await userEvent.click(button);
    await waitFor(() => {
      expect(sharedProps.onConfirmDelete).toHaveBeenCalled();
    });
  });
});
