import { SECRET_VALUE_TOGGLE_TEST_IDS } from '@secret-manager/components/secret-value/secretValueToggle.constants';
import { Matcher, act, screen, waitFor } from '@testing-library/react';
import userEvent, { UserEvent } from '@testing-library/user-event';
import { expect } from 'vitest';

import { BadgeColor } from '@ovhcloud/ods-react';

export const TIMEOUT = {
  DEFAULT: 3000,
  MEDIUM: 5000,
  LONG: 10000,
};

/* ASSERT VISIBILITY */

export const assertTextVisibility = async (text: Matcher, timeout = TIMEOUT.DEFAULT) => {
  await waitFor(() => expect(screen.getByText(text)).toBeVisible(), { timeout });
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

export const assertMessageVisibility = async (message: string, timeout = TIMEOUT.DEFAULT) => {
  await waitFor(
    () => {
      const messages = screen.getAllByText(message);
      const messageElement = messages.find((msg) => msg.getAttribute('data-ods') === 'message');
      expect(messageElement).toBeVisible();
    },
    { timeout },
  );
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

/**
 * Clicks on the JSON toggle
 */
export const clickJsonEditorToggle = async (user: UserEvent) => {
  const jsonToggle = screen.getByTestId(SECRET_VALUE_TOGGLE_TEST_IDS.jsonToggle);
  await act(() => user.click(jsonToggle));
};

/**
 * Changes the value of an input by test id
 */
export const changeInputValueByTestId = async (inputTestId: string, value: string) => {
  const user = userEvent.setup();
  const input = await screen.findByTestId(inputTestId);

  await act(async () => {
    await user.clear(input);
    await user.type(input, value);
  });

  await waitFor(() => expect(input).toHaveValue(value));
};
