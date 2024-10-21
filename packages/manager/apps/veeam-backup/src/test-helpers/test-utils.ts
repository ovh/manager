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

export const getEnabledButtonByLabel = async (label: string) => {
  let button: HTMLElement;
  await waitFor(() => {
    button = screen.getByText(label);
    return expect(button).not.toHaveAttribute('disabled');
  }, waitForOptions);
  return button;
};

export const getEnabledButtonByIcon = async ({
  container,
  iconName,
}: {
  container: HTMLElement;
  iconName: ODS_ICON_NAME;
}) => {
  let button: HTMLElement;
  await waitFor(() => {
    button = container.querySelector(`osds-icon[name="${iconName}"]`)
      ?.parentElement;
    return expect(button).not.toHaveAttribute('disabled');
  }, waitForOptions);
  return button;
};

export const getEnabledButtonByTestId = async (testId: string) => {
  let button: HTMLElement;
  await waitFor(() => {
    button = screen.getByTestId(testId);
    return expect(button).not.toHaveAttribute('disabled');
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
