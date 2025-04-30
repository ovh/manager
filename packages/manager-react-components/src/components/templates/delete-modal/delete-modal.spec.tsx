import { vitest } from 'vitest';
import { waitFor, screen } from '@testing-library/react';
import { render } from '../../../utils/test.provider';
import { DeleteModal, DeleteModalProps } from './delete-modal.component';

export const sharedProps: DeleteModalProps = {
  closeModal: vitest.fn(),
  onConfirmDelete: vitest.fn(),
  serviceTypeName: 'serviceType',
};

describe('Delete Modal component', () => {
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

    screen.getByTestId('manager-delete-modal-cancel').click();

    await waitFor(() => {
      expect(sharedProps.closeModal).toHaveBeenCalled();
    });
  });

  it('clicking confirm should call onConfirmDelete', async () => {
    render(<DeleteModal {...sharedProps} />);

    screen.getByTestId('manager-delete-modal-confirm').click();

    await waitFor(() => {
      expect(sharedProps.closeModal).toHaveBeenCalled();
    });
  });
});
