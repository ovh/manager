import userEvent from '@testing-library/user-event';
import { screen, act, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

export const DEFAULT_LISTING_ERROR = 'An error occured while fetching data';

// Form helpers
export const mockEditInputValue = async (value: string) => {
  const input = screen.getByLabelText('edit-input');
  const event = new CustomEvent('odsValueChange');
  Object.defineProperty(event, 'target', { value: { value } });
  await act(async () => waitFor(() => fireEvent(input, event)));
};

export const mockSubmitNewValue = async ({
  submitButtonLabel,
  value = 'new value',
}: {
  submitButtonLabel: string;
  value?: string;
}) => {
  await mockEditInputValue(value);
  const submitButton = screen.getByText(submitButtonLabel, { exact: true });
  return waitFor(() => userEvent.click(submitButton));
};
