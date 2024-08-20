import { waitFor, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../../../utils/test.provider';
import {
  UpdateNameModal,
  UpdateNameModalProps,
} from './update-name-modal.component';
import '@testing-library/jest-dom';

export const sharedProps: UpdateNameModalProps = {
  closeModal: jest.fn(),
  updateDisplayName: jest.fn(),
  headline: 'headline',
  description: 'description',
  inputLabel: 'inputLabel',
  cancelButtonLabel: 'cancelButtonLabel',
  confirmButtonLabel: 'confirmButtonLabel',
  pattern: '^[a-zA-Z0-9-_ s]*$',
  patternMessage: 'regex epression to respect',
};

describe('Update Name Modal component', () => {
  it('renders correctly', async () => {
    render(<UpdateNameModal {...sharedProps} />);

    await waitFor(() => {
      expect(screen.getByText(sharedProps.description)).toBeInTheDocument();
      expect(screen.getByText(sharedProps.inputLabel)).toBeInTheDocument();
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
      <UpdateNameModal
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
    render(<UpdateNameModal {...sharedProps} error={errorMessage} />);

    await waitFor(() => {
      expect(
        screen.getByText(errorMessage, { exact: false }),
      ).toBeInTheDocument();
    });
  });

  it('clicking cancel should call closeModal', async () => {
    render(<UpdateNameModal {...sharedProps} />);

    screen.getByText(sharedProps.cancelButtonLabel).click();

    await waitFor(() => {
      expect(sharedProps.closeModal).toHaveBeenCalled();
    });
  });

  it('confirm button should trigger the updateDisplayName function', async () => {
    render(<UpdateNameModal {...sharedProps} />);

    const button = screen.getByText(sharedProps.confirmButtonLabel);

    const input = screen.getByLabelText('update-input');

    const event = new CustomEvent('odsValueChange', {
      detail: { value: 'Test' },
    });
    fireEvent(input, event);

    await userEvent.click(button);

    await waitFor(() => {
      expect(sharedProps.updateDisplayName).toHaveBeenCalled();
    });
  });

  it('render patternMessage when pattern is present and button validate is clickable', async () => {
    render(<UpdateNameModal {...sharedProps} />);
    const input = screen.getByLabelText('update-input');
    const event = new CustomEvent('odsValueChange', {
      detail: { value: 'Test' },
    });
    fireEvent(input, event);

    await waitFor(() => {
      const patternMessage = screen.getByText(sharedProps.patternMessage);
      expect(patternMessage).toHaveAttribute('color', 'text');
      expect(patternMessage).toBeVisible();

      const validateButton = screen.getByText(sharedProps.confirmButtonLabel);
      expect(validateButton).toHaveAttribute('tabindex', '0');
      expect(validateButton).toBeVisible();
    });
  });

  it('button validate is disabled when pattern is invalid ', async () => {
    render(<UpdateNameModal {...sharedProps} />);
    const input = screen.getByLabelText('update-input');
    const event = new CustomEvent('odsValueChange', {
      detail: { value: 'Test*******' },
    });
    fireEvent(input, event);
    await waitFor(() => {
      const validateButton = screen.getByText(sharedProps.confirmButtonLabel);
      expect(validateButton).toHaveAttribute('disabled');
      expect(validateButton).toBeVisible();
      const patternMessage = screen.getByText(sharedProps.patternMessage);
      expect(patternMessage).toHaveAttribute('color', 'error');
      expect(patternMessage).toBeVisible();
    });
  });
});
