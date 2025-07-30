import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { within, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { WAIT_FOR_DEFAULT_OPTIONS } from './common.constants';

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
  nth = 0,
}: {
  container: HTMLElement;
  label: string;
  altLabel?: string;
  disabled?: boolean;
  isLink?: boolean;
  nth?: number;
}) => {
  let button: HTMLElement;
  await waitFor(() => {
    const buttonList = container.querySelectorAll(
      isLink ? 'osds-link' : 'osds-button',
    );
    button = Array.from(buttonList).filter((btn) =>
      [label, altLabel].includes(btn.textContent),
    )[nth];
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
  nth = 0,
}: {
  container: HTMLElement;
  iconName: ODS_ICON_NAME;
  disabled?: boolean;
  nth?: number;
}) => {
  let button: HTMLElement;
  await waitFor(() => {
    button = container.querySelectorAll(`osds-icon[name="${iconName}"]`)?.[nth]
      ?.parentElement;
    return disabled
      ? expect(button).toHaveAttribute('disabled')
      : expect(button).not.toHaveAttribute('disabled');
  }, WAIT_FOR_DEFAULT_OPTIONS);
  return button;
};

export const getButtonByTestId = async ({
  testId,
  disabled,
  nth = 0,
}: {
  testId: string;
  disabled?: boolean;
  nth?: number;
}) => {
  let button: HTMLElement;
  await waitFor(() => {
    button = screen.getAllByTestId(testId).at(nth);
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
