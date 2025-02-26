import userEvent from '@testing-library/user-event';
import {
  screen,
  act,
  waitFor,
  fireEvent,
  waitForOptions,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import { WAIT_FOR_DEFAULT_OPTIONS } from '@ovh-ux/manager-core-test-utils';

export const DEFAULT_LISTING_ERROR = 'An error occured while fetching data';

// Form helpers
export const mockEditInputValue = async (value: string) => {
  const input = screen.getByLabelText('edit-input');
  const event = new CustomEvent('odsChange');
  Object.defineProperty(event, 'target', { value: { value } });
  await act(async () => waitFor(() => fireEvent(input, event)));
};

export const mockSubmitNewValue = async ({
  submitCta,
  value = 'new value',
  ...options
}: {
  submitCta: HTMLElement;
  value?: string;
} & waitForOptions) => {
  await mockEditInputValue(value);
  return waitFor(() => userEvent.click(submitCta), {
    ...WAIT_FOR_DEFAULT_OPTIONS,
    ...options,
  });
};
