import { vitest } from 'vitest';
import { waitFor, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../../../utils/test.provider';
import { DeleteModal, DeleteModalProps } from './delete-modal.component';

export const sharedProps: DeleteModalProps = {
  closeModal: vitest.fn(),
  onConfirmDelete: vitest.fn(),
  serviceTypeName: 'serviceType',
  isOpen: true,
};

// waiting for ODS FIX in (_a = this.modalDialog)?.close in ods-modal2.js
describe('Delete Modal component', () => {
  it('waiting for ods fix', async () => {
    expect(true).toBeTruthy();
  });
  it('renders correctly', async () => {
    render(<DeleteModal {...sharedProps} />);
    await waitFor(() => {
      expect(
        screen.getByTestId('manager-delete-modal-description'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('manager-delete-modal-cancel'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('manager-delete-modal-confirm'),
      ).toBeInTheDocument();
    });
  });
  it('renders loading modal', async () => {
    const { asFragment } = render(<DeleteModal {...sharedProps} isLoading />);
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
