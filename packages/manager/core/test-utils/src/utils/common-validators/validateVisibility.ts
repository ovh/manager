import { screen, waitFor } from '@testing-library/react';
import { WAIT_FOR_DEFAULT_OPTIONS } from '../common.constants';

export const assertTextVisibility = (text: string) =>
  expect(screen.getByText(text)).toBeVisible();

export const assertAsyncTextVisibility = (
  text: string,
  options = WAIT_FOR_DEFAULT_OPTIONS,
): Promise<void> =>
  waitFor(() => expect(screen.getByText(text)).toBeVisible(), options);

export const assertAsyncElementVisibility = (
  element: HTMLElement,
  options = WAIT_FOR_DEFAULT_OPTIONS,
): Promise<void> => waitFor(() => expect(element).toBeVisible(), options);
