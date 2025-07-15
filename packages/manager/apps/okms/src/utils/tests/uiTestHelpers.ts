import { OdsIcon } from '@ovhcloud/ods-components/react';
import { waitFor, waitForOptions } from '@testing-library/react';

const WAIT_FOR_DEFAULT_OPTIONS = { timeout: 3000 };

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
      const buttonList = container.querySelectorAll(htmlTag);

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

      // If disabled is undefined, we do not do more checks
      if (disabled === undefined) {
        return true;
      }

      if (isLink) {
        return disabled
          ? expect(button).toHaveAttribute('is-disabled', 'true')
          : expect(button).not.toHaveAttribute('is-disabled');
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
