import { Mock, vitest } from 'vitest';
import React, { waitFor, screen } from '@testing-library/react';
import { render } from '../../../utils/test.provider';
import { DeleteModal } from './delete-modal.component';
import fr_Fr from './translations/Messages_fr_FR.json';

export const sharedProps: {
  closeModal: Mock<unknown[], unknown>;
  onConfirmDelete: Mock<unknown[], unknown>;
  serviceTypeName: string;
  cancelButtonLabel: string;
  confirmButtonLabel: string;
} = {
  closeModal: vitest.fn(),
  onConfirmDelete: vitest.fn(),
  serviceTypeName: 'serviceType',
  cancelButtonLabel: fr_Fr.deleteModalCancelButton,
  confirmButtonLabel: fr_Fr.deleteModalDeleteButton,
};

describe('Delete Modal component', () => {
  it('renders correctly', async () => {
    render(<DeleteModal {...sharedProps} />);

    await waitFor(() => {
      expect(
        screen.getByText(fr_Fr.deleteModalDescription),
      ).toBeInTheDocument();
      expect(
        screen.getByText(sharedProps.cancelButtonLabel),
      ).toBeInTheDocument();
      expect(
        screen.getByText(sharedProps.confirmButtonLabel),
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

    screen.getByText(sharedProps.cancelButtonLabel).click();

    await waitFor(() => {
      expect(sharedProps.closeModal).toHaveBeenCalled();
    });
  });

  it('clicking confirm should call onConfirmDelete', async () => {
    render(<DeleteModal {...sharedProps} />);

    screen.getByText(sharedProps.confirmButtonLabel).click();

    await waitFor(() => {
      expect(sharedProps.closeModal).toHaveBeenCalled();
    });
  });
});
