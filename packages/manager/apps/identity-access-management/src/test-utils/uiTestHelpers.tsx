import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import '@testing-library/jest-dom';

export const DEFAULT_LISTING_ERROR = 'An error occured while fetching data';
export const WAIT_FOR_DEFAULT_OPTIONS = {
  timeout: 30_000,
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
  const button: HTMLElement = container.querySelectorAll(
    `ods-button[icon="${iconName}"]`,
  )?.[nth] as HTMLElement;

  expect(button).toBeDefined();
  if (disabled) expect(button).toHaveAttribute('disabled');
  else expect(button).not.toHaveAttribute('disabled');

  return button;
};

export const getButtonByLabel = async ({
  container,
  label,
  disabled = false,
  nth = 0,
}: {
  container: HTMLElement;
  label: string;
  disabled?: boolean;
  nth?: number;
}) => {
  const button: HTMLElement = Array.from(
    container.querySelectorAll(`ods-button[label="${label}"]`),
  )?.[nth] as HTMLElement;

  expect(button).toBeDefined();
  const disabledAttribute = button.getAttribute('is-disabled') === 'true';

  if (disabled) expect(disabledAttribute).toBeTruthy();
  else expect(disabledAttribute).toBeFalsy();

  return button;
};

export const getOdsCheckbox = async ({
  container,
  disabled,
  nth = 0,
}: {
  container: HTMLElement;
  disabled?: boolean;
  nth?: number;
}) => {
  const checkbox: HTMLOdsCheckboxElement = Array.from(
    container.querySelectorAll('ods-checkbox'),
  )?.[nth] as HTMLOdsCheckboxElement;

  expect(checkbox).toBeDefined();

  const disabledAttribute = checkbox.getAttribute('is-disabled') === 'true';

  if (disabled) expect(disabledAttribute).toBeTruthy();
  else expect(disabledAttribute).toBeFalsy();

  return checkbox;
};
