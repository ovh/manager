import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { screen, waitFor, fireEvent, within } from '@testing-library/react';
import '@testing-library/jest-dom';

const WAIT_FOR_DEFAULT_OPTIONS = {
  timeout: 30_000,
};

export const assertOds18ModalVisibility = async ({
  container,
  isVisible,
}: {
  container: HTMLElement;
  isVisible: boolean;
}) =>
  waitFor(() => {
    const modal = container.querySelector('ods-modal');
    return isVisible
      ? expect(modal).toBeInTheDocument()
      : expect(modal).not.toBeInTheDocument();
  }, WAIT_FOR_DEFAULT_OPTIONS);

export const assertOds18ModalText = ({
  container,
  text,
}: {
  container: HTMLElement;
  text: string;
}): Promise<void> =>
  waitFor(
    () =>
      expect(
        within(container.querySelector('ods-modal')).getByText(text, {
          exact: false,
        }),
      ).toBeVisible(),
    WAIT_FOR_DEFAULT_OPTIONS,
  );

export const getOds18ButtonByLabel = async ({
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
      isLink ? 'ods-link' : 'ods-button',
    );
    button = Array.from(buttonList).filter((btn) =>
      [label, altLabel].includes(btn.getAttribute('label')),
    )[nth] as HTMLElement;
    return disabled
      ? expect(button).toHaveAttribute('disabled')
      : expect(button).not.toHaveAttribute('disabled');
  }, WAIT_FOR_DEFAULT_OPTIONS);
  return button;
};

export const getOds18ButtonByIcon = async ({
  container,
  iconName,
  disabled,
  isLink,
  nth = 0,
}: {
  container: HTMLElement;
  iconName: ODS_ICON_NAME;
  disabled?: boolean;
  isLink?: boolean;
  nth?: number;
}) => {
  let button: HTMLElement;
  await waitFor(() => {
    button = container.querySelectorAll(
      `${isLink ? 'ods-link' : 'ods-button'}[icon="${iconName}"]`,
    )?.[nth]?.parentElement;
    return disabled
      ? expect(button).toHaveAttribute('disabled')
      : expect(button).not.toHaveAttribute('disabled');
  }, WAIT_FOR_DEFAULT_OPTIONS);
  return button;
};

export const changeOds18InputValue = async ({
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
