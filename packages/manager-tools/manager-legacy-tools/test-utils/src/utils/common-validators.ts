import {
  Matcher,
  SelectorMatcherOptions,
  screen,
  waitFor,
  waitForOptions as WaitForOptions,
} from '@testing-library/react';
import { WAIT_FOR_DEFAULT_OPTIONS } from './common.constants';

export const assertTextVisibility = async (
  text: Matcher,
  options?: SelectorMatcherOptions,
  waitForOptions = WAIT_FOR_DEFAULT_OPTIONS,
): Promise<void> =>
  waitFor(
    () => expect(screen.getByText(text, options)).toBeVisible(),
    waitForOptions,
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
} & WaitForOptions): Promise<void> =>
  waitFor(() => expect(element).toHaveAttribute('label', label), {
    ...WAIT_FOR_DEFAULT_OPTIONS,
    ...options,
  });
