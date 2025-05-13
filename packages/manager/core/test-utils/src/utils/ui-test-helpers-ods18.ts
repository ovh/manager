import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import {
  screen,
  waitFor,
  fireEvent,
  within,
  waitForOptions,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import { WAIT_FOR_DEFAULT_OPTIONS } from './common.constants';

export const assertOdsModalVisibility = async ({
  container,
  isVisible,
  ...options
}: {
  container: HTMLElement;
  isVisible: boolean;
} & waitForOptions) =>
  waitFor(
    () => {
      const modal = container.querySelector('ods-modal');
      return isVisible
        ? expect(modal).toBeInTheDocument()
        : expect(modal).not.toBeInTheDocument();
    },
    { ...WAIT_FOR_DEFAULT_OPTIONS, ...options },
  );

export const assertOdsModalText = ({
  container,
  text,
  ...options
}: {
  container: HTMLElement;
  text: string;
} & waitForOptions): Promise<void> =>
  waitFor(
    () =>
      expect(
        within(container.querySelector('ods-modal')).getByText(text, {
          exact: false,
        }),
      ).toBeVisible(),
    { ...WAIT_FOR_DEFAULT_OPTIONS, ...options },
  );

export const getOdsButtonByLabel = async ({
  container,
  label,
  altLabel,
  disabled,
  isLink,
  nth = 0,
  ...options
}: {
  container: HTMLElement;
  label: string;
  altLabel?: string;
  disabled?: boolean;
  isLink?: boolean;
  nth?: number;
} & waitForOptions) => {
  let button: HTMLElement;
  await waitFor(
    () => {
      const buttonList = container.querySelectorAll(
        isLink ? 'ods-link' : 'ods-button',
      );
      button = Array.from(buttonList).filter((btn) =>
        [label, altLabel].includes(btn.getAttribute('label')),
      )[nth] as HTMLElement;
      return disabled
        ? expect(button).toHaveAttribute('disabled')
        : expect(button).not.toHaveAttribute('disabled');
    },
    { ...WAIT_FOR_DEFAULT_OPTIONS, ...options },
  );
  return button;
};

export const getOdsButtonByIcon = async ({
  container,
  iconName,
  disabled,
  isLink,
  nth = 0,
  ...options
}: {
  container: HTMLElement;
  iconName: ODS_ICON_NAME;
  disabled?: boolean;
  isLink?: boolean;
  nth?: number;
} & waitForOptions) => {
  let button: HTMLElement;
  await waitFor(
    () => {
      button = container.querySelectorAll(
        `${isLink ? 'ods-link' : 'ods-button'}[icon="${iconName}"]`,
      )?.[nth]?.parentElement;
      return disabled
        ? expect(button).toHaveAttribute('disabled')
        : expect(button).not.toHaveAttribute('disabled');
    },
    { ...WAIT_FOR_DEFAULT_OPTIONS, ...options },
  );
  return button;
};

export const changeOdsInputValue = async ({
  inputLabel,
  inputValue,
}: {
  inputLabel: string;
  inputValue: string;
}) => {
  const input = screen.getByLabelText(inputLabel);

  return waitFor(() =>
    fireEvent.change(input, { target: { value: inputValue } }),
  );
};

export const selectOdsSelectOption = async ({
  testId,
  value,
}: {
  testId: string;
  value: string;
}) => {
  const select = screen.getByTestId(testId);
  const event = new CustomEvent('odsChange', {
    detail: { value },
  });
  waitFor(() => fireEvent(select, event));
};
