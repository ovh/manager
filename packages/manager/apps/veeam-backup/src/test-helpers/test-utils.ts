import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { labels } from './test-i18n';

export const waitForOptions = {
  timeout: 30_000,
};

export const checkModal = async ({
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
  }, waitForOptions);

export const getButtonByLabel = async ({
  container,
  label,
  altLabel,
  disabled,
}: {
  container: HTMLElement;
  label: string;
  altLabel?: string;
  disabled?: boolean;
}) => {
  let button: HTMLElement;
  await waitFor(() => {
    const buttonList = container.querySelectorAll('osds-button');
    buttonList.forEach((btn) => {
      if ([label, altLabel].includes(btn.textContent)) {
        button = btn;
      }
    });
    return disabled
      ? expect(button).toHaveAttribute('disabled')
      : expect(button).not.toHaveAttribute('disabled');
  }, waitForOptions);
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
  }, waitForOptions);
  return button;
};

export const getButtonByTestId = async (testId: string, disabled?: boolean) => {
  let button: HTMLElement;
  await waitFor(() => {
    button = screen.getByTestId(testId);
    return disabled
      ? expect(button).toHaveAttribute('disabled')
      : expect(button).not.toHaveAttribute('disabled');
  }, waitForOptions);
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

export const goToDashboard = async (name: string) => {
  await waitFor(() => {
    userEvent.click(screen.getByText(name));
  });

  await waitFor(
    () => expect(screen.getByText(labels.dashboard.general_informations)),
    waitForOptions,
  );
};
