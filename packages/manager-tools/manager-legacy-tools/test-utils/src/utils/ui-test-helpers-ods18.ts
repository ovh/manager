import React from 'react';
import { OdsIcon } from '@ovhcloud/ods-components/react';
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

type GetOdsButtonParams = {
  container: HTMLElement;
  label?: string;
  altLabel?: string;
  iconName?: React.ComponentProps<typeof OdsIcon>['name'];
  disabled?: boolean;
  isLink?: boolean;
  nth?: number;
} & waitForOptions;

const getOdsButton = async ({
  container,
  label,
  altLabel,
  iconName,
  disabled,
  isLink,
  nth = 0,
  ...options
}: GetOdsButtonParams) => {
  let button: HTMLElement;
  await waitFor(
    () => {
      const htmlTag = isLink ? 'ods-link' : 'ods-button';
      const buttonList = container.querySelectorAll<HTMLElement>(htmlTag);

      if (iconName) {
        // filter by icon
        button = Array.from(buttonList).filter(
          (btn) => btn.getAttribute('icon') === iconName,
        )[nth];
      } else {
        // filter by label or altLabel
        button = Array.from(buttonList).filter((btn) =>
          [label, altLabel].includes(btn.getAttribute('label')),
        )[nth];
      }

      if (isLink) {
        return disabled
          ? expect(button).toHaveAttribute('is-disabled', 'true')
          : expect(button).not.toHaveAttribute('is-disabled', 'true');
      }
      return disabled
        ? expect(button).toHaveAttribute('disabled')
        : expect(button).not.toHaveAttribute('disabled');
    },
    { ...WAIT_FOR_DEFAULT_OPTIONS, ...options },
  );
  return button;
};

type GetOdsButtonByLabelParams = Omit<GetOdsButtonParams, 'iconName'> & {
  label: string;
};

export const getOdsButtonByLabel = async ({
  container,
  label,
  altLabel,
  disabled,
  isLink,
  nth = 0,
  ...options
}: GetOdsButtonByLabelParams) => {
  return getOdsButton({
    container,
    label,
    altLabel,
    disabled,
    isLink,
    nth,
    ...options,
  });
};

type GetOdsButtonByIconParams = Omit<GetOdsButtonParams, 'label' | 'altLabel'>;

export const getOdsButtonByIcon = async ({
  container,
  iconName,
  disabled,
  isLink,
  nth = 0,
  ...options
}: GetOdsButtonByIconParams) => {
  return getOdsButton({
    container,
    iconName,
    disabled,
    isLink,
    nth,
    ...options,
  });
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
