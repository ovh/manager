// @ts-nocheck
import { screen, waitFor, waitForOptions } from '@testing-library/react';
import { WAIT_FOR_DEFAULT_OPTIONS } from './common.constants';

export const getElementByTestId = (
  testId: string,
  options = WAIT_FOR_DEFAULT_OPTIONS,
): Promise<HTMLElement> =>
  waitFor(() => screen.getByTestId(testId), options).then(
    (response) => response,
  );

export const getNthElementByTestId = ({
  testId,
  index = 0,
  ...options
}: { testId: string; index?: number } & waitForOptions): Promise<HTMLElement> =>
  waitFor(() => screen.getAllByTestId(testId), options).then(
    (response) => response[index],
  );
