import { waitFor, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ODS_BUTTON_VARIANT, ODS_ICON_NAME } from '@ovhcloud/ods-components';

export const DEFAULT_LISTING_ERROR = 'An error occured while fetching data';
export const WAIT_FOR_DEFAULT_OPTIONS = {
  timeout: 30_000,
};

// Form helpers
// export const mockEditInputValue = async (value: string) => {
//   const input = screen.getByLabelText('edit-input');
//   const event = new CustomEvent('odsValueChange');
//   Object.defineProperty(event, 'target', { value: { value } });
//   await act(async () => waitFor(() => fireEvent(input, event)));
// };

// export const mockSubmitNewValue = async ({
//   submitButtonLabel,
//   value = 'new value',
// }: {
//   submitButtonLabel: string;
//   value?: string;
// }) => {
//   await mockEditInputValue(value);
//   const submitButton = screen.getByText(submitButtonLabel, { exact: true });
//   return waitFor(() => userEvent.click(submitButton));
// };

export const getButtonByVariant = async ({
  container,
  variant,
  disabled,
  nth = 0,
}: {
  container: HTMLElement;
  variant: ODS_BUTTON_VARIANT;
  disabled?: boolean;
  nth?: number;
}) => {
  let button: HTMLElement;
  await waitFor(() => {
    const buttonList = container.querySelectorAll('osds-button');
    button = Array.from(buttonList).filter((btn) =>
      [variant].includes(btn.getAttribute('variant') as ODS_BUTTON_VARIANT),
    )[nth];
    return disabled
      ? expect(button).toHaveAttribute('disabled')
      : expect(button).not.toHaveAttribute('disabled');
  }, WAIT_FOR_DEFAULT_OPTIONS);
  return button;
};

export const assertModalTitle = ({
  container,
  title,
}: {
  container: HTMLElement;
  title: string;
}): Promise<HTMLElement> =>
  waitFor(() => {
    const modal = container.querySelector('osds-modal');
    expect(modal).toHaveAttribute('headline', title);
    return modal;
  }, WAIT_FOR_DEFAULT_OPTIONS);

export const changeOdsSelectValueByTestId = async ({
  testId,
  value,
}: {
  testId: string;
  value: string;
}) => {
  const input = screen.getByTestId(testId);
  const event = new CustomEvent('odsValueChange', {
    detail: { value },
  });
  return waitFor(() => fireEvent(input, event));
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
    button = container
      .querySelectorAll(`osds-icon[name="${iconName}"]`)
      ?.[nth]?.closest('osds-button');
    return disabled
      ? expect(button).toHaveAttribute('disabled')
      : expect(button).not.toHaveAttribute('disabled');
  }, WAIT_FOR_DEFAULT_OPTIONS);
  return button;
};
