import { waitFor } from '@testing-library/react';
import { WAIT_FOR_DEFAULT_OPTIONS } from '../common.constants';

export const assertIsDisabled = (element: HTMLElement) =>
  expect(element).toHaveAttribute('is-disabled', 'true');

export const assertIsEnabled = (element: HTMLElement) =>
  expect(element).not.toHaveAttribute('is-disabled', 'true');

export const assertAsyncIsDisabled = (
  element: HTMLElement,
  options = WAIT_FOR_DEFAULT_OPTIONS,
): Promise<void> => waitFor(() => assertIsDisabled(element), options);

export const assertAsyncIsEnabled = (
  element: HTMLElement,
  options = WAIT_FOR_DEFAULT_OPTIONS,
): Promise<void> => waitFor(() => assertIsEnabled(element), options);
