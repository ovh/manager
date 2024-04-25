import { waitFor, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../../../utils/test.provider';
import { DeleteModal } from './delete-modal.component';
import '@testing-library/jest-dom';

const sharedProps = {
  closeModal: jest.fn(),
  onConfirmDelete: jest.fn(),
  headline: 'headline',
  description: 'description',
  deleteInputLabel: 'deleteInputLabel',
  cancelButtonLabel: 'cancelButtonLabel',
  confirmButtonLabel: 'confirmButtonLabel',
};

describe('Delete Modal component', () => {
  it('renders correctly', async () => {
    render(<DeleteModal {...sharedProps} />);

    await waitFor(() => {
      expect(screen.getByText(sharedProps.description)).toBeInTheDocument();
      expect(
        screen.getByText(sharedProps.deleteInputLabel),
      ).toBeInTheDocument();
      expect(
        screen.getByText(sharedProps.cancelButtonLabel),
      ).toBeInTheDocument();
      expect(
        screen.getByText(sharedProps.confirmButtonLabel),
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

  it('confirm button should be enabled by typing TERMINATE value', async () => {
    render(<DeleteModal {...sharedProps} />);

    const button = screen.getByText(sharedProps.confirmButtonLabel);

    expect(button).toBeDisabled();

    const input = screen.getByLabelText('delete-input');

    fireEvent.change(input, { target: { value: 'TERMINATE' } });
    await userEvent.click(button);

    await waitFor(() => {
      expect(sharedProps.onConfirmDelete).toHaveBeenCalled();
    });
  });
});
