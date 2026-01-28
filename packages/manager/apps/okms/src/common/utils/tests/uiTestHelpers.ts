import { SECRET_VALUE_TOGGLE_TEST_IDS } from '@secret-manager/components/secret-value/secretValueToggle.constants';
import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import { UserEvent } from '@testing-library/user-event';
import { expect } from 'vitest';

import { BadgeColor } from '@ovhcloud/ods-react';

export const TIMEOUT = {
  DEFAULT: 3000,
  MEDIUM: 5000,
  LONG: 10000,
};

/* GET BY TEST ID */

export const changeOdsInputValueByTestId = async (inputTestId: string, value: string) => {
  // First try to get the input directly
  let input = screen.queryByTestId(inputTestId);

  // If the input is not found, try to find it with a findByTestId
  // This can look silly, but the ODS input renders in a mysterious way
  // and if you use a findByTestId when you need a getByTestId (and reverse), it won't work
  if (!input) {
    input = await screen.findByTestId(inputTestId);
  }

  act(() => {
    fireEvent.change(input, {
      target: { value },
    });
  });

  // Wait for the data input to be updated
  await waitFor(() => {
    expect(input).toHaveValue(value);
  });
};

export const assertClipboardVisibility = async (value: string, timeout?: number) => {
  const clipboardInput = await screen.findByDisplayValue(value, {}, { timeout: timeout ?? 3000 });
  expect(clipboardInput).toHaveAttribute('data-ods', 'clipboard-control');
  expect(clipboardInput).toBeVisible();
  return clipboardInput;
};

type AssertModalVisibilityProps = {
  role: 'alertdialog' | 'dialog';
  state?: 'visible' | 'hidden';
  timeout?: number;
};

export const assertModalVisibility = async ({
  role,
  state = 'visible',
  timeout = TIMEOUT.DEFAULT,
}: AssertModalVisibilityProps) => {
  let modal: HTMLElement | null = null;
  await waitFor(
    () => {
      modal = screen.queryByRole(role);
      if (state === 'visible') {
        expect(modal).toBeInTheDocument();
      } else {
        expect(modal).not.toBeInTheDocument();
      }
    },
    { timeout },
  );
  return modal as unknown as HTMLElement;
};

export const assertDrawerVisibility = async ({
  state = 'visible',
  timeout = TIMEOUT.DEFAULT,
}: Omit<AssertModalVisibilityProps, 'role'>) => {
  let drawer: HTMLElement | null = null;
  await waitFor(
    () => {
      drawer = screen.queryByTestId('drawer');
      if (state === 'visible') {
        expect(drawer).toBeInTheDocument();
      } else {
        expect(drawer).not.toBeInTheDocument();
      }
    },
    { timeout },
  );
  return drawer as unknown as HTMLElement;
};

type AssertTitleVisibilityParams = {
  title: string;
  level: number;
  timeout?: number;
};

export const assertTitleVisibility = async ({
  title,
  level,
  timeout = TIMEOUT.DEFAULT,
}: AssertTitleVisibilityParams) => {
  await waitFor(
    () => expect(screen.getByRole('heading', { level, name: title })).toBeInTheDocument(),
    { timeout },
  );
};

/**
 * Clicks on the JSON toggle
 */
export const clickJsonEditorToggle = async (user: UserEvent) => {
  const jsonToggle = screen.getByTestId(SECRET_VALUE_TOGGLE_TEST_IDS.jsonToggle);
  await act(() => user.click(jsonToggle));
};

/**
 * Asserts that a badge element has the expected color class in its className
 * @param badge - The badge element to check
 * @param color - The expected color value
 */
export const assertBadgeColor = (badge: HTMLElement, color: BadgeColor) => {
  const colorClassFragment = `_badge--${color}_`;
  const className = badge.className || '';

  expect(className).toContain(colorClassFragment);
};
