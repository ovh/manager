import { waitFor, waitForOptions } from '@testing-library/react';
import { WAIT_FOR_DEFAULT_OPTIONS } from '../common.constants';

type TAssertElementLabel = {
  element: HTMLElement;
  label: string;
};

export const assertElementLabel = ({ element, label }: TAssertElementLabel) =>
  expect(element).toHaveAttribute('label', label);

export const assertAsyncElementLabel = ({
  element,
  label,
  ...options
}: TAssertElementLabel & waitForOptions): Promise<void> =>
  waitFor(() => assertElementLabel({ element, label }), {
    ...WAIT_FOR_DEFAULT_OPTIONS,
    ...options,
  });
