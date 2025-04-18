import { screen, waitFor } from '@testing-library/react';
import { WAIT_FOR_DEFAULT_OPTIONS } from '../common.constants';

export const assertTextVisibility = (text: string) =>
  expect(screen.getByText(text)).toBeVisible();

export const assertAsyncTextVisibility = (
  text: string,
  options = WAIT_FOR_DEFAULT_OPTIONS,
): Promise<void> => waitFor(() => assertTextVisibility(text), options);

export const assertElementVisibility = (element: HTMLElement) =>
  expect(element).toBeVisible();

export const assertAsyncElementVisibility = (
  element: HTMLElement,
  options = WAIT_FOR_DEFAULT_OPTIONS,
): Promise<void> => waitFor(() => assertElementVisibility(element), options);
