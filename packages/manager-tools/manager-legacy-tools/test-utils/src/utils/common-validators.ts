import { screen, waitFor, waitForOptions } from '@testing-library/react';
import { WAIT_FOR_DEFAULT_OPTIONS } from './common.constants';

export const assertTextVisibility = async (text: string): Promise<void> =>
  waitFor(
    () => expect(screen.getByText(text)).toBeVisible(),
    WAIT_FOR_DEFAULT_OPTIONS,
  );

export const assertElementVisibility = (
  element: HTMLElement,
  options = WAIT_FOR_DEFAULT_OPTIONS,
): Promise<void> => waitFor(() => expect(element).toBeVisible(), options);

export const assertElementLabel = ({
  element,
  label,
  ...options
}: {
  element: HTMLElement;
  label: string;
} & waitForOptions): Promise<void> =>
  waitFor(() => expect(element).toHaveAttribute('label', label), {
    ...WAIT_FOR_DEFAULT_OPTIONS,
    ...options,
  });
