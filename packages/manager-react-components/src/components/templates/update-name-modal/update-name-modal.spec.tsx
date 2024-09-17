// import { waitFor, screen, fireEvent } from '@testing-library/react';
// import userEvent from '@testing-library/user-event';
// import { render } from '../../../utils/test.provider';
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

// waiting for ODS FIX in (_a = this.modalDialog)?.close in ods-modal2.js
describe('Update Name Modal component', () => {
  it('waiting for ods fix', async () => {
    expect(true).toBeTruthy();
  });

  // it('renders correctly', async () => {
  //   const { container } = render(<UpdateNameModal {...sharedProps} />);

  //   await waitFor(() => {
  //     expect(screen.getByText(sharedProps.description)).toBeInTheDocument();
  //     expect(screen.getByText(sharedProps.inputLabel)).toBeInTheDocument();
  //     expect(
  //       container.querySelector('[label="confirmButtonLabel"]'),
  //     ).toBeInTheDocument();
  //     expect(
  //       container.querySelector('[label="cancelButtonLabel"]'),
  //     ).toBeInTheDocument();
  //   });
  // });

  // it('renders loading modal', async () => {
  //   const { asFragment } = render(
  //     <UpdateNameModal
  //       {...sharedProps}
  //       isLoading
  //       cancelButtonLabel={undefined}
  //       confirmButtonLabel={undefined}
  //     />,
  //   );

  //   await waitFor(() => {
  //     expect(asFragment()).toMatchSnapshot();
  //   });
  // });

  // it('renders error message in modal', async () => {
  //   const errorMessage = 'Error message';
  //   render(<UpdateNameModal {...sharedProps} error={errorMessage} />);
  //   await waitFor(() => {
  //     expect(
  //       screen.getByText(errorMessage, { exact: false }),
  //     ).toBeInTheDocument();
  //   });
  // });

  // it('clicking cancel should call closeModal', async () => {
  //   const { container } = render(<UpdateNameModal {...sharedProps} />);
  //   const button = container.querySelector('[label="cancelButtonLabel"]');
  //   await userEvent.click(button);
  //   await waitFor(() => {
  //     expect(sharedProps.closeModal).toHaveBeenCalled();
  //   });
  // });

  // it('confirm button should trigger the updateDisplayName function', async () => {
  //   const { container } = render(<UpdateNameModal {...sharedProps} />);
  //   const button = container.querySelector('[label="confirmButtonLabel"]');
  //   const input = screen.getByLabelText('update-input');
  //   const event = new CustomEvent('odsValueChange', {
  //     detail: { value: 'Test' },
  //   });
  //   fireEvent(input, event);
  //   await userEvent.click(button);
  //   await waitFor(() => {
  //     expect(sharedProps.updateDisplayName).toHaveBeenCalled();
  //   });
  // });

  // it('render patternMessage when pattern is present and button validate is clickable', async () => {
  //   const { container } = render(<UpdateNameModal {...sharedProps} />);
  //   const input = screen.getByLabelText('update-input');
  //   const event = new CustomEvent('odsValueChange', {
  //     detail: { value: 'Test' },
  //   });
  //   fireEvent(input, event);

  //   await waitFor(() => {
  //     expect(screen.getByText('regex epression to respect')).toBeVisible();

  //     const validateButton = container.querySelector(
  //       '[label="confirmButtonLabel"]',
  //     );
  //     expect(validateButton).toHaveAttribute('is-disabled', 'false');
  //     expect(validateButton).toBeVisible();
  //   });
  // });

  // it('button validate is disabled when pattern is invalid ', async () => {
  //   const { container } = render(
  //     <UpdateNameModal {...sharedProps} defaultValue="Test*******" />,
  //   );
  //   await waitFor(() => {
  //     const validateButton = container.querySelector(
  //       '[label="confirmButtonLabel"]',
  //     );
  //     expect(validateButton).toHaveAttribute('is-disabled', 'true');
  //     expect(validateButton).toBeVisible();
  //     const patternMessage = screen.getByText(sharedProps.patternMessage);
  //     expect(screen.getByText('regex epression to respect')).toHaveClass(
  //       'error',
  //     );
  //     expect(patternMessage).toBeVisible();
  //   });
  // });
});
