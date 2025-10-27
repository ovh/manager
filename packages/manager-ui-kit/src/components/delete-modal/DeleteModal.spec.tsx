import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vitest } from 'vitest';

import { render } from '@/commons/tests-utils/Render.utils';
import { DeleteModal, DeleteModalProps } from '@/components';

export const DeleteModalSharedProps: DeleteModalProps = {
  onClose: vitest.fn(),
  onConfirmDelete: vitest.fn(),
  serviceTypeName: 'serviceType',
  open: true,
};

describe('Delete Modal component', () => {
  it('renders correctly', () => {
    render(<DeleteModal {...DeleteModalSharedProps} />);
    expect(screen.getByTestId('manager-delete-modal-description')).toBeInTheDocument();
    expect(screen.getByTestId('manager-delete-modal-cancel')).toBeInTheDocument();
    expect(screen.getByTestId('manager-delete-modal-confirm')).toBeInTheDocument();
  });

  it('renders error message in modal', async () => {
    const errorMessage = 'Error message';
    render(<DeleteModal {...DeleteModalSharedProps} error={errorMessage} />);
    await waitFor(() => {
      expect(screen.getByText(errorMessage, { exact: false })).toBeInTheDocument();
    });
  });

  it('clicking cancel should call onClose', async () => {
    render(<DeleteModal {...DeleteModalSharedProps} />);
    const button = screen.getByTestId('manager-delete-modal-cancel');
    fireEvent.click(button);
    await waitFor(() => {
      expect(DeleteModalSharedProps.onClose).toHaveBeenCalled();
    });
  });

  it('clicking confirm should call onConfirmDelete', async () => {
    render(<DeleteModal {...DeleteModalSharedProps} />);
    const button = screen.getByTestId('manager-delete-modal-confirm');

    await userEvent.click(button);

    await waitFor(() => {
      expect(DeleteModalSharedProps.onConfirmDelete).toHaveBeenCalled();
    });
  });
});
