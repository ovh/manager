import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import {
  screen,
  act,
  waitFor,
  fireEvent,
  within,
} from '@testing-library/react';
import { expect } from 'vitest';

export const DEFAULT_TIMEOUT = 30_000;
export const DEFAULT_LISTING_ERROR = 'An error occured while fetching data';

/**
 * @description Standard check: wait and expect some text to be visible on the screen
 * @param text expected to be visible
 * @param timeout time to wait for
 * @returns
 */
export const checkTextVisibility = async (
  text: string,
  timeout = DEFAULT_TIMEOUT,
) =>
  waitFor(() => expect(screen.getByText(text)).toBeVisible(), {
    timeout,
  });

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

// Modal helpers
export const checkModalVisibility = async ({
  container,
  isVisible,
}: {
  container: HTMLElement;
  isVisible: boolean;
}) =>
  waitFor(
    () => {
      const modal = container.querySelector('osds-modal');
      return isVisible
        ? expect(modal).toBeInTheDocument()
        : expect(modal).not.toBeInTheDocument();
    },
    { timeout: DEFAULT_TIMEOUT },
  );

export const checkModalError = async ({
  container,
  error,
}: {
  container: HTMLElement;
  error: string;
}) =>
  waitFor(
    () =>
      expect(
        within(
          container.querySelector('osds-modal') as HTMLElement,
        ).getByText(error, { exact: false }),
      ).toBeVisible(),
    { timeout: DEFAULT_TIMEOUT },
  );
