import { screen, waitFor } from '@testing-library/react';
import { WAIT_FOR_DEFAULT_OPTIONS } from '../common.constants';

// Text
export const assertTextAbsence = (text: string) =>
  expect(screen.queryByText(text)).not.toBeInTheDocument();

export const assertAsyncTextAbsence = (
  text: string,
  options = WAIT_FOR_DEFAULT_OPTIONS,
): Promise<void> => waitFor(() => assertTextAbsence(text), options);

// HTMLElement
export const assertElementAbsence = (element: HTMLElement) =>
  expect(element).not.toBeInTheDocument();

export const assertAsyncElementAbsence = (
  element: HTMLElement,
  options = WAIT_FOR_DEFAULT_OPTIONS,
): Promise<void> => waitFor(() => assertElementAbsence(element), options);
