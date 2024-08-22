import { waitFor, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../../../utils/test.provider';
import { DeleteModal } from './delete-modal.component';
import '@testing-library/jest-dom';

export const sharedProps = {
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

    const event = new CustomEvent('odsValueChange', {
      detail: { value: 'TERMINATE' },
    });

    fireEvent(input, event);

    await waitFor(() => expect(button).toBeEnabled());

    await userEvent.click(button);

    await waitFor(() => {
      expect(sharedProps.onConfirmDelete).toHaveBeenCalled();
    });
  });
});
