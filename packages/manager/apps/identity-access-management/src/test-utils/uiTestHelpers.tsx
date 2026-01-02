import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import '@testing-library/jest-dom';
import { waitFor } from '@testing-library/react';

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
  const findCheckbox = () => {
    const candidates = [
      ...Array.from(container.querySelectorAll('ods-checkbox')),
      ...Array.from(container.querySelectorAll('osds-checkbox')),
      ...Array.from(container.querySelectorAll('input[type="checkbox"]')),
    ] as HTMLElement[];

    return candidates[nth];
  };

  await waitFor(() => {
    expect(findCheckbox()).toBeDefined();
  }, WAIT_FOR_DEFAULT_OPTIONS);

  const checkbox = findCheckbox();

  // Disabled detection across variants
  const isNativeInput = checkbox.tagName.toLowerCase() === 'input';
  const isDisabled = isNativeInput
    ? (checkbox as HTMLInputElement).disabled
    : checkbox.getAttribute('is-disabled') === 'true' ||
      checkbox.getAttribute('disabled') === 'true' ||
      checkbox.hasAttribute('disabled');

  if (disabled) expect(isDisabled).toBeTruthy();
  else expect(isDisabled).toBeFalsy();

  return checkbox;
};

export const getOdsBreadcrumbItemByLabel = async ({
  container,
  label,
}: {
  container: HTMLElement;
  label: string;
}) => {
  const item: HTMLOdsBreadcrumbItemElement = Array.from(
    container.querySelectorAll('ods-breadcrumb-item'),
  )?.find((_item) => _item.label === label);

  expect(item).toBeDefined();

  return item;
};
