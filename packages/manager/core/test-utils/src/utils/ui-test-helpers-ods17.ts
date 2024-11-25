import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { within, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

export const WAIT_FOR_DEFAULT_OPTIONS = {
  timeout: 30_000,
};

export const assertModalVisibility = async ({
  container,
  isVisible,
}: {
  container: HTMLElement;
  isVisible: boolean;
}) =>
  waitFor(() => {
    const modal = container.querySelector('osds-modal');
    return isVisible
      ? expect(modal).toBeInTheDocument()
      : expect(modal).not.toBeInTheDocument();
  }, WAIT_FOR_DEFAULT_OPTIONS);

export const assertModalText = ({
  container,
  text,
}: {
  container: HTMLElement;
  text: string;
}): Promise<void> =>
  waitFor(
    () =>
      expect(
        within(container.querySelector('osds-modal')).getByText(text, {
          exact: false,
        }),
      ).toBeVisible(),
    WAIT_FOR_DEFAULT_OPTIONS,
  );

export const getButtonByLabel = async ({
  container,
  label,
  altLabel,
  disabled,
  isLink,
}: {
  container: HTMLElement;
  label: string;
  altLabel?: string;
  disabled?: boolean;
  isLink?: boolean;
}) => {
  let button: HTMLElement;
  await waitFor(() => {
    const buttonList = container.querySelectorAll(
      isLink ? 'osds-link' : 'osds-button',
    );
    buttonList.forEach((btn) => {
      if ([label, altLabel].includes(btn.textContent)) {
        button = btn;
      }
    });
    return disabled
      ? expect(button).toHaveAttribute('disabled')
      : expect(button).not.toHaveAttribute('disabled');
  }, WAIT_FOR_DEFAULT_OPTIONS);
  return button;
};

export const getButtonByIcon = async ({
  container,
  iconName,
  disabled,
}: {
  container: HTMLElement;
  iconName: ODS_ICON_NAME;
  disabled?: boolean;
}) => {
  let button: HTMLElement;
  await waitFor(() => {
    button = container.querySelector(`osds-icon[name="${iconName}"]`)
      ?.parentElement;
    return disabled
      ? expect(button).toHaveAttribute('disabled')
      : expect(button).not.toHaveAttribute('disabled');
  }, WAIT_FOR_DEFAULT_OPTIONS);
  return button;
};

export const getButtonByTestId = async (testId: string, disabled?: boolean) => {
  let button: HTMLElement;
  await waitFor(() => {
    button = screen.getByTestId(testId);
    return disabled
      ? expect(button).toHaveAttribute('disabled')
      : expect(button).not.toHaveAttribute('disabled');
  }, WAIT_FOR_DEFAULT_OPTIONS);
  return button;
};

export const changeInputValue = async ({
  inputLabel,
  value,
}: {
  inputLabel: string;
  value: string;
}) => {
  const input = screen.getByLabelText(inputLabel);
  const event = new CustomEvent('odsValueChange', {
    detail: { value },
  });
  return waitFor(() => fireEvent(input, event));
};

/**
 * @description Standard check: wait and expect some text to be visible on the screen
 * @param text expected to be visible
 * @param timeout time to wait for (default to 30sec)
 * @returns
 */
export const checkTextVisibility = (text: string): Promise<void> =>
  waitFor(
    () => expect(screen.getByText(text)).toBeVisible(),
    WAIT_FOR_DEFAULT_OPTIONS,
  );
