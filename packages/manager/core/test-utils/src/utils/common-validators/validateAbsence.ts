import { screen, waitFor } from '@testing-library/react';
import { WAIT_FOR_DEFAULT_OPTIONS } from '../common.constants';

export const assertAsyncTextAbsence = (
  text: string,
  options = WAIT_FOR_DEFAULT_OPTIONS,
): Promise<void> =>
  waitFor(
    () => expect(screen.queryByText(text)).not.toBeInTheDocument(),
    options,
  );

export const assertAsyncElementAbsence = (
  element: HTMLElement,
  options = WAIT_FOR_DEFAULT_OPTIONS,
): Promise<void> =>
  waitFor(() => expect(element).not.toBeInTheDocument(), options);
