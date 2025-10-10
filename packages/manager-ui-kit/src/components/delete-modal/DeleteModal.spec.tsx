import { vitest } from 'vitest';
import { waitFor, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '@/setupTest';
import { DeleteModal } from './DeleteModal.component';
import { DeleteModalProps } from './DeleteModal.props';

export const sharedProps: DeleteModalProps = {
  onClose: vitest.fn(),
  onConfirmDelete: vitest.fn(),
  serviceTypeName: 'serviceType',
  open: true,
};

describe('Delete Modal component', () => {
  it('renders correctly', () => {
    render(<DeleteModal {...sharedProps} />);
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

  it('renders error message in modal', () => {
    const errorMessage = 'Error message';
    render(<DeleteModal {...sharedProps} error={errorMessage} />);
    waitFor(() => {
      expect(
        screen.getByText(errorMessage, { exact: false }),
      ).toBeInTheDocument();
    });
  });

  it('clicking cancel should call onClose', () => {
    render(<DeleteModal {...sharedProps} />);
    const button = screen.getByTestId('manager-delete-modal-cancel');
    fireEvent.click(button);
    waitFor(() => {
      expect(sharedProps.onClose).toHaveBeenCalled();
    });
  });

  it('clicking confirm should call onConfirmDelete', () => {
    render(<DeleteModal {...sharedProps} />);
    const button = screen.getByTestId('manager-delete-modal-confirm');
    userEvent.click(button);
    waitFor(() => {
      expect(sharedProps.onConfirmDelete).toHaveBeenCalled();
    });
  });
});
